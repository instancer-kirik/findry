import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import { usePanels } from "@/hooks/use-panels";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePanel } from "@/hooks/use-panels";
import { useAuth } from "@/hooks/use-auth";

export default function Panels() {
  const { data: panels = [], isLoading } = usePanels();
  const { user } = useAuth();
  const createPanel = useCreatePanel();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", blurb: "", room: "", starts_at: "", duration_min: 45 });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Convention Panels</h1>
            <p className="text-muted-foreground mt-1">Timed, in-person multi-speaker sessions.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={!user}><Plus className="w-4 h-4 mr-2" />New Panel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create panel</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <Textarea placeholder="Blurb" value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} />
                <Input placeholder="Room / Hall" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
                <Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
                <Input type="number" placeholder="Duration (min)" value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })} />
                <Button
                  className="w-full"
                  disabled={!form.title || !form.starts_at || createPanel.isPending}
                  onClick={async () => {
                    await createPanel.mutateAsync({
                      title: form.title,
                      blurb: form.blurb || undefined,
                      room: form.room || undefined,
                      starts_at: new Date(form.starts_at).toISOString(),
                      duration_min: form.duration_min,
                    });
                    setOpen(false);
                    setForm({ title: "", blurb: "", room: "", starts_at: "", duration_min: 45 });
                  }}
                >Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? <p className="text-muted-foreground">Loading panels…</p> : null}
        {!isLoading && panels.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No panels scheduled yet. Create one to get started.</CardContent></Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {panels.map((p) => (
            <Link key={p.id} to={`/panels/${p.id}`}>
              <Card className="hover:border-primary transition">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    <Badge variant={p.status === "live" ? "default" : "secondary"}>{p.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {p.blurb ? <p className="text-muted-foreground line-clamp-2">{p.blurb}</p> : null}
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(p.starts_at).toLocaleString()}</span>
                    {p.room ? <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{p.room}</span> : null}
                    <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{p.duration_min}min</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}