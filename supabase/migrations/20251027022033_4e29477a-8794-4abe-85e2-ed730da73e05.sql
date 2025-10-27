-- Add landing page columns to projects table
ALTER TABLE projects
ADD COLUMN landing_page jsonb DEFAULT NULL;

ALTER TABLE projects
ADD COLUMN has_custom_landing boolean NOT NULL DEFAULT false;

-- Create performance indexes
CREATE INDEX idx_projects_has_custom_landing ON projects (has_custom_landing) WHERE has_custom_landing = true;
CREATE INDEX idx_projects_landing_page_gin ON projects USING gin (landing_page) WHERE landing_page IS NOT NULL;

-- Add comments to document the columns
COMMENT ON COLUMN projects.landing_page IS 'JSON data for custom landing page configuration including hero section, sections, theme, and social links';
COMMENT ON COLUMN projects.has_custom_landing IS 'Boolean flag indicating if the project has a custom landing page configured and ready for public viewing';