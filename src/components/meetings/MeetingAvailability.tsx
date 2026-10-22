import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Copy, Plus, RefreshCw, Check, CalendarDays } from 'lucide-react';
import { z } from 'zod';
import AvailabilityGrid from './AvailabilityGrid';
import { buildCandidateSlots, pollFormSchema, rankMeetingTimes, type AvailabilityPoll } from '@/lib/meeting-availability';

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const responseSchema = z.object({ name: z.string().trim().min(1, 'Enter your name').max(80), slots: z.array(z.string().datetime()).max(672) });

export default function MeetingAvailability({ token }: { token?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<AvailabilityPoll | null>(null);
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dates, setDates] = useState<Date[]>([]);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');
  const [duration, setDuration] = useState('60');
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState('availability');
  const [timezone, setTimezone] = useState(localTimezone);
  const [saved, setSaved] = useState(false);
  const [polls, setPolls] = useState<{ title: string; share_token: string; selected_start: string | null }[]>([]);

  const load = useCallback(async (restore = false) => {
    if (!token || !z.string().uuid().safeParse(token).success) { setError('Poll not found'); setLoading(false); return; }
    try {
      const { data, error: fetchError } = await supabase.rpc('get_meeting_availability_poll', { p_token: token });
      if (fetchError) throw fetchError;
      if (!data) throw new Error('Poll not found or no longer available');
      const next = data as unknown as AvailabilityPoll;
      next.slots = next.slots.map(s => new Date(s).toISOString());
      next.responses = next.responses.map(r => ({ ...r, available_slots: r.available_slots.map(s => new Date(s).toISOString()) }));
      setPoll(next); setError('');
      if (restore) {
        const responseId = localStorage.getItem(`availability:${token}:response`);
        const own = next.responses.find(r => r.id === responseId);
        if (own) { setName(own.name); setSelected(new Set(own.available_slots)); setSaved(true); }
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not load availability'); }
    finally { setLoading(false); }
  }, [token]);
  useEffect(() => { if (token) void load(true); }, [token, load]);
  useEffect(() => {
    if (!user || token) return;
    void supabase.from('meeting_availability_polls').select('title, share_token, selected_start').order('created_at', { ascending: false }).then(({ data, error: listError }) => {
      if (listError) setError(listError.message); else setPolls(data || []);
    });
  }, [user, token]);

  async function createPoll(e: React.FormEvent) {
    e.preventDefault(); if (!user) return;
    const parsed = pollFormSchema.safeParse({ title, description, dates, start, end, duration });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message || 'Check meeting details'); return; }
    const slots = buildCandidateSlots(dates, start, end);
    if (!rankMeetingTimes(slots, [], Number(duration)).length) { toast.error('The time window is shorter than the meeting'); return; }
    setBusy(true);
    try {
      const { data, error: createError } = await supabase.from('meeting_availability_polls').insert({ title: parsed.data.title, description, organizer_id: user.id, timezone: localTimezone, slots, duration_minutes: Number(duration) }).select('share_token').single();
      if (createError) throw createError;
      navigate(`/meetings/availability/${data.share_token}`);
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not create poll'); }
    finally { setBusy(false); }
  }
  async function saveResponse() {
    if (!token || !poll) return;
    const parsed = responseSchema.safeParse({ name, slots: [...selected] });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message || 'Check your availability'); return; }
    setBusy(true);
    try {
      const keyName = `availability:${token}:edit`;
      let key = localStorage.getItem(keyName);
      if (!key) { key = crypto.randomUUID(); localStorage.setItem(keyName, key); }
      const { data, error: saveError } = await supabase.rpc('save_meeting_availability_response', { p_token: token, p_edit_key: key, p_name: parsed.data.name, p_slots: parsed.data.slots });
      if (saveError) throw saveError;
      localStorage.setItem(`availability:${token}:response`, data);
      setSaved(true); toast.success('Availability saved'); await load(); setMode('results');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not save availability'); }
    finally { setBusy(false); }
  }
  async function chooseTime(time: string | null) {
    if (!poll || !user || user.id !== poll.organizer_id) return;
    setBusy(true);
    try {
      const { error: updateError } = await supabase.from('meeting_availability_polls').update({ selected_start: time }).eq('id', poll.id);
      if (updateError) throw updateError;
      await load(); toast.success(time ? 'Meeting time confirmed' : 'Poll reopened');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not update poll'); }
    finally { setBusy(false); }
  }
  const displayTime = (s: string) => new Intl.DateTimeFormat(undefined, { timeZone: timezone, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(s));

  if (!token) return <section className="space-y-6">
    <div><h2 className="text-xl font-semibold">Find a meeting time</h2></div>
    {error && <p role="alert" className="text-destructive">{error}</p>}
    {polls.length > 0 && <div className="divide-y border-y">{polls.map(p => <Link key={p.share_token} to={`/meetings/availability/${p.share_token}`} className="flex items-center justify-between gap-3 py-3"><span>{p.title}</span><Badge variant="secondary">{p.selected_start ? 'Confirmed' : 'Collecting availability'}</Badge></Link>)}</div>}
    <form onSubmit={createPoll} className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4"><div className="space-y-2"><Label htmlFor="poll-title">Meeting title</Label><Input id="poll-title" value={title} onChange={e => setTitle(e.target.value)} maxLength={160} required /></div>
          <div className="space-y-2"><Label htmlFor="poll-notes">Notes</Label><Textarea id="poll-notes" value={description} onChange={e => setDescription(e.target.value)} maxLength={2000} /></div>
          <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label htmlFor="window-start">From</Label><Input id="window-start" type="time" step={1800} value={start} onChange={e => setStart(e.target.value)} required /></div><div className="space-y-2"><Label htmlFor="window-end">Until</Label><Input id="window-end" type="time" step={1800} value={end} onChange={e => setEnd(e.target.value)} required /></div></div>
          <div className="space-y-2"><Label>Meeting length</Label><Select value={duration} onValueChange={setDuration}><SelectTrigger aria-label="Meeting length"><SelectValue /></SelectTrigger><SelectContent>{[30,60,90,120].map(n => <SelectItem key={n} value={String(n)}>{n} minutes</SelectItem>)}</SelectContent></Select></div>
          <p className="text-sm text-muted-foreground">Timezone: {localTimezone}</p>
        </div>
        <div className="space-y-2"><Label>Candidate dates</Label><Calendar mode="multiple" selected={dates} onSelect={v => setDates(v || [])} max={14} className="w-fit rounded-md border" /><Badge variant="outline">{dates.length} dates</Badge></div>
      </div>
      <Button disabled={!user || busy} type="submit"><Plus className="mr-2 h-4 w-4" />{busy ? 'Creating…' : 'Create availability poll'}</Button>
      {!user && <p className="text-sm text-muted-foreground">Sign in to create a poll. Respondents don’t need an account.</p>}
    </form>
  </section>;
  if (loading) return <p className="py-8 text-muted-foreground">Loading availability…</p>;
  if (error) return <div className="space-y-4 py-8"><p role="alert" className="text-destructive">{error}</p><Button variant="outline" onClick={() => void load()}>Retry</Button></div>;
  if (!poll) return null;
  const ranked = rankMeetingTimes(poll.slots, poll.responses, poll.duration_minutes);
  const organizer = user?.id === poll.organizer_id;
  return <section className="space-y-5">
    <header className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h1 className="break-words text-2xl font-semibold">{poll.title}</h1><p className="mt-1 text-sm text-muted-foreground">{poll.duration_minutes} minutes · {poll.responses.length} respondents</p>{poll.description && <p className="mt-3 whitespace-pre-wrap break-words">{poll.description}</p>}</div><div className="flex gap-2"><Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); toast.success('Poll link copied'); } catch { toast.error('Could not copy link'); } }}><Copy className="mr-2 h-4 w-4" />Share link</Button><Button variant="ghost" size="icon" aria-label="Refresh responses" title="Refresh responses" onClick={() => void load()}><RefreshCw className="h-4 w-4" /></Button></div></header>
    {poll.selected_start && <div className="flex flex-wrap items-center justify-between gap-3 border-y py-4"><p className="font-medium"><Check className="mr-2 inline h-4 w-4 text-primary" />{displayTime(poll.selected_start)} · confirmed</p>{organizer && <Button variant="outline" disabled={busy} onClick={() => void chooseTime(null)}>Reopen poll</Button>}</div>}
    <div className="flex flex-wrap items-center justify-between gap-3"><Tabs value={mode} onValueChange={setMode}><TabsList><TabsTrigger value="availability">Your availability</TabsTrigger><TabsTrigger value="results">Group overlap</TabsTrigger></TabsList></Tabs><Select value={timezone} onValueChange={setTimezone}><SelectTrigger className="w-auto max-w-full" aria-label="Display timezone"><SelectValue /></SelectTrigger><SelectContent>{[...new Set([localTimezone, poll.timezone, 'UTC'])].map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent></Select></div>
    {mode === 'availability' && <div className="flex flex-wrap items-end gap-3"><div className="min-w-[180px] flex-1 space-y-2"><Label htmlFor="respondent-name">Your name</Label><Input id="respondent-name" value={name} onChange={e => { setName(e.target.value); setSaved(false); }} maxLength={80} disabled={!!poll.selected_start} /></div><Button variant="outline" disabled={!!poll.selected_start} onClick={() => { setSelected(new Set(poll.slots)); setSaved(false); }}>Select all</Button><Button variant="ghost" disabled={!!poll.selected_start} onClick={() => { setSelected(new Set()); setSaved(false); }}>Clear</Button></div>}
    <AvailabilityGrid slots={poll.slots} timezone={timezone} selected={selected} onChange={v => { setSelected(v); setSaved(false); }} responses={poll.responses} results={mode === 'results'} disabled={!!poll.selected_start} />
    {mode === 'availability' ? <div className="flex flex-wrap items-center gap-4"><Button onClick={() => void saveResponse()} disabled={busy || !!poll.selected_start}>{busy ? 'Saving…' : saved ? 'Availability saved' : 'Save availability'}</Button><span className="text-sm text-muted-foreground">{selected.size} half-hour slots selected</span><span className="text-sm text-muted-foreground">{!selected.size && 'No times available'}</span></div> : <div className="grid gap-6 lg:grid-cols-2"><div><h3 className="mb-3 font-semibold">Best meeting times</h3>{!poll.responses.length ? <p className="text-sm text-muted-foreground">No responses yet</p> : ranked.slice(0, 5).map(r => <div key={r.start} className="flex flex-wrap items-center justify-between gap-3 border-b py-3"><div><p>{displayTime(r.start)}</p><p className="text-sm text-muted-foreground">{r.count} of {poll.responses.length} available for {poll.duration_minutes} minutes</p></div>{organizer && !poll.selected_start && <Button size="sm" variant="outline" disabled={busy} onClick={() => void chooseTime(r.start)}><CalendarDays className="mr-2 h-4 w-4" />Choose time</Button>}</div>)}</div><div><h3 className="mb-3 font-semibold">Respondents</h3><div className="flex flex-wrap gap-2">{poll.responses.map(r => <Badge key={r.id} variant="secondary">{r.name} · {r.available_slots.length ? `${r.available_slots.length} slots` : 'Unavailable'}</Badge>)}</div></div></div>}
  </section>;
}