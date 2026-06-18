
-- Enums
CREATE TYPE public.floorplan_claim_mode AS ENUM ('organizer','open','hybrid');
CREATE TYPE public.floorplan_item_kind AS ENUM ('booth','table','wall','pedestal','stage','seating','tent','truck','path','entrance','power','signage','misc');
CREATE TYPE public.floorplan_assignment_status AS ENUM ('assigned','pending_claim','confirmed','declined');

-- venue_floorplans
CREATE TABLE public.venue_floorplans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  canvas JSONB NOT NULL DEFAULT '{"width":1000,"height":600,"units":"ft","background":null}'::jsonb,
  claim_mode public.floorplan_claim_mode NOT NULL DEFAULT 'organizer',
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.venue_floorplans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.venue_floorplans TO authenticated;
GRANT ALL ON public.venue_floorplans TO service_role;
ALTER TABLE public.venue_floorplans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view public floorplans" ON public.venue_floorplans
  FOR SELECT USING (is_public OR created_by = auth.uid());
CREATE POLICY "creator inserts floorplan" ON public.venue_floorplans
  FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "creator updates floorplan" ON public.venue_floorplans
  FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "creator deletes floorplan" ON public.venue_floorplans
  FOR DELETE USING (created_by = auth.uid());

CREATE TRIGGER trg_venue_floorplans_updated
  BEFORE UPDATE ON public.venue_floorplans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- floorplan_items
CREATE TABLE public.floorplan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floorplan_id UUID NOT NULL REFERENCES public.venue_floorplans(id) ON DELETE CASCADE,
  kind public.floorplan_item_kind NOT NULL,
  label TEXT,
  x NUMERIC NOT NULL DEFAULT 0,
  y NUMERIC NOT NULL DEFAULT 0,
  w NUMERIC NOT NULL DEFAULT 40,
  h NUMERIC NOT NULL DEFAULT 40,
  rotation NUMERIC NOT NULL DEFAULT 0,
  z NUMERIC NOT NULL DEFAULT 30,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_floorplan_items_plan ON public.floorplan_items(floorplan_id);

GRANT SELECT ON public.floorplan_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.floorplan_items TO authenticated;
GRANT ALL ON public.floorplan_items TO service_role;
ALTER TABLE public.floorplan_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view items of visible floorplans" ON public.floorplan_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.venue_floorplans f WHERE f.id = floorplan_id AND (f.is_public OR f.created_by = auth.uid()))
  );
CREATE POLICY "creator writes items" ON public.floorplan_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.venue_floorplans f WHERE f.id = floorplan_id AND f.created_by = auth.uid())
  );
CREATE POLICY "creator updates items" ON public.floorplan_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.venue_floorplans f WHERE f.id = floorplan_id AND f.created_by = auth.uid())
  );
CREATE POLICY "creator deletes items" ON public.floorplan_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.venue_floorplans f WHERE f.id = floorplan_id AND f.created_by = auth.uid())
  );

CREATE TRIGGER trg_floorplan_items_updated
  BEFORE UPDATE ON public.floorplan_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- floorplan_assignments
CREATE TABLE public.floorplan_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.floorplan_items(id) ON DELETE CASCADE,
  status public.floorplan_assignment_status NOT NULL DEFAULT 'assigned',
  assigned_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  project_id UUID,
  panel_id UUID REFERENCES public.panels(id) ON DELETE SET NULL,
  ugc_id UUID REFERENCES public.ugc_content(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_floorplan_assignments_item ON public.floorplan_assignments(item_id);

GRANT SELECT ON public.floorplan_assignments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.floorplan_assignments TO authenticated;
GRANT ALL ON public.floorplan_assignments TO service_role;
ALTER TABLE public.floorplan_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view assignments of visible floorplans" ON public.floorplan_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.floorplan_items i
      JOIN public.venue_floorplans f ON f.id = i.floorplan_id
      WHERE i.id = item_id AND (f.is_public OR f.created_by = auth.uid())
    )
  );
CREATE POLICY "creator inserts assignment" ON public.floorplan_assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.floorplan_items i
      JOIN public.venue_floorplans f ON f.id = i.floorplan_id
      WHERE i.id = item_id AND f.created_by = auth.uid()
    )
  );
CREATE POLICY "self claim open spot" ON public.floorplan_assignments
  FOR INSERT WITH CHECK (
    status = 'pending_claim'
    AND assigned_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.floorplan_items i
      JOIN public.venue_floorplans f ON f.id = i.floorplan_id
      WHERE i.id = item_id AND f.claim_mode IN ('open','hybrid') AND f.is_public
    )
  );
CREATE POLICY "creator updates assignment" ON public.floorplan_assignments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.floorplan_items i
      JOIN public.venue_floorplans f ON f.id = i.floorplan_id
      WHERE i.id = item_id AND f.created_by = auth.uid()
    )
  );
CREATE POLICY "claimant cancels own pending" ON public.floorplan_assignments
  FOR DELETE USING (assigned_user_id = auth.uid() AND status = 'pending_claim');
CREATE POLICY "creator deletes assignment" ON public.floorplan_assignments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.floorplan_items i
      JOIN public.venue_floorplans f ON f.id = i.floorplan_id
      WHERE i.id = item_id AND f.created_by = auth.uid()
    )
  );

CREATE TRIGGER trg_floorplan_assignments_updated
  BEFORE UPDATE ON public.floorplan_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.venue_floorplans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.floorplan_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.floorplan_assignments;
ALTER TABLE public.venue_floorplans REPLICA IDENTITY FULL;
ALTER TABLE public.floorplan_items REPLICA IDENTITY FULL;
ALTER TABLE public.floorplan_assignments REPLICA IDENTITY FULL;
