
import { useEffect, useState } from 'react';
import { Project } from '@/hooks/use-project';
import { supabase } from '@/integrations/supabase/client';

interface DemoProjectState {
  project: Project | null;
  isLoading: boolean;
  error: Error | null;
}

export function useDemoProject(projectId: string) {
  const [state, setState] = useState<DemoProjectState>({
    project: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchDemoProject = async () => {
      if (!projectId) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        // Fetch project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (projectError) throw projectError;
        
        // Fetch components for this project
        const { data: componentsData, error: componentsError } = await supabase
          .from('project_components')
          .select('*')
          .eq('project_id', projectId);
          
        if (componentsError) throw componentsError;
        
        // Fetch tasks for this project
        const { data: tasksData, error: tasksError } = await supabase
          .from('project_tasks')
          .select('*')
          .eq('project_id', projectId);
          
        if (tasksError) throw tasksError;
        
        // Build the full project object
        const project: Project = {
          ...projectData,
          components: componentsData || [],
          tasks: tasksData || []
        };
        
        setState({
          project,
          isLoading: false,
          error: null
        });
        
      } catch (error) {
        console.error('Error fetching demo project:', error);
        setState({
          project: null,
          isLoading: false,
          error: error as Error
        });
      }
    };
    
    fetchDemoProject();
  }, [projectId]);
  
  return state;
}
