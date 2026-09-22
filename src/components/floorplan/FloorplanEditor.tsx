import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Box, Square, RectangleHorizontal, Columns3, Tent, Truck,
  Mic2, Plug, Sparkles, Footprints, DoorOpen, Trash2, RotateCw, Lock, Unlock, Volume2,
  Plus, SlidersHorizontal, X,
} from "lucide-react";
import type { FloorplanItem, FloorplanItemKind, FloorplanAssignment } from "@/hooks/use-floorplan";

// canvas units per foot (seeded plans use 1 ft = 10 units)
const UPF = 10;
const ft = (units: number) => Math.round((units / UPF) * 10) / 10;
const toUnits = (feet: number) => Math.round(feet * UPF);
const SNAP = 5; // half a foot

const PALETTE: { kind: FloorplanItemKind; label: string; w: number; h: number; z?: number; icon: React.ElementType; color: string; meta?: Record<string, unknown> }[] = [
  { kind: "booth", label: "Booth", w: 100, h: 100, icon: Square, color: "#fb923c", meta: { sizable: true } },
  { kind: "table", label: "Table", w: 60, h: 40, icon: RectangleHorizontal, color: "#f59e0b", meta: { sizable: true } },
  { kind: "wall", label: "Wall", w: 120, h: 10, icon: Columns3, color: "#a3a3a3", meta: { sizable: true } },
  {
    kind: "wall", label: "Rolling Acoustic Wall", w: 40, h: 5, z: 22, icon: Volume2, color: "#c26f3d",
    meta: {
      object_type: "rolling_acoustic_wall", rolling: true, absorber: true,
      width_inches: 48, height_inches: 84, depth_inches: 6,
      core: "4 in mineral wool", finish: "fire-rated acoustic fabric",
    },
  },
  {
    kind: "wall", label: "Movable Wall (8 ft)", w: 80, h: 6, z: 24, icon: Columns3, color: "#b08968",
    meta: {
      object_type: "movable_wall", rolling: true,
      width_inches: 96, height_inches: 96, depth_inches: 6,
      core: "2x4 frame + 3.5 in mineral wool", finish: "ply both faces",
    },
  },
  {
    kind: "wall", label: "Acoustic Curtain", w: 120, h: 3, z: 26, icon: Volume2, color: "#8d6e63",
    meta: { object_type: "acoustic_curtain", rolling: true, track: "ceiling track", finish: "22 oz velour" },
  },
  {
    kind: "misc", label: "Recording Booth", w: 80, h: 70, z: 26, icon: Mic2, color: "#7c9cbf",
    meta: {
      object_type: "recording_booth", isolation: true,
      footprint_ft: "8 x 7", inner_height_ft: 8,
      build: "decoupled double-stud walls, 2 layers 5/8 drywall + green glue, floating floor, sealed door + laminated window",
    },
  },
  {
    kind: "misc", label: "Workshop Room", w: 240, h: 180, z: 26, icon: Box, color: "#9a8c98",
    meta: {
      object_type: "workshop_room", sizable: true,
      needs: "dust collection, 240V drop, wide double door, tool wall",
    },
  },
  {
    kind: "misc", label: "Mezzanine Deck", w: 300, h: 200, z: 4, icon: Columns3, color: "#6b7280",
    meta: { object_type: "mezzanine_deck", sizable: true, deck_height_ft: 12 },
  },
  { kind: "pedestal", label: "Pedestal", w: 30, h: 30, icon: Box, color: "#c084fc" },
  { kind: "stage", label: "Stage", w: 240, h: 120, icon: Mic2, color: "#f43f5e", meta: { sizable: true } },
  { kind: "seating", label: "Seating", w: 180, h: 100, icon: Footprints, color: "#60a5fa", meta: { sizable: true } },
  { kind: "tent", label: "Tent", w: 120, h: 120, icon: Tent, color: "#22c55e" },
  { kind: "truck", label: "Food Truck", w: 140, h: 60, icon: Truck, color: "#10b981" },
  { kind: "entrance", label: "Entrance", w: 60, h: 20, icon: DoorOpen, color: "#eab308" },
  { kind: "power", label: "Power Drop", w: 20, h: 20, icon: Plug, color: "#ef4444" },
  { kind: "signage", label: "Signage", w: 40, h: 40, icon: Sparkles, color: "#e879f9" },
];

