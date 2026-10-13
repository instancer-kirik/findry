import { useState } from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DrawingLines } from "./DrawingLines";
import { drawingSize, parseFloorplanDxf, type DxfUnit, type FloorplanDrawing } from "@/lib/floorplan-dxf";
import type { FloorplanItem } from "@/hooks/use-floorplan";
import { toast } from "sonner";

interface Props {
  items: FloorplanItem[];
  onAdd: (patch: Partial<FloorplanItem> & { kind: "misc" }) => Promise<unknown>;
  disabled?: boolean;
}
export function DxfImportDialog({ items, onAdd, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [drawing, setDrawing] = useState<FloorplanDrawing | null>(null);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState<DxfUnit | "">("");
  const [targetId, setTargetId] = useState("origin");
  const [x, setX] = useState(0), [y, setY] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const zones = items.filter(it => it.kind === "booth" || it.meta?.object_type === "room_zone");
  const target = items.find(it => it.id === targetId);
  const size = drawing && unit ? drawingSize(drawing, unit) : null;
  const upload = async (file?: File) => {
    setError(""); setDrawing(null); setUnit("");
    if (!file) return;
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error("Choose a DXF smaller than 20 MB.");
      const result = parseFloorplanDxf(await file.text());
      setDrawing(result); setUnit(result.detectedUnit ?? ""); setName(file.name.replace(/\.dxf$/i, ""));
    } catch (e) { setError(e instanceof Error ? e.message : "Could not read drawing"); }
  };
  const save = async () => {
    if (!drawing || !size || !unit || !name.trim()) return;
    setBusy(true);
    try {
      await onAdd({ kind: "misc", label: `${name.trim()} — DXF`, x: (target?.x ?? 0) + x * 10, y: (target?.y ?? 0) + y * 10,
        w: size.w, h: size.h, z: 0, rotation: 0, level: target?.level ?? 0,
        meta: { object_type: "dxf_reference", locked: true, segments: drawing.segments, source_units: unit, source_width: drawing.width, source_height: drawing.height } });
      toast.success("Drawing imported at original scale"); setOpen(false); setDrawing(null);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save drawing"); }
    finally { setBusy(false); }
  };
  return <Dialog open={open} onOpenChange={value => { if (!busy) setOpen(value); }}>
    <Button variant="outline" className="min-h-10" disabled={disabled} onClick={() => setOpen(true)}><FileUp className="mr-1 h-4 w-4" />Import DXF</Button>
    <DialogContent className="max-h-[90dvh] w-[calc(100%-1rem)] overflow-y-auto" aria-describedby={undefined}>
      <DialogHeader><DialogTitle>Import DXF</DialogTitle></DialogHeader>
      <Input type="file" accept=".dxf" aria-label="DXF file" disabled={busy} onChange={e => upload(e.target.files?.[0])} />
      {drawing && <>
        <div className="flex h-48 justify-center border border-border bg-muted/30 p-3"><DrawingLines segments={drawing.segments} width={drawing.width} height={drawing.height} /></div>
        <div><Label htmlFor="drawing-name">Name</Label><Input id="drawing-name" value={name} onChange={e => setName(e.target.value)} /></div>
        <div><Label>Drawing units</Label><Select value={unit} onValueChange={v => setUnit(v as DxfUnit)}><SelectTrigger aria-label="Drawing units"><SelectValue placeholder="Choose units" /></SelectTrigger><SelectContent>
          {([['in','Inches'],['ft','Feet'],['mm','Millimeters'],['cm','Centimeters'],['m','Meters']] as const).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
        </SelectContent></Select></div>
        {size && <p className="text-sm">Drawing bounds: {(size.w / 10).toFixed(2)} × {(size.h / 10).toFixed(2)} ft{target ? ` · Room: ${(target.w / 10).toFixed(2)} × ${(target.h / 10).toFixed(2)} ft` : ''}</p>}
        {Object.keys(drawing.skipped).length > 0 && <p role="status" className="text-sm text-destructive">Not imported: {Object.entries(drawing.skipped).map(([type, count]) => `${count} ${type}`).join(", ")}. Explode blocks or convert curves to lines for a complete outline.</p>}
        <div><Label>Placement</Label><Select value={targetId} onValueChange={setTargetId}><SelectTrigger aria-label="Drawing placement"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="origin">Plan origin</SelectItem>{zones.map(it => <SelectItem key={it.id} value={it.id}>{it.label ?? "Zone"}</SelectItem>)}</SelectContent></Select></div>
        <div className="grid grid-cols-2 gap-2"><div><Label htmlFor="drawing-x">X offset (ft)</Label><Input id="drawing-x" type="number" step="0.1" value={x} onChange={e => setX(Number(e.target.value))} /></div><div><Label htmlFor="drawing-y">Y offset (ft)</Label><Input id="drawing-y" type="number" step="0.1" value={y} onChange={e => setY(Number(e.target.value))} /></div></div>
        <Button onClick={save} disabled={busy || !size || !name.trim()}>{busy ? "Importing…" : "Import locked outline"}</Button>
      </>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </DialogContent>
  </Dialog>;
}