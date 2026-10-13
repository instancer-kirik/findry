import type { DrawingSegment } from "@/lib/floorplan-dxf";

export function DrawingLines({ segments, width, height }: { segments: DrawingSegment[]; width: number; height: number }) {
  return <svg aria-label="DXF drawing outline" className="h-full w-full overflow-visible text-foreground" viewBox={`0 0 ${width} ${height}`}>
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      {segments.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1 * width} y1={y1 * height} x2={x2 * width} y2={y2 * height} vectorEffect="non-scaling-stroke" />)}
    </g>
  </svg>;
}