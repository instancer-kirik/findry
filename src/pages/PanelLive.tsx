import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePanel, usePanelQuestions, useUpvoteQuestion } from "@/hooks/use-panels";
import { Button } from "@/components/ui/button";
import { ArrowUp, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function useCountdown(target: string, duration_min: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const start = new Date(target).getTime();
  const end = start + duration_min * 60_000;
  const remaining = Math.max(0, end - now);
  const toStart = start - now;
  const m = Math.floor(remaining / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  return { remaining, toStart, label: `${m}:${String(s).padStart(2, "0")}`, started: toStart <= 0 };
}

export default function PanelLive() {
  const { panelId } = useParams<{ panelId: string }>();
  const { data } = usePanel(panelId);
  const { data: questions = [] } = usePanelQuestions(panelId);
  const upvote = useUpvoteQuestion(panelId!);
  const panel = data?.panel;
  const speakers = data?.speakers ?? [];
  const cd = useCountdown(panel?.starts_at ?? new Date().toISOString(), panel?.duration_min ?? 45);

  if (!panel) return <div className="min-h-screen bg-background flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={cd.started ? "default" : "secondary"}>{cd.started ? "LIVE" : "Starts soon"}</Badge>
            <span className="font-semibold">{panel.title}</span>
            <span className="text-sm text-muted-foreground">{panel.room}</span>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to={`/panels/${panel.id}`}><X className="w-4 h-4" /></Link></Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-8 text-center">
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">{cd.started ? "Time remaining" : "Starts in"}</p>
            <p className="text-7xl font-mono font-bold tabular-nums">{cd.label}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Speakers</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {speakers.map((s) => (
                <div key={s.id} className="border rounded-md p-3">
                  <p className="font-medium">{s.display_name ?? "Speaker"}</p>
                  <Badge variant="outline" className="mt-1">{s.role}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Question queue</h2>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {questions.map((q) => (
              <div key={q.id} className={`flex items-start gap-2 border rounded-md p-3 ${q.promoted ? "border-primary bg-primary/5" : ""}`}>
                <Button size="sm" variant="ghost" className="flex-col h-auto py-1 px-2" onClick={() => upvote.mutate(q)}>
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-xs">{q.upvotes}</span>
                </Button>
                <p className={`flex-1 text-sm ${q.answered ? "line-through opacity-50" : ""}`}>{q.content}</p>
              </div>
            ))}
            {questions.length === 0 ? <p className="text-sm text-muted-foreground text-center py-12">No questions yet.</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}