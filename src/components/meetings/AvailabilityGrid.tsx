import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AvailabilityResponse } from '@/lib/meeting-availability';

interface Props { slots: string[]; timezone: string; selected: Set<string>; onChange: (slots: Set<string>) => void; responses: AvailabilityResponse[]; results: boolean; disabled?: boolean }
export default function AvailabilityGrid({ slots, timezone, selected, onChange, responses, results, disabled }: Props) {
  const paint = useRef<boolean | null>(null);
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const cells = slots.map(s => ({ slot: s, day: formatter.format(new Date(s)), time: timeFormatter.format(new Date(s)) }));
  const days = [...new Set(cells.map(c => c.day))];
  const times = [...new Set(cells.map(c => c.time))].sort();
  const apply = (slot: string, value: boolean) => { const next = new Set(selected); if (value) next.add(slot); else next.delete(slot); onChange(next); };
  return <div className="max-h-[650px] overflow-auto rounded-md border" onPointerUp={() => { paint.current = null; }} onPointerLeave={() => { paint.current = null; }}>
    <table className="w-full border-collapse text-sm">
      <thead className="sticky top-0 z-10 bg-background"><tr><th className="sticky left-0 bg-background px-3 py-3 text-left">Time</th>{days.map(day => <th key={day} className="min-w-[112px] px-2 py-3">{new Intl.DateTimeFormat(undefined, { timeZone: timezone, weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(cells.find(c => c.day === day)?.slot || slots[0]))}</th>)}</tr></thead>
      <tbody>{times.map(time => <tr key={time}><th className="sticky left-0 bg-background px-3 text-left font-normal text-muted-foreground">{time}</th>{days.map(day => {
        const cell = cells.find(c => c.day === day && c.time === time);
        if (!cell) return <td key={day} className="bg-muted/30" />;
        const count = responses.filter(r => r.available_slots.some(s => Date.parse(s) === Date.parse(cell.slot))).length;
        const chosen = selected.has(cell.slot);
        return <td key={day} className="border p-0.5"><Button type="button" variant="ghost" disabled={disabled && !results} aria-label={`${day} ${time}${results ? `, ${count} available` : ''}`} aria-pressed={!results && chosen} title={results ? responses.filter(r => r.available_slots.some(s => Date.parse(s) === Date.parse(cell.slot))).map(r => r.name).join(', ') || 'Nobody available' : `${time}–${timeFormatter.format(new Date(Date.parse(cell.slot) + 1800000))}`} className={cn('h-9 w-full rounded-sm text-xs touch-none select-none', results ? count === responses.length && count > 0 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : count ? 'bg-primary/30 hover:bg-primary/40' : 'bg-muted/40' : chosen ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted/40')} onPointerDown={e => { if (results || disabled) return; e.preventDefault(); paint.current = !chosen; apply(cell.slot, !chosen); }} onPointerEnter={e => { if (e.buttons && paint.current !== null && !results && !disabled) apply(cell.slot, paint.current); }} onClick={e => { if (e.detail === 0 && !results && !disabled) apply(cell.slot, !chosen); }}>{results ? `${count}/${responses.length}` : chosen ? '✓' : ''}</Button></td>;
      })}</tr>)}</tbody>
    </table>
  </div>;
}