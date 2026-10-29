import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Camera, ImagePlus, Loader2, Save, Trash2 } from "lucide-react";
import CatalogCamera from "@/components/floorplan/CatalogCamera";
import { freshCatalogItems } from "@/lib/catalog-batch";

const PLACE = "Baltimore Hackerspace";
const FLOORPLAN_ID = "617b20a6-8edf-4218-a6b4-ed6cfca9f749";
const CATEGORIES = ["Automotive", "Carpentry", "CNC Tools", "Electrical", "General", "Machinist Tools", "Metalworking", "Miscellaneous", "Stock / materials"];
const db = supabase as any;

type Found = {
  key: string; keep: boolean; name: string; kind: "tool" | "material"; category: string;
  quantity: string | null; shape: string | null; brand: string | null; model: string | null;
  power: string | null; notes: string | null;
};
type Shot = { id: string; preview: string; status: "working" | "done" | "error"; error?: string };

/** Shrink a photo so uploads stay fast on phone data. */
const shrink = (file: File) => new Promise<string>((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const s = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    const context = c.getContext("2d");
    if (!context) { reject(new Error("Couldn't prepare that photo")); return; }
    context.drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    resolve(c.toDataURL("image/jpeg", 0.82));
  };
  img.onerror = () => reject(new Error("Couldn't read that photo"));
  img.src = URL.createObjectURL(file);
});

