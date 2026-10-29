import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { freshCatalogItems } from './catalog-batch';

describe('rapid inventory batches', () => {
  it('does not add the same recognized item on every camera frame', () => {
    const seen = new Set<string>();
    assert.equal(freshCatalogItems([{ name: 'Drill', model: 'DCD771', quantity: '1' }], seen).length, 1);
    assert.equal(freshCatalogItems([{ name: ' drill ', model: 'dcd771', quantity: '1' }], seen).length, 0);
  });
  it('keeps visibly different specifications separate', () => {
    const seen = new Set<string>();
    assert.equal(freshCatalogItems([{ name: 'Drill', model: 'DCD771' }, { name: 'Drill', model: 'DCD791' }], seen).length, 2);
  });
  it('allows the same type again in an explicitly new batch', () => {
    const seen = new Set<string>();
    freshCatalogItems([{ name: 'Aluminum bar' }], seen);
    seen.clear();
    assert.equal(freshCatalogItems([{ name: 'Aluminum bar' }], seen).length, 1);
  });
});