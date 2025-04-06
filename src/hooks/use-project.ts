
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

    // Fetch components using a direct query instead of rpc
    const { data: componentsData, error: componentsError } = await supabase
      .from('project_components')
      .select('*')
      .eq('project_id', id);

    if (componentsError) throw componentsError;

    // Fetch tasks using a direct query instead of rpc
    const { data: tasksData, error: tasksError } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', id);

    if (tasksError) throw tasksError;

    return {
      ...project,
      components: componentsData as ProjectComponent[] || [],
      tasks: tasksData as ProjectTask[] || []
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
        ...project,
        name: project.name || '' // Ensure name is not undefined
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
      for (const component of project.components) {
        // Use direct insert instead of rpc
        const { error: componentError } = await supabase
          .from('project_components')
          .insert({
            project_id: projectId,
            name: component.name,
            description: component.description || null,
            status: component.status,
            type: component.type,
            dependencies: component.dependencies || []
          });
        
        if (componentError) throw componentError;
      }
    }

    // Insert tasks if provided
    if (project.tasks && project.tasks.length > 0) {
      for (const task of project.tasks) {
        // Use direct insert instead of rpc
        const { error: taskError } = await supabase
          .from('project_tasks')
          .insert({
            project_id: projectId,
            title: task.title,
            description: task.description || null,
            status: task.status,
            priority: task.priority,
            assigned_to: task.assigned_to || null,
            due_date: task.due_date || null
          });
        
        if (taskError) throw taskError;
      }
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

    // Using direct insert instead of rpc
    const { data, error } = await supabase
      .from('project_components')
      .insert({
        project_id: component.project_id,
        name: component.name,
        description: component.description || null,
        status: component.status,
        type: component.type,
        dependencies: component.dependencies || []
      })
      .select()
      .single();

    if (error) throw error;

    return data as ProjectComponent;
  };

  const updateProjectComponent = async ({ id, ...componentData }: ProjectComponent) => {
    if (!user) throw new Error('User not authenticated');

    // Using direct update instead of rpc
    const { data, error } = await supabase
      .from('project_components')
      .update({
        name: componentData.name,
        description: componentData.description || null,
        status: componentData.status,
        type: componentData.type,
        dependencies: componentData.dependencies || []
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as ProjectComponent;
  };

  const createProjectTask = async (task: Omit<ProjectTask, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    // Using direct insert instead of rpc
    const { data, error } = await supabase
      .from('project_tasks')
      .insert({
        project_id: task.project_id,
        title: task.title,
        description: task.description || null,
        status: task.status,
        priority: task.priority,
        assigned_to: task.assigned_to || null,
        due_date: task.due_date || null
      })
      .select()
      .single();

    if (error) throw error;

    return data as ProjectTask;
  };

  const updateProjectTask = async ({ id, ...taskData }: ProjectTask) => {
    if (!user) throw new Error('User not authenticated');

    // Using direct update instead of rpc
    const { data, error } = await supabase
      .from('project_tasks')
      .update({
        title: taskData.title,
        description: taskData.description || null,
        status: taskData.status,
        priority: taskData.priority,
        assigned_to: taskData.assigned_to || null,
        due_date: taskData.due_date || null
      })
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
