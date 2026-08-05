import { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Plus, Gamepad2, Link2, Swords } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  ACTIVITY_LABELS, GameActivity, useCancelGameMatch, useCreateGameMatch,
  useGameMatchParticipants, useGameMatches, useJoinGameMatch, useLeaveGameMatch,
} from "@/hooks/use-game-matches";

const ACTIVITIES: GameActivity[] = ["tennis", "dnd", "racing", "fighting", "other"];

const emptyForm = {
  title: "",
  activity: "tennis" as GameActivity,
  game_title: "",
  format: "",
  skill_level: "",
  starts_at: "",
  duration_min: 60,
  location: "",
  platform: "",
  lobby_url: "",
  max_players: 2,
  notes: "",
  is_public: true,
};

export default function GameMatches() {
  const { user } = useAuth();
  const { data: matches = [], isLoading } = useGameMatches();
  const { data: participants = [] } = useGameMatchParticipants();
  const createMatch = useCreateGameMatch();
  const joinMatch = useJoinGameMatch();
  const leaveMatch = useLeaveGameMatch();
  const cancelMatch = useCancelGameMatch();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState<"all" | GameActivity>("all");

  const countsByMatch = useMemo(() => {
    const map: Record<string, number> = {};
    participants.forEach((p) => {
      if (p.status === "joined") map[p.match_id] = (map[p.match_id] ?? 0) + 1;
    });
    return map;
  }, [participants]);

  const joinedIds = useMemo(
    () => new Set(participants.filter((p) => p.user_id === user?.id).map((p) => p.match_id)),
    [participants, user],
  );

  const visible = matches.filter((m) => filter === "all" || m.activity === filter);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Game Matches</h1>
            <p className="text-muted-foreground mt-1">
              Schedule tennis sets, D&amp;D sessions, race nights, and fight-game lobbies.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={!user}>
                <Plus className="w-4 h-4 mr-2" />Schedule Match
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Schedule a match</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sunday doubles at Riverside" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Activity</Label>
                    <Select value={form.activity} onValueChange={(v) => setForm({ ...form, activity: v as GameActivity })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ACTIVITIES.map((a) => <SelectItem key={a} value={a}>{ACTIVITY_LABELS[a]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Game / system</Label>
                    <Input value={form.game_title} onChange={(e) => setForm({ ...form, game_title: e.target.value })} placeholder="Curse of Strahd, iRacing…" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Starts at</Label>
                    <Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Duration (min)</Label>
                    <Input type="number" value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Format</Label>
                    <Input value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} placeholder="1v1, doubles, campaign" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Skill level</Label>
                    <Input value={form.skill_level} onChange={(e) => setForm({ ...form, skill_level: e.target.value })} placeholder="Casual, 4.0 NTRP, ranked" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Location (in person)</Label>
                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Court 3, game store, table" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Platform (online)</Label>
                    <Input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="PS5, PC, Roll20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Lobby / room link</Label>
                    <Input value={form.lobby_url} onChange={(e) => setForm({ ...form, lobby_url: e.target.value })} placeholder="https://" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Max players</Label>
                    <Input type="number" min={2} value={form.max_players} onChange={(e) => setForm({ ...form, max_players: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Notes</Label>
                  <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Bring your own dice, best of 5, etc." />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">Public match</p>
                    <p className="text-xs text-muted-foreground">Anyone can find and join it.</p>
                  </div>
                  <Switch checked={form.is_public} onCheckedChange={(v) => setForm({ ...form, is_public: v })} />
                </div>
                <Button
                  className="w-full"
                  disabled={!form.title || !form.starts_at || createMatch.isPending}
                  onClick={async () => {
                    await createMatch.mutateAsync({
                      ...form,
                      starts_at: new Date(form.starts_at).toISOString(),
                    });
                    setOpen(false);
                    setForm(emptyForm);
                  }}
                >Schedule</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | GameActivity)} className="mb-6">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {ACTIVITIES.map((a) => (
              <TabsTrigger key={a} value={a}>{ACTIVITY_LABELS[a]}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? <p className="text-muted-foreground">Loading matches…</p> : null}
        {!isLoading && visible.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No matches scheduled yet. Set one up and invite players.
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((m) => {
            const joined = joinedIds.has(m.id);
            const isHost = m.host_id === user?.id;
            const count = countsByMatch[m.id] ?? 0;
            return (
              <Card key={m.id} className="hover:border-primary transition">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{m.title}</CardTitle>
                    <Badge variant={m.status === "cancelled" ? "destructive" : m.status === "live" ? "default" : "secondary"}>
                      {m.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="outline" className="gap-1"><Swords className="w-3 h-3" />{ACTIVITY_LABELS[m.activity]}</Badge>
                    {m.game_title ? <Badge variant="outline" className="gap-1"><Gamepad2 className="w-3 h-3" />{m.game_title}</Badge> : null}
                    {m.format ? <Badge variant="outline">{m.format}</Badge> : null}
                    {m.skill_level ? <Badge variant="outline">{m.skill_level}</Badge> : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {m.notes ? <p className="text-muted-foreground line-clamp-2">{m.notes}</p> : null}
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(m.starts_at).toLocaleString()}</span>
                    {m.location || m.platform ? (
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{m.location || m.platform}</span>
                    ) : null}
                    <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{count}/{m.max_players}</span>
                  </div>
                  {m.lobby_url && joined ? (
                    <a href={m.lobby_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                      <Link2 className="w-3.5 h-3.5" />Lobby link
                    </a>
                  ) : null}
                  <div className="flex gap-2 pt-1">
                    {joined ? (
                      <Button size="sm" variant="outline" disabled={isHost} onClick={() => leaveMatch.mutate(m.id)}>
                        {isHost ? "Hosting" : "Leave"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={!user || m.status === "cancelled" || count >= m.max_players}
                        onClick={() => joinMatch.mutate({ matchId: m.id })}
                      >
                        {count >= m.max_players ? "Full" : "Join"}
                      </Button>
                    )}
                    {isHost && m.status !== "cancelled" ? (
                      <Button size="sm" variant="ghost" onClick={() => cancelMatch.mutate(m.id)}>Cancel</Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}