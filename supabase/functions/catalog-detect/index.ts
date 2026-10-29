import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { createOpenAI } from "npm:@ai-sdk/openai@2";
import { streamText, Output, jsonSchema } from "npm:ai@5";

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
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: u } = await sb.auth.getUser(auth.replace(/^Bearer\s+/i, ""));
    if (!u?.user) return j({ error: "Sign in to scan items" }, 401);
    const { data: isAdmin } = await sb.rpc("has_role", { _role: "admin", _user_id: u.user.id });
    if (!isAdmin) return j({ error: "Only inventory admins can scan items" }, 403);

    const { image, mode } = await req.json();
    if (typeof image !== "string" || !image.startsWith("data:image/") || image.length > 8_000_000)
      return j({ error: "Send a JPEG or PNG photo under ~6 MB" }, 400);

    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
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

    let text = "";
    let failure: unknown = null;
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") text += part.text;
      if (part.type === "error") failure = part.error;
    }
    if (failure) {
      const status = (failure as { statusCode?: number })?.statusCode ?? 502;
      const msg = status === 402 ? "Out of AI credits. Add more in Settings → Plans & credits."
        : status === 429 ? "Too many scans at once. Wait a moment and try again."
        : (failure as Error)?.message ?? "AI request failed";
      console.error("catalog-detect AI error", status, failure);
      return j({ error: msg }, status);
    }
    const parsed = JSON.parse(text);
    return j({ items: Array.isArray(parsed?.items) ? parsed.items : [] });
  } catch (e) {
    if ((e as Error)?.name === "AbortError") return j({ error: "cancelled" }, 499);
    console.error(e);
    return j({ error: (e as Error).message ?? "Unknown error" }, 500);
  }
});
