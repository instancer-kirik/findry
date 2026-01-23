import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { Database } from '@/integrations/supabase/types';

// Use Supabase types
type ProjectRecord = Database['public']['Tables']['projects']['Row'];
type ProjectComponentRecord = Database['public']['Tables']['project_components']['Row'];
type ProjectTaskRecord = Database['public']['Tables']['project_tasks']['Row'];

// Extended types for our application
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
  updated_at?: string;
}

// Unified project record from the view
interface UnifiedProjectRecord {
  id: string;
  name: string;
  description: string | null;
  domain: string | null;
  status: string | null;
  tech_stack: string[] | null;
  features: string[] | null;
  source_url: string | null;
  emoji: string | null;
  featured: boolean | null;
  featured_order: number | null;
  project_type: string | null;
  source_table: string | null;
  created_at: string | null;
  updated_at: string | null;
  dev_project_id: string | null;
  dev_version: string | null;
  dev_progress: number | null;
  dev_repo_url: string | null;
  idea_id: string | null;
  idea_category_id: string | null;
  target_market: string | null;
  problem_statement: string | null;
  solution_approach: string | null;
  feasibility_score: number | null;
  market_potential_score: number | null;
  priority_score: number | null;
  category_name: string | null;
  category_icon: string | null;
  category_color: string | null;
  path: string | null;
}

// Get all projects from unified_projects view
export const useGetProjects = () => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async (): Promise<Project[]> => {
      try {
        // Fetch from unified_projects view - includes all project types
        const { data: unifiedData, error: unifiedError } = await supabase
          .from('unified_projects')
          .select('*')
          .order('featured', { ascending: false })
          .order('updated_at', { ascending: false });

        if (unifiedError) {
          console.error('Error fetching unified projects:', unifiedError);
        }

        // Also fetch from projects table for user-specific projects with full features
        let projectsData: ProjectRecord[] = [];
        
        if (user) {
          const [ownershipResult, directOwnerResult] = await Promise.all([
            supabase
              .from('content_ownership')
              .select('content_id')
              .eq('content_type', 'project')
              .eq('owner_id', user.id),
            supabase
              .from('projects')
              .select('*')
              .or(`owner_id.eq.${user.id},created_by.eq.${user.id}`)
          ]);

          const ownershipIds = (ownershipResult.data || []).map(item => item.content_id);
          
          let ownershipProjects: ProjectRecord[] = [];
          if (ownershipIds.length > 0) {
            const { data } = await supabase
              .from('projects')
              .select('*')
              .in('id', ownershipIds);
            ownershipProjects = data || [];
          }

          const allProjects = [
            ...ownershipProjects,
            ...(directOwnerResult.data || [])
          ];
          
          const projectMap = new Map<string, ProjectRecord>();
          allProjects.forEach(p => projectMap.set(p.id, p));
          projectsData = Array.from(projectMap.values());
        }

        // Process unified projects
        const unifiedProjects: Project[] = (unifiedData || []).map((p: UnifiedProjectRecord) => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          status: (p.status as any) || 'planning',
          version: p.dev_version || '0.1.0',
          progress: p.dev_progress || 0,
          tags: p.tech_stack || [],
          components: [],
          tasks: [],
          repoUrl: p.source_url || p.dev_repo_url,
          source: p.source_table || 'unified',
          updated_at: p.updated_at || undefined
        }));

        // Process user's projects table data
        const userProjects: Project[] = projectsData.map((p: ProjectRecord) => ({
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
          source: 'projects',
          updated_at: p.updated_at
        }));

        // Combine and deduplicate by id (user projects take priority)
        const projectMap = new Map<string, Project>();
        unifiedProjects.forEach(p => projectMap.set(p.id, p));
        userProjects.forEach(p => projectMap.set(p.id, p)); // Override with user projects
        const projects = Array.from(projectMap.values());
        
        // For user projects from 'projects' table, get components and tasks
        for (const project of projects) {
          if (project.source === 'projects') {
            const { data: componentsData } = await supabase
              .from('project_components')
              .select('*')
              .eq('project_id', project.id);
              
            if (componentsData) {
              project.components = componentsData.map((c: ProjectComponentRecord) => ({
                id: c.id,
                name: c.name,
                description: c.description || '',
                status: (c.status as 'planned' | 'in-development' | 'ready' | 'needs-revision') || 'planned',
                type: (c.type as 'ui' | 'feature' | 'integration' | 'page') || 'feature'
              }));
            }
            
            const { data: tasksData } = await supabase
              .from('project_tasks')
              .select('*')
              .eq('project_id', project.id);
              
            if (tasksData) {
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
        
        const project: Project = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          status: (data.status as any) || 'planning',
          version: data.version || '0.1.0',
          progress: data.progress || 0,
          tags: data.tags || [],
          components: [],
          tasks: [],
          repoUrl: data.repo_url,
          source: 'projects',
          updated_at: data.updated_at
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
        console.error(`Error fetching project ${projectId}:`, error);
        return null;
      }
    },
    enabled: !!projectId
  });
};

