-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE public.thread_kind AS ENUM ('direct', 'group', 'panel_backstage', 'panel_qa', 'community');
CREATE TYPE public.thread_member_role AS ENUM ('owner', 'member');
CREATE TYPE public.message_sender_kind AS ENUM ('user', 'bot', 'system');
CREATE TYPE public.panel_status AS ENUM ('draft', 'scheduled', 'live', 'ended', 'cancelled');
CREATE TYPE public.panel_speaker_role AS ENUM ('host', 'speaker', 'moderator');
CREATE TYPE public.panel_rsvp_status AS ENUM ('interested', 'going', 'checked_in', 'cancelled');
CREATE TYPE public.bot_kind AS ENUM ('assistant', 'scheduled', 'moderator');

-- ============================================================
-- THREADS
-- ============================================================
CREATE TABLE public.threads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind        public.thread_kind NOT NULL DEFAULT 'group',
  title       text,
  created_by  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  context_type text,
  context_id  uuid,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.threads TO authenticated;
GRANT ALL ON public.threads TO service_role;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.thread_members (
  thread_id  uuid NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.thread_member_role NOT NULL DEFAULT 'member',
  joined_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (thread_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thread_members TO authenticated;
GRANT ALL ON public.thread_members TO service_role;
ALTER TABLE public.thread_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.thread_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id    uuid NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  sender_kind  public.message_sender_kind NOT NULL DEFAULT 'user',
  sender_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_bot_id  uuid,
  content      text NOT NULL,
  attachments  jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thread_messages TO authenticated;
GRANT ALL ON public.thread_messages TO service_role;
ALTER TABLE public.thread_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_thread_messages_thread_created ON public.thread_messages(thread_id, created_at DESC);
CREATE INDEX idx_thread_members_user ON public.thread_members(user_id);

-- Security-definer helper to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.is_thread_member(_thread_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.thread_members WHERE thread_id = _thread_id AND user_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.is_thread_owner(_thread_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.threads WHERE id = _thread_id AND created_by = _user_id)
$$;

-- threads policies
CREATE POLICY "threads_select_members_or_creator" ON public.threads FOR SELECT TO authenticated
  USING (created_by = auth.uid() OR public.is_thread_member(id, auth.uid()));
CREATE POLICY "threads_insert_self" ON public.threads FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "threads_update_owner" ON public.threads FOR UPDATE TO authenticated
  USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
CREATE POLICY "threads_delete_owner" ON public.threads FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- thread_members policies
CREATE POLICY "thread_members_select_visible" ON public.thread_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_thread_member(thread_id, auth.uid()) OR public.is_thread_owner(thread_id, auth.uid()));
CREATE POLICY "thread_members_insert_owner_or_self_join" ON public.thread_members FOR INSERT TO authenticated
  WITH CHECK (public.is_thread_owner(thread_id, auth.uid()) OR user_id = auth.uid());
CREATE POLICY "thread_members_delete_owner_or_self" ON public.thread_members FOR DELETE TO authenticated
  USING (public.is_thread_owner(thread_id, auth.uid()) OR user_id = auth.uid());

-- thread_messages policies
CREATE POLICY "thread_messages_select_members" ON public.thread_messages FOR SELECT TO authenticated
  USING (public.is_thread_member(thread_id, auth.uid()) OR public.is_thread_owner(thread_id, auth.uid()));
CREATE POLICY "thread_messages_insert_members" ON public.thread_messages FOR INSERT TO authenticated
  WITH CHECK (
    (public.is_thread_member(thread_id, auth.uid()) OR public.is_thread_owner(thread_id, auth.uid()))
    AND (sender_kind <> 'user' OR sender_user_id = auth.uid())
  );
CREATE POLICY "thread_messages_update_own" ON public.thread_messages FOR UPDATE TO authenticated
  USING (sender_user_id = auth.uid()) WITH CHECK (sender_user_id = auth.uid());
CREATE POLICY "thread_messages_delete_own_or_owner" ON public.thread_messages FOR DELETE TO authenticated
  USING (sender_user_id = auth.uid() OR public.is_thread_owner(thread_id, auth.uid()));

-- Auto-add creator as owner member
CREATE OR REPLACE FUNCTION public.add_thread_creator_as_member()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.thread_members (thread_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_thread_creator_member AFTER INSERT ON public.threads
  FOR EACH ROW EXECUTE FUNCTION public.add_thread_creator_as_member();

CREATE TRIGGER trg_threads_updated_at BEFORE UPDATE ON public.threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- PANELS
-- ============================================================
CREATE TABLE public.panels (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      uuid REFERENCES public.events(id) ON DELETE SET NULL,
  title         text NOT NULL,
  blurb         text,
  room          text,
  starts_at     timestamptz NOT NULL,
  duration_min  integer NOT NULL DEFAULT 45,
  capacity      integer,
  livestream_url text,
  recording_url text,
  status        public.panel_status NOT NULL DEFAULT 'scheduled',
  backstage_thread_id uuid REFERENCES public.threads(id) ON DELETE SET NULL,
  created_by    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.panels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.panels TO authenticated;
GRANT ALL ON public.panels TO service_role;
ALTER TABLE public.panels ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.panel_speakers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id   uuid NOT NULL REFERENCES public.panels(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name text,
  role       public.panel_speaker_role NOT NULL DEFAULT 'speaker',
  position   integer NOT NULL DEFAULT 0,
  bio        text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.panel_speakers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.panel_speakers TO authenticated;
GRANT ALL ON public.panel_speakers TO service_role;
ALTER TABLE public.panel_speakers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.panel_attendees (
  panel_id    uuid NOT NULL REFERENCES public.panels(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status      public.panel_rsvp_status NOT NULL DEFAULT 'going',
  checked_in_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (panel_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.panel_attendees TO authenticated;
GRANT ALL ON public.panel_attendees TO service_role;
ALTER TABLE public.panel_attendees ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.panel_questions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id   uuid NOT NULL REFERENCES public.panels(id) ON DELETE CASCADE,
  asked_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  content    text NOT NULL,
  upvotes    integer NOT NULL DEFAULT 0,
  promoted   boolean NOT NULL DEFAULT false,
  answered   boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.panel_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.panel_questions TO authenticated;
GRANT ALL ON public.panel_questions TO service_role;
ALTER TABLE public.panel_questions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_panel_speakers_panel ON public.panel_speakers(panel_id, position);
CREATE INDEX idx_panel_questions_panel ON public.panel_questions(panel_id, upvotes DESC, created_at);
CREATE INDEX idx_panels_starts_at ON public.panels(starts_at);

-- Helpers
CREATE OR REPLACE FUNCTION public.is_panel_organizer(_panel_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.panels WHERE id = _panel_id AND created_by = _user_id)
      OR EXISTS (SELECT 1 FROM public.panel_speakers WHERE panel_id = _panel_id AND user_id = _user_id AND role IN ('host','moderator'))
$$;

-- panels policies (public discovery)
CREATE POLICY "panels_select_all" ON public.panels FOR SELECT USING (true);
CREATE POLICY "panels_insert_auth" ON public.panels FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "panels_update_organizer" ON public.panels FOR UPDATE TO authenticated
  USING (public.is_panel_organizer(id, auth.uid())) WITH CHECK (public.is_panel_organizer(id, auth.uid()));
CREATE POLICY "panels_delete_creator" ON public.panels FOR DELETE TO authenticated USING (created_by = auth.uid());

CREATE POLICY "panel_speakers_select_all" ON public.panel_speakers FOR SELECT USING (true);
CREATE POLICY "panel_speakers_write_organizer" ON public.panel_speakers FOR ALL TO authenticated
  USING (public.is_panel_organizer(panel_id, auth.uid()))
  WITH CHECK (public.is_panel_organizer(panel_id, auth.uid()));

CREATE POLICY "panel_attendees_select_self_or_organizer" ON public.panel_attendees FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_panel_organizer(panel_id, auth.uid()));
CREATE POLICY "panel_attendees_write_self" ON public.panel_attendees FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "panel_questions_select_all" ON public.panel_questions FOR SELECT USING (true);
CREATE POLICY "panel_questions_insert_auth" ON public.panel_questions FOR INSERT TO authenticated
  WITH CHECK (asked_by = auth.uid());
CREATE POLICY "panel_questions_update_author_or_organizer" ON public.panel_questions FOR UPDATE TO authenticated
  USING (asked_by = auth.uid() OR public.is_panel_organizer(panel_id, auth.uid()))
  WITH CHECK (asked_by = auth.uid() OR public.is_panel_organizer(panel_id, auth.uid()));
CREATE POLICY "panel_questions_delete_author_or_organizer" ON public.panel_questions FOR DELETE TO authenticated
  USING (asked_by = auth.uid() OR public.is_panel_organizer(panel_id, auth.uid()));

CREATE TRIGGER trg_panels_updated_at BEFORE UPDATE ON public.panels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- BOTS
-- ============================================================
CREATE TABLE public.bots (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text,
  avatar_url    text,
  kind          public.bot_kind NOT NULL DEFAULT 'assistant',
  system_prompt text NOT NULL DEFAULT '',
  model         text NOT NULL DEFAULT 'google/gemini-3-flash-preview',
  config        jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bots TO authenticated;
GRANT ALL ON public.bots TO service_role;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.thread_bots (
  thread_id  uuid NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  bot_id     uuid NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  enabled    boolean NOT NULL DEFAULT true,
  added_by   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  added_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (thread_id, bot_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thread_bots TO authenticated;
GRANT ALL ON public.thread_bots TO service_role;
ALTER TABLE public.thread_bots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bots_select_owner_or_public" ON public.bots FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR is_public = true);
CREATE POLICY "bots_select_public_anon" ON public.bots FOR SELECT TO anon USING (is_public = true);
CREATE POLICY "bots_insert_owner" ON public.bots FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "bots_update_owner" ON public.bots FOR UPDATE TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "bots_delete_owner" ON public.bots FOR DELETE TO authenticated USING (owner_id = auth.uid());

CREATE POLICY "thread_bots_select_thread_members" ON public.thread_bots FOR SELECT TO authenticated
  USING (public.is_thread_member(thread_id, auth.uid()) OR public.is_thread_owner(thread_id, auth.uid()));
CREATE POLICY "thread_bots_write_owner" ON public.thread_bots FOR ALL TO authenticated
  USING (public.is_thread_owner(thread_id, auth.uid()))
  WITH CHECK (public.is_thread_owner(thread_id, auth.uid()) AND added_by = auth.uid());

CREATE TRIGGER trg_bots_updated_at BEFORE UPDATE ON public.bots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.thread_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.panel_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.thread_members;