const HackerspaceScan = () => {
  const { user, loading: authLoading } = useAuth() as any;
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);
  const [zones, setZones] = useState<string[]>([]);
  const [zone, setZone] = useState("");
  const [mode, setMode] = useState<"pile" | "single">("pile");
  const [shots, setShots] = useState<Shot[]>([]);
  const [found, setFound] = useState<Found[]>([]);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [scanError, setScanError] = useState("");
  const [lastCount, setLastCount] = useState<number | null>(null);
  const busyRef = useRef(false);
  const seenRef = useRef(new Set<string>());
  const uploadAbortRef = useRef<AbortController | null>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  useEffect(() => () => uploadAbortRef.current?.abort(), []);

  useEffect(() => {
    db.from("floorplan_items").select("label").eq("floorplan_id", FLOORPLAN_ID)
      .or("kind.eq.booth,meta->>object_type.eq.room_zone,meta->>object_type.eq.storage_rack")
      .then(({ data }: any) => setZones([...new Set<string>((data ?? []).map((d: any) => d.label).filter(Boolean))].sort()));
  }, []);
  useEffect(() => {
    if (authLoading) return;
    if (!user) { setIsAdmin(false); setRoleChecked(true); return; }
    setRoleChecked(false);
    Promise.all(["admin", "moderator"].map(r => db.rpc("has_role", { _role: r, _user_id: user.id })))
      .then((res: any[]) => { setIsAdmin(res.some(x => !!x.data)); setRoleChecked(true); });
  }, [user, authLoading]);

  const recognize = async (image: string, signal: AbortSignal): Promise<boolean> => {
    if (busyRef.current || !isAdmin || signal.aborted) return false;
    busyRef.current = true; setBusy(true); setScanError("");
    const id = crypto.randomUUID();
    setShots(s => [{ id, preview: image, status: "working" as const }, ...s].slice(0, 12));
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Sign in to scan items");
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/catalog-detect`, {
        method: "POST", signal,
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${sessionData.session.access_token}` },
        body: JSON.stringify({ image, mode }),
      });
      const data = await response.json();
      if (signal.aborted) { setShots(s => s.filter(x => x.id !== id)); return false; }
      const msg = !response.ok ? data?.error ?? data?.message ?? `Recognition failed (${response.status})` : data?.error;
      if (msg) throw new Error(msg);
      if (!Array.isArray(data?.items)) throw new Error("Recognition returned an invalid list. Scanning paused.");
      const items: Found[] = freshCatalogItems<Found>((data.items as any[]).map(it => ({ ...it, key: crypto.randomUUID(), keep: true })), seenRef.current);
      setFound(f => [...items, ...f]); setLastCount(items.length);
      setShots(s => s.map(x => x.id === id ? { ...x, status: "done" } : x));
      return true;
    } catch (cause) {
      if (signal.aborted) { setShots(s => s.filter(x => x.id !== id)); return false; }
      const msg = cause instanceof Error ? cause.message : "Recognition failed. Scanning paused.";
      setScanError(msg); toast.error(msg);
      setShots(s => s.map(x => x.id === id ? { ...x, status: "error", error: msg } : x));
      return false;
    } finally { busyRef.current = false; setBusy(false); }
  };

  const scan = async (files: FileList | null) => {
    if (!files?.length || busyRef.current) return;
    const controller = new AbortController();
    uploadAbortRef.current = controller;
    for (const file of Array.from(files)) {
      if (controller.signal.aborted) break;
      try { if (!await recognize(await shrink(file), controller.signal)) break; }
      catch (cause) { toast.error(cause instanceof Error ? cause.message : "Couldn't read that photo"); break; }
    }
  };

  const edit = (key: string, patch: Partial<Found>) => setFound(f => f.map(x => x.key === key ? { ...x, ...patch } : x));
  const kept = found.filter(f => f.keep && f.name.trim());

  const saveAll = async () => {
    if (!kept.length) return;
    setSaving(true);
    const { data: last } = await db.from("space_tools").select("sort_order").eq("place", PLACE).order("sort_order", { ascending: false }).limit(1);
    let order = last?.[0]?.sort_order ?? 0;
    const rows = kept.map(f => {
      const params: Record<string, string> = {};
      (["shape", "brand", "model", "power"] as const).forEach(k => { const value = f[k]?.trim(); if (value) params[k] = value; });
      const details = [f.brand && `Brand: ${f.brand}`, f.model && `Model: ${f.model}`, f.shape && `Shape: ${f.shape}`, f.power && `Power: ${f.power}`].filter(Boolean);
      return {
        place: PLACE, name: f.name.trim(), kind: f.kind, category: f.category,
        quantity: f.quantity?.trim() || null, description: f.notes?.trim() || null,
        details, params, location: zone.trim() || null, sort_order: ++order,
      };
    });
    const { error } = await db.from("space_tools").insert(rows);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(`Saved ${rows.length} item${rows.length === 1 ? "" : "s"}${zone ? ` to ${zone}` : ""}`);
    const savedKeys = new Set(kept.map(x => x.key));
    setFound(f => f.filter(x => !savedKeys.has(x.key)));
  };

  const disabled = !isAdmin;
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <p className="text-sm text-muted-foreground"><Link to="/spaces/baltimore-hackerspace" className="underline">{PLACE} inventory</Link></p>
        <h1 className="mt-1 text-3xl font-bold">Scan items</h1>
        {roleChecked && !isAdmin && <p className="mt-3 rounded-md border bg-muted p-3 text-sm">{user ? `Signed in as ${user.email}, which is not an inventory admin or manager.` : "Sign in as an inventory admin or manager to scan items."}</p>}

        <div className="mt-6 space-y-4 border-b pb-6">
          <div>
            <label className="text-sm font-medium" htmlFor="scan-zone">1. Location for this batch</label>
            <Input id="scan-zone" className="mt-1" list="scan-zones" value={zone} onChange={e => setZone(e.target.value)} placeholder="Zone name or any text, e.g. Milling Bay" disabled={disabled || busy || saving || found.length > 0} />
            <datalist id="scan-zones">{zones.map(z => <option key={z} value={z} />)}</datalist>
          </div>
          <div>
            <p className="text-sm font-medium">2. What's in the photo</p>
            <div className="mt-1 flex gap-2">
              <Button size="sm" variant={mode === "pile" ? "default" : "outline"} onClick={() => setMode("pile")} disabled={disabled || busy}>Box or pile</Button>
              <Button size="sm" variant={mode === "single" ? "default" : "outline"} onClick={() => setMode("single")} disabled={disabled || busy}>One item</Button>
            </div>
          </div>
          <div>
            <CatalogCamera disabled={disabled || saving} busy={busy} onRecognize={recognize} />
            <div className="mt-1 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => libraryRef.current?.click()} disabled={disabled || busy || saving}><ImagePlus className="mr-2 h-4 w-4" />Choose photos</Button>
              <Button variant="outline" disabled={disabled || busy || saving || found.length > 0} onClick={() => { seenRef.current.clear(); setShots([]); setLastCount(null); setScanError(""); toast("New batch started"); }}><Camera className="mr-2 h-4 w-4" />New batch</Button>
            </div>
            <input ref={libraryRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { scan(e.target.files); e.target.value = ""; }} />
            {scanError && <p role="alert" className="mt-2 text-sm text-destructive">{scanError}</p>}
            {lastCount !== null && <p className="mt-2 text-sm text-muted-foreground" role="status">Last scan: {lastCount} new · repeated matches skipped</p>}
          </div>
          {shots.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {shots.map(s => (
                <div key={s.id} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border" title={s.error}>
                  <img src={s.preview} alt="Scanned photo" className="h-full w-full object-cover" />
                  {s.status === "working" && <div className="absolute inset-0 grid place-items-center bg-background/60"><Loader2 className="h-5 w-5 animate-spin" /></div>}
                  {s.status === "error" && <div className="absolute inset-x-0 bottom-0 bg-destructive px-1 text-[10px] text-destructive-foreground">Failed</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {found.length > 0 && (
          <div className="mt-6 space-y-3">
            <h2 className="text-lg font-semibold">Found {found.length} · {kept.length} selected</h2>
            <Button variant="ghost" size="sm" disabled={busy || saving} onClick={() => setFound([])}><Trash2 className="mr-2 h-4 w-4" />Discard batch</Button>
            {found.map(f => (
              <Card key={f.key} className={`p-3 ${f.keep ? "" : "opacity-50"}`}>
                <div className="flex items-start gap-3">
                  <Checkbox className="mt-2.5" checked={f.keep} onCheckedChange={v => edit(f.key, { keep: !!v })} aria-label={`Keep ${f.name}`} />
                  <div className="grid flex-1 gap-2 sm:grid-cols-6">
                    <Input aria-label="Name" className="sm:col-span-4" value={f.name} onChange={e => edit(f.key, { name: e.target.value })} />
                    <Input aria-label="Quantity" className="sm:col-span-2" placeholder="Qty" value={f.quantity ?? ""} onChange={e => edit(f.key, { quantity: e.target.value })} />
                    <Select value={f.kind} onValueChange={v => edit(f.key, { kind: v as Found["kind"] })}>
                      <SelectTrigger aria-label="Type" className="sm:col-span-2"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="tool">Tool</SelectItem><SelectItem value="material">Material</SelectItem></SelectContent>
                    </Select>
                    <Select value={f.category} onValueChange={v => edit(f.key, { category: v })}>
                      <SelectTrigger aria-label="Category" className="sm:col-span-4"><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input aria-label="Brand" className="sm:col-span-2" placeholder="Brand" value={f.brand ?? ""} onChange={e => edit(f.key, { brand: e.target.value })} />
                    <Input aria-label="Model" className="sm:col-span-2" placeholder="Model" value={f.model ?? ""} onChange={e => edit(f.key, { model: e.target.value })} />
                    <Input aria-label="Shape" className="sm:col-span-2" placeholder="Shape / form" value={f.shape ?? ""} onChange={e => edit(f.key, { shape: e.target.value })} />
                    <Input aria-label="Power" className="sm:col-span-2" placeholder="Power" value={f.power ?? ""} onChange={e => edit(f.key, { power: e.target.value })} />
                    <Input aria-label="Notes" className="sm:col-span-4" placeholder="Notes" value={f.notes ?? ""} onChange={e => edit(f.key, { notes: e.target.value })} />
                  </div>
                  <Button size="icon" variant="ghost" aria-label="Remove" onClick={() => setFound(x => x.filter(y => y.key !== f.key))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {found.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur">
          <div className="container mx-auto flex max-w-4xl items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">{kept.length} to save{zone ? ` → ${zone}` : " (no location)"}</span>
            <Button onClick={saveAll} disabled={saving || !kept.length || disabled}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save {kept.length}
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default HackerspaceScan;
