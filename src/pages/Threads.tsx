import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MessageSquare, Bot as BotIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useMyThreads, useCreateThread } from "@/hooks/use-threads";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Threads() {
  const { user } = useAuth();
  const { data: threads = [], isLoading } = useMyThreads();
  const create = useCreateThread();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Group Threads</h1>
            <p className="text-muted-foreground mt-1">Multi-artist conversations with bots.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={!user}><Plus className="w-4 h-4 mr-2" />New thread</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New group thread</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Thread title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Button className="w-full" disabled={!title || create.isPending} onClick={async () => {
                  const t = await create.mutateAsync({ title });
                  setOpen(false);
                  setTitle("");
                  window.location.href = `/threads/${t.id}`;
                }}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!user ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Sign in to view your threads.</CardContent></Card>
        ) : isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : threads.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No threads yet. Create one to start collaborating.</CardContent></Card>
        ) : (
          <div className="space-y-2">
            {threads.map((t) => (
              <Link key={t.id} to={`/threads/${t.id}`}>
                <Card className="hover:border-primary transition">
                  <CardContent className="py-4 flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{t.title ?? "Untitled thread"}</p>
                      <p className="text-xs text-muted-foreground">{t.kind} · updated {new Date(t.updated_at).toLocaleString()}</p>
                    </div>
                    <BotIcon className="w-4 h-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}