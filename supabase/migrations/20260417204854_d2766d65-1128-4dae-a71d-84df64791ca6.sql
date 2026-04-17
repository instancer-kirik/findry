
ALTER TABLE public.content_ownership
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'owner'
  CHECK (role IN ('owner', 'editor', 'viewer', 'collaborator'));

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_ownership_unique_role') THEN
    ALTER TABLE public.content_ownership
      ADD CONSTRAINT content_ownership_unique_role
      UNIQUE (content_id, content_type, owner_id, role);
  END IF;
END $$;

INSERT INTO public.content_ownership (content_id, content_type, owner_id, role)
SELECT id, 'project'::content_type, COALESCE(owner_id, created_by), 'owner'
FROM public.projects WHERE COALESCE(owner_id, created_by) IS NOT NULL
ON CONFLICT (content_id, content_type, owner_id, role) DO NOTHING;

INSERT INTO public.content_ownership (content_id, content_type, owner_id, role)
SELECT id, 'development_project'::content_type, COALESCE(owner_id, created_by), 'owner'
FROM public.development_projects WHERE COALESCE(owner_id, created_by) IS NOT NULL
ON CONFLICT (content_id, content_type, owner_id, role) DO NOTHING;

INSERT INTO public.content_ownership (content_id, content_type, owner_id, role)
SELECT id, 'product_idea'::content_type, COALESCE(owner_id, created_by), 'owner'
FROM public.product_ideas WHERE COALESCE(owner_id, created_by) IS NOT NULL
ON CONFLICT (content_id, content_type, owner_id, role) DO NOTHING;

INSERT INTO public.content_ownership (content_id, content_type, owner_id, role)
SELECT id, 'loreum_work'::content_type, owner_id, 'owner'
FROM public.loreum_creative_works WHERE owner_id IS NOT NULL
ON CONFLICT (content_id, content_type, owner_id, role) DO NOTHING;

INSERT INTO public.content_ownership (content_id, content_type, owner_id, role)
SELECT id, 'vehicle_config'::content_type, COALESCE(owner_id, created_by), 'owner'
FROM public.vehicle_configurations WHERE COALESCE(owner_id, created_by) IS NOT NULL
ON CONFLICT (content_id, content_type, owner_id, role) DO NOTHING;

INSERT INTO public.content_ownership (content_id, content_type, owner_id, role)
SELECT id, 'video_project'::content_type, COALESCE(owner_id, created_by), 'owner'
FROM public.video_projects WHERE COALESCE(owner_id, created_by) IS NOT NULL
ON CONFLICT (content_id, content_type, owner_id, role) DO NOTHING;

INSERT INTO public.content_ownership (content_id, content_type, owner_id, role)
SELECT id, 'catalog_entry'::content_type, COALESCE(owner_id, created_by), 'owner'
FROM public.projects_catalog WHERE COALESCE(owner_id, created_by) IS NOT NULL
ON CONFLICT (content_id, content_type, owner_id, role) DO NOTHING;

ALTER TABLE public.content_ownership ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view ownership" ON public.content_ownership;
CREATE POLICY "Anyone can view ownership" ON public.content_ownership FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can claim their own ownership" ON public.content_ownership;
CREATE POLICY "Users can claim their own ownership" ON public.content_ownership FOR INSERT WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "Owners can update their ownership" ON public.content_ownership;
CREATE POLICY "Owners can update their ownership" ON public.content_ownership FOR UPDATE USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "Owners can revoke their ownership" ON public.content_ownership;
CREATE POLICY "Owners can revoke their ownership" ON public.content_ownership FOR DELETE USING (auth.uid() = owner_id);

CREATE OR REPLACE FUNCTION public.is_my_content(_content_id uuid, _content_type content_type, _user_id uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.content_ownership WHERE content_id = _content_id AND content_type = _content_type AND owner_id = _user_id);
$$;

DROP VIEW IF EXISTS public.unified_projects CASCADE;

CREATE VIEW public.unified_projects WITH (security_invoker = on) AS
WITH owners_agg AS (
  SELECT content_id, content_type::text AS ctype, array_agg(DISTINCT owner_id) AS owner_ids
  FROM public.content_ownership GROUP BY content_id, content_type
)
SELECT
  p.id, p.name, p.description, ('/projects/' || p.id::text) AS path,
  NULL::text AS domain, p.status, p.tags AS tech_stack, NULL::text[] AS features,
  NULL::text AS source_url, NULL::text AS emoji, COALESCE(p.featured, false) AS featured,
  'project'::text AS project_type, 'projects'::text AS source_table, p.created_at,
  NULL::uuid AS dev_project_id, p.progress AS dev_progress, NULL::text AS dev_repo_url,
  NULL::text AS category_name, p.owner_id, p.created_by,
  COALESCE(p.is_public, false) AS is_public, COALESCE(o.owner_ids, ARRAY[]::uuid[]) AS owner_ids
