import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getCuttingMaintenance, cuttingSuggestion, matchesMaintenance, maintenanceSchema } from './cutting-maintenance';

describe('sharpening and replacement tracking', () => {
  it('flags known cutting tools for inspection, not assumed sharpening', () => {
    const m = getCuttingMaintenance({ name: 'Tablesaw', params: {} });
    assert.equal(m.status, 'inspect'); assert.equal(m.suggested, true);
    assert.equal(cuttingSuggestion({ name: 'Oscilloscope' }), null);
  });
  it('honors saved needs and retains replacement link', () => {
    const m = getCuttingMaintenance({ name: 'Router Table', params: { cutting_maintenance: { status: 'sharpen', part: 'Router bit', replacement_url: 'https://example.com/bit' } } });
    assert.equal(m.status, 'sharpen'); assert.equal(m.replacement_url, 'https://example.com/bit'); assert.equal(m.suggested, false);
    assert.equal(matchesMaintenance({ name: 'Router Table', params: { cutting_maintenance: m } }, 'sharpen'), true);
  });
  it('rejects unsafe replacement links', () => {
    assert.equal(maintenanceSchema.safeParse({ status: 'replace', replacement_url: 'javascript:alert(1)' }).success, false);
  });
  it('abrasive wheels and plasma consumables are replacement inspection candidates', () => {
    assert.match(cuttingSuggestion({ name: 'Angle Grinders' })?.notes || '', /do not sharpen/);
    assert.match(cuttingSuggestion({ name: 'Plasma Cutter' })?.notes || '', /replace rather than sharpen/);
  });
});