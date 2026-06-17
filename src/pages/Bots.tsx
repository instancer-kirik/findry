import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot as BotIcon, Plus, Sparkles, Clock, Shield } from "lucide-react";
import { useMyBots, useCreateBot } from "@/hooks/use-bots";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const KIND_ICON = { assistant: Sparkles, scheduled: Clock, moderator: Shield } as const;

export default function BotsPage() {
  const { user } = useAuth();
  const { data: bots = [] } = useMyBots();
  const create = useCreateBot();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; description: string; kind: "assistant" | "scheduled" | "moderator"; system_prompt: string }>({
    name: "", description: "", kind: "assistant", system_prompt: "You are a helpful assistant in a Garflock group thread.",
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bots</h1>
            <p className="text-muted-foreground mt-1">AI helpers for your threads — assistants, scheduled posters, and moderators.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={!user}><Plus className="w-4 h-4 mr-2" />New bot</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create a bot</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v as typeof form.kind })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assistant">Assistant — replies in threads</SelectItem>
                    <SelectItem value="scheduled">Scheduled — posts on a timer</SelectItem>
                    <SelectItem value="moderator">Moderator — watches threads</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea rows={5} placeholder="System prompt" value={form.system_prompt} onChange={(e) => setForm({ ...form, system_prompt: e.target.value })} />
                <Button className="w-full" disabled={!form.name || create.isPending} onClick={async () => {
                  await create.mutateAsync(form);
                  setOpen(false);
                  setForm({ name: "", description: "", kind: "assistant", system_prompt: form.system_prompt });
                }}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {bots.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No bots yet. Build one to drop into your threads.</CardContent></Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {bots.map((b) => {
              const Icon = KIND_ICON[b.kind] ?? BotIcon;
              return (
                <Card key={b.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base inline-flex items-center gap-2"><Icon className="w-4 h-4" />{b.name}</CardTitle>
                      <Badge variant="outline">{b.kind}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    {b.description ? <p>{b.description}</p> : null}
                    <p className="text-xs font-mono opacity-70 line-clamp-3">{b.system_prompt}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}