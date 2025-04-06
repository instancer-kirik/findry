
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export interface ProjectComponent {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  status: 'planned' | 'in-development' | 'ready' | 'needs-revision';
  type: 'ui' | 'feature' | 'integration' | 'page';
  dependencies?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
  version?: string;
  progress?: number;
  repo_url?: string;
  image_url?: string;
  location?: string;
  budget?: string;
  tags?: string[];
  type?: string;
  timeline?: string;
  created_at?: string;
  updated_at?: string;
  components?: ProjectComponent[];
  tasks?: ProjectTask[];
}

export function useProjects() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Project[];
  };

  const fetchProject = async (id: string) => {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError) throw projectError;

    const { data: components, error: componentsError } = await supabase
      .from('project_components')
      .select('*')
      .eq('project_id', id);

    if (componentsError) throw componentsError;

    const { data: tasks, error: tasksError } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', id);

    if (tasksError) throw tasksError;

    return {
      ...project,
      components: components || [],
      tasks: tasks || []
    } as Project;
  };

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const projectId = uuidv4();
    
    // Insert project
    const { data, error } = await supabase
      .from('projects')
      .insert({
        id: projectId,
        ...project
      })
      .select()
      .single();

    if (error) throw error;

    // Create ownership record
    const { error: ownershipError } = await supabase
      .from('content_ownership')
      .insert({
        content_id: projectId,
        content_type: 'project',
        owner_id: user.id
      });

    if (ownershipError) throw ownershipError;

    // Insert components if provided
    if (project.components && project.components.length > 0) {
      const { error: componentsError } = await supabase
        .from('project_components')
        .insert(
          project.components.map(component => ({
            ...component,
            project_id: projectId
          }))
        );

      if (componentsError) throw componentsError;
    }

    // Insert tasks if provided
    if (project.tasks && project.tasks.length > 0) {
      const { error: tasksError } = await supabase
        .from('project_tasks')
        .insert(
          project.tasks.map(task => ({
            ...task,
            project_id: projectId
          }))
        );

      if (tasksError) throw tasksError;
    }

    return data as Project;
  };

  const updateProject = async ({ id, ...projectData }: Project) => {
    if (!user) throw new Error('User not authenticated');

    // Update project
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as Project;
  };

  const createProjectComponent = async (component: Omit<ProjectComponent, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('project_components')
      .insert(component)
      .select()
      .single();

    if (error) throw error;

    return data as ProjectComponent;
  };

  const updateProjectComponent = async ({ id, ...componentData }: ProjectComponent) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('project_components')
      .update(componentData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as ProjectComponent;
  };

  const createProjectTask = async (task: Omit<ProjectTask, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('project_tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;

    return data as ProjectTask;
  };

  const updateProjectTask = async ({ id, ...taskData }: ProjectTask) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('project_tasks')
      .update(taskData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as ProjectTask;
  };

  const useGetProjects = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: fetchProjects,
    });
  };

  const useGetProject = (id: string) => {
    return useQuery({
      queryKey: ['project', id],
      queryFn: () => fetchProject(id),
      enabled: !!id,
    });
  };

  const useCreateProject = () => {
    return useMutation({
      mutationFn: createProject,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        toast.success('Project created successfully');
      },
      onError: (error) => {
        console.error('Create project error:', error);
        toast.error('Failed to create project');
      },
    });
  };

  const useUpdateProject = () => {
    return useMutation({
      mutationFn: updateProject,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
        toast.success('Project updated successfully');
      },
      onError: (error) => {
        console.error('Update project error:', error);
        toast.error('Failed to update project');
      },
    });
  };

  const useCreateProjectComponent = () => {
    return useMutation({
      mutationFn: createProjectComponent,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['project', variables.project_id] });
        toast.success('Component added successfully');
      },
      onError: (error) => {
        console.error('Create component error:', error);
        toast.error('Failed to add component');
      },
    });
  };

  const useUpdateProjectComponent = () => {
    return useMutation({
      mutationFn: updateProjectComponent,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });
        toast.success('Component updated successfully');
      },
      onError: (error) => {
        console.error('Update component error:', error);
        toast.error('Failed to update component');
      },
    });
  };

  const useCreateProjectTask = () => {
    return useMutation({
      mutationFn: createProjectTask,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['project', variables.project_id] });
        toast.success('Task added successfully');
      },
      onError: (error) => {
        console.error('Create task error:', error);
        toast.error('Failed to add task');
      },
    });
  };

  const useUpdateProjectTask = () => {
    return useMutation({
      mutationFn: updateProjectTask,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });
        toast.success('Task updated successfully');
      },
      onError: (error) => {
        console.error('Update task error:', error);
        toast.error('Failed to update task');
      },
    });
  };

  return {
    useGetProjects,
    useGetProject,
    useCreateProject,
    useUpdateProject,
    useCreateProjectComponent,
    useUpdateProjectComponent,
    useCreateProjectTask,
    useUpdateProjectTask
  };
}
