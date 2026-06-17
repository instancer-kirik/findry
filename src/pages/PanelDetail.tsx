import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Mic, ArrowUp, Play, Check } from "lucide-react";
import { usePanel, usePanelQuestions, useAskQuestion, useUpvoteQuestion, useRsvpPanel } from "@/hooks/use-panels";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function PanelDetail() {
  const { panelId } = useParams<{ panelId: string }>();
  const { data } = usePanel(panelId);
  const { data: questions = [] } = usePanelQuestions(panelId);
  const ask = useAskQuestion(panelId!);
  const upvote = useUpvoteQuestion(panelId!);
  const rsvp = useRsvpPanel();
  const { user } = useAuth();
  const [q, setQ] = useState("");

  if (!data?.panel) {
    return <Layout><div className="container mx-auto px-4 py-8">Loading…</div></Layout>;
  }
  const { panel, speakers } = data;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={panel.status === "live" ? "default" : "secondary"}>{panel.status}</Badge>
              {panel.room ? <Badge variant="outline"><MapPin className="w-3 h-3 mr-1" />{panel.room}</Badge> : null}
            </div>
            <h1 className="text-3xl font-bold">{panel.title}</h1>
            {panel.blurb ? <p className="text-muted-foreground mt-2">{panel.blurb}</p> : null}
            <p className="text-sm text-muted-foreground mt-2 inline-flex items-center gap-1">
              <Calendar className="w-4 h-4" />{new Date(panel.starts_at).toLocaleString()} · {panel.duration_min}min
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild variant="default"><Link to={`/panels/${panel.id}/live`}><Play className="w-4 h-4 mr-2" />Live view</Link></Button>
            <Button variant="outline" disabled={!user} onClick={() => rsvp.mutate({ panel_id: panel.id, status: "going" })}>I'm going</Button>
            <Button variant="ghost" disabled={!user} onClick={() => rsvp.mutate({ panel_id: panel.id, status: "checked_in" })}><Check className="w-4 h-4 mr-2" />Check in</Button>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base inline-flex items-center gap-2"><Mic className="w-4 h-4" />Speakers</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {speakers.length === 0 ? <p className="text-sm text-muted-foreground">No speakers added yet.</p> : null}
            {speakers.map((s) => (
              <div key={s.id} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <p className="font-medium">{s.display_name ?? "Speaker"}</p>
                  {s.bio ? <p className="text-xs text-muted-foreground">{s.bio}</p> : null}
                </div>
                <Badge variant="outline">{s.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Audience questions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Textarea placeholder={user ? "Ask the panel…" : "Sign in to ask a question"} value={q} onChange={(e) => setQ(e.target.value)} disabled={!user} />
              <Button disabled={!user || !q.trim()} onClick={async () => { await ask.mutateAsync(q); setQ(""); }}>Ask</Button>
            </div>
            <div className="space-y-2">
              {questions.map((qi) => (
                <div key={qi.id} className={`flex items-start gap-3 border rounded-md p-3 ${qi.promoted ? "border-primary" : ""}`}>
                  <Button size="sm" variant="ghost" className="flex-col h-auto py-1 px-2" onClick={() => upvote.mutate(qi)}>
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-xs">{qi.upvotes}</span>
                  </Button>
                  <p className={`flex-1 text-sm ${qi.answered ? "line-through text-muted-foreground" : ""}`}>{qi.content}</p>
                  {qi.promoted ? <Badge>Up next</Badge> : null}
                </div>
              ))}
              {questions.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No questions yet — be the first.</p> : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}