CREATE TABLE public.space_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place text NOT NULL DEFAULT 'Baltimore Hackerspace',
  kind text NOT NULL DEFAULT 'tool',
  category text NOT NULL DEFAULT 'General',
  name text NOT NULL,
  description text,
  details text[] NOT NULL DEFAULT '{}',
  links text[] NOT NULL DEFAULT '{}',
  location text,
  owner_name text,
  owner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  quantity text,
  training_required boolean NOT NULL DEFAULT false,
  params jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.space_tools TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.space_tools TO authenticated;
GRANT ALL ON public.space_tools TO service_role;
ALTER TABLE public.space_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view space tools" ON public.space_tools FOR SELECT USING (true);
CREATE POLICY "Admins can add space tools" ON public.space_tools FOR INSERT TO authenticated WITH CHECK (public.has_role(_role => 'admin', _user_id => auth.uid()));
CREATE POLICY "Admins can edit space tools" ON public.space_tools FOR UPDATE TO authenticated USING (public.has_role(_role => 'admin', _user_id => auth.uid()));
CREATE POLICY "Admins can delete space tools" ON public.space_tools FOR DELETE TO authenticated USING (public.has_role(_role => 'admin', _user_id => auth.uid()));
CREATE TRIGGER update_space_tools_updated_at BEFORE UPDATE ON public.space_tools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();