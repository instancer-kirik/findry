-- The issue was with using non-UUID values for UUID columns - let's use proper UUIDs

-- First check if the projects table already exists and what columns it has
SELECT column_name FROM information_schema.columns WHERE table_name = 'projects' AND table_schema = 'public';

-- Add missing columns to the projects table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='status' AND table_schema='public') THEN
        ALTER TABLE public.projects ADD COLUMN status TEXT;
    END IF;

    IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='version' AND table_schema='public') THEN
        ALTER TABLE public.projects ADD COLUMN version TEXT;
    END IF;

    IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='repo_url' AND table_schema='public') THEN
        ALTER TABLE public.projects ADD COLUMN repo_url TEXT;
    END IF;

    IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='progress' AND table_schema='public') THEN
        ALTER TABLE public.projects ADD COLUMN progress INTEGER;
    END IF;
END$$;

-- Insert demo data for projects with proper UUID format
INSERT INTO public.projects (id, name, description, status, version, repo_url, progress, tags)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Findry Platform Core', 'The main platform for creative ecosystem connections', 'development', '0.5.0', 'https://github.com/user/findry', 65, ARRAY['core', 'platform', 'features']),
  ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Creator Marketplace', 'Buy and sell creative services and products', 'planning', '0.1.0', NULL, 20, ARRAY['marketplace', 'e-commerce', 'creators']),
  ('5a7b8c9d-0e1f-2345-6789-012345678901', 'Meta Project Tracker', 'Track development projects and their components', 'released', '1.0.0', 'https://github.com/meta-projects/tracker', 100, ARRAY['meta', 'tracker', 'project-management']),
  ('7b8c9d0e-1f23-4567-8901-234567890123', 'Components Library', 'Reusable UI components for multiple projects', 'maintenance', '2.3.1', 'https://github.com/components/library', 95, ARRAY['ui', 'components', 'design-system']),
  ('9d0e1f23-4567-8901-2345-67890123456a', 'Artist Platform', 'Platform for artists to showcase their work', 'testing', '0.9.0', 'https://github.com/artist/platform', 85, ARRAY['artists', 'portfolio', 'creative'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  version = EXCLUDED.version,
  repo_url = EXCLUDED.repo_url,
  progress = EXCLUDED.progress,
  tags = EXCLUDED.tags;

-- Insert demo data for project components with proper UUIDs
INSERT INTO public.project_components (id, project_id, name, description, status, type, dependencies)
VALUES
  -- Findry Platform Core components
  ('c3d4e5f6-a7b8-9012-cdef-345678901234', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'User Authentication', 'Login, signup and profile management', 'ready', 'feature', ARRAY[]::TEXT[]),
  ('d4e5f6a7-b8c9-0123-def0-456789012345', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Discovery Engine', 'AI-powered content and collaboration discovery', 'in-development', 'feature', ARRAY[]::TEXT[]),
  ('e5f6a7b8-c9d0-1234-ef01-567890123456', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Event Management', 'Create and manage events with bookings', 'in-development', 'feature', ARRAY[]::TEXT[]),
  ('f6a7b8c9-d0e1-2345-f012-678901234567', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Venue Profiles', 'Venue management and bookings', 'in-development', 'page', ARRAY[]::TEXT[]),

   -- Creator Marketplace tasks (Note: These seem like components, not tasks based on the original schema structure? Adjust if needed)
  ('b4c5d6e7-f8a9-0123-ab17-456789012345', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Design product detail page', 'Create UI for product details', 'completed', 'medium', ARRAY['Jamie']::TEXT[]), -- Assuming 'dependencies' field holds assigned_to temporarily?
  ('c5d6e7f8-a9b0-1234-ab18-567890123456', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Implement shopping cart', 'Build cart functionality with state management', 'not-started', 'high', ARRAY['Taylor']::TEXT[]), -- Assuming 'dependencies' field holds assigned_to temporarily?

  -- Meta Project Tracker tasks (Note: These seem like components, not tasks based on the original schema structure? Adjust if needed)
  ('d6e7f8a9-b0c1-2345-ab19-678901234567', '5a7b8c9d-0e1f-2345-6789-012345678901', 'Add filtering system', 'Implement project filtering by status and tags', 'completed', 'medium', ARRAY['Jordan']::TEXT[]), -- Assuming 'dependencies' field holds assigned_to temporarily?
  ('e7f8a9b0-c1d2-3456-ab20-789012345678', '5a7b8c9d-0e1f-2345-6789-012345678901', 'Improve task detail view', 'Add more information to task cards', 'completed', 'low', ARRAY['Casey']::TEXT[]), -- Assuming 'dependencies' field holds assigned_to temporarily?
  ('f8a9b0c1-d2e3-4567-ab21-890123456789', '5a7b8c9d-0e1f-2345-6789-012345678901', 'Fix mobile navigation', 'Navigation is broken on small devices', 'completed', 'high', ARRAY['Riley']::TEXT[]), -- Assuming 'dependencies' field holds assigned_to temporarily?

  -- Components Library tasks (Note: These seem like components, not tasks based on the original schema structure? Adjust if needed)
  ('a9b0c1d2-e3f4-5678-ab22-901234567890', '7b8c9d0e-1f23-4567-8901-234567890123', 'Update button design', 'Implement new design system for buttons', 'completed', 'medium', ARRAY['Morgan']::TEXT[]), -- Assuming 'dependencies' field holds assigned_to temporarily?
  ('b0c1d2e3-f4a5-6789-ab23-012345678901', '7b8c9d0e-1f23-4567-8901-234567890123', 'Accessibility improvements', 'Ensure all components meet WCAG standards', 'in-progress', 'high', ARRAY['Taylor']::TEXT[]), -- Assuming 'dependencies' field holds assigned_to temporarily?
  ('c1d2e3f4-a5b6-7890-ab24-123456789012', '7b8c9d0e-1f23-4567-8901-234567890123', 'Add dark mode support', 'Implement dark mode variants for all components', 'blocked', 'medium', ARRAY['Jordan']::TEXT[]), -- Assuming 'dependencies' field holds assigned_to temporarily?

  -- Artist Platform components
  ('d6e7f8a9-b0c1-2345-ab07-678901234567', '9d0e1f23-4567-8901-2345-67890123456a', 'Artist Profiles', 'Artist profile creation and management', 'ready', 'page', ARRAY[]::TEXT[]),
  ('e7f8a9b0-c1d2-3456-ab08-789012345678', '9d0e1f23-4567-8901-2345-67890123456a', 'Portfolio Gallery', 'Artwork display system', 'in-development', 'feature', ARRAY[]::TEXT[]),
  ('f8a9b0c1-d2e3-4567-ab09-890123456789', '9d0e1f23-4567-8901-2345-67890123456a', 'Commission System', 'Request and manage art commissions', 'planned', 'feature', ARRAY[]::TEXT[])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  type = EXCLUDED.type,
  dependencies = EXCLUDED.dependencies;

-- Insert demo data for development tasks with proper UUIDs and user IDs fetched via email subquery
-- !!! IMPORTANT: Replace placeholder emails like 'sarah@example.com' with actual emails from your auth.users table !!!
INSERT INTO public.project_tasks (id, project_id, title, description, status, priority, assigned_to)
VALUES
  -- Findry Platform Core tasks
  ('d0e1f2a3-b4c5-6789-ab10-012345678901', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fix time-picker component', 'Create missing time-picker component causing errors', 'completed', 'high', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')), 
  ('e1f2a3b4-c5d6-7890-ab11-123456789012', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Improve venue detail page', 'Add user-generated content section to venue pages', 'completed', 'medium', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')), 
  ('f2a3b4c5-d6e7-8901-ab12-234567890123', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Implement calendar integration', 'Connect event bookings with external calendar providers', 'in-progress', 'medium', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')), 
  ('a3b4c5d6-e7f8-9012-ab13-345678901234', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fix payment gateway', 'Resolve issues with payment processing', 'not-started', 'high', NULL), -- No assignee

  -- Creator Marketplace tasks
  ('b4c5d6e7-f8a9-0123-ab14-456789012345', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Design product detail page', 'Create UI for product details', 'completed', 'medium', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')), -- Using provided email
  ('c5d6e7f8-a9b0-1234-ab15-567890123456', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Implement shopping cart', 'Build cart functionality with state management', 'not-started', 'high', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')), 

  -- Meta Project Tracker tasks
  ('d6e7f8a9-b0c1-2345-ab16-678901234567', '5a7b8c9d-0e1f-2345-6789-012345678901', 'Add filtering system', 'Implement project filtering by status and tags', 'completed', 'medium', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')), 
  ('e7f8a9b0-c1d2-3456-ab17-789012345678', '5a7b8c9d-0e1f-2345-6789-012345678901', 'Improve task detail view', 'Add more information to task cards', 'completed', 'low', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')), 
  ('f8a9b0c1-d2e3-4567-ab18-890123456789', '5a7b8c9d-0e1f-2345-6789-012345678901', 'Fix mobile navigation', 'Navigation is broken on small devices', 'completed', 'high', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')), 

  -- Components Library tasks
  ('a9b0c1d2-e3f4-5678-ab19-901234567890', '7b8c9d0e-1f23-4567-8901-234567890123', 'Update button design', 'Implement new design system for buttons', 'completed', 'medium', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')), 
  ('b0c1d2e3-f4a5-6789-ab20-012345678901', '7b8c9d0e-1f23-4567-8901-234567890123', 'Accessibility improvements', 'Ensure all components meet WCAG standards', 'in-progress', 'high', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')),  --(Note: same name as another task)
  ('c1d2e3f4-a5b6-7890-ab21-123456789012', '7b8c9d0e-1f23-4567-8901-234567890123', 'Add dark mode support', 'Implement dark mode variants for all components', 'blocked', 'medium', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')),  --(Note: same name as another task)

  -- Artist Platform tasks
  ('d2e3f4a5-b6c7-8901-ab22-234567890123', '9d0e1f23-4567-8901-2345-67890123456a', 'Implement image upload', 'Add ability to upload and crop artwork images', 'completed', 'high', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')), 
  ('e3f4a5b6-c7d8-9012-ab23-345678901234', '9d0e1f23-4567-8901-2345-67890123456a', 'Build commission request form', 'Create the form for requesting commissions', 'in-progress', 'medium', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')), 
  ('f4a5b6c7-d8e9-0123-ab24-456789012345', '9d0e1f23-4567-8901-2345-67890123456a', 'Setup payment processing', 'Integrate with payment provider for artist payments', 'not-started', 'high', (SELECT id FROM auth.users WHERE email = 'kirik@instance.select')) 
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  priority = EXCLUDED.priority,
  assigned_to = EXCLUDED.assigned_to;

-- Update the content_ownership for demo projects
-- This assigns all demo projects to the *first* user found in auth.users.
-- You might want to adjust this logic if projects should have different owners.
INSERT INTO public.content_ownership (content_id, content_type, owner_id)
SELECT
  id,
  'project',
  (SELECT id FROM auth.users LIMIT 1)
FROM public.projects
WHERE id IN (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  '5a7b8c9d-0e1f-2345-6789-012345678901',
  '7b8c9d0e-1f23-4567-8901-234567890123',
  '9d0e1f23-4567-8901-2345-67890123456a'
)
ON CONFLICT DO NOTHING;