DO $$
DECLARE
  default_owner UUID := '2603d9b1-82cb-4ced-99a3-ce194b30c7c7';
BEGIN
  ALTER TABLE public.development_projects
    ADD COLUMN IF NOT EXISTS owner_id UUID,
    ADD COLUMN IF NOT EXISTS created_by UUID,
    ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;
  UPDATE public.development_projects SET owner_id = default_owner WHERE owner_id IS NULL;
  UPDATE public.development_projects SET created_by = default_owner WHERE created_by IS NULL;

  ALTER TABLE public.product_ideas
    ADD COLUMN IF NOT EXISTS owner_id UUID,
    ADD COLUMN IF NOT EXISTS created_by UUID,
    ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;
  UPDATE public.product_ideas SET owner_id = default_owner WHERE owner_id IS NULL;
  UPDATE public.product_ideas SET created_by = default_owner WHERE created_by IS NULL;

  ALTER TABLE public.loreum_creative_works
    ADD COLUMN IF NOT EXISTS owner_id UUID,
    ADD COLUMN IF NOT EXISTS created_by UUID;
  UPDATE public.loreum_creative_works SET owner_id = default_owner WHERE owner_id IS NULL;
  UPDATE public.loreum_creative_works SET created_by = default_owner WHERE created_by IS NULL;
  UPDATE public.loreum_creative_works SET is_public = true WHERE is_public IS NULL;

  ALTER TABLE public.vehicle_configurations
    ADD COLUMN IF NOT EXISTS owner_id UUID,
    ADD COLUMN IF NOT EXISTS created_by UUID,
    ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;
  UPDATE public.vehicle_configurations SET owner_id = default_owner WHERE owner_id IS NULL;
  UPDATE public.vehicle_configurations SET created_by = default_owner WHERE created_by IS NULL;

  ALTER TABLE public.video_projects
    ADD COLUMN IF NOT EXISTS owner_id UUID,
    ADD COLUMN IF NOT EXISTS created_by UUID,
    ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;
  UPDATE public.video_projects SET owner_id = default_owner WHERE owner_id IS NULL;
  UPDATE public.video_projects SET created_by = default_owner WHERE created_by IS NULL;

  ALTER TABLE public.projects_catalog
    ADD COLUMN IF NOT EXISTS owner_id UUID,
    ADD COLUMN IF NOT EXISTS created_by UUID,
    ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;
  UPDATE public.projects_catalog SET owner_id = default_owner WHERE owner_id IS NULL;
  UPDATE public.projects_catalog SET created_by = default_owner WHERE created_by IS NULL;
END $$;

DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'development_projects','product_ideas','loreum_creative_works',
    'vehicle_configurations','video_projects','projects_catalog'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_public_read" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "%s_public_read" ON public.%I FOR SELECT USING (is_public = true OR auth.uid() = owner_id)', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_owner_write" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "%s_owner_write" ON public.%I FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id)', t, t);
  END LOOP;
END $$;

DROP VIEW IF EXISTS public.unified_projects CASCADE;

CREATE VIEW public.unified_projects AS
SELECT
  pc.id, pc.name, pc.description,
  COALESCE(pc.domain, 'Showcase'::text) AS domain,
  pc.status,
  COALESCE(pc.tech_stack, ARRAY[]::text[]) AS tech_stack,
  COALESCE(pc.features, ARRAY[]::text[]) AS features,
  pc.source_url, pc.emoji, pc.featured, pc.featured_order, pc.project_type,
  'catalog'::text AS source_table,
  pc.created_at, pc.updated_at,
  dp.id AS dev_project_id, dp.version AS dev_version,
  dp.progress AS dev_progress, dp.repo_url AS dev_repo_url,
  pi.id AS idea_id, pi.category_id AS idea_category_id,
  pi.target_market, pi.problem_statement, pi.solution_approach,
  pi.feasibility_score, pi.market_potential_score, pi.priority_score,
  cat.name AS category_name, cat.icon_name AS category_icon, cat.color AS category_color,
  pc.owner_id, pc.created_by, pc.is_public,
  NULL::text AS image_url, NULL::jsonb AS metadata,
  pc.path
FROM projects_catalog pc
LEFT JOIN development_projects dp ON pc.dev_project_id = dp.id
LEFT JOIN product_ideas pi ON pc.product_idea_id = pi.id
LEFT JOIN product_categories cat ON pi.category_id = cat.id

UNION ALL

SELECT dp.id, dp.name, dp.description, 'Development'::text, dp.status,
  ARRAY[]::text[], ARRAY[]::text[], dp.repo_url, '🛠️'::text, false, 0,
  'development'::text, 'development_projects'::text, dp.created_at, dp.updated_at,
  dp.id, dp.version, dp.progress, dp.repo_url,
  NULL::uuid, NULL::uuid, NULL::text, NULL::text, NULL::text,
  NULL::integer, NULL::integer, NULL::integer,
  NULL::character varying, NULL::character varying, NULL::character varying,
  dp.owner_id, dp.created_by, dp.is_public,
  NULL::text, NULL::jsonb,
  ('/projects/' || dp.id::text)::text
