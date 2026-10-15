import React, { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { InventoryPanel } from "./InventoryPanel";
import type { SpaceTool } from "@/hooks/use-floorplan-inventory";
import type { FloorplanItem } from "@/hooks/use-floorplan";


export const isZone = (i: FloorplanItem) => i.kind === "booth" || i.meta?.object_type === "room_zone" || i.meta?.object_type === "storage_rack";
const norm = (s: string | null | undefined) => (s ?? "").trim().toLowerCase();

/** Zone props, parent/child zones, and inventory whose location matches this zone (or a child zone). */
export function ZoneContents({ item, items = [], readOnly, onUpdate, tools = [], canEditInventory, saving, setLocation }: {
  item: FloorplanItem; items: FloorplanItem[]; readOnly?: boolean;
  tools?: SpaceTool[]; canEditInventory?: boolean; saving?: boolean;
  setLocation?: (id: string, location: string | null) => Promise<boolean>;
  onUpdate: (id: string, patch: Partial<FloorplanItem>) => void;
}) {
  const [showSearch, setShowSearch] = useState(false);
  const zone = (item.label ?? "").trim();


  const zones = items.filter(isZone);
  const parentId = (item.meta?.parent_id as string) || "";
  const parent = zones.find(z => z.id === parentId);
  // Descendants, guarded against cycles.
  const descendants = useMemo(() => {
    const out: FloorplanItem[] = []; const seen = new Set([item.id]);
    const walk = (id: string) => zones.filter(z => z.meta?.parent_id === id && !seen.has(z.id)).forEach(z => { seen.add(z.id); out.push(z); walk(z.id); });
    walk(item.id); return out;
  }, [zones, item.id]);
  const children = descendants.filter(d => d.meta?.parent_id === item.id);
  const zoneOf = (t: SpaceTool) => [item, ...descendants].find(z => z.label && norm(z.label) === norm(t.location));
  const inside = tools.filter(t => zone && zoneOf(t));
  const others = tools.filter(t => !inside.includes(t));


  const props = Object.entries(item.meta ?? {}).filter(([k]) => !["color", "parent_id"].includes(k));
  const blocked = new Set([item.id, ...descendants.map(d => d.id)]);

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Parent zone</Label>
        <select disabled={readOnly} className="mt-1 h-10 w-full rounded-md border bg-background px-2 text-xs"
          value={parentId} onChange={e => onUpdate(item.id, { meta: { ...item.meta, parent_id: e.target.value || undefined } })}>
          <option value="">None (top level)</option>
          {zones.filter(z => !blocked.has(z.id)).map(z => <option key={z.id} value={z.id}>{z.label || z.kind}</option>)}
        </select>
        {children.length > 0 && (
          <p className="mt-1 text-[11px] text-muted-foreground">Sub-zones: {children.map(c => c.label || c.kind).join(", ")}</p>
        )}
      </div>
      <div>
        <Label className="text-xs">Zone props</Label>
        <dl className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1 rounded-md bg-muted/50 p-2 text-xs">
          <dt className="text-muted-foreground">Size</dt><dd>{(item.w / 10).toFixed(1)} × {(item.h / 10).toFixed(1)} ft</dd>
          <dt className="text-muted-foreground">Kind</dt><dd>{item.kind}</dd>
          <dt className="text-muted-foreground">Level</dt><dd>{(item.level ?? 0) === 0 ? "ground" : "mezzanine"}</dd>
          {parent && <><dt className="text-muted-foreground">Inside</dt><dd>{parent.label}</dd></>}
          {props.map(([k, v]) => (
            <React.Fragment key={k}><dt className="truncate text-muted-foreground">{k.replace(/_/g, " ")}</dt><dd className="break-words">{String(v)}</dd></React.Fragment>
          ))}
        </dl>
      </div>
      <div>
        <Label className="text-xs">Contains ({inside.length})</Label>
        {!zone ? <p className="text-xs text-muted-foreground">Name this zone to list its tools and materials.</p>
          : inside.length === 0 ? <p className="mt-1 text-xs text-muted-foreground">Nothing here yet. Set locations in the inventory table, or add below.</p>
          : (
            <ul className="mt-1 max-h-64 divide-y overflow-auto rounded-md border text-xs">
              {inside.map(t => {
                const z = zoneOf(t);
                return (
                  <li key={t.id} className="flex items-center gap-2 p-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{t.name}{t.quantity ? ` ×${t.quantity}` : ""}</p>
                      <p className="truncate text-muted-foreground">{[z && z.id !== item.id ? `in ${z.label}` : null, t.kind, t.category, t.owner_name].filter(Boolean).join(" · ")}</p>
                    </div>
                    {canEditInventory && <Button size="sm" variant="ghost" disabled={saving} className="h-9 w-9 p-0" aria-label={`Remove ${t.name}`} onClick={() => setLocation?.(t.id, null)}><X className="h-3 w-3" /></Button>}
                  </li>
                );
              })}
            </ul>
          )}
        {zone && setLocation && (
          <div className="mt-2 space-y-2">
            <Button size="sm" variant="outline" className="h-10 w-full" onClick={() => setShowSearch(value => !value)}>{showSearch ? "Hide inventory search" : "Search tools & materials"}</Button>
            {showSearch && <InventoryPanel tools={others} canEdit={!!canEditInventory} saving={!!saving} target={zone} onAssign={id => { void setLocation(id, zone); }} />}
          </div>
        )}
      </div>
    </div>
  );
}
