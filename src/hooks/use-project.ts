
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

    // Fetch components using the RPC function
    const { data: componentsData, error: componentsError } = await supabase
      .rpc('get_project_components', { p_project_id: id });

    if (componentsError) throw componentsError;

    // Fetch tasks using the RPC function
    const { data: tasksData, error: tasksError } = await supabase
      .rpc('get_project_tasks', { p_project_id: id });

    if (tasksError) throw tasksError;

    // Convert the any[] type to our specific types
    const components = componentsData as unknown as ProjectComponent[];
    const tasks = tasksData as unknown as ProjectTask[];

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
        const { error: componentError } = await supabase
          .rpc('insert_project_component', { 
            p_project_id: projectId,
            p_name: component.name,
            p_description: component.description || null,
            p_status: component.status,
            p_type: component.type,
            p_dependencies: component.dependencies || []
          });
        
        if (componentError) throw componentError;
      }
    }

    // Insert tasks if provided
    if (project.tasks && project.tasks.length > 0) {
      for (const task of project.tasks) {
        const { error: taskError } = await supabase
          .rpc('insert_project_task', { 
            p_project_id: projectId,
            p_title: task.title,
            p_description: task.description || null,
            p_status: task.status,
            p_priority: task.priority,
            p_assigned_to: task.assigned_to || null,
            p_due_date: task.due_date || null
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

    // Using rpc to create component
    const { data, error } = await supabase
      .rpc('insert_project_component', { 
        p_project_id: component.project_id,
        p_name: component.name,
        p_description: component.description || null,
        p_status: component.status,
        p_type: component.type,
        p_dependencies: component.dependencies || []
      });

    if (error) throw error;

    return data as unknown as ProjectComponent;
  };

  const updateProjectComponent = async ({ id, ...componentData }: ProjectComponent) => {
    if (!user) throw new Error('User not authenticated');

    // Using rpc to update component
    const { data, error } = await supabase
      .rpc('update_project_component', { 
        p_id: id,
        p_name: componentData.name,
        p_description: componentData.description || null,
        p_status: componentData.status,
        p_type: componentData.type,
        p_dependencies: componentData.dependencies || []
      });

    if (error) throw error;

    return data as unknown as ProjectComponent;
  };

  const createProjectTask = async (task: Omit<ProjectTask, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    // Using rpc to create task
    const { data, error } = await supabase
      .rpc('insert_project_task', { 
        p_project_id: task.project_id,
        p_title: task.title,
        p_description: task.description || null,
        p_status: task.status,
        p_priority: task.priority,
        p_assigned_to: task.assigned_to || null,
        p_due_date: task.due_date || null
      });

    if (error) throw error;

    return data as unknown as ProjectTask;
  };

  const updateProjectTask = async ({ id, ...taskData }: ProjectTask) => {
    if (!user) throw new Error('User not authenticated');

    // Using rpc to update task
    const { data, error } = await supabase
      .rpc('update_project_task', { 
        p_id: id,
        p_title: taskData.title,
        p_description: taskData.description || null,
        p_status: taskData.status,
        p_priority: taskData.priority,
        p_assigned_to: taskData.assigned_to || null,
        p_due_date: taskData.due_date || null
      });

    if (error) throw error;

    return data as unknown as ProjectTask;
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
