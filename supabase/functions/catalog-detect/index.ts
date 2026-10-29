import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { createOpenAI } from "npm:@ai-sdk/openai@2";
import { streamText, Output, jsonSchema } from "npm:ai@5";
import { createLovableAiGatewayRunIdFetch } from "./run-id.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID",
};
const j = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const CATEGORIES = ["Automotive", "Carpentry", "CNC Tools", "Electrical", "General", "Machinist Tools", "Metalworking", "Miscellaneous", "Stock / materials"];

const schema = jsonSchema<{ items: Array<Record<string, unknown>> }>({
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "kind", "category", "quantity", "shape", "brand", "model", "power", "notes"],
        properties: {
          name: { type: "string" },
          kind: { type: "string", enum: ["tool", "material"] },
          category: { type: "string", enum: CATEGORIES },
          quantity: { type: ["string", "null"] },
          shape: { type: ["string", "null"] },
          brand: { type: ["string", "null"] },
          model: { type: ["string", "null"] },
          power: { type: ["string", "null"] },
          notes: { type: ["string", "null"] },
        },
      },
    },
  },
});

const INSTRUCTIONS = `You catalog a makerspace inventory from photos. List every distinct, identifiable tool or material visible (one entry per type; combine identical items into a quantity like "4" or "about 20"). Use short specific names ("1/2 in drive torque wrench", "6061 aluminum round bar").
- shape: physical form for stock/materials (sheet, slab, bar, round bar, tube, pipe, angle, plate, spool, motor, board, block...), else null.
- brand/model: only if readable on the item; never guess.
- power: power requirement if visible or clearly implied by the item type (e.g. "120V corded", "18V battery", "pneumatic", "240V"); null for hand tools/materials.
- notes: other important info visible (size, sizes in a set, damage, missing parts, safety); null if none.
Skip tiny unidentifiable clutter, packaging, and people. If nothing is identifiable, return an empty list.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return j({ error: "AI is not configured" }, 500);

    const auth = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !anonKey) return j({ error: "Recognition service is not configured" }, 500);
    const sb = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: auth } },
    });
    const { data: u } = await sb.auth.getUser(auth.replace(/^Bearer\s+/i, ""));
    if (!u?.user) return j({ error: "Sign in to scan items" }, 401);
    const userId = u.user.id;
    const roles = await Promise.all(["admin", "moderator"].map((r) => sb.rpc("has_role", { _role: r, _user_id: userId })));
    if (!roles.some((r) => r.data)) return j({ error: "Only inventory admins or managers can scan items" }, 403);

    const { image, mode } = await req.json();
    if (typeof image !== "string" || !image.startsWith("data:image/") || image.length > 8_000_000)
      return j({ error: "Send a JPEG or PNG photo under ~6 MB" }, 400);

    const gateway = createLovableAiGatewayRunIdFetch();
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: gateway.fetch,
    });
    const hint = mode === "single"
      ? "This photo shows ONE main item. Return just that item with as much detail as is readable."
      : "This photo may show a box, shelf, or pile with many items. List each one.";

    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      system: INSTRUCTIONS,
      experimental_output: Output.object({ schema }),
      messages: [{ role: "user", content: [{ type: "text", text: hint }, { type: "image", image: new URL(image) }] }],
      abortSignal: req.signal,
      maxRetries: 0,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const encoder = new TextEncoder();
    const body = new ReadableStream({
      async start(controller) {
        const send = (event: unknown) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        send({ type: "progress" });
        // Keep the browser connection alive without aborting or replaying billed work.
        const heartbeat = setInterval(() => send({ type: "progress" }), 5000);
        try {
          let text = "";
          for await (const part of result.fullStream) {
            if (part.type === "text-delta") text += part.text;
            if (part.type === "error") throw part.error;
          }
          let parsed: { items?: unknown[] };
          try { parsed = JSON.parse(text); }
          catch { throw new Error("Recognition returned an unreadable item list. Scanning paused; your batch is still here."); }
          if (!Array.isArray(parsed.items)) throw new Error("Recognition returned an invalid item list. Scanning paused.");
          send({ type: "result", items: parsed.items });
          console.info("catalog-detect completed", { runId: gateway.getRunId(), itemCount: parsed.items.length });
        } catch (error) {
          const failure = error as { statusCode?: number; message?: string; name?: string; responseBody?: string };
          const status = failure.statusCode ?? 502;
          let message = failure.message ?? "Recognition failed. Scanning paused.";
          // SDK parser errors can embed a full HTML response; never show that as the scan error.
          if (error instanceof SyntaxError || /<!doctype|<html|unexpected token/i.test(message)) {
            message = `Recognition service returned a web-page error (${status}). Scanning paused; your batch is still here.`;
          } else if (failure.responseBody) {
            try {
              const upstream = JSON.parse(failure.responseBody);
              message = upstream.message ?? upstream.error?.message ?? message;
            } catch { /* preserve the safe fallback */ }
          }
          console.error("catalog-detect failed", { status, runId: gateway.getRunId(), errorType: failure.name });
          send({ type: "error", status, error: message });
        } finally {
          clearInterval(heartbeat);
          controller.close();
        }
      },
    });
    return new Response(body, { headers: { ...corsHeaders, "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" } });
  } catch (e) {
    if ((e as Error)?.name === "AbortError") return j({ error: "cancelled" }, 499);
    console.error(e);
    return j({ error: (e as Error).message ?? "Unknown error" }, 500);
  }
});
