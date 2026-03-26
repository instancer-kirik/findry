import React, { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Zap, Sun, Bed, Wrench, Droplets, Fan, Shield, Package,
  Thermometer, Radio, RotateCw, Trash2, Lock, Unlock,
  ZoomIn, ZoomOut, Maximize2, GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlacedComponent {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked: boolean;
  color: string;
  icon: React.ElementType;
}

const PALETTE_ITEMS = [
  { type: "bed", label: "Bed / Sleeping", width: 120, height: 60, color: "hsl(var(--primary))", icon: Bed },
  { type: "kitchen", label: "Kitchen / Counter", width: 100, height: 40, color: "hsl(var(--accent))", icon: Wrench },
  { type: "workbench", label: "Workbench", width: 100, height: 50, color: "hsl(var(--secondary))", icon: Wrench },
  { type: "battery-bank", label: "Battery Bank", width: 50, height: 40, color: "hsl(30 90% 50%)", icon: Zap },
  { type: "solar-controller", label: "Solar Controller", width: 30, height: 30, color: "hsl(45 90% 50%)", icon: Sun },
  { type: "water-tank", label: "Water Tank", width: 50, height: 50, color: "hsl(200 70% 50%)", icon: Droplets },
  { type: "gray-tank", label: "Gray Water Tank", width: 50, height: 40, color: "hsl(200 30% 50%)", icon: Droplets },
  { type: "heater", label: "Diesel Heater", width: 30, height: 30, color: "hsl(0 70% 50%)", icon: Fan },
  { type: "fridge", label: "Fridge", width: 40, height: 40, color: "hsl(180 50% 50%)", icon: Thermometer },
  { type: "storage", label: "Storage Cabinet", width: 60, height: 40, color: "hsl(var(--muted))", icon: Package },
  { type: "seating", label: "Seating Area", width: 80, height: 50, color: "hsl(270 40% 60%)", icon: Bed },
  { type: "electronics", label: "Electronics Bay", width: 40, height: 30, color: "hsl(210 60% 50%)", icon: Radio },
];

const VEHICLE_PRESETS = [
  { name: "Step Van (Bread Truck)", width: 500, height: 280, label: "10ft × 7ft cargo" },
  { name: "Transit 250", width: 480, height: 220, label: "12ft × 5.5ft cargo" },
  { name: "Sprinter 170", width: 520, height: 210, label: "13ft × 5.3ft cargo" },
  { name: "Chevy Silverado Bed", width: 320, height: 200, label: "6.5ft × 5ft bed" },
];

const LayoutConfigurator: React.FC = () => {
  const [placed, setPlaced] = useState<PlacedComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [vehiclePreset, setVehiclePreset] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const vehicle = VEHICLE_PRESETS[vehiclePreset];
  let idCounter = useRef(0);

  const addComponent = useCallback((item: typeof PALETTE_ITEMS[0]) => {
    idCounter.current += 1;
    const newComp: PlacedComponent = {
      id: `${item.type}-${Date.now()}-${idCounter.current}`,
      type: item.type,
      label: item.label,
      x: vehicle.width / 2 - item.width / 2,
      y: vehicle.height / 2 - item.height / 2,
      width: item.width,
      height: item.height,
      rotation: 0,
      locked: false,
      color: item.color,
      icon: item.icon,
    };
    setPlaced((prev) => [...prev, newComp]);
    setSelectedId(newComp.id);
  }, [vehicle]);

  const handleMouseDown = (e: React.MouseEvent, comp: PlacedComponent) => {
    if (comp.locked) return;
    e.stopPropagation();
    setSelectedId(comp.id);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragging({
      id: comp.id,
      offsetX: (e.clientX - rect.left) / zoom - comp.x,
      offsetY: (e.clientY - rect.top) / zoom - comp.y,
    });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min((e.clientX - rect.left) / zoom - dragging.offsetX, vehicle.width));
    const newY = Math.max(0, Math.min((e.clientY - rect.top) / zoom - dragging.offsetY, vehicle.height));
    setPlaced((prev) =>
      prev.map((c) => (c.id === dragging.id ? { ...c, x: newX, y: newY } : c))
    );
  }, [dragging, zoom, vehicle]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const rotateSelected = () => {
    if (!selectedId) return;
    setPlaced((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, rotation: (c.rotation + 90) % 360, width: c.height, height: c.width }
          : c
      )
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setPlaced((prev) => prev.filter((c) => c.id !== selectedId));
    setSelectedId(null);
  };

  const toggleLock = () => {
    if (!selectedId) return;
    setPlaced((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, locked: !c.locked } : c))
    );
  };

  const selectedComp = placed.find((c) => c.id === selectedId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_220px] gap-4">
      {/* Component Palette */}
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 max-h-[60vh] overflow-y-auto">
          {PALETTE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                onClick={() => addComponent(item)}
                className="w-full flex items-center gap-2 p-2 rounded-md border border-border hover:bg-accent/50 transition-colors text-left text-sm"
              >
                <div
                  className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Canvas Area */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm">Floor Plan</CardTitle>
            <div className="flex gap-1.5 flex-wrap">
              {VEHICLE_PRESETS.map((v, i) => (
                <Badge
                  key={v.name}
                  variant={i === vehiclePreset ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setVehiclePreset(i)}
                >
                  {v.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(2, z + 0.1))}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(1)}>
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-lg bg-muted/30 p-4">
            <div
              ref={canvasRef}
              className="relative mx-auto border-2 border-dashed border-foreground/20 rounded-lg"
              style={{
                width: vehicle.width * zoom,
                height: vehicle.height * zoom,
                cursor: dragging ? "grabbing" : "default",
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => setSelectedId(null)}
            >
              {/* Vehicle outline details */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Front of vehicle indicator */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-[10px] text-muted-foreground font-medium tracking-wider"
                  style={{ transform: `translateX(-50%) scale(${zoom})` }}
                >
                  ▲ FRONT
                </div>
                {/* Rear indicator */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3 text-[10px] text-muted-foreground font-medium tracking-wider"
                  style={{ transform: `translateX(-50%) scale(${zoom})` }}
                >
                  REAR ▼
                </div>
                {/* Grid lines */}
                <svg width="100%" height="100%" className="opacity-10">
                  {Array.from({ length: Math.floor(vehicle.width / 50) }).map((_, i) => (
                    <line
                      key={`v${i}`}
                      x1={(i + 1) * 50 * zoom}
                      y1={0}
                      x2={(i + 1) * 50 * zoom}
                      y2={vehicle.height * zoom}
                      stroke="currentColor"
                      strokeWidth={1}
                    />
                  ))}
                  {Array.from({ length: Math.floor(vehicle.height / 50) }).map((_, i) => (
                    <line
                      key={`h${i}`}
                      x1={0}
                      y1={(i + 1) * 50 * zoom}
                      x2={vehicle.width * zoom}
                      y2={(i + 1) * 50 * zoom}
                      stroke="currentColor"
                      strokeWidth={1}
                    />
                  ))}
                </svg>
              </div>

              {/* Placed components */}
              {placed.map((comp) => {
                const Icon = comp.icon;
                const isSelected = comp.id === selectedId;
                return (
                  <div
                    key={comp.id}
                    className={cn(
                      "absolute rounded border-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-shadow",
                      isSelected ? "border-foreground ring-2 ring-primary/50 shadow-lg z-10" : "border-transparent hover:border-foreground/30",
                      comp.locked && "opacity-70 cursor-not-allowed"
                    )}
                    style={{
                      left: comp.x * zoom,
                      top: comp.y * zoom,
                      width: comp.width * zoom,
                      height: comp.height * zoom,
                      backgroundColor: comp.color,
                      transform: `rotate(${comp.rotation}deg)`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, comp)}
                  >
                    <Icon className="text-white" style={{ width: 14 * zoom, height: 14 * zoom }} />
                    {zoom >= 0.8 && (
                      <span
                        className="text-white font-medium leading-none mt-0.5 text-center px-1"
                        style={{ fontSize: Math.max(8, 10 * zoom) }}
                      >
                        {comp.label}
                      </span>
                    )}
                    {comp.locked && (
                      <Lock className="absolute top-0.5 right-0.5 text-white/70" style={{ width: 10 * zoom, height: 10 * zoom }} />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">{vehicle.label}</p>
          </div>
        </CardContent>
      </Card>

      {/* Properties Panel */}
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {selectedComp ? (
            <>
              <div>
                <p className="text-sm font-medium">{selectedComp.label}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(selectedComp.x)}px, {Math.round(selectedComp.y)}px · {selectedComp.width}×{selectedComp.height}
                </p>
              </div>
              <Separator />
              <div className="flex flex-col gap-1.5">
                <Button variant="outline" size="sm" onClick={rotateSelected} className="justify-start">
                  <RotateCw className="h-3.5 w-3.5 mr-2" /> Rotate 90°
                </Button>
                <Button variant="outline" size="sm" onClick={toggleLock} className="justify-start">
                  {selectedComp.locked ? <Unlock className="h-3.5 w-3.5 mr-2" /> : <Lock className="h-3.5 w-3.5 mr-2" />}
                  {selectedComp.locked ? "Unlock" : "Lock"}
                </Button>
                <Button variant="destructive" size="sm" onClick={deleteSelected} className="justify-start">
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Remove
                </Button>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">
                  Rotation: {selectedComp.rotation}° · {selectedComp.locked ? "Locked" : "Unlocked"}
                </p>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Select a placed component or add one from the palette
            </p>
          )}
          <Separator />
          <div>
            <p className="text-xs font-medium mb-1">Placed ({placed.length})</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {placed.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "w-full flex items-center gap-1.5 p-1 rounded text-xs text-left",
                      c.id === selectedId ? "bg-accent" : "hover:bg-accent/50"
                    )}
                  >
                    <Icon className="h-3 w-3 shrink-0" />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayoutConfigurator;
