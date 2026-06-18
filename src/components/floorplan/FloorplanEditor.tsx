import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Box, Square, RectangleHorizontal, Columns3, Tent, Truck,
  Mic2, Plug, Sparkles, Footprints, DoorOpen, Trash2, RotateCw, Lock, Unlock
} from "lucide-react";
import type { FloorplanItem, FloorplanItemKind, FloorplanAssignment } from "@/hooks/use-floorplan";

const PALETTE: { kind: FloorplanItemKind; label: string; w: number; h: number; icon: any; color: string }[] = [
  { kind: "booth", label: "10×10 Booth", w: 100, h: 100, icon: Square, color: "#fb923c" },
  { kind: "booth", label: "10×20 Booth", w: 200, h: 100, icon: RectangleHorizontal, color: "#fb923c" },
  { kind: "table", label: "Table", w: 60, h: 40, icon: RectangleHorizontal, color: "#f59e0b" },
  { kind: "wall", label: "Wall", w: 120, h: 10, icon: Columns3, color: "#a3a3a3" },
  { kind: "pedestal", label: "Pedestal", w: 30, h: 30, icon: Box, color: "#c084fc" },
  { kind: "stage", label: "Stage", w: 240, h: 120, icon: Mic2, color: "#f43f5e" },
  { kind: "seating", label: "Seating", w: 180, h: 100, icon: Footprints, color: "#60a5fa" },
  { kind: "tent", label: "Tent", w: 120, h: 120, icon: Tent, color: "#22c55e" },
  { kind: "truck", label: "Food Truck", w: 140, h: 60, icon: Truck, color: "#10b981" },
  { kind: "entrance", label: "Entrance", w: 60, h: 20, icon: DoorOpen, color: "#eab308" },
  { kind: "power", label: "Power Drop", w: 20, h: 20, icon: Plug, color: "#ef4444" },
  { kind: "signage", label: "Signage", w: 40, h: 40, icon: Sparkles, color: "#e879f9" },
];

interface Props {
  items: FloorplanItem[];
  assignments: FloorplanAssignment[];
  canvas: { width: number; height: number; units: string };
  readOnly?: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: (patch: Partial<FloorplanItem> & { kind: FloorplanItemKind }) => void;
  onUpdate: (id: string, patch: Partial<FloorplanItem>) => void;
  onRemove: (id: string) => void;
  onClaim?: (id: string) => void;
}

