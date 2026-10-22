import { z } from 'zod';

export const pollFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a meeting title').max(160),
  description: z.string().max(2000),
  dates: z.array(z.date()).min(1, 'Choose at least one date').max(14, 'Choose up to 14 dates'),
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
  duration: z.coerce.number().refine(n => [30, 60, 90, 120].includes(n)),
}).refine(v => v.end > v.start, { message: 'End time must be after start time' });

export function buildCandidateSlots(dates: Date[], start: string, end: string): string[] {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const slots: string[] = [];
  for (const date of dates) {
    for (let minute = sh * 60 + sm; minute + 30 <= eh * 60 + em; minute += 30) {
      const slot = new Date(date);
      slot.setHours(Math.floor(minute / 60), minute % 60, 0, 0);
      slots.push(slot.toISOString());
    }
  }
  return [...new Set(slots)].sort();
}

export interface AvailabilityResponse { id: string; name: string; available_slots: string[] }
export interface AvailabilityPoll {
  id: string; title: string; description: string; timezone: string; slots: string[];
  duration_minutes: number; selected_start: string | null; organizer_id: string;
  responses: AvailabilityResponse[];
}
export function rankMeetingTimes(slots: string[], responses: AvailabilityResponse[], duration: number) {
  const slotSet = new Set(slots.map(s => new Date(s).toISOString()));
  const available = responses.map(r => new Set(r.available_slots.map(s => new Date(s).toISOString())));
  return [...slotSet].sort().flatMap(start => {
    const window = Array.from({ length: duration / 30 }, (_, i) => new Date(Date.parse(start) + i * 1800000).toISOString());
    if (!window.every(s => slotSet.has(s))) return [];
    return [{ start, count: available.filter(set => window.every(s => set.has(s))).length }];
  }).sort((a, b) => b.count - a.count || a.start.localeCompare(b.start));
}