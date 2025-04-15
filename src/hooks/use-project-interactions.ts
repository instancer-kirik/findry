import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProjectComponent {
  id: string;
  name: string;
  description?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'blocked';
  type: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  dependencies?: string[]; // Add the missing dependencies property
}

const useProjectInteractions = (projectId: string) => {
  const [components, setComponents] = useState<ProjectComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('projects_components')
          .select('*')
          .eq('project_id', projectId);

        if (error) {
          setError(error.message);
        } else {
          setComponents(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, [projectId]);

  const addComponent = async (newComponent: Omit<ProjectComponent, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('projects_components')
        .insert([{ ...newComponent, project_id: projectId }])
        .select()

      if (error) {
        setError(error.message);
        toast.error(`Failed to add component: ${error.message}`);
      } else {
        setComponents([...components, ...(data as ProjectComponent[])]);
        toast.success('Component added successfully!');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to add component: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateComponent = async (componentId: string, updates: Partial<ProjectComponent>) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('projects_components')
        .update(updates)
        .eq('id', componentId);

      if (error) {
        setError(error.message);
        toast.error(`Failed to update component: ${error.message}`);
      } else {
        setComponents(components.map(c => (c.id === componentId ? { ...c, ...updates } : c)));
        toast.success('Component updated successfully!');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to update component: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteComponent = async (componentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('projects_components')
        .delete()
        .eq('id', componentId);

      if (error) {
        setError(error.message);
        toast.error(`Failed to delete component: ${error.message}`);
      } else {
        setComponents(components.filter(c => c.id !== componentId));
        toast.success('Component deleted successfully!');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to delete component: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    components,
    loading,
    error,
    addComponent,
    updateComponent,
    deleteComponent,
  };
};

export default useProjectInteractions;
