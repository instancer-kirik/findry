import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Pause, Play, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = { disabled: boolean; busy: boolean; onRecognize: (image: string, signal: AbortSignal) => Promise<boolean> };

export default function CatalogCamera({ disabled, busy, onRecognize }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const generationRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [starting, setStarting] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [device, setDevice] = useState("");
  const recognizeRef = useRef(onRecognize);
  recognizeRef.current = onRecognize;

  const release = () => {
    generationRef.current += 1;
    requestRef.current?.abort();
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };
  useEffect(() => () => release(), []);
  useEffect(() => { if (disabled) { release(); setOpen(false); setRunning(false); } }, [disabled]);

  const start = async (deviceId?: string) => {
    release();
    const generation = generationRef.current;
    setOpen(true); setReady(false); setStarting(true); setError(""); setRunning(false);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera access is unavailable in this browser. Use Choose photos instead.");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: {
        ...(deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: "environment" } }),
        width: { ideal: 1280 }, height: { ideal: 720 },
      } });
      if (generation !== generationRef.current) { stream.getTracks().forEach(track => track.stop()); return; }
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) { release(); return; }
      video.srcObject = stream;
      await video.play();
      setDevice(stream.getVideoTracks()[0]?.getSettings().deviceId ?? "");
      setDevices((await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === "videoinput"));
      setReady(true); setRunning(true);
    } catch (cause) {
      if (generation !== generationRef.current) return;
      release();
      const name = cause instanceof DOMException ? cause.name : "";
      setError(name === "NotAllowedError" ? "Camera permission was denied. Allow camera access in your browser, then try again."
        : name === "NotFoundError" ? "No camera was found. Connect a webcam or choose photos."
        : name === "NotReadableError" ? "The camera is busy. Close other apps using it and try again."
        : cause instanceof Error ? cause.message : "Could not open the camera.");
    } finally { if (generation === generationRef.current || !streamRef.current) setStarting(false); }
  };

  const capture = async () => {
    const video = videoRef.current;
    if (!video?.videoWidth || busy || requestRef.current) return false;
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * scale); canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return false;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const ok = await recognizeRef.current(canvas.toDataURL("image/jpeg", 0.82), controller.signal);
      if (!ok) setRunning(false);
      return ok;
    } finally { if (requestRef.current === controller) requestRef.current = null; }
  };

  useEffect(() => {
    if (!running || !ready || busy || disabled) return;
    // Never overlap recognition requests; leave time to reposition between results.
    const timer = window.setTimeout(() => { void capture(); }, 3000);
    return () => window.clearTimeout(timer);
  }, [running, ready, busy, disabled]);

  return <div className="space-y-3">
    {!open && <Button size="lg" onClick={() => void start()} disabled={disabled}><Camera className="mr-2 h-5 w-5" />Open camera</Button>}
    {open && <>
      <div className="relative aspect-video overflow-hidden rounded-md border bg-muted">
        <video ref={videoRef} muted autoPlay playsInline className="h-full w-full object-contain" aria-label="Live inventory camera" />
        <div className="absolute left-2 top-2 flex items-center gap-2 rounded-md bg-background/90 px-3 py-2 text-sm" role="status">
          {(starting || busy) && <Loader2 className="h-4 w-4 animate-spin" />}
          {starting ? "Opening camera…" : busy ? "Recognizing…" : running ? "Live scan" : "Paused"}
        </div>
        <Button className="absolute right-2 top-2" size="icon" variant="secondary" aria-label="Close camera" onClick={() => { release(); setOpen(false); setReady(false); setRunning(false); }}><X className="h-4 w-4" /></Button>
      </div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {ready ? <>
          <Button onClick={() => setRunning(value => !value)} disabled={disabled}>{running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}{running ? "Pause live scan" : "Resume live scan"}</Button>
          <Button variant="outline" onClick={() => void capture()} disabled={busy || running || disabled}><Camera className="mr-2 h-4 w-4" />Scan now</Button>
          {devices.length > 1 && <Select value={device} onValueChange={value => void start(value)} disabled={busy}>
            <SelectTrigger className="w-full sm:w-56" aria-label="Camera device"><SelectValue placeholder="Camera" /></SelectTrigger>
            <SelectContent>{devices.map((d, index) => <SelectItem key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${index + 1}`}</SelectItem>)}</SelectContent>
          </Select>}
        </> : !starting && <Button variant="outline" onClick={() => void start()} disabled={disabled}><RefreshCw className="mr-2 h-4 w-4" />Try camera again</Button>}
      </div>
    </>}
  </div>;
}