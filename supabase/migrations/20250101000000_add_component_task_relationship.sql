-- Migration to add component-task relationship and fix project ownership

-- Add component_id column to project_tasks table if it doesn't exist
ALTER TABLE project_tasks
ADD COLUMN IF NOT EXISTS component_id UUID REFERENCES project_components(id) ON DELETE SET NULL;

-- Create index for component_id for better query performance
CREATE INDEX IF NOT EXISTS idx_project_tasks_component_id ON project_tasks(component_id);

-- Add missing columns to project_components table if they don't exist
ALTER TABLE project_components
ADD COLUMN IF NOT EXISTS assigned_to TEXT,
ADD COLUMN IF NOT EXISTS due_date DATE;

-- Ensure proper RLS policies exist for project_tasks
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view public project tasks" ON project_tasks;
DROP POLICY IF EXISTS "Users can view their own project tasks" ON project_tasks;
DROP POLICY IF EXISTS "Users can insert tasks for their projects" ON project_tasks;
DROP POLICY IF EXISTS "Users can update tasks for their projects" ON project_tasks;
DROP POLICY IF EXISTS "Users can delete tasks for their projects" ON project_tasks;

-- Create RLS policies for project_tasks
CREATE POLICY "Anyone can view public project tasks"
ON project_tasks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_tasks.project_id
    AND projects.is_public = true
  )
);

CREATE POLICY "Users can view their own project tasks"
ON project_tasks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_tasks.project_id
    AND (
      projects.created_by = auth.uid()
      OR projects.owner_id::text = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM content_ownership
        WHERE content_id = projects.id
        AND content_type = 'project'
        AND owner_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can insert tasks for their projects"
ON project_tasks
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_tasks.project_id
    AND (
      projects.created_by = auth.uid()
      OR projects.owner_id::text = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM content_ownership
        WHERE content_id = projects.id
        AND content_type = 'project'
        AND owner_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can update tasks for their projects"
ON project_tasks
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_tasks.project_id
    AND (
      projects.created_by = auth.uid()
      OR projects.owner_id::text = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM content_ownership
        WHERE content_id = projects.id
        AND content_type = 'project'
        AND owner_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can delete tasks for their projects"
ON project_tasks
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_tasks.project_id
    AND (
      projects.created_by = auth.uid()
      OR projects.owner_id::text = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM content_ownership
        WHERE content_id = projects.id
        AND content_type = 'project'
        AND owner_id = auth.uid()
      )
    )
  )
);

-- Ensure proper RLS policies exist for project_components
ALTER TABLE project_components ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view public project components" ON project_components;
DROP POLICY IF EXISTS "Users can view their own project components" ON project_components;
DROP POLICY IF EXISTS "Users can insert components for their projects" ON project_components;
DROP POLICY IF EXISTS "Users can update components for their projects" ON project_components;
DROP POLICY IF EXISTS "Users can delete components for their projects" ON project_components;

-- Create RLS policies for project_components
CREATE POLICY "Anyone can view public project components"
ON project_components
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_components.project_id
    AND projects.is_public = true
  )
);

CREATE POLICY "Users can view their own project components"
ON project_components
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_components.project_id
    AND (
      projects.created_by = auth.uid()
      OR projects.owner_id::text = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM content_ownership
        WHERE content_id = projects.id
        AND content_type = 'project'
        AND owner_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can insert components for their projects"
ON project_components
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_components.project_id
    AND (
      projects.created_by = auth.uid()
      OR projects.owner_id::text = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM content_ownership
        WHERE content_id = projects.id
        AND content_type = 'project'
        AND owner_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can update components for their projects"
ON project_components
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_components.project_id
    AND (
      projects.created_by = auth.uid()
      OR projects.owner_id::text = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM content_ownership
        WHERE content_id = projects.id
        AND content_type = 'project'
        AND owner_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can delete components for their projects"
ON project_components
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_components.project_id
    AND (
      projects.created_by = auth.uid()
      OR projects.owner_id::text = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM content_ownership
        WHERE content_id = projects.id
        AND content_type = 'project'
        AND owner_id = auth.uid()
      )
    )
  )
);

-- Create function to get component-specific tasks
CREATE OR REPLACE FUNCTION get_component_tasks(component_id_param UUID)
RETURNS TABLE (
  id UUID,
  project_id UUID,
  component_id UUID,
  title TEXT,
  description TEXT,
  status TEXT,
  priority TEXT,
  assigned_to TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pt.id,
    pt.project_id,
    pt.component_id,
    pt.title,
    pt.description,
    pt.status,
    pt.priority,
    pt.assigned_to,
    pt.due_date,
    pt.created_at,
    pt.updated_at
  FROM project_tasks pt
  WHERE pt.component_id = component_id_param
  ORDER BY pt.created_at DESC;
END;
$$;

-- Create function to calculate component completion percentage
CREATE OR REPLACE FUNCTION calculate_component_progress(component_id_param UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
  progress_percent INTEGER;
BEGIN
  -- Count total tasks for this component
  SELECT COUNT(*) INTO total_tasks
  FROM project_tasks
  WHERE component_id = component_id_param;

  -- If no tasks, return 0
  IF total_tasks = 0 THEN
    RETURN 0;
  END IF;

  -- Count completed tasks
  SELECT COUNT(*) INTO completed_tasks
  FROM project_tasks
  WHERE component_id = component_id_param AND status = 'completed';

  -- Calculate percentage
  progress_percent := ROUND((completed_tasks::DECIMAL / total_tasks::DECIMAL) * 100);

  RETURN progress_percent;
END;
$$;

-- Create view for enhanced project components with task metrics
CREATE OR REPLACE VIEW project_components_with_metrics AS
SELECT
  pc.*,
  COALESCE(task_counts.total_tasks, 0) as total_tasks,
  COALESCE(task_counts.completed_tasks, 0) as completed_tasks,
  COALESCE(task_counts.pending_tasks, 0) as pending_tasks,
  COALESCE(task_counts.in_progress_tasks, 0) as in_progress_tasks,
  CASE
    WHEN COALESCE(task_counts.total_tasks, 0) = 0 THEN 0
    ELSE ROUND((COALESCE(task_counts.completed_tasks, 0)::DECIMAL / task_counts.total_tasks::DECIMAL) * 100)
  END as task_completion_percentage
FROM project_components pc
LEFT JOIN (
  SELECT
    component_id,
    COUNT(*) as total_tasks,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks,
    COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tasks
  FROM project_tasks
  WHERE component_id IS NOT NULL
  GROUP BY component_id
) task_counts ON pc.id = task_counts.component_id;

-- Add helpful comment
COMMENT ON COLUMN project_tasks.component_id IS 'Optional reference to the component this task belongs to';
COMMENT ON FUNCTION get_component_tasks IS 'Returns all tasks associated with a specific component';
COMMENT ON FUNCTION calculate_component_progress IS 'Calculates completion percentage for a component based on its tasks';
COMMENT ON VIEW project_components_with_metrics IS 'Enhanced view of project components with task completion metrics';