const BOOTH_PRESETS: { label: string; w: number; h: number }[] = [
  { label: "10 × 10", w: 100, h: 100 },
  { label: "10 × 20", w: 200, h: 100 },
  { label: "20 × 20", w: 200, h: 200 },
  { label: "8 × 8", w: 80, h: 80 },
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
  /** local-only preview during drag/resize; no network write */
  onPreview?: (id: string, patch: Partial<FloorplanItem>) => void;
  onRemove: (id: string) => void;
  onClaim?: (id: string) => void;
}

type Gesture =
  | { mode: "move"; id: string; pointerId: number; sx: number; sy: number; ox: number; oy: number; active: boolean; latest: Partial<FloorplanItem> }
  | { mode: "resize"; id: string; pointerId: number; sx: number; sy: number; w0: number; h0: number; active: boolean; latest: Partial<FloorplanItem> };

const TOUCH_DRAG_THRESHOLD = 6;

export const FloorplanEditor: React.FC<Props> = ({
  items, assignments, canvas, readOnly, selectedId, onSelect, onAdd, onUpdate, onPreview, onRemove, onClaim,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const isMobile = useIsMobile();
  const [isCompact, setIsCompact] = useState(() => typeof window !== "undefined" && window.innerWidth < 1200);
  const [zoom, setZoom] = useState(isMobile ? 0.45 : 0.7);
  const [level, setLevel] = useState(0);
  const [tray, setTray] = useState<"add" | "inspect" | null>(null);
  const onLevel = items.filter((it) => (it.level ?? 0) === level);
  const offLevel = items.filter((it) => (it.level ?? 0) !== level);

  const selected = items.find((i) => i.id === selectedId) || null;
  const assignedItemIds = new Set(assignments.filter(a => a.status !== "declined").map(a => a.item_id));
  const preview = onPreview ?? onUpdate;
  const snap = (n: number) => Math.round(n / SNAP) * SNAP;

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1199px)");
    const updateCompact = () => setIsCompact(query.matches);
    updateCompact();
    query.addEventListener("change", updateCompact);
    return () => query.removeEventListener("change", updateCompact);
  }, []);

  const pickItem = (item: FloorplanItem) => {
    onSelect(item.id);
    if (isMobile) setTray("inspect");
  };

  const startMove = (e: React.PointerEvent, item: FloorplanItem) => {
    pickItem(item);
    if (readOnly || item.meta?.locked) return;
    if (!canvasRef.current) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const rect = canvasRef.current.getBoundingClientRect();
    gestureRef.current = {
      mode: "move", id: item.id, pointerId: e.pointerId, sx: e.clientX, sy: e.clientY,
      ox: (e.clientX - rect.left) / zoom - item.x,
      oy: (e.clientY - rect.top) / zoom - item.y,
      active: false, latest: {},
    };
  };

  const startResize = (e: React.PointerEvent, item: FloorplanItem) => {
    e.stopPropagation();
    e.preventDefault();
    if (readOnly || item.meta?.locked) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    gestureRef.current = {
      mode: "resize", id: item.id, pointerId: e.pointerId, sx: e.clientX, sy: e.clientY,
      w0: item.w, h0: item.h, active: false, latest: {},
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== e.pointerId || !canvasRef.current) return;
    const distance = Math.hypot(e.clientX - gesture.sx, e.clientY - gesture.sy);
    if (!gesture.active && distance < TOUCH_DRAG_THRESHOLD) return;
    gesture.active = true;
    e.preventDefault();
    if (gesture.mode === "move") {
      const rect = canvasRef.current.getBoundingClientRect();
      const patch = {
        x: snap((e.clientX - rect.left) / zoom - gesture.ox),
        y: snap((e.clientY - rect.top) / zoom - gesture.oy),
      };
      gesture.latest = patch;
      preview(gesture.id, patch);
    } else {
      const patch = {
        w: Math.max(SNAP, snap(gesture.w0 + (e.clientX - gesture.sx) / zoom)),
        h: Math.max(SNAP, snap(gesture.h0 + (e.clientY - gesture.sy) / zoom)),
      };
      gesture.latest = patch;
      preview(gesture.id, patch);
    }
  };

  // one write when the gesture ends
  const endGesture = (e?: React.PointerEvent) => {
    const gesture = gestureRef.current;
    if (!gesture) return;
    if (e && e.pointerId !== gesture.pointerId) return;
    if (gesture.active && Object.keys(gesture.latest).length > 0) {
      onUpdate(gesture.id, gesture.latest);
    }
    gestureRef.current = null;
  };

  const colorFor = (kind: FloorplanItemKind) => PALETTE.find(p => p.kind === kind)?.color ?? "#888";

  const paletteBody = (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
      {PALETTE.map((p, i) => {
        const Icon = p.icon;
        return (
          <Button key={i} type="button" variant="outline"
            onClick={() => { onAdd({ kind: p.kind, label: p.label, w: p.w, h: p.h, z: p.z, level, meta: { color: p.color, ...p.meta } }); if (isCompact) setTray(null); }}
            className="h-auto min-h-20 flex-col gap-1 p-2 text-xs touch-manipulation">
            <Icon className="h-4 w-4" style={{ color: p.color }} />
            <span className="w-full whitespace-normal text-center leading-tight">{p.label}</span>
            <span className="text-[10px] text-muted-foreground">{ft(p.w)} × {ft(p.h)} ft</span>
          </Button>
        );
      })}
    </div>
  );

  const inspectorBody = !selected ? (
    <p className="text-sm text-muted-foreground">Tap an item on the plan to edit it.</p>
  ) : (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant="outline">{selected.kind}</Badge>
        <div className="flex items-center gap-1">
          <Badge variant="secondary">{(selected.level ?? 0) === 0 ? "ground" : "mezzanine"}</Badge>
          {assignedItemIds.has(selected.id) && <Badge>claimed</Badge>}
        </div>
      </div>
      {!readOnly && (
          <Button size="sm" variant="outline" className="min-h-11 w-full text-xs"
          onClick={() => onUpdate(selected.id, { level: (selected.level ?? 0) === 0 ? 1 : 0 })}>
          Move to {(selected.level ?? 0) === 0 ? "mezzanine" : "ground floor"}
        </Button>
      )}
      <div>
        <Label className="text-xs">Label</Label>
        <Input value={selected.label ?? ""} onChange={(e) => onUpdate(selected.id, { label: e.target.value })} disabled={readOnly} />
      </div>

      {/* footprint in feet */}
      <div>
        <Label className="text-xs">Footprint (ft)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" step="0.5" value={ft(selected.w)} disabled={readOnly}
            onChange={(e) => onUpdate(selected.id, { w: Math.max(SNAP, toUnits(+e.target.value || 0)) })} />
          <Input type="number" step="0.5" value={ft(selected.h)} disabled={readOnly}
            onChange={(e) => onUpdate(selected.id, { h: Math.max(SNAP, toUnits(+e.target.value || 0)) })} />
        </div>
        {!readOnly && (
          <div className="mt-2 flex flex-wrap gap-1">
            {BOOTH_PRESETS.map((p) => (
              <Button key={p.label} size="sm" variant="secondary" className="min-h-10 px-3 text-[11px]"
                onClick={() => onUpdate(selected.id, { w: p.w, h: p.h })}>{p.label} ft</Button>
            ))}
          </div>
        )}
        <p className="mt-1 text-[11px] text-muted-foreground">Drag the corner handle on the plan to resize.</p>
      </div>

      {selected.meta?.object_type === "rolling_acoustic_wall" && (
        <div className="border-l-2 border-primary bg-muted/50 p-3 text-xs">
          <p className="font-medium">48 × 84 × 6 in</p>
          <p className="mt-1 text-muted-foreground">4 in mineral wool · fire-rated acoustic fabric · locking casters</p>
          <p className="mt-2 text-muted-foreground">Absorbs reflections; it does not soundproof the room.</p>
        </div>
      )}
      {selected.meta?.object_type === "movable_wall" && (
        <div className="border-l-2 border-primary bg-muted/50 p-3 text-xs">
          <p className="font-medium">8 ft × 8 ft × 6 in, on locking casters</p>
          <p className="mt-1 text-muted-foreground">2x4 frame, 3.5 in mineral wool, ply both faces. Gang several to define a room, then roll them away.</p>
        </div>
      )}
      {selected.meta?.object_type === "acoustic_curtain" && (
        <div className="border-l-2 border-primary bg-muted/50 p-3 text-xs">
          <p className="font-medium">Ceiling-track curtain, 22 oz velour</p>
          <p className="mt-1 text-muted-foreground">Cheapest way to tame a 20–30 ft tall room; slides open for full volume.</p>
        </div>
      )}
      {selected.meta?.object_type === "recording_booth" && (
        <div className="border-l-2 border-primary bg-muted/50 p-3 text-xs">
          <p className="font-medium">8 × 7 ft booth, 8 ft inner ceiling</p>
          <p className="mt-1 text-muted-foreground">Decoupled double-stud walls, two layers 5/8 drywall with damping compound, floating floor, sealed door and laminated window. This one is real isolation, so it stays put.</p>
        </div>
      )}
      {selected.meta?.object_type === "workshop_room" && (
        <div className="border-l-2 border-primary bg-muted/50 p-3 text-xs">
          <p className="font-medium">Workshop room</p>
          <p className="mt-1 text-muted-foreground">Plan for dust collection, a 240V drop, a wide double door, and a tool wall. Keep it away from the booth.</p>
        </div>
      )}
      {selected.meta?.object_type === "mezzanine_deck" && (
        <div className="border-l-2 border-primary bg-muted/50 p-3 text-xs">
          <p className="font-medium">Mezzanine deck at 12 ft</p>
          <p className="mt-1 text-muted-foreground">Put this on the mezzanine level and place items on top of it. Under-deck space stays usable at ground level.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div><Label className="text-xs">X</Label><Input type="number" value={selected.x} onChange={(e) => onUpdate(selected.id, { x: +e.target.value })} disabled={readOnly} /></div>
        <div><Label className="text-xs">Y</Label><Input type="number" value={selected.y} onChange={(e) => onUpdate(selected.id, { y: +e.target.value })} disabled={readOnly} /></div>
        <div><Label className="text-xs">Rotation</Label><Input type="number" value={selected.rotation} onChange={(e) => onUpdate(selected.id, { rotation: +e.target.value })} disabled={readOnly} /></div>
        <div><Label className="text-xs">Height (3D)</Label><Input type="number" value={selected.z} onChange={(e) => onUpdate(selected.id, { z: +e.target.value })} disabled={readOnly} /></div>
      </div>
      {!readOnly && (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-11 w-11 p-0" aria-label="Rotate item" title="Rotate item" onClick={() => onUpdate(selected.id, { rotation: (selected.rotation + 15) % 360 })}><RotateCw className="h-4 w-4" /></Button>
          <Button size="sm" variant="outline" className="h-11 w-11 p-0" aria-label={selected.meta?.locked ? "Unlock item" : "Lock item"} title={selected.meta?.locked ? "Unlock item" : "Lock item"} onClick={() => onUpdate(selected.id, { meta: { ...selected.meta, locked: !selected.meta?.locked } })}>
            {selected.meta?.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="destructive" className="h-11 w-11 p-0" aria-label="Delete item" title="Delete item" onClick={() => { onRemove(selected.id); if (isCompact) setTray(null); }}><Trash2 className="h-4 w-4" /></Button>
        </div>
      )}
      {readOnly && onClaim && !assignedItemIds.has(selected.id) && (
        <Button size="sm" className="w-full" onClick={() => onClaim(selected.id)}>Claim this spot</Button>
      )}
    </div>
  );

  const canvasCard = (
    <Card className="overflow-auto bg-muted/30 p-2 sm:p-3 overscroll-contain">
      <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
        <div className="flex gap-1">
          {[0, 1].map((lv) => (
            <Button key={lv} size="sm" variant={level === lv ? "default" : "outline"} className="h-7 px-2 text-xs"
              onClick={() => { setLevel(lv); onSelect(null); }}>
              {lv === 0 ? "Ground" : "Mezzanine"}
            </Button>
          ))}
        </div>
        <span>Zoom</span>
        <input aria-label="Plan zoom" className="h-10 w-28 touch-manipulation accent-primary" type="range" min="0.2" max="2" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
        <span className="ml-auto text-muted-foreground">{ft(canvas.width)} × {ft(canvas.height)} ft</span>
      </div>
      <div
        ref={canvasRef}
        className="relative mx-auto select-none touch-none border border-border bg-card overscroll-none"
        style={{
          width: canvas.width * zoom, height: canvas.height * zoom,
          backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
          backgroundSize: `${UPF * zoom}px ${UPF * zoom}px`,
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onClick={(e) => { if (e.target === e.currentTarget) onSelect(null); }}
      >
        {offLevel.map((it) => (
          <div key={`ghost-${it.id}`} className="absolute pointer-events-none border border-dashed border-muted-foreground/40 opacity-30"
            style={{
              left: it.x * zoom, top: it.y * zoom,
              width: it.w * zoom, height: it.h * zoom,
              transform: `rotate(${it.rotation}deg)`,
            }} />
        ))}
        {onLevel.map((it) => {
          const claimed = assignedItemIds.has(it.id);
          const sel = selectedId === it.id;
          return (
            <div
              key={it.id}
              onPointerDown={(e) => startMove(e, it)}
              className={`absolute flex items-center justify-center text-[10px] font-medium cursor-move select-none touch-none ${sel ? "z-10 ring-2 ring-primary ring-offset-2 ring-offset-background" : ""} ${it.meta?.locked ? "cursor-default" : "active:cursor-grabbing"}`}
              style={{
                left: it.x * zoom, top: it.y * zoom,
                width: it.w * zoom, height: it.h * zoom,
                transform: `rotate(${it.rotation}deg)`,
                background: (it.meta?.color ?? colorFor(it.kind)) + (claimed ? "" : "cc"),
                border: claimed ? "2px solid hsl(var(--primary))" : "1px solid rgba(0,0,0,.3)",
                color: "#0a0a0a",
              }}
            >
              <span className="pointer-events-none px-1 text-center leading-tight">{it.label ?? it.kind}</span>
              {sel && !readOnly && !it.meta?.locked && (
                <span
                  onPointerDown={(e) => startResize(e, it)}
                  aria-label="Resize item"
                  className="absolute -bottom-3 -right-3 h-7 w-7 cursor-nwse-resize rounded-sm border-2 border-background bg-primary shadow-md touch-none sm:h-8 sm:w-8"
                />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );

  if (isCompact) {
    return (
      <div className="relative min-h-[55vh] pb-20">
        {canvasCard}
        {/* Mobile tray */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur">
          {tray && (
            <div className="max-h-[45vh] overflow-y-auto p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{tray === "add" ? "Add to floor" : "Selected item"}</span>
                <Button size="sm" variant="ghost" className="h-11 w-11 p-0" aria-label="Close tray" onClick={() => setTray(null)}><X className="h-4 w-4" /></Button>
              </div>
              {tray === "add" ? paletteBody : inspectorBody}
            </div>
          )}
          <div className="flex gap-2 p-2">
            {!readOnly && (
              <Button className="min-h-12 flex-1" variant={tray === "add" ? "default" : "outline"}
                onClick={() => setTray(tray === "add" ? null : "add")}>
                <Plus className="mr-1 h-4 w-4" />Add
              </Button>
            )}
            <Button className="min-h-12 flex-1" variant={tray === "inspect" ? "default" : "outline"}
              onClick={() => setTray(tray === "inspect" ? null : "inspect")}>
              <SlidersHorizontal className="mr-1 h-4 w-4" />
              {selected ? (selected.label ?? selected.kind) : "Details"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-3 h-[calc(100vh-180px)]">
      {!readOnly && (
        <Card className="p-3 overflow-y-auto">
          <h3 className="font-semibold mb-2 text-sm">Drop into floor</h3>
          {paletteBody}
        </Card>
      )}
      {canvasCard}
      <Card className="p-3 overflow-y-auto">{inspectorBody}</Card>
    </div>
  );
};
