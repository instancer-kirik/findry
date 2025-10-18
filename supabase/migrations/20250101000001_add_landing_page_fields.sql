-- Add landing page fields to projects table
ALTER TABLE projects
ADD COLUMN landing_page JSONB,
ADD COLUMN has_custom_landing BOOLEAN DEFAULT FALSE;

-- Create index for better performance on has_custom_landing queries
CREATE INDEX idx_projects_has_custom_landing ON projects(has_custom_landing) WHERE has_custom_landing = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN projects.landing_page IS 'JSON configuration for custom project landing pages';
COMMENT ON COLUMN projects.has_custom_landing IS 'Flag to indicate if project has a custom landing page';

-- Update existing projects to have has_custom_landing = false by default (already handled by DEFAULT)
-- This migration is safe to run on existing data
