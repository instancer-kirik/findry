import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

// Types for our projects system
export interface ProjectComponent {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-development' | 'ready' | 'needs-revision';
  type: 'ui' | 'feature' | 'integration' | 'page';
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
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
  repoUrl?: string;
  progress: number;
  tags: string[];
  source?: string;  // Added to track where the project came from (discover or projects)
  contributors?: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
}

// Define database types
interface ProjectRecord {
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
}

interface ProjectComponentRecord {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  status?: string;
  type?: string;
  dependencies?: string[];
  created_at?: string;
  updated_at?: string;
}

interface ProjectTaskRecord {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigned_to?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProjects = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  
  // Get all projects owned by the current user
  const useGetProjects = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: async (): Promise<Project[]> => {
        try {
          let projectsData;
          
          if (user) {
            // First get the IDs of projects owned by the user
            const { data: ownershipData, error: ownershipError } = await supabase
              .from('content_ownership')
              .select('content_id')
              .eq('content_type', 'project')
              .eq('owner_id', user.id);

            if (ownershipError) throw ownershipError;
            
            if (!ownershipData || ownershipData.length === 0) {
              // If no owned projects, get public projects instead
              const { data, error } = await supabase
                .from('projects')
                .select('*')
                .limit(10);
                
              if (error) throw error;
              projectsData = data;
            } else {
              const projectIds = ownershipData.map(item => item.content_id);
              
              // Then fetch the actual projects
              const { data, error } = await supabase
                .from('projects')
                .select('*')
                .in('id', projectIds);

              if (error) throw error;
              projectsData = data;
            }
          } else {
            // If not logged in, just load all public projects
            const { data, error } = await supabase
              .from('projects')
              .select('*')
              .limit(10);
              
            if (error) throw error;
            projectsData = data;
          }
          
          // Process the data to match our Project interface
          const projects: Project[] = (projectsData || []).map((p: ProjectRecord) => {
            const project: Project = {
              id: p.id,
              name: p.name,
              description: p.description || '',
              status: (p.status as any) || 'planning',
              version: p.version || '0.1.0',
              progress: p.progress || 0,
              tags: p.tags || [],
              components: [],
              tasks: [],
              repoUrl: p.repo_url,
              source: 'projects' // Mark this as coming from projects page
            };
            
            return project;
          });
          
          // For each project, get its components and tasks
          for (const project of projects) {
            // Get components
            const { data: componentsData, error: componentsError } = await supabase
              .from('project_components')
              .select('*')
              .eq('project_id', project.id);
              
            if (!componentsError && componentsData) {
              project.components = componentsData.map((c: ProjectComponentRecord) => ({
                id: c.id,
                name: c.name,
                description: c.description || '',
                status: (c.status as 'planned' | 'in-development' | 'ready' | 'needs-revision') || 'planned',
                type: (c.type as 'ui' | 'feature' | 'integration' | 'page') || 'feature'
              }));
            }
            
            // Get tasks
            const { data: tasksData, error: tasksError } = await supabase
              .from('project_tasks')
              .select('*')
              .eq('project_id', project.id);
              
            if (!tasksError && tasksData) {
              project.tasks = tasksData.map((t: ProjectTaskRecord) => ({
                id: t.id,
                title: t.title,
                description: t.description || '',
                status: (t.status as 'pending' | 'in-progress' | 'completed' | 'blocked') || 'pending',
                priority: (t.priority as 'low' | 'medium' | 'high') || 'medium',
                assignedTo: t.assigned_to,
                dueDate: t.due_date
              }));
            }
          }
          
          return projects;
        } catch (error) {
          console.error('Error fetching projects:', error);
          return [];
        }
      }
    });
  };
  
  // Get a single project by ID
  const useGetProject = (projectId?: string, source?: string) => {
    return useQuery({
      queryKey: ['project', projectId],
      queryFn: async (): Promise<Project | null> => {
        if (!projectId) return null;
        
        try {
          // Fetch the project
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

          if (error) throw error;
          
          if (!data) return null;
          
          // Create the project object
          const p = data as ProjectRecord;
          const project: Project = {
            id: p.id,
            name: p.name,
            description: p.description || '',
            status: (p.status as any) || 'planning',
            version: p.version || '0.1.0',
            progress: p.progress || 0,
            tags: p.tags || [],
            components: [],
            tasks: [],
            repoUrl: p.image_url,
            source: source || (p as any).source || 'projects' // Track source
          };
          
          // Get components
          const { data: componentsData, error: componentsError } = await supabase
            .from('project_components')
            .select('*')
            .eq('project_id', projectId);
            
          if (!componentsError && componentsData) {
            project.components = componentsData.map((c: ProjectComponentRecord) => ({
              id: c.id,
              name: c.name,
              description: c.description || '',
              status: (c.status as 'planned' | 'in-development' | 'ready' | 'needs-revision') || 'planned',
              type: (c.type as 'ui' | 'feature' | 'integration' | 'page') || 'feature'
            }));
          }
          
          // Get tasks
          const { data: tasksData, error: tasksError } = await supabase
            .from('project_tasks')
            .select('*')
            .eq('project_id', projectId);
            
          if (!tasksError && tasksData) {
            project.tasks = tasksData.map((t: ProjectTaskRecord) => ({
              id: t.id,
              title: t.title,
              description: t.description || '',
              status: (t.status as 'pending' | 'in-progress' | 'completed' | 'blocked') || 'pending',
              priority: (t.priority as 'low' | 'medium' | 'high') || 'medium',
              assignedTo: t.assigned_to,
              dueDate: t.due_date
            }));
          }
          
          return project;
        } catch (error) {
          console.error('Error fetching project:', error);
          return null;
        }
      },
      enabled: !!projectId
    });
  };
  
  // Create a new project
  const useCreateProject = () => {
    return useMutation({
      mutationFn: async (newProject: Omit<Project, 'id'>) => {
        if (!user) throw new Error('User not authenticated');
        
        // Insert into projects table
        const { data, error } = await supabase
          .from('projects')
          .insert({
            name: newProject.name,
            description: newProject.description,
            status: newProject.status,
            version: newProject.version,
            progress: newProject.progress,
            tags: newProject.tags,
            repo_url: newProject.repoUrl
          })
          .select('id')
          .single();
        
        if (error) throw error;
        
        const projectId = data.id;
        
        // Create ownership record
        const { error: ownershipError } = await supabase
          .from('content_ownership')
          .insert({
            content_id: projectId,
            content_type: 'project',
            owner_id: user.id
          });
        
        if (ownershipError) throw ownershipError;
        
        // Insert components if any
        if (newProject.components && newProject.components.length > 0) {
          const componentsToInsert = newProject.components.map(c => ({
            project_id: projectId,
            name: c.name,
            description: c.description,
            status: c.status,
            type: c.type
          }));
          
          const { error: componentsError } = await supabase
            .from('project_components')
            .insert(componentsToInsert);
          
          if (componentsError) throw componentsError;
        }
        
        // Insert tasks if any
        if (newProject.tasks && newProject.tasks.length > 0) {
          const tasksToInsert = newProject.tasks.map(t => ({
            project_id: projectId,
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            assigned_to: t.assignedTo,
            due_date: t.dueDate
          }));
          
          const { error: tasksError } = await supabase
            .from('project_tasks')
            .insert(tasksToInsert);
          
          if (tasksError) throw tasksError;
        }
        
        toast.success('Project created successfully');
        
        return projectId;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      },
      onError: (error) => {
        toast.error(`Failed to create project: ${error.message}`);
      }
    });
  };
  
  // Update project
  const useUpdateProject = () => {
    return useMutation({
      mutationFn: async ({ projectId, updates }: { projectId: string, updates: Partial<Project> }) => {
        if (!user) throw new Error('User not authenticated');
        
        // Ensure user owns the project
        const { data: ownership, error: ownershipError } = await supabase
          .from('content_ownership')
          .select('*')
          .eq('content_id', projectId)
          .eq('content_type', 'project')
          .eq('owner_id', user.id)
          .single();
        
        if (ownershipError || !ownership) {
          throw new Error('You do not have permission to update this project');
        }
        
        const { error } = await supabase
          .from('projects')
          .update({
            name: updates.name,
            description: updates.description,
            status: updates.status,
            version: updates.version,
            progress: updates.progress,
            tags: updates.tags,
            repo_url: updates.repoUrl
          })
          .eq('id', projectId);
        
        if (error) throw error;
        
        toast.success('Project updated successfully');
        
        return projectId;
      },
      onSuccess: (projectId) => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      },
      onError: (error) => {
        toast.error(`Failed to update project: ${error.message}`);
      }
    });
  };
  
  // Create project component
  const useCreateProjectComponent = () => {
    return useMutation({
      mutationFn: async ({ projectId, component }: { projectId: string, component: Omit<ProjectComponent, 'id'> }) => {
        if (!user) throw new Error('User not authenticated');
        
        // Ensure user owns the project
        const { data: ownership, error: ownershipError } = await supabase
          .from('content_ownership')
          .select('*')
          .eq('content_id', projectId)
          .eq('content_type', 'project')
          .eq('owner_id', user.id)
          .single();
        
        if (ownershipError || !ownership) {
          throw new Error('You do not have permission to add components to this project');
        }
        
        const { data, error } = await supabase
          .from('project_components')
          .insert({
            project_id: projectId,
            name: component.name,
            description: component.description,
            status: component.status,
            type: component.type
          })
          .select('id')
          .single();
        
        if (error) throw error;
        
        toast.success('Component created successfully');
        
        return data.id;
      },
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      },
      onError: (error) => {
        toast.error(`Failed to create component: ${error.message}`);
      }
    });
  };
  
  // Update project component
  const useUpdateProjectComponent = () => {
    return useMutation({
      mutationFn: async ({ projectId, componentId, updates }: { 
        projectId: string, 
        componentId: string, 
        updates: Partial<ProjectComponent> 
      }) => {
        if (!user) throw new Error('User not authenticated');
        
        // Ensure user owns the project
        const { data: ownership, error: ownershipError } = await supabase
          .from('content_ownership')
          .select('*')
          .eq('content_id', projectId)
          .eq('content_type', 'project')
          .eq('owner_id', user.id)
          .single();
        
        if (ownershipError || !ownership) {
          throw new Error('You do not have permission to update components in this project');
        }
        
        const { error } = await supabase
          .from('project_components')
          .update({
            name: updates.name,
            description: updates.description,
            status: updates.status,
            type: updates.type
          })
          .eq('id', componentId)
          .eq('project_id', projectId);
        
        if (error) throw error;
        
        toast.success('Component updated successfully');
        
        return componentId;
      },
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      },
      onError: (error) => {
        toast.error(`Failed to update component: ${error.message}`);
      }
    });
  };
  
  // Create project task
  const useCreateProjectTask = () => {
    return useMutation({
      mutationFn: async ({ projectId, task }: { projectId: string, task: Omit<ProjectTask, 'id'> }) => {
        if (!user) throw new Error('User not authenticated');
        
        // Ensure user owns the project
        const { data: ownership, error: ownershipError } = await supabase
          .from('content_ownership')
          .select('*')
          .eq('content_id', projectId)
          .eq('content_type', 'project')
          .eq('owner_id', user.id)
          .single();
        
        if (ownershipError || !ownership) {
          throw new Error('You do not have permission to add tasks to this project');
        }
        
        const { data, error } = await supabase
          .from('project_tasks')
          .insert({
            project_id: projectId,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assigned_to: task.assignedTo,
            due_date: task.dueDate
          })
          .select('id')
          .single();
        
        if (error) throw error;
        
        toast.success('Task created successfully');
        
        return data.id;
      },
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      },
      onError: (error) => {
        toast.error(`Failed to create task: ${error.message}`);
      }
    });
  };
  
  // Update project task
  const useUpdateProjectTask = () => {
    return useMutation({
      mutationFn: async ({ projectId, taskId, updates }: { 
        projectId: string, 
        taskId: string, 
        updates: Partial<ProjectTask> 
      }) => {
        if (!user) throw new Error('User not authenticated');
        
        // Ensure user owns the project
        const { data: ownership, error: ownershipError } = await supabase
          .from('content_ownership')
          .select('*')
          .eq('content_id', projectId)
          .eq('content_type', 'project')
          .eq('owner_id', user.id)
          .single();
        
        if (ownershipError || !ownership) {
          throw new Error('You do not have permission to update tasks in this project');
        }
        
        const { error } = await supabase
          .from('project_tasks')
          .update({
            title: updates.title,
            description: updates.description,
            status: updates.status,
            priority: updates.priority,
            assigned_to: updates.assignedTo,
            due_date: updates.dueDate
          })
          .eq('id', taskId)
          .eq('project_id', projectId);
        
        if (error) throw error;
        
        toast.success('Task updated successfully');
        
        return taskId;
      },
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      },
      onError: (error) => {
        toast.error(`Failed to update task: ${error.message}`);
      }
    });
  };
  
  // Function to fetch a single project
  const fetchProject = async (id: string, source?: string): Promise<Project> => {
    console.log("Fetching project with ID:", id, "Source:", source);
    
    try {
      // If source is 'discover', we want to fetch the project from the public projects
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_components(*), project_tasks(*)')
        .eq('id', id)
        .single();

      console.log("Supabase query result:", data, "Error:", error);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (!data) {
        console.error("No project found with ID:", id);
        throw new Error('No project found');
      }

      const components = (data.project_components || []).map((component: any) => ({
        id: component.id,
        name: component.name,
        description: component.description || '',
        status: (component.status as 'planned' | 'in-development' | 'ready' | 'needs-revision') || 'planned',
        type: (component.type as 'ui' | 'feature' | 'integration' | 'page') || 'feature'
      }));

      const tasks = (data.project_tasks || []).map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: (task.status as 'pending' | 'in-progress' | 'completed' | 'blocked') || 'pending',
        priority: (task.priority as 'low' | 'medium' | 'high') || 'medium',
        assignedTo: task.assigned_to,
        dueDate: task.due_date
      }));

      // Convert the database record to our Project interface with safe fallbacks
      const project: Project = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        // Map the database fields to our interface, with fallbacks
        status: 'planning', // Default to planning
        version: '0.1.0',   // Default version
        progress: 0,        // Default progress
        components,
        tasks,
        repoUrl: data.image_url, // Use image_url which is guaranteed to exist
        tags: data.tags || [],
        source: source || 'projects' // Track source
      };
      
      // Apply any additional properties that might exist
      if ((data as any).status) project.status = (data as any).status;
      if ((data as any).type) project.status = (data as any).type;
      if ((data as any).version) project.version = (data as any).version;
      if ((data as any).progress) project.progress = (data as any).progress;
      if ((data as any).repo_url) project.repoUrl = (data as any).repo_url;

      console.log("Transformed project:", project);
      return project;
    } catch (error) {
      console.error("Error in fetchProject:", error);
      throw error;
    }
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
};