FROM public.projects p
LEFT JOIN owners_agg o ON o.content_id = p.id AND o.ctype = 'project'

UNION ALL

SELECT dp.id, dp.name, dp.description, ('/projects/' || dp.id::text),
  NULL::text, dp.status, NULL::text[], NULL::text[],
  dp.repo_url, NULL::text, false,
  'development'::text, 'development_projects'::text, dp.created_at,
  dp.id, dp.progress, dp.repo_url,
  NULL::text, dp.owner_id, dp.created_by,
  COALESCE(dp.is_public, false), COALESCE(o.owner_ids, ARRAY[]::uuid[])
FROM public.development_projects dp
LEFT JOIN owners_agg o ON o.content_id = dp.id AND o.ctype = 'development_project'

UNION ALL

SELECT pi.id, pi.name::text, pi.description, ('/projects/' || pi.id::text),
  'product_idea'::text, COALESCE(pi.status::text, 'idea'), pi.tags, NULL::text[],
  NULL::text, NULL::text, false,
  'product_idea'::text, 'product_ideas'::text, pi.created_at,
  NULL::uuid, NULL::integer, NULL::text,
  NULL::text, pi.owner_id, pi.created_by,
  COALESCE(pi.is_public, false), COALESCE(o.owner_ids, ARRAY[]::uuid[])
FROM public.product_ideas pi
LEFT JOIN owners_agg o ON o.content_id = pi.id AND o.ctype = 'product_idea'

UNION ALL

SELECT lcw.id, lcw.title, lcw.description, ('/lyrics?id=' || lcw.id::text),
  lcw.creative_type, COALESCE(lcw.status, 'in_progress'),
  lcw.tags, NULL::text[], NULL::text,
  NULL::text, false, 'creative_work'::text,
  'loreum_creative_works'::text, lcw.created_at,
  NULL::uuid, NULL::integer, NULL::text,
  lcw.creative_type, lcw.owner_id, NULL::uuid,
  COALESCE(lcw.is_public, false), COALESCE(o.owner_ids, ARRAY[]::uuid[])
FROM public.loreum_creative_works lcw
LEFT JOIN owners_agg o ON o.content_id = lcw.id AND o.ctype = 'loreum_work'

UNION ALL

SELECT vc.id, vc.project_name,
  (vc.vehicle_year::text || ' ' || COALESCE(vc.vehicle_make,'') || ' ' || COALESCE(vc.vehicle_model,''))::text,
  '/vehicle-build'::text,
  'automotive'::text, 'active'::text, NULL::text[],
  NULL::text[], NULL::text, '🚐'::text,
  false, 'vehicle_build'::text, 'vehicle_configurations'::text,
  vc.created_at, NULL::uuid, NULL::integer,
  NULL::text, 'Vehicle Build'::text,
  vc.owner_id, vc.created_by, COALESCE(vc.is_public, false),
  COALESCE(o.owner_ids, ARRAY[]::uuid[])
FROM public.vehicle_configurations vc
LEFT JOIN owners_agg o ON o.content_id = vc.id AND o.ctype = 'vehicle_config'

UNION ALL

SELECT vp.id, vp.name, vp.description, ('/projects/' || vp.id::text),
  'video'::text, COALESCE(vp.status, 'active'),
  NULL::text[], NULL::text[], NULL::text,
  '🎬'::text, false, 'video'::text,
  'video_projects'::text, vp.created_at,
  NULL::uuid, NULL::integer, NULL::text,
  'Video Project'::text, vp.owner_id, vp.created_by,
  COALESCE(vp.is_public, false), COALESCE(o.owner_ids, ARRAY[]::uuid[])
FROM public.video_projects vp
LEFT JOIN owners_agg o ON o.content_id = vp.id AND o.ctype = 'video_project'

UNION ALL

SELECT pc.id, pc.name, pc.description, COALESCE(pc.path, '/projects/' || pc.id::text),
  pc.domain, COALESCE(pc.status, 'active'), pc.tech_stack, pc.features,
  pc.source_url, pc.emoji, COALESCE(pc.featured, false),
  COALESCE(pc.project_type, 'catalog'), 'catalog'::text,
  pc.created_at, pc.dev_project_id, NULL::integer,
  NULL::text, NULL::text, pc.owner_id, pc.created_by,
  COALESCE(pc.is_public, true), COALESCE(o.owner_ids, ARRAY[]::uuid[])
FROM public.projects_catalog pc
LEFT JOIN owners_agg o ON o.content_id = pc.id AND o.ctype = 'catalog_entry';
