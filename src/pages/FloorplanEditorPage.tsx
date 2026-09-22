import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useFloorplan, useFloorplanLayouts } from "@/hooks/use-floorplan";
import { FloorplanEditor } from "@/components/floorplan/FloorplanEditor";
import { Eye, ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function FloorplanEditorPage() {
  const { floorplanId } = useParams();
  const { plan, items, assignments, loading, isOwner, addItem, updateItem, removeItem, claimItem, refresh } = useFloorplan(floorplanId);
  const { layouts, saveLayout, deleteLayout, applyLayout } = useFloorplanLayouts(floorplanId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layoutName, setLayoutName] = useState("");

  if (loading) return <Layout><div className="p-8 text-muted-foreground">Loading…</div></Layout>;
  if (!plan) return <Layout><div className="p-8">Floorplan not found.</div></Layout>;

  const onClaim = async (id: string) => {
    const { error } = await claimItem(id);
    if (error) toast.error(error); else toast.success("Claim submitted — awaiting approval");
  };

  const onSaveLayout = async () => {
    if (!layoutName.trim()) return toast.error("Name this layout first");
    const { error } = await saveLayout(layoutName.trim(), items);
    if (error) toast.error(error);
    else { toast.success(`Saved "${layoutName.trim()}"`); setLayoutName(""); }
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

        <Card className="mb-3 flex flex-wrap items-center gap-2 p-3">
          <span className="text-sm font-medium">Saved layouts</span>
          {layouts.length === 0 && <span className="text-xs text-muted-foreground">None yet — arrange the room, then save it as a mode.</span>}
          {layouts.map((l) => (
            <span key={l.id} className="flex items-center gap-1">
              <Button size="sm" variant="secondary" className="h-7 text-xs"
                onClick={async () => { await applyLayout(l); await refresh(); toast.success(`Switched to ${l.name}`); }}>
                {l.name}
              </Button>
              {isOwner && (
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => deleteLayout(l.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </span>
          ))}
          {isOwner && (
            <div className="ml-auto flex items-center gap-2">
              <Input value={layoutName} onChange={(e) => setLayoutName(e.target.value)}
                placeholder="Workshop day / Recording day / Event night" className="h-8 w-64 text-xs" />
              <Button size="sm" className="h-8" onClick={onSaveLayout}><Save className="h-3 w-3 mr-1" />Save current</Button>
            </div>
          )}
        </Card>

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
