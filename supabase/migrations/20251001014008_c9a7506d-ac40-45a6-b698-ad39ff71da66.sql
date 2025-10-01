-- Add missing ownership and discovery fields to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS owner_type text,
ADD COLUMN IF NOT EXISTS owner_id uuid,
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count integer DEFAULT 0;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_public ON projects(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE featured = true;

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view public projects" ON projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- Create new policies
CREATE POLICY "Anyone can view public projects" 
ON projects 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can view their own projects" 
ON projects 
FOR SELECT 
USING (created_by = auth.uid());

CREATE POLICY "Authenticated users can create projects" 
ON projects 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Users can update their own projects" 
ON projects 
FOR UPDATE 
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own projects" 
ON projects 
FOR DELETE 
USING (created_by = auth.uid());