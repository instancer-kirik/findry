import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

// Types from database schema
type ProjectRecord = Database['public']['Tables']['projects']['Row'];
type ProjectComponentRecord = Database['public']['Tables']['project_components']['Row'];
type ProjectTaskRecord = Database['public']['Tables']['project_tasks']['Row'];

// Application types that match our UI needs
export interface ProjectComponent {
  id: string;
  name: string;
  description: string;
  status: 'in_progress' | 'completed' | 'pending';
  type: 'ui' | 'feature' | 'integration' | 'page';
}

export interface ProjectTask {
  id: string;
  name: string;
  description: string;
  status: 'in_progress' | 'completed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'development' | 'testing' | 'released' | 'maintenance';
  version: string;
  components: ProjectComponent[];
  tasks: ProjectTask[];
  progress: number;
  tags: string[];
  source?: string;
  timeline?: {
    start_date: string;
    end_date: string;
    milestones: {
      date: string;
      description: string;
    }[];
  };
  contributors?: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  created_at: string;
  updated_at: string;
}

export const useCreateProject = () => {
  return useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          description: project.description,
          status: project.status,
          version: project.version,
          progress: project.progress,
          tags: project.tags
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: async ({ id, ...project }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: project.name,
          description: project.description,
          status: project.status,
          version: project.version,
          progress: project.progress,
          tags: project.tags
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  });
};

export const useGetProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          components:project_components(*),
          tasks:project_tasks(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transform database records to our application types
      const components = (data.components || []).map((c: ProjectComponentRecord) => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
        status: c.status as 'in_progress' | 'completed' | 'pending',
        type: c.type as 'ui' | 'feature' | 'integration' | 'page'
      }));

      const tasks = (data.tasks || []).map((t: ProjectTaskRecord) => ({
        id: t.id,
        name: t.title,
        description: t.description || '',
        status: t.status as 'in_progress' | 'completed' | 'pending',
        priority: t.priority as 'low' | 'medium' | 'high',
        assignedTo: t.assigned_to,
        dueDate: t.due_date
      }));

      // Parse timeline if it exists
      const timeline = data.timeline ? JSON.parse(data.timeline) : undefined;

      return {
        ...data,
        components,
        tasks,
        timeline
      } as Project;
    },
  });
};

export const useGetProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          components:project_components(*),
          tasks:project_tasks(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((p: any) => {
        const components = (p.components || []).map((c: ProjectComponentRecord) => ({
          id: c.id,
          name: c.name,
          description: c.description || '',
          status: c.status as 'in_progress' | 'completed' | 'pending',
          type: c.type as 'ui' | 'feature' | 'integration' | 'page'
        }));

        const tasks = (p.tasks || []).map((t: ProjectTaskRecord) => ({
          id: t.id,
          name: t.title,
          description: t.description || '',
          status: t.status as 'in_progress' | 'completed' | 'pending',
          priority: t.priority as 'low' | 'medium' | 'high',
          assignedTo: t.assigned_to,
          dueDate: t.due_date
        }));

        return {
          ...p,
          components,
          tasks
        } as Project;
      });
    },
  });
};

export const useCreateProjectComponent = () => {
  return useMutation({
    mutationFn: async (component: Omit<ProjectComponent, 'id'> & { project_id: string }) => {
      const { data, error } = await supabase
        .from('project_components')
        .insert({
          project_id: component.project_id,
          name: component.name,
          description: component.description,
          status: component.status,
          type: component.type
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateProjectComponent = () => {
  return useMutation({
    mutationFn: async ({ id, ...component }: Partial<ProjectComponent> & { id: string }) => {
      const { data, error } = await supabase
        .from('project_components')
        .update({
          name: component.name,
          description: component.description,
          status: component.status,
          type: component.type
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useDeleteProjectComponent = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('project_components')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  });
};

export const useCreateProjectTask = () => {
  return useMutation({
    mutationFn: async (task: Omit<ProjectTask, 'id'> & { project_id: string }) => {
      const { data, error } = await supabase
        .from('project_tasks')
        .insert({
          project_id: task.project_id,
          title: task.name,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigned_to: task.assignedTo,
          due_date: task.dueDate
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateProjectTask = () => {
  return useMutation({
    mutationFn: async ({ id, ...task }: Partial<ProjectTask> & { id: string }) => {
      const { data, error } = await supabase
        .from('project_tasks')
        .update({
          title: task.name,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigned_to: task.assignedTo,
          due_date: task.dueDate
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useDeleteProjectTask = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  });
};

// Main hook that combines all project operations
export const useProject = () => {
  const { user } = useUser();

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const getProject = useGetProject;
  const getProjects = useGetProjects();
  
  const createComponent = useCreateProjectComponent();
  const updateComponent = useUpdateProjectComponent();
  const deleteComponent = useDeleteProjectComponent();
  
  const createTask = useCreateProjectTask();
  const updateTask = useUpdateProjectTask();
  const deleteTask = useDeleteProjectTask();

  return {
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getProjects,
    createComponent,
    updateComponent,
    deleteComponent,
    createTask,
    updateTask,
    deleteTask
  };
};
