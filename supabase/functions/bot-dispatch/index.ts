import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { thread_id } = await req.json();
    if (!thread_id) return j({ error: "thread_id required" }, 400);
    if (!LOVABLE_API_KEY) return j({ error: "LOVABLE_API_KEY missing" }, 500);

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch active bots attached to this thread
    const { data: tBots, error: tbErr } = await admin
      .from("thread_bots")
      .select("bot_id, enabled, bot:bots(*)")
      .eq("thread_id", thread_id)
      .eq("enabled", true);
    if (tbErr) throw tbErr;
    if (!tBots || tBots.length === 0) return j({ ok: true, dispatched: 0 });

    // Fetch last ~20 messages
    const { data: msgs, error: mErr } = await admin
      .from("thread_messages")
      .select("sender_kind, sender_user_id, sender_bot_id, content, created_at")
      .eq("thread_id", thread_id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (mErr) throw mErr;
    const history = (msgs ?? []).reverse();
    const last = history[history.length - 1];
    // Avoid bot reply loops: skip if last message is from a bot
    if (last?.sender_kind === "bot") return j({ ok: true, skipped: "last_was_bot" });

    let dispatched = 0;
    for (const tb of tBots) {
      const bot = (tb as { bot: { id: string; name: string; kind: string; system_prompt: string; model: string } }).bot;
      if (!bot || bot.kind === "scheduled") continue; // scheduled bots run via cron, not on message

      const messages = [
        { role: "system", content: `${bot.system_prompt}\n\nYou are "${bot.name}". Keep replies under 120 words. ${bot.kind === "moderator" ? "Only respond if you spot rule violations, spam, or off-topic drift; otherwise reply with the single token NOOP." : ""}` },
        ...history.map((m) => ({
          role: m.sender_kind === "bot" ? "assistant" : "user",
          content: m.sender_kind === "bot" ? m.content : `${m.content}`,
        })),
      ];

      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({ model: bot.model || "google/gemini-3-flash-preview", messages }),
      });
      if (!aiRes.ok) {
        console.error("bot AI call failed", bot.id, aiRes.status, await aiRes.text());
        continue;
      }
      const data = await aiRes.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();
      if (!reply || reply === "NOOP") continue;

      await admin.from("thread_messages").insert({
        thread_id,
        sender_kind: "bot",
        sender_bot_id: bot.id,
        content: reply,
      });
      dispatched++;
    }

    return j({ ok: true, dispatched });
  } catch (e) {
    console.error("bot-dispatch error", e);
    return j({ error: (e as Error).message }, 500);
  }
});

function j(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}