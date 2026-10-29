import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readCatalogResponse } from './catalog-response';

describe('recognition replies', () => {
  it('reports HTML failures without exposing a JSON syntax error', async () => {
    await assert.rejects(readCatalogResponse(new Response('<!DOCTYPE html><html>Error</html>', { status: 502 })), /unreadable reply \(502\)/);
  });
  it('reads a result across partial stream chunks and skips progress', async () => {
    const body = new ReadableStream({ start(c) {
      for (const text of ['{"type":"progress"}\n{"type":"res', 'ult","items":[{"name":"Drill"}]}\n']) c.enqueue(new TextEncoder().encode(text));
      c.close();
    } });
    assert.deepEqual((await readCatalogResponse(new Response(body, { headers: { 'content-type': 'application/x-ndjson' } }))).items, [{ name: 'Drill' }]);
  });
  it('preserves service denial messages and stops without retrying', async () => {
    await assert.rejects(readCatalogResponse(new Response('{"type":"error","error":"Only inventory admins or managers can scan items"}\n', { headers: { 'content-type': 'application/x-ndjson' } })), /Only inventory admins or managers/);
  });
  it('never treats an interrupted scan as an empty successful result', async () => {
    await assert.rejects(readCatalogResponse(new Response('{"type":"progress"}\n', { headers: { 'content-type': 'application/x-ndjson' } })), /ended before the result/);
  });
});