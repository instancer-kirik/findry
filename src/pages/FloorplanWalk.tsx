import React, { lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFloorplan } from "@/hooks/use-floorplan";
import { ArrowLeft } from "lucide-react";

const FloorplanScene3D = lazy(() => import("@/components/floorplan/FloorplanScene3D"));

export default function FloorplanWalk() {
  const { floorplanId } = useParams();
  const { plan, items, loading } = useFloorplan(floorplanId);
  const [walkable, setWalkable] = React.useState(false);

  if (loading || !plan) return <div className="p-8 text-muted-foreground">Loading…</div>;

  return (
    <div className="fixed inset-0 bg-background">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <Link to={`/floorplans/${plan.id}`}><Button size="sm" variant="secondary"><ArrowLeft className="h-4 w-4 mr-1" />Back</Button></Link>
        <span className="bg-background/80 backdrop-blur px-3 py-1 rounded text-sm">{plan.title}</span>
        <Button size="sm" variant={walkable ? "default" : "outline"} onClick={() => setWalkable(v => !v)}>
          {walkable ? "Walk mode (click canvas)" : "Orbit mode"}
        </Button>
      </div>
      <Suspense fallback={<div className="p-8">Loading 3D…</div>}>
        <FloorplanScene3D items={items} canvas={plan.canvas} walkable={walkable} />
      </Suspense>
    </div>
  );
}