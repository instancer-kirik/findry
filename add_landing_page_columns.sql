-- Add landing page columns to projects table
-- This migration adds the necessary columns for custom landing pages

-- Add the landing_page column to store JSON data
ALTER TABLE projects
ADD COLUMN landing_page jsonb DEFAULT NULL;

-- Add the has_custom_landing flag
ALTER TABLE projects
ADD COLUMN has_custom_landing boolean NOT NULL DEFAULT false;

-- Create an index on has_custom_landing for better query performance
CREATE INDEX idx_projects_has_custom_landing ON projects (has_custom_landing) WHERE has_custom_landing = true;

-- Create an index on landing_page for JSON queries
CREATE INDEX idx_projects_landing_page_gin ON projects USING gin (landing_page) WHERE landing_page IS NOT NULL;

-- Update existing projects that might have landing page data
-- This is a safety measure in case there's any existing data
UPDATE projects
SET has_custom_landing = true
WHERE landing_page IS NOT NULL
  AND landing_page != 'null'::jsonb
  AND jsonb_typeof(landing_page) = 'object';

-- Add a comment to document the columns
COMMENT ON COLUMN projects.landing_page IS 'JSON data for custom landing page configuration including hero section, sections, theme, and social links';
COMMENT ON COLUMN projects.has_custom_landing IS 'Boolean flag indicating if the project has a custom landing page configured and ready for public viewing';

-- Verify the changes
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'projects'
  AND column_name IN ('landing_page', 'has_custom_landing');
