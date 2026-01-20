-- Add foreign key relationship from projects.created_by to profiles.id for PostgREST embedding
-- The profiles table uses the same UUID as auth.users, so this creates a usable relationship

-- First check if the constraint exists and drop it if targeting auth.users
DO $$ 
BEGIN
  -- Drop the old constraint that points to auth.users
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'projects_created_by_fkey' 
    AND conrelid = 'public.projects'::regclass
  ) THEN
    ALTER TABLE public.projects DROP CONSTRAINT projects_created_by_fkey;
  END IF;
END $$;

-- Add the new FK pointing to profiles table (which PostgREST can embed)
ALTER TABLE public.projects
ADD CONSTRAINT projects_created_by_profiles_fkey 
FOREIGN KEY (created_by) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);