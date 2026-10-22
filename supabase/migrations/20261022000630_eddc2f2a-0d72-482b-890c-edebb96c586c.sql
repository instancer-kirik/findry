CREATE TABLE public.meeting_availability_polls (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organizer_id uuid NOT NULL, share_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
 title text NOT NULL, description text NOT NULL DEFAULT '', timezone text NOT NULL, slots timestamptz[] NOT NULL, duration_minutes integer NOT NULL DEFAULT 60,
 selected_start timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_availability_polls TO authenticated;
GRANT ALL ON public.meeting_availability_polls TO service_role;
ALTER TABLE public.meeting_availability_polls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organizers manage availability polls" ON public.meeting_availability_polls FOR ALL TO authenticated USING (organizer_id=auth.uid()) WITH CHECK (organizer_id=auth.uid());
CREATE TABLE public.meeting_availability_responses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), poll_id uuid NOT NULL REFERENCES public.meeting_availability_polls(id) ON DELETE CASCADE,
 name text NOT NULL, edit_key uuid NOT NULL DEFAULT gen_random_uuid(), available_slots timestamptz[] NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(poll_id,edit_key)
);
GRANT ALL ON public.meeting_availability_responses TO service_role;
ALTER TABLE public.meeting_availability_responses ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.validate_meeting_availability_poll() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF length(trim(NEW.title)) NOT BETWEEN 1 AND 160 OR length(NEW.description)>2000 OR length(NEW.timezone)>100 OR cardinality(NEW.slots) NOT BETWEEN 1 AND 672 OR NEW.duration_minutes NOT IN (30,60,90,120) THEN RAISE EXCEPTION 'Invalid poll details'; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_timezone_names WHERE name=NEW.timezone) THEN RAISE EXCEPTION 'Invalid timezone'; END IF;
 IF EXISTS(SELECT 1 FROM unnest(NEW.slots) s WHERE s IS NULL) OR (SELECT count(DISTINCT s) FROM unnest(NEW.slots) s) <> cardinality(NEW.slots) THEN RAISE EXCEPTION 'Invalid candidate times'; END IF;
 IF TG_OP='UPDATE' AND (NEW.organizer_id<>OLD.organizer_id OR NEW.share_token<>OLD.share_token OR NEW.slots<>OLD.slots OR NEW.duration_minutes<>OLD.duration_minutes) THEN RAISE EXCEPTION 'Poll candidate times cannot be changed after creation'; END IF;
 IF NEW.selected_start IS NOT NULL AND EXISTS(SELECT 1 FROM generate_series(0,NEW.duration_minutes/30-1) n WHERE NOT (NEW.selected_start+n*interval '30 minutes'=ANY(NEW.slots))) THEN RAISE EXCEPTION 'Chosen time is outside the candidate times'; END IF;
 NEW.updated_at=now(); RETURN NEW;
END $$;
CREATE TRIGGER validate_meeting_availability_poll BEFORE INSERT OR UPDATE ON public.meeting_availability_polls FOR EACH ROW EXECUTE FUNCTION public.validate_meeting_availability_poll();
CREATE OR REPLACE FUNCTION public.get_meeting_availability_poll(p_token uuid) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT jsonb_build_object('id',p.id,'title',p.title,'description',p.description,'timezone',p.timezone,'slots',p.slots,'duration_minutes',p.duration_minutes,'selected_start',p.selected_start,'organizer_id',p.organizer_id,'responses',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',r.id,'name',r.name,'available_slots',r.available_slots) ORDER BY r.created_at) FROM public.meeting_availability_responses r WHERE r.poll_id=p.id),'[]'::jsonb)) FROM public.meeting_availability_polls p WHERE p.share_token=p_token;
$$;
REVOKE ALL ON FUNCTION public.get_meeting_availability_poll(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_meeting_availability_poll(uuid) TO anon, authenticated;
CREATE OR REPLACE FUNCTION public.save_meeting_availability_response(p_token uuid,p_edit_key uuid,p_name text,p_slots timestamptz[]) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE target public.meeting_availability_polls; response_id uuid;
BEGIN
 SELECT * INTO target FROM public.meeting_availability_polls WHERE share_token=p_token FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Poll not found'; END IF;
 IF target.selected_start IS NOT NULL THEN RAISE EXCEPTION 'This poll is closed'; END IF;
 IF p_edit_key IS NULL OR p_name IS NULL OR length(trim(p_name)) NOT BETWEEN 1 AND 80 OR p_slots IS NULL OR cardinality(p_slots)>672 OR NOT (p_slots <@ target.slots) OR EXISTS(SELECT 1 FROM unnest(p_slots) s WHERE s IS NULL) THEN RAISE EXCEPTION 'Invalid availability response'; END IF;
 INSERT INTO public.meeting_availability_responses(poll_id,edit_key,name,available_slots) VALUES(target.id,p_edit_key,trim(p_name),ARRAY(SELECT DISTINCT s FROM unnest(p_slots) s ORDER BY s)) ON CONFLICT(poll_id,edit_key) DO UPDATE SET name=EXCLUDED.name, available_slots=EXCLUDED.available_slots,updated_at=now() RETURNING id INTO response_id;
 RETURN response_id;
END $$;
REVOKE ALL ON FUNCTION public.save_meeting_availability_response(uuid,uuid,text,timestamptz[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_meeting_availability_response(uuid,uuid,text,timestamptz[]) TO anon, authenticated;