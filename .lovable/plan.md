## Scope

Three connected primitives for Garflock:

1. **Group Threads** — multi-artist persistent chats (project / gig / panel scoped)
2. **Convention Panels** — IRL, timed, scheduled multi-speaker sessions at a venue/event (think "10:30am — Custom EV Conversions panel, 4 speakers, Hall B, 45min")
3. **Bots** — chat assistants, scheduled agents, and moderators that live inside threads and panels

---

## 1. Group Threads

New table `thread` + `thread_member` + `thread_message`.
- `thread.kind`: `direct | group | panel_backstage | community`
- `thread.context_ref`: optional FK to project / panel / community
- Realtime via Supabase `postgres_changes` on `thread_message`
- UI: `/threads`, `/threads/:id` with member list, typing, file/image attachments, @mentions, message reactions
- Reuses existing `MarketplaceChat` / `ProjectChat` patterns but consolidated

## 2. Convention Panels

New tables `panel`, `panel_speaker`, `panel_attendee`, plus link to `events` (existing).
Fields: `title, blurb, room, starts_at, duration_min, capacity, recording_url, livestream_url, status`.
- Speakers: ordered list with role (`host | speaker | moderator`)
- Each panel auto-spawns a backstage `thread` (kind = `panel_backstage`) for the speakers + a public Q&A thread for attendees
- Attendee RSVP, "I'm here" check-in via QR at the room
- Timed runtime view (`/panels/:id/live`): countdown, current speaker, timer, audience questions feed with upvote, moderator can promote a question
- Public schedule grid at `/conventions/:eventId` (rooms × time)

## 3. Bots

One `bot` table + `thread_bot` membership.
- `bot.kind`: `assistant | scheduled | moderator`
- `bot.config` JSONB (prompt, schedule cron, moderation rules)
- Edge function `bot-dispatch` invoked by:
  - new `thread_message` (assistant + moderator paths)
  - `pg_cron` (scheduled agents)
- Uses Lovable AI Gateway (`google/gemini-3-flash-preview`) via AI SDK
- Bot messages stored as normal `thread_message` rows with `sender_kind = 'bot'`
- Per-thread toggle: which bots are active, with creator-only config

---

## Build Order

1. Migration: `thread`, `thread_member`, `thread_message`, `panel`, `panel_speaker`, `panel_attendee`, `bot`, `thread_bot` (+ GRANTs + RLS + realtime publication + triggers)
2. Hooks: `use-threads`, `use-panel`, `use-bots`
3. Pages: `/threads`, `/threads/:id`, `/panels`, `/panels/:id`, `/panels/:id/live`, `/bots`
4. Edge function: `bot-dispatch` with assistant / moderator / scheduled paths
5. Nav: add "Panels" + "Threads" to main menu; surface bots inside thread settings
6. Seed: 2 demo panels at a fake convention, 1 assistant bot, 1 moderator bot

---

## Open questions before I build

- Should panels live **under existing `events`** as a sub-type, or as a fully separate `panel` table linked to a parent event? (I'm leaning: separate `panel` table with optional `event_id` — keeps existing event flows untouched.)
- Should the **public Q&A** for a panel be its own thread, or just an "audience questions" list with upvotes (no replies)? Upvote-only is the convention norm.
- Bots: open to **anyone with a Garflock account** building bots, or **creator/admin only** in v1? I'd default to creator-only in v1 to avoid spam.

Reply with answers (or "your call on all three") and I'll ship it.
