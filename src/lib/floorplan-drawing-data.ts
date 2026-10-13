import workshopDrawing from "@/data/workshop-dxf.json";
import type { DrawingSegment } from "./floorplan-dxf";

export function getDrawingSegments(meta: Record<string, any>): DrawingSegment[] {
  if (Array.isArray(meta.segments)) return meta.segments;
  if (meta.drawing_key === "baltimore_workshop_shop_dxf") return workshopDrawing.segments as DrawingSegment[];
  return [];
}