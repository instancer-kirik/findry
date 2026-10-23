CREATE OR REPLACE FUNCTION public.validate_space_tool_cutting_maintenance() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
DECLARE m jsonb; k text;
BEGIN
 m=NEW.params->'cutting_maintenance';
 IF m IS NULL THEN RETURN NEW; END IF;
 IF jsonb_typeof(m)<>'object' OR COALESCE(m->>'status','') NOT IN ('untracked','inspect','ready','sharpen','replace','ordered','out_of_service') THEN RAISE EXCEPTION 'Invalid cutting-part maintenance status'; END IF;
 FOREACH k IN ARRAY ARRAY['part','notes','replacement_url','checked_on'] LOOP
 IF m ? k AND jsonb_typeof(m->k)<>'string' THEN RAISE EXCEPTION 'Maintenance fields must be text'; END IF;
 END LOOP;
 IF length(COALESCE(m->>'part',''))>300 OR length(COALESCE(m->>'notes',''))>2000 OR length(COALESCE(m->>'replacement_url',''))>2000 THEN RAISE EXCEPTION 'Maintenance details too long'; END IF;
 IF COALESCE(m->>'replacement_url','')<>'' AND (m->>'replacement_url') !~ '^https?://[^[:space:]]+$' THEN RAISE EXCEPTION 'Replacement link must be HTTP or HTTPS'; END IF;
 IF COALESCE(m->>'checked_on','')<>'' THEN
 IF (m->>'checked_on') !~ '^\d{4}-\d{2}-\d{2}$' THEN RAISE EXCEPTION 'Invalid inspection date'; END IF;
 PERFORM (m->>'checked_on')::date;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER validate_space_tool_cutting_maintenance BEFORE INSERT OR UPDATE OF params ON public.space_tools FOR EACH ROW EXECUTE FUNCTION public.validate_space_tool_cutting_maintenance();