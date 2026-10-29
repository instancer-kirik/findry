export async function readCatalogResponse(response: Response): Promise<{ items?: unknown[]; error?: string }> {
  const fallback = `Recognition service returned an unreadable reply (${response.status}). Scanning paused; your batch is still here.`;
  const parse = (text: string) => {
    try { return JSON.parse(text); }
    catch { throw new Error(fallback); }
  };
  if (!response.headers.get('content-type')?.includes('application/x-ndjson')) {
    const text = await response.text();
    if (!text.trim()) throw new Error(fallback);
    return parse(text);
  }
  if (!response.body) throw new Error(fallback);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      pending += decoder.decode(value, { stream: !done });
      const lines = pending.split('\n');
      pending = lines.pop() ?? '';
      if (done && pending.trim()) lines.push(pending);
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = parse(line);
        if (event.type === 'error') throw new Error(event.error || 'Recognition failed. Scanning paused.');
        if (event.type === 'result') return event;
      }
      if (done) throw new Error('Recognition connection ended before the result. Scanning paused; your batch is still here.');
    }
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}