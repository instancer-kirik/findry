import DxfParser from "dxf-parser";

export type DxfUnit = "in" | "ft" | "mm" | "cm" | "m";
export type DrawingSegment = [number, number, number, number];
export interface FloorplanDrawing {
  segments: DrawingSegment[];
  width: number;
  height: number;
  detectedUnit: DxfUnit | null;
  skipped: Record<string, number>;
}
const FEET_PER_UNIT: Record<DxfUnit, number> = { in: 1 / 12, ft: 1, mm: 1 / 304.8, cm: 1 / 30.48, m: 1 / 0.3048 };
export const drawingSize = (drawing: FloorplanDrawing, unit: DxfUnit) => ({
  w: drawing.width * FEET_PER_UNIT[unit] * 10,
  h: drawing.height * FEET_PER_UNIT[unit] * 10,
});

// Geometry is normalized, not resized to the room. Model-space only.
export function parseFloorplanDxf(source: string): FloorplanDrawing {
  if (source.startsWith("AutoCAD Binary DXF")) throw new Error("Export this drawing as an ASCII DXF first.");
  const dxf = new DxfParser().parseSync(source);
  if (!dxf) throw new Error("The DXF could not be read.");
  const segments: DrawingSegment[] = [];
  const skipped: Record<string, number> = {};
  const add = (x1: number, y1: number, x2: number, y2: number) => {
    if (![x1, y1, x2, y2].every(Number.isFinite)) throw new Error("The drawing contains invalid coordinates.");
    if (segments.length >= 20000) throw new Error("This drawing is too detailed. Export a simplified floorplan (under 20,000 segments).");
    segments.push([x1, y1, x2, y2]);
  };
  for (const entity of dxf.entities as unknown as Array<Record<string, any>>) {
    if (entity.inPaperSpace) continue;
    if (entity.type === "LINE" || ((entity.type === "LWPOLYLINE" || entity.type === "POLYLINE") && !entity.vertices?.some((v: any) => v.bulge))) {
      const vertices = entity.vertices ?? [];
      for (let i = 1; i < vertices.length; i++) add(vertices[i - 1].x, vertices[i - 1].y, vertices[i].x, vertices[i].y);
      if (entity.shape && vertices.length > 2) add(vertices[vertices.length - 1].x, vertices[vertices.length - 1].y, vertices[0].x, vertices[0].y);
    } else if (entity.type === "ARC" || entity.type === "CIRCLE") {
      const start = entity.type === "CIRCLE" ? 0 : entity.startAngle;
      let sweep = entity.type === "CIRCLE" ? Math.PI * 2 : entity.endAngle - start;
      if (sweep <= 0) sweep += Math.PI * 2;
      const count = Math.max(8, Math.ceil(sweep / (Math.PI / 36)));
      for (let i = 0; i < count; i++) {
        const a = start + sweep * i / count, b = start + sweep * (i + 1) / count;
        add(entity.center.x + entity.radius * Math.cos(a), entity.center.y + entity.radius * Math.sin(a), entity.center.x + entity.radius * Math.cos(b), entity.center.y + entity.radius * Math.sin(b));
      }
    } else skipped[entity.type] = (skipped[entity.type] ?? 0) + 1;
  }
  if (!segments.length) throw new Error("No supported floorplan lines found. Export lines, straight polylines, arcs or circles; explode blocks first.");
  const xs = segments.flatMap(s => [s[0], s[2]]), ys = segments.flatMap(s => [s[1], s[3]]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const width = maxX - minX, height = maxY - minY;
  if (width <= 0 || height <= 0) throw new Error("The drawing must have a nonzero width and length.");
  const units: Record<number, DxfUnit> = { 1: "in", 2: "ft", 4: "mm", 5: "cm", 6: "m" };
  return { width, height, detectedUnit: units[Number(dxf.header.$INSUNITS)] ?? null, skipped,
    segments: segments.map(([x1, y1, x2, y2]) => [(x1 - minX) / width, (maxY - y1) / height, (x2 - minX) / width, (maxY - y2) / height]),
  };
}