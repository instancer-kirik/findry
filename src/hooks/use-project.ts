
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectComponent, ProjectTask } from '@/types/project';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

export const useGetProject = (projectId?: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async (): Promise<Project | null> => {
      if (!projectId) return null;
      
      try {
        // Get the project data
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        if (!data) return null;
        
        // Get components
        const { data: componentsData, error: componentsError } = await supabase
          .from('project_components')
          .select('*')
          .eq('project_id', projectId);
          
        if (componentsError) throw componentsError;
        
        // Get tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('project_tasks')
          .select('*')
          .eq('project_id', projectId);
          
        if (tasksError) throw tasksError;
        
        const project: Project = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          status: (data.status as any) || 'planning',
          version: data.version || '0.1.0',
          progress: data.progress || 0,
          tags: data.tags || [],
          components: componentsData ? componentsData.map((c: any) => ({
            id: c.id,
            name: c.name,
            type: c.type || 'feature',
            description: c.description || '',
            status: c.status || 'pending',
            assignedTo: c.assigned_to,
            dueDate: c.due_date
          })) : [],
          tasks: tasksData ? tasksData.map((t: any) => ({
            id: t.id,
            name: t.name || t.title, // Support both name and title
            title: t.title || t.name, // Support both name and title
            description: t.description || '',
            status: t.status || 'pending',
            assignedTo: t.assigned_to,
            dueDate: t.due_date,
            priority: t.priority || 'medium'
          })) : [],
          ownerType: data.owner_type || 'personal',
          ownerId: data.owner_id || '',
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          // Additional fields from the database schema
          budget: data.budget || '',
          location: data.location || '',
          timeline: data.timeline || '',
          type: data.type || '',
          image_url: data.image_url || '',
          repo_url: data.repo_url || ''
        };
        
        return project;
      } catch (error: any) {
        console.error(`Error fetching project ${projectId}:`, error);
        toast(`Error fetching project: ${error.message}`);
        return null;
      }
    },
    enabled: !!projectId
  });
};

export const useGetProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        return (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          status: p.status || 'planning',
          version: p.version || '0.1.0',
          progress: p.progress || 0,
          tags: p.tags || [],
          components: [],
          tasks: [],
          ownerType: p.owner_type || 'personal',
          ownerId: p.owner_id || '',
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          // Additional fields
          budget: p.budget || '',
          location: p.location || '',
          timeline: p.timeline || '',
          type: p.type || '',
          image_url: p.image_url || '',
          repo_url: p.repo_url || ''
        }));
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast(`Error fetching projects: ${error.message}`);
        return [];
      }
    }
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  
  return useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'components' | 'tasks'>) => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            name: projectData.name,
            description: projectData.description,
            status: projectData.status,
            version: projectData.version,
            progress: projectData.progress,
            tags: projectData.tags,
            owner_type: projectData.ownerType,
            owner_id: projectData.ownerId || user?.id
          })
          .select('id')
          .single();
          
        if (error) throw error;
        if (!data) throw new Error('Failed to create project');
        
        return data.id;
      } catch (error: any) {
        console.error('Error creating project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast('Project created successfully');
    },
    onError: (error: any) => {
      toast(`Error creating project: ${error.message}`);
    }
  });
};

export const useProject = () => {
  return {
    useGetProjects,
    useGetProject,
    useCreateProject
  };
};
