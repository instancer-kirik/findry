import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { FloorplanItem } from "@/hooks/use-floorplan";

const db = supabase as any;
type Tool = { id: string; name: string; kind: string | null; category: string | null; location: string | null; owner_name: string | null; quantity: string | null };

/** Lists inventory whose location matches this zone's label; editors can move items in/out. */
export function ZoneContents({ item, readOnly }: { item: FloorplanItem; readOnly?: boolean }) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [pick, setPick] = useState("");
  const zone = (item.label ?? "").trim();

  const load = async () => {
    const { data } = await db.from("space_tools").select("id,name,kind,category,location,owner_name,quantity").order("name");
    setTools(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const inside = useMemo(() => tools.filter(t => zone && (t.location ?? "").trim().toLowerCase() === zone.toLowerCase()), [tools, zone]);
  const others = useMemo(() => tools.filter(t => !inside.includes(t)), [tools, inside]);

  const setLocation = async (id: string, location: string | null) => {
    const { error } = await db.from("space_tools").update({ location }).eq("id", id);
    if (error) return toast.error(error.message);
    setTools(ts => ts.map(t => t.id === id ? { ...t, location } : t));
  };

  const props = Object.entries(item.meta ?? {}).filter(([k]) => k !== "color");

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Zone props</Label>
        <dl className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1 rounded-md bg-muted/50 p-2 text-xs">
          <dt className="text-muted-foreground">Size</dt><dd>{(item.w / 10).toFixed(1)} × {(item.h / 10).toFixed(1)} ft</dd>
          <dt className="text-muted-foreground">Kind</dt><dd>{item.kind}</dd>
          <dt className="text-muted-foreground">Level</dt><dd>{(item.level ?? 0) === 0 ? "ground" : "mezzanine"}</dd>
          {props.map(([k, v]) => (
            <React.Fragment key={k}><dt className="truncate text-muted-foreground">{k.replace(/_/g, " ")}</dt><dd className="break-words">{String(v)}</dd></React.Fragment>
          ))}
        </dl>
      </div>
      <div>
        <Label className="text-xs">Contains ({inside.length})</Label>
        {!zone ? <p className="text-xs text-muted-foreground">Name this zone to list its tools and materials.</p>
          : inside.length === 0 ? <p className="mt-1 text-xs text-muted-foreground">Nothing here yet.</p>
          : (
            <ul className="mt-1 max-h-64 divide-y overflow-auto rounded-md border text-xs">
              {inside.map(t => (
                <li key={t.id} className="flex items-center gap-2 p-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{t.name}{t.quantity ? ` ×${t.quantity}` : ""}</p>
                    <p className="truncate text-muted-foreground">{[t.kind, t.category, t.owner_name].filter(Boolean).join(" · ")}</p>
                  </div>
                  {!readOnly && <Button size="sm" variant="ghost" className="h-9 w-9 p-0" aria-label={`Remove ${t.name}`} onClick={() => setLocation(t.id, null)}><X className="h-3 w-3" /></Button>}
                </li>
              ))}
            </ul>
          )}
        {!readOnly && zone && (
          <div className="mt-2 flex gap-2">
            <select className="h-10 min-w-0 flex-1 rounded-md border bg-background px-2 text-xs" value={pick} onChange={e => setPick(e.target.value)}>
              <option value="">Add tool or material…</option>
              {others.map(t => <option key={t.id} value={t.id}>{t.name}{t.location ? ` (in ${t.location})` : ""}</option>)}
            </select>
            <Button size="sm" className="h-10" disabled={!pick} onClick={async () => { await setLocation(pick, zone); setPick(""); }}>Add</Button>
          </div>
        )}
      </div>
    </div>
  );
}
