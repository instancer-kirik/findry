CREATE TYPE public.game_activity AS ENUM ('tennis','dnd','racing','fighting','other');
CREATE TYPE public.game_match_status AS ENUM ('open','full','confirmed','live','completed','cancelled');
CREATE TYPE public.game_participant_role AS ENUM ('host','player','spectator','dungeon_master','referee');
CREATE TYPE public.game_participant_status AS ENUM ('joined','waitlist','declined','no_show');

CREATE TABLE public.game_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL,
  title text NOT NULL,
  activity public.game_activity NOT NULL DEFAULT 'other',
  game_title text,
  format text,
  skill_level text,
  starts_at timestamptz NOT NULL,
  duration_min integer NOT NULL DEFAULT 60,
  timezone text,
  location text,
  platform text,
  lobby_url text,
  max_players integer NOT NULL DEFAULT 2,
  status public.game_match_status NOT NULL DEFAULT 'open',
  notes text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.game_match_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.game_matches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  display_name text,
  role public.game_participant_role NOT NULL DEFAULT 'player',
  status public.game_participant_status NOT NULL DEFAULT 'joined',
  result text,
  score integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (match_id, user_id)
);

CREATE INDEX idx_game_matches_starts_at ON public.game_matches (starts_at);
CREATE INDEX idx_game_match_participants_match ON public.game_match_participants (match_id);

GRANT SELECT ON public.game_matches TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_matches TO authenticated;
GRANT ALL ON public.game_matches TO service_role;

GRANT SELECT ON public.game_match_participants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_match_participants TO authenticated;
GRANT ALL ON public.game_match_participants TO service_role;

ALTER TABLE public.game_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_match_participants ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_game_match_participant(_match_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.game_match_participants
    WHERE match_id = _match_id AND user_id = _user_id
  )
$$;

CREATE POLICY "Public matches are viewable"
ON public.game_matches FOR SELECT
USING (is_public = true OR host_id = auth.uid() OR public.is_game_match_participant(id, auth.uid()));

CREATE POLICY "Users can create matches"
ON public.game_matches FOR INSERT TO authenticated
WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can update their matches"
ON public.game_matches FOR UPDATE TO authenticated
USING (host_id = auth.uid()) WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can delete their matches"
ON public.game_matches FOR DELETE TO authenticated
USING (host_id = auth.uid());

CREATE POLICY "Participants of visible matches are viewable"
ON public.game_match_participants FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.game_matches m
  WHERE m.id = match_id
    AND (m.is_public = true OR m.host_id = auth.uid() OR public.is_game_match_participant(m.id, auth.uid()))
));

CREATE POLICY "Users can join matches"
ON public.game_match_participants FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own participation, hosts update any"
ON public.game_match_participants FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.game_matches m WHERE m.id = match_id AND m.host_id = auth.uid()))
WITH CHECK (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.game_matches m WHERE m.id = match_id AND m.host_id = auth.uid()));

CREATE POLICY "Users leave, hosts remove"
ON public.game_match_participants FOR DELETE TO authenticated
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.game_matches m WHERE m.id = match_id AND m.host_id = auth.uid()));

CREATE TRIGGER update_game_matches_updated_at BEFORE UPDATE ON public.game_matches
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_game_match_participants_updated_at BEFORE UPDATE ON public.game_match_participants
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();