-- Fix RLS policy for projects table to use owner_id instead of created_by
-- The current policy checks created_by which is often NULL, but owner_id is consistently populated

-- Drop the old policy
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;

-- Create new policy that checks owner_id
CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
TO public
USING (
  auth.uid() = owner_id 
  OR auth.uid() = created_by
);

-- Also fix the delete policy for consistency
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
TO public
USING (
  auth.uid() = owner_id 
  OR auth.uid() = created_by
);

-- Add comment for documentation
COMMENT ON POLICY "Users can update their own projects" ON public.projects IS 
'Allows users to update projects where they are the owner_id or created_by';