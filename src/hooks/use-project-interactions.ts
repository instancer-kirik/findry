
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectComponent {
  id: string;
  name: string;
  status: string;
  type: string;
  projectId: string;
  description?: string;
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
}

const useProjectInteractions = (projectId: string) => {
  const [components, setComponents] = useState<ProjectComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch project components
  const fetchComponents = async () => {
    try {
      setLoading(true);
      
      // Use the project_components table directly
      const { data, error } = await supabase
        .from('project_components')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      if (data) {
        // Transform the data to match the ProjectComponent interface
        const transformedData: ProjectComponent[] = data.map(item => ({
          id: item.id,
          name: item.name,
          status: item.status,
          type: item.type,
          projectId: item.project_id,
          description: item.description,
          dependencies: item.dependencies,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
        
        setComponents(transformedData);
      }
    } catch (e) {
      console.error('Error fetching project components:', e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new component
  const createComponent = async (component: Omit<ProjectComponent, 'id' | 'createdAt' | 'updatedAt' | 'projectId'>) => {
    try {
      const { data, error } = await supabase
        .from('project_components')
        .insert([{ 
          name: component.name,
          status: component.status,
          type: component.type,
          project_id: projectId,
          description: component.description,
          dependencies: component.dependencies || []
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        // Transform the new component data
        const newComponent: ProjectComponent = {
          id: data[0].id,
          name: data[0].name,
          status: data[0].status,
          type: data[0].type,
          projectId: data[0].project_id,
          description: data[0].description,
          dependencies: data[0].dependencies,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at
        };
        
        setComponents([...components, newComponent]);
      }
      
      return data;
    } catch (e) {
      console.error('Error creating component:', e);
      throw e;
    }
  };

  // Update an existing component
  const updateComponent = async (component: ProjectComponent) => {
    try {
      const { data, error } = await supabase
        .from('project_components')
        .update({ 
          name: component.name,
          status: component.status,
          type: component.type,
          description: component.description,
          dependencies: component.dependencies || []
        })
        .eq('id', component.id)
        .select();
      
      if (error) throw error;
      
      if (data) {
        // Update the components state
        setComponents(components.map(c => 
          c.id === component.id 
            ? {
                ...c,
                name: component.name,
                status: component.status,
                type: component.type,
                description: component.description,
                dependencies: component.dependencies,
                updatedAt: new Date().toISOString()
              } 
            : c
        ));
      }
      
      return data;
    } catch (e) {
      console.error('Error updating component:', e);
      throw e;
    }
  };

  // Delete a component
  const deleteComponent = async (componentId: string) => {
    try {
      const { error } = await supabase
        .from('project_components')
        .delete()
        .eq('id', componentId);
      
      if (error) throw error;
      
      // Update the components state
      setComponents(components.filter(c => c.id !== componentId));
    } catch (e) {
      console.error('Error deleting component:', e);
      throw e;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchComponents();
    }
  }, [projectId]);

  return {
    components,
    loading,
    error,
    fetchComponents,
    createComponent,
    updateComponent,
    deleteComponent
  };
};

// Export the hook properly
export { useProjectInteractions };
export default useProjectInteractions;
