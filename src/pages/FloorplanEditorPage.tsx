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
  const { plan, items, assignments, loading, isOwner, addItem, updateItem, patchItemLocal, removeItem, claimItem, refresh } = useFloorplan(floorplanId);
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
      <div className="mx-auto max-w-[1400px] p-2 sm:p-4">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link to="/floorplans"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <h1 className="min-w-0 flex-1 truncate text-lg font-bold sm:text-2xl">{plan.title}</h1>
            <Badge variant="outline" className="hidden sm:inline-flex">{plan.claim_mode}</Badge>
            {isOwner && <Badge className="hidden sm:inline-flex">owner</Badge>}
          </div>
          <Link className="self-end sm:self-auto" to={`/floorplans/${plan.id}/walk`}><Button size="sm" className="min-h-10"><Eye className="mr-1 h-4 w-4" />Walk in 3D</Button></Link>
        </div>

        <Card className="mb-3 flex flex-wrap items-center gap-2 overflow-x-auto p-2 sm:p-3">
          <span className="shrink-0 text-sm font-medium">Saved layouts</span>
          {layouts.length === 0 && <span className="text-xs text-muted-foreground">None yet — arrange the room, then save it as a mode.</span>}
          {layouts.map((l) => (
            <span key={l.id} className="flex items-center gap-1">
              <Button size="sm" variant="secondary" className="min-h-10 whitespace-nowrap text-xs"
                onClick={async () => { await applyLayout(l); await refresh(); toast.success(`Switched to ${l.name}`); }}>
                {l.name}
              </Button>
              {isOwner && (
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0" aria-label={`Delete ${l.name}`} onClick={() => deleteLayout(l.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </span>
          ))}
          {isOwner && (
            <div className="flex w-full items-center gap-2 xl:ml-auto xl:w-auto">
              <Input value={layoutName} onChange={(e) => setLayoutName(e.target.value)}
                placeholder="Workshop / Recording / Event" className="h-11 min-w-0 flex-1 text-xs xl:w-64" />
              <Button size="sm" className="h-11 shrink-0" onClick={onSaveLayout}><Save className="mr-1 h-3 w-3" />Save</Button>
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
          onPreview={patchItemLocal}
          onRemove={removeItem}
          onClaim={onClaim}
        />
      </div>
    </Layout>
  );
}
