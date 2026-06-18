import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFloorplan } from "@/hooks/use-floorplan";
import { FloorplanEditor } from "@/components/floorplan/FloorplanEditor";
import { Eye, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function FloorplanEditorPage() {
  const { floorplanId } = useParams();
  const { plan, items, assignments, loading, isOwner, addItem, updateItem, removeItem, claimItem } = useFloorplan(floorplanId);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (loading) return <Layout><div className="p-8 text-muted-foreground">Loading…</div></Layout>;
  if (!plan) return <Layout><div className="p-8">Floorplan not found.</div></Layout>;

  const onClaim = async (id: string) => {
    const { error } = await claimItem(id);
    if (error) toast.error(error); else toast.success("Claim submitted — awaiting approval");
  };

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/floorplans"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <h1 className="text-2xl font-bold">{plan.title}</h1>
            <Badge variant="outline">{plan.claim_mode}</Badge>
            {isOwner && <Badge>owner</Badge>}
          </div>
          <Link to={`/floorplans/${plan.id}/walk`}><Button><Eye className="h-4 w-4 mr-1" />Walk in 3D</Button></Link>
        </div>
        <FloorplanEditor
          items={items}
          assignments={assignments}
          canvas={plan.canvas}
          readOnly={!isOwner}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={addItem}
          onUpdate={updateItem}
          onRemove={removeItem}
          onClaim={onClaim}
        />
      </div>
    </Layout>
  );
}