FROM development_projects dp
WHERE NOT EXISTS (SELECT 1 FROM projects_catalog pc WHERE pc.dev_project_id = dp.id)

UNION ALL

SELECT pi.id, pi.name, pi.description, 'Product Ideas'::text, pi.status,
  COALESCE(pi.tags, ARRAY[]::text[]), ARRAY[]::text[],
  NULL::text, '💡'::text, false, 0,
  'idea'::text, 'product_ideas'::text, pi.created_at, pi.updated_at,
  NULL::uuid, NULL::text, NULL::integer, NULL::text,
  pi.id, pi.category_id, pi.target_market, pi.problem_statement, pi.solution_approach,
  pi.feasibility_score, pi.market_potential_score, pi.priority_score,
  cat.name, cat.icon_name, cat.color,
  pi.owner_id, pi.created_by, pi.is_public,
  NULL::text, NULL::jsonb,
  ('/projects/' || pi.id::text)::text
FROM product_ideas pi
LEFT JOIN product_categories cat ON pi.category_id = cat.id
WHERE NOT EXISTS (SELECT 1 FROM projects_catalog pc WHERE pc.product_idea_id = pi.id)

UNION ALL

SELECT p.id, p.name, p.description,
  COALESCE(p.category::text, 'General'::text), p.status,
  COALESCE(p.tags, ARRAY[]::text[]), ARRAY[]::text[],
  p.repo_url, '📁'::text, COALESCE(p.featured, false), 0,
  'project'::text, 'projects'::text, p.created_at, p.updated_at,
  NULL::uuid, NULL::text, NULL::integer, NULL::text,
  NULL::uuid, NULL::uuid, NULL::text, NULL::text, NULL::text,
  NULL::integer, NULL::integer, NULL::integer,
  NULL::character varying, NULL::character varying, NULL::character varying,
  p.owner_id, p.created_by, p.is_public,
  p.image_url, NULL::jsonb,
  ('/projects/' || p.id::text)::text
FROM projects p

UNION ALL

SELECT lcw.id, lcw.title, lcw.description,
  COALESCE(lcw.genre, 'Creative')::text, COALESCE(lcw.status, 'draft')::text,
  COALESCE(lcw.tags, ARRAY[]::text[]), ARRAY[]::text[],
  NULL::text, '✍️'::text, false, 0,
  lcw.creative_type, 'loreum_creative_works'::text, lcw.created_at, lcw.updated_at,
  NULL::uuid, NULL::text, NULL::integer, NULL::text,
  NULL::uuid, NULL::uuid, NULL::text, NULL::text, NULL::text,
  NULL::integer, NULL::integer, NULL::integer,
  NULL::character varying, NULL::character varying, NULL::character varying,
  lcw.owner_id, lcw.created_by, COALESCE(lcw.is_public, true),
  NULL::text, NULL::jsonb,
  ('/lyrics?id=' || lcw.id::text)::text
FROM loreum_creative_works lcw
WHERE lcw.parent_work_id IS NULL

UNION ALL

SELECT vc.id,
  COALESCE(vc.project_name, TRIM(CONCAT_WS(' ', vc.vehicle_year::text, vc.vehicle_make, vc.vehicle_model)), 'Vehicle Build')::text,
  NULL::text,
  'Vehicle'::text,
  'planning'::text,
  ARRAY[]::text[], ARRAY[]::text[],
  NULL::text, '🚐'::text, false, 0,
  'vehicle'::text, 'vehicle_configurations'::text,
  vc.created_at, vc.updated_at,
  NULL::uuid, NULL::text, NULL::integer, NULL::text,
  NULL::uuid, NULL::uuid, NULL::text, NULL::text, NULL::text,
  NULL::integer, NULL::integer, NULL::integer,
  NULL::character varying, NULL::character varying, NULL::character varying,
  vc.owner_id, vc.created_by, vc.is_public,
  NULL::text, NULL::jsonb,
  ('/vehicle-build?id=' || vc.id::text)::text
FROM vehicle_configurations vc

UNION ALL

SELECT vp.id, COALESCE(vp.name, 'Video Project')::text, vp.description,
  'Video'::text, COALESCE(vp.status, 'draft')::text,
  ARRAY[]::text[], ARRAY[]::text[],
  NULL::text, '🎬'::text, false, 0,
  'video'::text, 'video_projects'::text,
  vp.created_at, vp.updated_at,
  NULL::uuid, NULL::text, NULL::integer, NULL::text,
  NULL::uuid, NULL::uuid, NULL::text, NULL::text, NULL::text,
  NULL::integer, NULL::integer, NULL::integer,
  NULL::character varying, NULL::character varying, NULL::character varying,
  vp.owner_id, vp.created_by, vp.is_public,
  NULL::text, NULL::jsonb,
  ('/projects/' || vp.id::text)::text
FROM video_projects vp;

GRANT SELECT ON public.unified_projects TO anon, authenticated;