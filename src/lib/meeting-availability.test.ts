import { describe, expect, test } from 'bun:test';
import { buildCandidateSlots, rankMeetingTimes } from './meeting-availability';

describe('respondent availability', () => {
  test('candidate windows provide selectable half-hour intervals', () => {
    const slots = buildCandidateSlots([new Date(2026, 9, 20)], '09:00', '10:30');
    expect(slots.length).toBe(3);
    expect(Date.parse(slots[2]) - Date.parse(slots[0])).toBe(3600000);
  });
  test('overlap counts respondents available for the entire meeting', () => {
    const slots = ['2026-10-20T09:00:00Z', '2026-10-20T09:30:00Z', '2026-10-20T10:00:00Z'];
    const result = rankMeetingTimes(slots, [{ id: 'a', name: 'A', available_slots: slots }, { id: 'b', name: 'B', available_slots: slots.slice(1) }], 60);
    expect(result).toEqual([{ start: '2026-10-20T09:30:00.000Z', count: 2 }, { start: '2026-10-20T09:00:00.000Z', count: 1 }]);
  });
  test('separate days cannot form a continuous meeting', () => {
    expect(rankMeetingTimes(['2026-10-20T09:00:00Z', '2026-10-21T09:00:00Z'], [], 60)).toEqual([]);
  });
});