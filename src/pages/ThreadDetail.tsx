import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot as BotIcon, ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useThread, useSendMessage } from "@/hooks/use-threads";
import { useThreadBots, useMyBots, useAttachBotToThread } from "@/hooks/use-bots";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ThreadDetail() {
  const { threadId } = useParams<{ threadId: string }>();
  const { user } = useAuth();
  const { data } = useThread(threadId);
  const { data: threadBots = [] } = useThreadBots(threadId);
  const { data: myBots = [] } = useMyBots();
  const attach = useAttachBotToThread(threadId!);
  const send = useSendMessage(threadId!);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [data?.messages.length]);

  if (!data?.thread) return <Layout><div className="container mx-auto px-4 py-8">Loading…</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <Button asChild variant="ghost" size="sm"><Link to="/threads"><ArrowLeft className="w-4 h-4 mr-2" />Threads</Link></Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><BotIcon className="w-4 h-4 mr-2" />Bots ({threadBots.length})</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Attach a bot</DialogTitle></DialogHeader>
              <div className="space-y-2">
                {myBots.length === 0 ? <p className="text-sm text-muted-foreground">No bots yet. <Link to="/bots" className="underline">Create one</Link>.</p> : null}
                {myBots.map((b) => (
                  <div key={b.id} className="flex items-center justify-between border rounded-md p-3">
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.kind}</p>
                    </div>
                    <Button size="sm" onClick={() => attach.mutate(b.id)} disabled={threadBots.some((tb: { bot_id: string }) => tb.bot_id === b.id)}>Attach</Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <h1 className="text-2xl font-bold mb-1">{data.thread.title ?? "Thread"}</h1>
        <p className="text-sm text-muted-foreground mb-4">{data.members.length} member{data.members.length === 1 ? "" : "s"}</p>

        <Card>
          <CardContent className="p-0">
            <div className="h-[60vh] overflow-y-auto p-4 space-y-3">
              {data.messages.length === 0 ? <p className="text-center text-sm text-muted-foreground py-12">No messages yet. Say hi.</p> : null}
              {data.messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_user_id === user?.id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 ${m.sender_kind === "bot" ? "bg-accent border border-primary/30" : m.sender_user_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {m.sender_kind === "bot" ? <Badge variant="outline" className="mb-1 text-xs"><BotIcon className="w-3 h-3 mr-1" />bot</Badge> : null}
                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    <p className="text-[10px] opacity-60 mt-1">{new Date(m.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="border-t p-3 flex gap-2">
              <Textarea
                rows={2}
                placeholder={user ? "Message…" : "Sign in to chat"}
                value={text}
                disabled={!user}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (text.trim()) { send.mutate(text); setText(""); }
                  }
                }}
              />
              <Button onClick={() => { if (text.trim()) { send.mutate(text); setText(""); } }} disabled={!user || !text.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}