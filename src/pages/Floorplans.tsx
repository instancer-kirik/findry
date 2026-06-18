import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useFloorplanList, createFloorplan, type ClaimMode } from "@/hooks/use-floorplan";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Box, Eye } from "lucide-react";
import { toast } from "sonner";

export default function Floorplans() {
  const { plans, loading, refresh } = useFloorplanList();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [claimMode, setClaimMode] = useState<ClaimMode>("hybrid");

  const submit = async () => {
    if (!user) { toast.error("Sign in to create a floorplan"); return; }
    if (!title.trim()) return;
    try {
      const created = await createFloorplan({ title, description, claim_mode: claimMode, created_by: user.id });
      setOpen(false); setTitle(""); setDescription("");
      refresh();
      navigate(`/floorplans/${created.id}`);
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Venue Floorplans</h1>
            <p className="text-muted-foreground">Vendor booths, panel rooms, gallery walls, outdoor festivals.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />New floorplan</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New floorplan</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                <div>
                  <Label>Claim mode</Label>
                  <Select value={claimMode} onValueChange={(v) => setClaimMode(v as ClaimMode)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organizer">Organizer assigns</SelectItem>
                      <SelectItem value="open">Self-claim only</SelectItem>
                      <SelectItem value="hybrid">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter><Button onClick={submit}>Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : plans.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">No floorplans yet. Create one to start placing booths, walls, stages, and food trucks.</Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((p) => (
              <Card key={p.id} className="p-4 hover:border-primary transition">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  <Badge variant="outline">{p.claim_mode}</Badge>
                </div>
                {p.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.description}</p>}
                <div className="flex gap-2">
                  <Link to={`/floorplans/${p.id}`} className="flex-1"><Button variant="outline" className="w-full" size="sm"><Box className="h-3 w-3 mr-1" />Edit</Button></Link>
                  <Link to={`/floorplans/${p.id}/walk`} className="flex-1"><Button className="w-full" size="sm"><Eye className="h-3 w-3 mr-1" />Walk</Button></Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}