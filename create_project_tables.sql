-- Create tables for project tracking system

-- Table for development projects
CREATE TABLE development_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) CHECK (status IN ('planning', 'development', 'testing', 'released', 'maintenance')),
  version VARCHAR(20),
  repo_url VARCHAR(255),
  progress INTEGER CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for project components
CREATE TABLE project_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES development_projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) CHECK (status IN ('planned', 'in-development', 'ready', 'needs-revision')),
  type VARCHAR(50) CHECK (type IN ('ui', 'feature', 'integration', 'page')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for project component dependencies
CREATE TABLE component_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID REFERENCES project_components(id) ON DELETE CASCADE,
  depends_on_id UUID REFERENCES project_components(id) ON DELETE CASCADE,
  UNIQUE(component_id, depends_on_id)
);

-- Table for development tasks
CREATE TABLE development_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES development_projects(id) ON DELETE CASCADE,
  component_id UUID REFERENCES project_components(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) CHECK (status IN ('pending', 'in-progress', 'completed', 'blocked')),
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to VARCHAR(255),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for project tags
CREATE TABLE project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES development_projects(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  UNIQUE(project_id, tag)
);

-- Insert demo data for development projects
INSERT INTO development_projects (id, name, description, status, version, repo_url, progress)
VALUES 
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Findry Platform Core', 'The main platform for creative ecosystem connections', 'development', '0.5.0', 'https://github.com/user/findry', 65),
  ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Creator Marketplace', 'Buy and sell creative services and products', 'planning', '0.1.0', NULL, 20);

-- Insert demo data for project components
INSERT INTO project_components (id, project_id, name, description, status, type)
VALUES
  -- Findry Platform Core components
  ('c3d4e5f6-a7b8-9012-cdef-345678901234', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'User Authentication', 'Login, signup and profile management', 'ready', 'feature'),
  ('d4e5f6a7-b8c9-0123-defg-4567890123456', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Discovery Engine', 'AI-powered content and collaboration discovery', 'in-development', 'feature'),
  ('e5f6a7b8-c9d0-1234-efgh-5678901234567', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Event Management', 'Create and manage events with bookings', 'in-development', 'feature'),
  ('f6a7b8c9-d0e1-2345-fghi-6789012345678', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Venue Profiles', 'Venue management and bookings', 'in-development', 'page'),
  
  -- Creator Marketplace components
  ('a7b8c9d0-e1f2-3456-ghij-7890123456789', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Shop Creation', 'Interface for setting up creator shops', 'ready', 'page'),
  ('b8c9d0e1-f2a3-4567-hijk-8901234567890', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Product Listings', 'Product catalog and management', 'in-development', 'feature'),
  ('c9d0e1f2-a3b4-5678-ijkl-9012345678901', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Shopping Cart', 'Cart and checkout functionality', 'planned', 'feature');

-- Insert demo data for development tasks
INSERT INTO development_tasks (id, project_id, component_id, title, description, status, priority, assigned_to)
VALUES
  -- Findry Platform Core tasks
  ('d0e1f2a3-b4c5-6789-jklm-0123456789012', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd4e5f6a7-b8c9-0123-defg-4567890123456', 'Fix time-picker component', 'Create missing time-picker component causing errors', 'completed', 'high', 'Sarah'),
  ('e1f2a3b4-c5d6-7890-klmn-1234567890123', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f6a7b8c9-d0e1-2345-fghi-6789012345678', 'Improve venue detail page', 'Add user-generated content section to venue pages', 'completed', 'medium', 'Mike'),
  ('f2a3b4c5-d6e7-8901-lmno-2345678901234', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'e5f6a7b8-c9d0-1234-efgh-5678901234567', 'Implement calendar integration', 'Connect event bookings with external calendar providers', 'in-progress', 'medium', 'Alex'),
  ('a3b4c5d6-e7f8-9012-mnop-3456789012345', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', NULL, 'Fix payment gateway', 'Resolve issues with payment processing', 'pending', 'high', NULL),
  
  -- Creator Marketplace tasks
  ('b4c5d6e7-f8a9-0123-nopq-4567890123456', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'a7b8c9d0-e1f2-3456-ghij-7890123456789', 'Design product detail page', 'Create UI for product details', 'completed', 'medium', 'Jamie'),
  ('c5d6e7f8-a9b0-1234-opqr-5678901234567', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'c9d0e1f2-a3b4-5678-ijkl-9012345678901', 'Implement shopping cart', 'Build cart functionality with state management', 'pending', 'high', 'Taylor');

-- Insert demo data for project tags
INSERT INTO project_tags (project_id, tag)
VALUES
  -- Findry Platform Core tags
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'core'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'platform'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'features'),
  
  -- Creator Marketplace tags
  ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'marketplace'),
  ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'e-commerce'),
  ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'creators'); 