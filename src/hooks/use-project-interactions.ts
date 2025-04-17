import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProjectComponent } from '@/types/project';
import { Database } from '@/integrations/supabase/database.types';

// Type for database project component
type ProjectComponentRecord = Database['public']['Tables']['project_components']['Row'];

// Export interface correctly matching the project.ts type file
export interface ProjectInteractionsProps {
  projectId: string;
}

// Convert database record to ProjectComponent type
function convertToProjectComponent(record: ProjectComponentRecord): ProjectComponent {
  return {
    id: record.id,
    name: record.name,
    type: record.type || 'feature',
    description: record.description || '',
    status: (record.status as 'pending' | 'in_progress' | 'completed'),
    assignedTo: record.assigned_to || undefined,
    dueDate: record.due_date || undefined
  };
}

// Convert ProjectComponent to database format
function convertFromProjectComponent(component: Partial<ProjectComponent>, projectId: string): Partial<ProjectComponentRecord> {
  const record: Partial<ProjectComponentRecord> = {};
  
  if ('name' in component) record.name = component.name;
  if ('description' in component) record.description = component.description || null;
  if ('type' in component) record.type = component.type || null;
  if ('status' in component) record.status = component.status || null;
  if ('assignedTo' in component) record.assigned_to = component.assignedTo || null;
  if ('dueDate' in component) record.due_date = component.dueDate || null;
  record.project_id = projectId;
  
  return record;
}

export const useProjectInteractions = ({ projectId }: ProjectInteractionsProps) => {
  const [components, setComponents] = useState<ProjectComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('project_components')
          .select('*')
          .eq('project_id', projectId);

        if (error) {
          setError(error.message);
        } else if (data) {
          const formattedComponents = data.map(convertToProjectComponent);
          setComponents(formattedComponents);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, [projectId]);

  const addComponent = async (newComponent: Omit<ProjectComponent, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      const dbRecord = convertFromProjectComponent(newComponent, projectId);
      
      const { data, error } = await supabase
        .from('project_components')
        .insert([dbRecord])
        .select();

      if (error) {
        setError(error.message);
        toast.error(`Failed to add component: ${error.message}`);
        return null;
      } else if (data && data.length > 0) {
        const formattedComponent = convertToProjectComponent(data[0] as ProjectComponentRecord);
        setComponents([...components, formattedComponent]);
        toast.success('Component added successfully!');
        return formattedComponent;
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to add component: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateComponent = async (componentId: string, updates: Partial<ProjectComponent>) => {
    setLoading(true);
    setError(null);

    try {
      const dbUpdates = convertFromProjectComponent(updates, projectId);

      const { error } = await supabase
        .from('project_components')
        .update(dbUpdates)
        .eq('id', componentId);

      if (error) {
        setError(error.message);
        toast.error(`Failed to update component: ${error.message}`);
        return false;
      } else {
        // Update the local state with the changes
        setComponents(components.map(c => 
          c.id === componentId ? { ...c, ...updates } : c
        ));
        toast.success('Component updated successfully!');
        return true;
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to update component: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteComponent = async (componentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('project_components')
        .delete()
        .eq('id', componentId);

      if (error) {
        setError(error.message);
        toast.error(`Failed to delete component: ${error.message}`);
        return false;
      } else {
        setComponents(components.filter(c => c.id !== componentId));
        toast.success('Component deleted successfully!');
        return true;
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to delete component: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Add this function to support chat integration
  const recordEvent = async (
    eventType: 'status_change' | 'task_update' | 'component_update' | 'comment' | 'member_joined',
    details: Record<string, any>
  ) => {
    try {
      // For now, we'll just log the event - in a real implementation this would be saved to the database
      console.log('Project event recorded:', { projectId, eventType, details });
      return true;
    } catch (err: any) {
      console.error('Error recording project event:', err);
      return false;
    }
  };

  return {
    components,
    loading,
    error,
    addComponent,
    updateComponent,
    deleteComponent,
    recordEvent
  };
};
