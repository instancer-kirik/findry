ALTER TABLE public.floorplan_items ADD COLUMN IF NOT EXISTS level integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.floorplan_layouts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  floorplan_id uuid NOT NULL REFERENCES public.venue_floorplans(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  snapshot jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_default boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_floorplan_layouts_plan ON public.floorplan_layouts(floorplan_id);

GRANT SELECT ON public.floorplan_layouts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.floorplan_layouts TO authenticated;
GRANT ALL ON public.floorplan_layouts TO service_role;

ALTER TABLE public.floorplan_layouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public floorplan layouts are viewable"
ON public.floorplan_layouts FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.venue_floorplans p
  WHERE p.id = floorplan_layouts.floorplan_id
    AND (p.is_public = true OR p.created_by = auth.uid())
));

CREATE POLICY "Owners can insert floorplan layouts"
ON public.floorplan_layouts FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.venue_floorplans p
  WHERE p.id = floorplan_layouts.floorplan_id AND p.created_by = auth.uid()
));

CREATE POLICY "Owners can update floorplan layouts"
ON public.floorplan_layouts FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.venue_floorplans p
  WHERE p.id = floorplan_layouts.floorplan_id AND p.created_by = auth.uid()
));

CREATE POLICY "Owners can delete floorplan layouts"
ON public.floorplan_layouts FOR DELETE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.venue_floorplans p
  WHERE p.id = floorplan_layouts.floorplan_id AND p.created_by = auth.uid()
));

CREATE TRIGGER update_floorplan_layouts_updated_at
BEFORE UPDATE ON public.floorplan_layouts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();