// Create a new project
const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (newProject: Omit<Project, 'id'>) => {
      try {
        // Insert the project into the database
        const { data, error } = await supabase
          .from('projects')
          .insert({
            name: newProject.name,
            description: newProject.description,
            status: newProject.status,
            version: newProject.version,
            progress: newProject.progress,
            repo_url: newProject.repoUrl,
            tags: newProject.tags || []
          })
          .select('id')
          .single();
          
        if (error) throw error;
        if (!data) throw new Error('No data returned from insert');
        
        const projectId = data.id;
        
        // If user is logged in, create ownership record
        if (user) {
          const { error: ownershipError } = await supabase
            .from('content_ownership')
            .insert({
              content_id: projectId,
              content_type: 'project',
              owner_id: user.id
            });
            
          if (ownershipError) {
            console.error('Error creating ownership record:', ownershipError);
            // Continue anyway - project is created but ownership might not be
          }
        }
        
        // Insert components if any
        if (newProject.components && newProject.components.length > 0) {
          const componentsToInsert = newProject.components.map(component => ({
            project_id: projectId,
            name: component.name,
            description: component.description,
            status: component.status,
            type: component.type
          }));
          
          const { error: componentsError } = await supabase
            .from('project_components')
            .insert(componentsToInsert);
            
          if (componentsError) {
            console.error('Error inserting components:', componentsError);
          }
        }
        
        // Insert tasks if any
        if (newProject.tasks && newProject.tasks.length > 0) {
          const tasksToInsert = newProject.tasks.map(task => ({
            project_id: projectId,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assigned_to: task.assignedTo,
            due_date: task.dueDate
          }));
          
          const { error: tasksError } = await supabase
            .from('project_tasks')
            .insert(tasksToInsert);
            
          if (tasksError) {
            console.error('Error inserting tasks:', tasksError);
          }
        }
      
      toast.success('Project created successfully');
      return projectId;
      } catch (error: any) {
        console.error('Error creating project:', error);
        toast.error(`Failed to create project: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
};

// Update task status
const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: ProjectTask['status'] }) => {
      try {
        const { error } = await supabase
          .from('project_tasks')
          .update({ status })
          .eq('id', taskId);
          
        if (error) throw error;
      
      toast.success(`Task status updated to ${status}`);
      return taskId;
      } catch (error: any) {
        console.error('Error updating task status:', error);
        toast.error(`Failed to update task: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
};

// Create a test project (for debugging)
const createTestProject = async () => {
  const { user } = useUser();

  try {
    console.log('Creating test project...');
    
    // Insert the project into the database
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: 'Test Project ' + new Date().toLocaleTimeString(),
        description: 'This is a test project created for debugging',
        status: 'planning',
        version: '0.1.0',
        progress: 10,
        tags: ['test', 'debug']
      })
      .select('*')
      .single();
      
    if (error) {
      console.error('Error creating test project:', error);
      toast.error(`Failed to create test project: ${error.message}`);
      return null;
    }
    
    if (!data) {
      console.error('No data returned from insert');
      toast.error('Failed to create test project: No data returned');
      return null;
    }
    
    console.log('Test project created:', data);
    toast.success('Test project created successfully');
    
    // If user is logged in, create ownership record
    if (user) {
      const { error: ownershipError } = await supabase
        .from('content_ownership')
        .insert({
          content_id: data.id,
          content_type: 'project',
          owner_id: user.id
        });
        
      if (ownershipError) {
        console.error('Error creating ownership record:', ownershipError);
      }
    }
    
    return data;
  } catch (error: any) {
    console.error('Error creating test project:', error);
    toast.error(`Failed to create test project: ${error.message}`);
    return null;
  }
};

// Named exports for direct use
export { useUpdateTaskStatus };

export const useProjects = () => {
  return {
    useGetProjects,
    useGetProject,
    useCreateProject,
    useUpdateTaskStatus,
    createTestProject
  };
};