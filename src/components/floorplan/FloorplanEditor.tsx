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
  Plus, SlidersHorizontal, X, Copy, Bath, CookingPot, Construction, Package, EyeOff,
} from "lucide-react";
import { ZoneContents, isZone } from "./ZoneContents";
import { DrawingLines } from "./DrawingLines";
import { getDrawingSegments } from "@/lib/floorplan-drawing-data";
import type { FloorplanItem, FloorplanItemKind, FloorplanAssignment } from "@/hooks/use-floorplan";
import { useFloorplanInventory, type SpaceTool } from "@/hooks/use-floorplan-inventory";
import { InventoryPanel } from "./InventoryPanel";
import { toast } from "sonner";

// canvas units per foot (seeded plans use 1 ft = 10 units)
const UPF = 10;
const ft = (units: number) => Math.round((units / UPF) * 10) / 10;
const toUnits = (feet: number) => Math.round(feet * UPF);
const SNAP = 5; // half a foot

const SWATCH_COLORS = [
  "#fb923c", "#f59e0b", "#ef4444", "#f43f5e", "#e879f9", "#a78bfa",
  "#60a5fa", "#38bdf8", "#14b8a6", "#22c55e", "#92400e", "#78716c", "#94a3b8",
];
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
  {
    kind: "misc", label: "5 Ton Crane", w: 300, h: 120, z: 30, icon: Construction, color: "#d97706",
    meta: { object_type: "five_ton_crane", sizable: true, capacity_tons: 5, clearance_required: true },
  },
  {
    kind: "misc", label: "Bathroom", w: 100, h: 80, z: 26, icon: Bath, color: "#38bdf8",
    meta: { object_type: "bathroom", sizable: true, plumbing_required: true },
  },
  {
    kind: "misc", label: "Kitchen", w: 160, h: 120, z: 26, icon: CookingPot, color: "#84cc16",
    meta: { object_type: "kitchen", sizable: true, plumbing_required: true, ventilation_required: true },
  },
  // Large shop tools (footprints include working clearance). Owned by individual members.
  { kind: "misc", label: "CNC Router 5x10 (Shopbot)", w: 80, h: 140, z: 26, icon: Box, color: "#e11d48", meta: { object_type: "shop_tool", tool: "shopbot", sizable: true, member_owned: true, needs: "dust collection, 240V" } },
  { kind: "misc", label: "Laser Cutter (100W CO2)", w: 50, h: 40, z: 26, icon: Sparkles, color: "#f43f5e", meta: { object_type: "shop_tool", tool: "co2_laser", sizable: true, member_owned: true, needs: "exhaust vent" } },
  { kind: "misc", label: "Bridgeport Mill", w: 60, h: 60, z: 26, icon: Box, color: "#64748b", meta: { object_type: "shop_tool", tool: "bridgeport", sizable: true, member_owned: true, needs: "240V, level floor" } },
  { kind: "misc", label: "Table Saw", w: 80, h: 80, z: 26, icon: Square, color: "#a16207", meta: { object_type: "shop_tool", tool: "tablesaw", sizable: true, member_owned: true, needs: "infeed/outfeed clearance" } },
  { kind: "misc", label: "Welding Station", w: 60, h: 60, z: 26, icon: Sparkles, color: "#ea580c", meta: { object_type: "shop_tool", tool: "welding", sizable: true, member_owned: true, needs: "fire-safe zone, screens, ventilation" } },
  { kind: "table", label: "Workbench", w: 80, h: 30, icon: RectangleHorizontal, color: "#92400e", meta: { object_type: "shop_tool", tool: "workbench", sizable: true, member_owned: true } },
  { kind: "misc", label: "Storage Rack (3 tier)", w: 80, h: 20, z: 96, icon: Columns3, color: "#78716c", meta: { object_type: "storage_rack", tiers: 3, sizable: true } },
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
  inventoryPlace?: string;
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
  items, assignments, canvas, readOnly, selectedId, onSelect, onAdd, onUpdate, onPreview, onRemove, onClaim, inventoryPlace,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const gestureCleanupRef = useRef<(() => void) | null>(null);
  const isMobile = useIsMobile();
  const [isCompact, setIsCompact] = useState(() => typeof window !== "undefined" && window.innerWidth < 1200);
  const [zoom, setZoom] = useState(isMobile ? 0.45 : 0.7);
  const [level, setLevel] = useState(0);
  const [tray, setTray] = useState<"add" | "inspect" | null>(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [detailsHidden, setDetailsHidden] = useState(false);
  const [draggedTool, setDraggedTool] = useState<{ tool: SpaceTool; x: number; y: number } | null>(null);
  const [dropZone, setDropZone] = useState<string | null>(null);
  const inventory = useFloorplanInventory(inventoryPlace);
  const inventoryDragCleanup = useRef<(() => void) | null>(null);
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

  const scrollCardRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  useEffect(() => {
    const card = scrollCardRef.current;
    if (!card) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const el = canvasRef.current;
      if (!el) return;
      const z = zoomRef.current;
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const next = Math.min(2, Math.max(0.2, z * Math.exp(-dy * 0.002)));
      if (next === z) return;
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left, py = e.clientY - rect.top;
      const k = next / z;
      zoomRef.current = next;
      setZoom(next);
      requestAnimationFrame(() => {
        card.scrollLeft += px * (k - 1);
        window.scrollBy(0, py * (k - 1));
      });
    };
    card.addEventListener("wheel", onWheel, { passive: false });
    return () => card.removeEventListener("wheel", onWheel);
  }, []);

  const startPan = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || e.target !== e.currentTarget) return;
    const card = scrollCardRef.current;
    let lx = e.clientX, ly = e.clientY;
    const move = (ev: PointerEvent) => {
      if (card) card.scrollLeft -= ev.clientX - lx;
      window.scrollBy(0, -(ev.clientY - ly));
      lx = ev.clientX; ly = ev.clientY;
    };
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  useEffect(() => () => gestureCleanupRef.current?.(), []);
  useEffect(() => () => inventoryDragCleanup.current?.(), []);

  const startInventoryDrag = (event: React.PointerEvent, tool: SpaceTool) => {
    if (!inventory.canEdit || inventory.saving || event.button !== 0) return;
    event.preventDefault(); event.stopPropagation();
    inventoryDragCleanup.current?.();
    const pointerId = event.pointerId;
    const sx = event.clientX; const sy = event.clientY;
    let active = false;
    let target: FloorplanItem | undefined;
    const findZone = (x: number, y: number) => {
      const ids = document.elementsFromPoint(x, y).map(element => element.getAttribute("data-zone-id")).filter(Boolean);
      return items.filter(item => ids.includes(item.id) && isZone(item) && (item.level ?? 0) === level).sort((a, b) => a.w * a.h - b.w * b.h)[0];
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      e.preventDefault();
      if (!active && Math.hypot(e.clientX - sx, e.clientY - sy) < TOUCH_DRAG_THRESHOLD) return;
      active = true;
      if (isCompact) setTray(null);
      target = findZone(e.clientX, e.clientY);
      setDropZone(target?.id ?? null);
      setDraggedTool({ tool, x: e.clientX, y: e.clientY });
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", end, true);
      window.removeEventListener("pointercancel", cancel, true);
      setDraggedTool(null); setDropZone(null); inventoryDragCleanup.current = null;
    };
    const end = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      target = findZone(e.clientX, e.clientY);
      cleanup();
      if (!active) return;
      if (!target?.label?.trim()) { toast.error("Drop on a named zone"); return; }
      const zone = target;
      void inventory.setLocation(tool.id, zone.label?.trim() ?? null).then(saved => { if (saved) onSelect(zone.id); });
    };
    const cancel = (e: PointerEvent) => { if (e.pointerId === pointerId) cleanup(); };
    inventoryDragCleanup.current = cleanup;
    window.addEventListener("pointermove", move, { capture: true, passive: false });
    window.addEventListener("pointerup", end, true);
    window.addEventListener("pointercancel", cancel, true);
  };

  const pickItem = (item: FloorplanItem) => {
    onSelect(item.id);
    setDetailsHidden(false);
    if (isCompact) setTray("inspect");
  };

  const updateGesture = (clientX: number, clientY: number) => {
    const gesture = gestureRef.current;
    if (!gesture || !canvasRef.current) return;
    const distance = Math.hypot(clientX - gesture.sx, clientY - gesture.sy);
    if (!gesture.active && distance < TOUCH_DRAG_THRESHOLD) return;
    gesture.active = true;
    if (gesture.mode === "move") {
      const rect = canvasRef.current.getBoundingClientRect();
      const item = items.find((entry) => entry.id === gesture.id);
      const maxX = Math.max(0, canvas.width - (item?.w ?? 0));
      const maxY = Math.max(0, canvas.height - (item?.h ?? 0));
      const patch = {
        x: Math.min(maxX, Math.max(0, snap((clientX - rect.left) / zoom - gesture.ox))),
        y: Math.min(maxY, Math.max(0, snap((clientY - rect.top) / zoom - gesture.oy))),
      };
      gesture.latest = patch;
      preview(gesture.id, patch);
    } else {
      const item = items.find((entry) => entry.id === gesture.id);
      const maxW = Math.max(SNAP, canvas.width - (item?.x ?? 0));
      const maxH = Math.max(SNAP, canvas.height - (item?.y ?? 0));
      const patch = {
        w: Math.min(maxW, Math.max(SNAP, snap(gesture.w0 + (clientX - gesture.sx) / zoom))),
        h: Math.min(maxH, Math.max(SNAP, snap(gesture.h0 + (clientY - gesture.sy) / zoom))),
      };
      gesture.latest = patch;
      preview(gesture.id, patch);
    }
  };

  const finishGesture = (pointerId: number) => {
    const gesture = gestureRef.current;
    if (!gesture || pointerId !== gesture.pointerId) return;
    if (gesture.active && Object.keys(gesture.latest).length > 0) onUpdate(gesture.id, gesture.latest);
    gestureRef.current = null;
    gestureCleanupRef.current?.();
  };

  const listenForGesture = () => {
    gestureCleanupRef.current?.();
    const move = (event: PointerEvent) => {
      if (gestureRef.current?.pointerId !== event.pointerId) return;
      event.preventDefault();
      updateGesture(event.clientX, event.clientY);
    };
    const end = (event: PointerEvent) => finishGesture(event.pointerId);
    const cleanup = () => {
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", end, true);
      window.removeEventListener("pointercancel", end, true);
      gestureCleanupRef.current = null;
    };
    gestureCleanupRef.current = cleanup;
    window.addEventListener("pointermove", move, { capture: true, passive: false });
    window.addEventListener("pointerup", end, true);
    window.addEventListener("pointercancel", end, true);
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
    listenForGesture();
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
    listenForGesture();
  };

  const colorFor = (kind: FloorplanItemKind) => PALETTE.find(p => p.kind === kind)?.color ?? "#888";
  const currentColor = selected ? ((selected.meta?.color as string) ?? colorFor(selected.kind)) : "#888888";


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
          <Badge variant="secondary">{(selected.level ?? 0) === 0 ? "Ground floor" : "Upper floor"}</Badge>
          {assignedItemIds.has(selected.id) && <Badge>claimed</Badge>}
        </div>
      </div>
      <div>
        <Label htmlFor="item-building-floor" className="text-xs">Building floor</Label>
        <select id="item-building-floor" className="mt-1 h-11 w-full rounded-md border bg-background px-2 text-xs" disabled={readOnly} value={selected.level ?? 0}
          onChange={event => onUpdate(selected.id, { level: Number(event.target.value) })}>
          <option value={0}>Ground floor</option>
          <option value={1}>Upper floor (mezzanine)</option>
        </select>
      </div>
      <div>
        <Label className="text-xs">Label</Label>
        <Input value={selected.label ?? ""} onChange={(e) => onUpdate(selected.id, { label: e.target.value })} disabled={readOnly} />
      </div>

      <div>
        <Label className="text-xs">Color</Label>
        {!readOnly && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {SWATCH_COLORS.map((c) => (
              <button key={c} type="button" aria-label={`Set color ${c}`} title={c}
                className={`h-7 w-7 rounded-full border-2 ${currentColor === c ? "border-foreground" : "border-transparent"}`}
                style={{ background: c }}
                onClick={() => onUpdate(selected.id, { meta: { ...selected.meta, color: c } })} />
            ))}
            <label className="relative ml-1 h-7 w-7 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-muted-foreground" title="Custom color">
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] leading-none text-muted-foreground">+</span>
              <input type="color" aria-label="Custom color" className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                value={/^#[0-9a-fA-F]{6}$/.test(currentColor) ? currentColor : "#fb923c"}
                onChange={(e) => onUpdate(selected.id, { meta: { ...selected.meta, color: e.target.value } })} />
            </label>

            {selected.meta?.color && (
              <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => {
                const { color, ...rest } = selected.meta ?? {};
                onUpdate(selected.id, { meta: rest });
              }}>Reset</Button>
            )}
          </div>
        )}
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

      {isZone(selected) && (
        <ZoneContents item={selected} items={items} readOnly={readOnly} onUpdate={onUpdate} tools={inventory.tools} canEditInventory={inventory.canEdit} saving={inventory.saving} setLocation={inventoryPlace ? inventory.setLocation : undefined} />
      )}

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
      {selected.meta?.object_type === "five_ton_crane" && (
        <div className="border-l-2 border-primary bg-muted/50 p-3 text-xs">
          <p className="font-medium">5 ton crane zone</p>
          <p className="mt-1 text-muted-foreground">Keep the travel path and lift clearance unobstructed. Final placement requires structural review.</p>
        </div>
      )}
      {selected.meta?.object_type === "bathroom" && (
        <div className="border-l-2 border-primary bg-muted/50 p-3 text-xs">
          <p className="font-medium">Bathroom</p>
          <p className="mt-1 text-muted-foreground">Allow room for plumbing, ventilation, door clearance, and an accessible turning area.</p>
        </div>
      )}
      {selected.meta?.object_type === "kitchen" && (
        <div className="border-l-2 border-primary bg-muted/50 p-3 text-xs">
          <p className="font-medium">Kitchen</p>
          <p className="mt-1 text-muted-foreground">Reserve service runs for water, waste, power, and ventilation.</p>
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
          <Button size="sm" variant="outline" className="h-11 w-11 p-0" aria-label="Duplicate item" title="Duplicate item" onClick={() => {
            onAdd({
              kind: selected.kind,
              label: selected.label ? `${selected.label} copy` : null,
              x: Math.max(0, Math.min(canvas.width - selected.w, snap(selected.x + SNAP * 4))),
              y: Math.max(0, Math.min(canvas.height - selected.h, snap(selected.y + SNAP * 4))),
              w: selected.w,
              h: selected.h,
              rotation: selected.rotation,
              z: selected.z,
              level: selected.level ?? 0,
              meta: { ...selected.meta },
            });
          }}><Copy className="h-4 w-4" /></Button>
          <Button size="sm" variant="outline" className="h-11 w-11 p-0" aria-label="Rotate item" title="Rotate item" onClick={() => onUpdate(selected.id, { rotation: (selected.rotation + 15) % 360 })}><RotateCw className="h-4 w-4" /></Button>
          <Button size="sm" variant="outline" className="h-11 w-11 p-0" aria-label={selected.meta?.locked ? "Unlock item" : "Lock item"} title={selected.meta?.locked ? "Unlock item" : "Lock item"} onClick={() => onUpdate(selected.id, { meta: { ...selected.meta, locked: !selected.meta?.locked } })}>
            {selected.meta?.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="destructive" className="h-11 w-11 p-0" aria-label="Delete item" title="Delete item" onClick={() => { onRemove(selected.id); if (isCompact) setTray(null); }}><Trash2 className="h-4 w-4" /></Button>
        </div>
      )}
      {readOnly && onClaim && selected.meta?.object_type !== "dxf_reference" && !assignedItemIds.has(selected.id) && (
        <Button size="sm" className="w-full" onClick={() => onClaim(selected.id)}>Claim this spot</Button>
      )}
    </div>
  );

  const canvasToolbar = (
    <div className="sticky top-14 z-30 mb-2 flex flex-wrap items-center gap-2 rounded-lg border bg-background/95 px-2 py-2 text-xs shadow-sm backdrop-blur">
      {inventoryPlace && <Button size="sm" variant={inventoryOpen ? "default" : "outline"} className="h-10" onClick={() => { setInventoryOpen(value => !value); setTray(null); }}><Package className="mr-1 h-4 w-4" />Tools & materials</Button>}
      <div className="flex gap-1">
        {[0, 1].map((lv) => (
          <Button key={lv} size="sm" variant={level === lv ? "default" : "outline"} className="h-7 px-2 text-xs"
            onClick={() => { setLevel(lv); onSelect(null); }}>
            {lv === 0 ? "Ground floor" : "Upper floor"}
          </Button>
        ))}
      </div>
      <span>Zoom</span>
      <input aria-label="Plan zoom" className="h-10 w-28 touch-manipulation accent-primary" type="range" min="0.2" max="2" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
      {onLevel.filter(it => it.meta?.object_type === "dxf_reference").map(it => <Button key={it.id} variant="outline" size="sm" onClick={() => pickItem(it)}>{it.label}</Button>)}
      <span className="ml-auto text-muted-foreground">{ft(canvas.width)} × {ft(canvas.height)} ft</span>
    </div>
  );

  const canvasCard = (
    <Card ref={scrollCardRef} className="overflow-x-auto overflow-y-visible bg-muted/30 p-2 sm:p-3">
      <div
        ref={canvasRef}
        className="relative mx-auto select-none border border-border bg-card cursor-grab active:cursor-grabbing"
        style={{
          width: canvas.width * zoom, height: canvas.height * zoom,
          touchAction: "pan-x pan-y",
          backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
          backgroundSize: `${UPF * zoom}px ${UPF * zoom}px`,
        }}
        onPointerDown={startPan}
        onClick={(e) => { if (e.target === e.currentTarget) onSelect(null); }}
      >
        {offLevel.map((it) => (
          <div key={`ghost-${it.id}`} className="absolute pointer-events-none border border-dashed border-muted-foreground/40 opacity-30"
            style={{
              left: it.x * zoom, top: it.y * zoom,
              width: it.w * zoom, height: it.h * zoom,
                 touchAction: "none",
              transform: `rotate(${it.rotation}deg)`,
            }} />
        ))}
        {onLevel.filter(it => it.meta?.object_type !== "dxf_reference").map((it) => {
          const claimed = assignedItemIds.has(it.id);
          const sel = selectedId === it.id;
          return (
            <div
              key={it.id}
              data-zone-id={isZone(it) ? it.id : undefined}
              aria-label={`Plan item ${it.label ?? it.kind}`}
              onPointerDown={(e) => startMove(e, it)}
              className={`absolute flex items-center justify-center text-[10px] font-medium cursor-move select-none touch-none ${dropZone === it.id ? "z-10 ring-4 ring-primary" : sel ? "z-10 ring-2 ring-primary ring-offset-2 ring-offset-background" : ""} ${it.meta?.locked ? "cursor-default" : "active:cursor-grabbing"}`}
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
        {onLevel.filter(it => it.meta?.object_type === "dxf_reference").map(it => <div key={it.id} className="pointer-events-none absolute z-20" style={{ left: it.x * zoom, top: it.y * zoom, width: it.w * zoom, height: it.h * zoom, transform: `rotate(${it.rotation}deg)` }}>
          <DrawingLines segments={getDrawingSegments(it.meta)} width={it.w} height={it.h} />
        </div>)}
      </div>
    </Card>
  );

  const inventoryBody = <InventoryPanel {...inventory} target={selected && isZone(selected) ? selected.label : null} onAssign={id => { if (selected?.label && isZone(selected)) void inventory.setLocation(id, selected.label.trim()); }} onDrag={startInventoryDrag} />;
  const dragOverlay = draggedTool && <div className="pointer-events-none fixed z-[100] max-w-56 rounded-md border border-primary bg-background px-3 py-2 text-xs shadow-lg" style={{ left: Math.min(draggedTool.x + 12, window.innerWidth - 230), top: Math.max(8, draggedTool.y - 48) }}>{draggedTool.tool.name}<p className="text-primary">{items.find(item => item.id === dropZone)?.label ?? "…"}</p></div>;

  if (isCompact) {
    return (
      <div className="relative min-h-[55vh] pb-20">
        {canvasToolbar}
        {canvasCard}
        {dragOverlay}
        {inventoryOpen && <aside aria-label="Zone inventory" className="fixed bottom-20 left-0 top-0 z-30 w-[280px] max-w-[85vw] overflow-y-auto rounded-r-lg border bg-background p-2 shadow-lg"><div className="sticky top-14 z-10 -mt-2 mb-2 flex items-center justify-between bg-background pb-1 pt-2"><span className="text-xs font-semibold">Inventory</span><Button size="icon" variant="ghost" aria-label="Hide inventory" className="h-10 w-10" onClick={() => setInventoryOpen(false)}><X className="h-4 w-4" /></Button></div>{inventoryBody}</aside>}
        {/* Mobile tray */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur">
          {tray && (
            <div className="relative">
              <Button size="icon" variant="secondary" className="absolute -top-12 right-3 z-50 h-11 w-11 border shadow-lg" title="Hide selected item details" aria-label="Hide selected item details" onClick={() => setTray(null)}><EyeOff className="h-4 w-4" /></Button>
            <div className="max-h-[45vh] overflow-y-auto p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{tray === "add" ? "Add to floor" : "Selected item"}</span>
                <Button size="sm" variant="ghost" className="h-11 w-11 p-0" aria-label="Close tray" onClick={() => setTray(null)}><X className="h-4 w-4" /></Button>
              </div>
              {tray === "add" ? paletteBody : inspectorBody}
            </div>
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
              <SlidersHorizontal className="mr-1 h-4 w-4 shrink-0" />
              <span className="truncate">{selected ? (selected.label ?? selected.kind) : "Details"}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative grid gap-3 h-[calc(100vh-180px)] ${!readOnly || inventoryOpen ? detailsHidden ? "grid-cols-[240px_minmax(0,1fr)]" : "grid-cols-[240px_minmax(0,1fr)_280px]" : detailsHidden ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_280px]"}`}>
      {dragOverlay}
      {(!readOnly || inventoryOpen) && (
        <aside className="p-3 overflow-y-auto border-r">
          <h3 className="font-semibold mb-2 text-sm">{inventoryOpen ? "Tools & materials" : "Add to floor"}</h3>
          {inventoryOpen ? inventoryBody : paletteBody}
        </aside>
      )}
      <div className="min-w-0">{canvasToolbar}{canvasCard}</div>
      <Button size="icon" variant="secondary" className="absolute right-3 top-3 z-30 h-11 w-11 border shadow-lg" aria-label={detailsHidden ? "Show selected item details" : "Hide selected item details"} title={detailsHidden ? "Show selected item details" : "Hide selected item details"} onClick={() => setDetailsHidden(value => !value)}>{detailsHidden ? <SlidersHorizontal className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</Button>
      {!detailsHidden && <aside className="p-3 pt-16 overflow-y-auto border-l">{inspectorBody}</aside>}
    </div>
  );
};