export const FloorplanEditor: React.FC<Props> = ({
  items, assignments, canvas, readOnly, selectedId, onSelect, onAdd, onUpdate, onRemove, onClaim,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.7);
  const [drag, setDrag] = useState<{ id: string; ox: number; oy: number } | null>(null);

  const selected = items.find((i) => i.id === selectedId) || null;
  const assignedItemIds = new Set(assignments.filter(a => a.status !== "declined").map(a => a.item_id));

  const handleMouseDown = (e: React.MouseEvent, item: FloorplanItem) => {
    onSelect(item.id);
    if (readOnly || item.meta?.locked) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    setDrag({ id: item.id, ox: (e.clientX - rect.left) / zoom - item.x, oy: (e.clientY - rect.top) / zoom - item.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drag) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - drag.ox;
    const y = (e.clientY - rect.top) / zoom - drag.oy;
    onUpdate(drag.id, { x: Math.round(x), y: Math.round(y) });
  };

  const handleMouseUp = () => setDrag(null);

  const colorFor = (kind: FloorplanItemKind) => PALETTE.find(p => p.kind === kind)?.color ?? "#888";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_260px] gap-3 h-[calc(100vh-180px)]">
      {/* Palette */}
      {!readOnly && (
        <Card className="p-3 overflow-y-auto">
          <h3 className="font-semibold mb-2 text-sm">Drop into floor</h3>
          <div className="grid grid-cols-2 gap-2">
            {PALETTE.map((p, i) => {
              const Icon = p.icon;
              return (
                <button key={i} onClick={() => onAdd({ kind: p.kind, label: p.label, w: p.w, h: p.h, meta: { color: p.color } })}
                  className="flex flex-col items-center gap-1 p-2 rounded border border-border hover:bg-accent text-xs">
                  <Icon className="h-4 w-4" style={{ color: p.color }} />
                  <span className="truncate w-full text-center">{p.label}</span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Canvas */}
      <Card className="p-3 overflow-auto bg-muted/30">
        <div className="flex items-center gap-2 mb-2 text-xs">
          <span>Zoom</span>
          <input type="range" min="0.3" max="2" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
          <span className="ml-auto text-muted-foreground">{canvas.width}×{canvas.height} {canvas.units}</span>
        </div>
        <div
          ref={canvasRef}
          className="relative bg-card border border-border mx-auto"
          style={{
            width: canvas.width * zoom, height: canvas.height * zoom,
            backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={(e) => { if (e.target === e.currentTarget) onSelect(null); }}
        >
          {items.map((it) => {
            const claimed = assignedItemIds.has(it.id);
            const sel = selectedId === it.id;
            return (
              <div
                key={it.id}
                onMouseDown={(e) => handleMouseDown(e, it)}
                className={`absolute flex items-center justify-center text-[10px] font-medium cursor-move select-none ${sel ? "ring-2 ring-primary" : ""}`}
                style={{
                  left: it.x * zoom, top: it.y * zoom,
                  width: it.w * zoom, height: it.h * zoom,
                  transform: `rotate(${it.rotation}deg)`,
                  background: (it.meta?.color ?? colorFor(it.kind)) + (claimed ? "" : "cc"),
                  border: claimed ? "2px solid hsl(var(--primary))" : "1px solid rgba(0,0,0,.3)",
                  color: "#0a0a0a",
                }}
              >
                {it.label ?? it.kind}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Inspector */}
      <Card className="p-3 overflow-y-auto">
        {!selected ? (
          <p className="text-sm text-muted-foreground">Select an item to inspect.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{selected.kind}</Badge>
              {assignedItemIds.has(selected.id) && <Badge>claimed</Badge>}
            </div>
            <div>
              <Label className="text-xs">Label</Label>
              <Input value={selected.label ?? ""} onChange={(e) => onUpdate(selected.id, { label: e.target.value })} disabled={readOnly} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs">W</Label><Input type="number" value={selected.w} onChange={(e) => onUpdate(selected.id, { w: +e.target.value })} disabled={readOnly} /></div>
              <div><Label className="text-xs">H</Label><Input type="number" value={selected.h} onChange={(e) => onUpdate(selected.id, { h: +e.target.value })} disabled={readOnly} /></div>
              <div><Label className="text-xs">X</Label><Input type="number" value={selected.x} onChange={(e) => onUpdate(selected.id, { x: +e.target.value })} disabled={readOnly} /></div>
              <div><Label className="text-xs">Y</Label><Input type="number" value={selected.y} onChange={(e) => onUpdate(selected.id, { y: +e.target.value })} disabled={readOnly} /></div>
              <div><Label className="text-xs">Rotation</Label><Input type="number" value={selected.rotation} onChange={(e) => onUpdate(selected.id, { rotation: +e.target.value })} disabled={readOnly} /></div>
              <div><Label className="text-xs">Height (3D)</Label><Input type="number" value={selected.z} onChange={(e) => onUpdate(selected.id, { z: +e.target.value })} disabled={readOnly} /></div>
            </div>
            {!readOnly && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onUpdate(selected.id, { rotation: (selected.rotation + 15) % 360 })}><RotateCw className="h-3 w-3" /></Button>
                <Button size="sm" variant="outline" onClick={() => onUpdate(selected.id, { meta: { ...selected.meta, locked: !selected.meta?.locked } })}>
                  {selected.meta?.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onRemove(selected.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            )}
            {readOnly && onClaim && !assignedItemIds.has(selected.id) && (
              <Button size="sm" className="w-full" onClick={() => onClaim(selected.id)}>Claim this spot</Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};