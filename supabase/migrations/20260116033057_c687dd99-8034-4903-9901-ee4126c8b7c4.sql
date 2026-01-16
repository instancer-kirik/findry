-- Drop all existing SELECT policies on projects table
DROP POLICY IF EXISTS "Allow public read access to projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can view public projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;

-- Create proper SELECT policy that respects is_public flag
CREATE POLICY "Users can view public or own projects"
ON public.projects FOR SELECT
USING (
  is_public = true 
  OR auth.uid() = owner_id 
  OR auth.uid() = created_by
  OR auth.uid() = user_id
);