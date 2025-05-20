
import { useState } from 'react';
import { Project, ProjectComponent, ProjectTask, ProjectStatus, ProjectTaskStatus } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

interface ProjectInteractionsProps {
  projectId: string;
}

export const useProjectInteractions = ({ projectId }: ProjectInteractionsProps) => {
  const [components, setComponents] = useState<ProjectComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const [isEditingComponent, setIsEditingComponent] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const { user } = useAuth();

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_components')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      setComponents(data as ProjectComponent[]);
    } catch (err) {
      console.error('Error fetching project components:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createComponent = async (component: Omit<ProjectComponent, 'id' | 'projectId'>) => {
    try {
      setIsAddingComponent(true);
      const newComponent = {
        ...component,
        project_id: projectId
      };
      
      const { data, error } = await supabase
        .from('project_components')
        .insert(newComponent)
        .select()
        .single();
      
      if (error) throw error;
      
      setComponents(prev => [...prev, data as ProjectComponent]);
      return data as ProjectComponent;
    } catch (err) {
      console.error('Error creating component:', err);
      throw err;
    } finally {
      setIsAddingComponent(false);
    }
  };

  const updateComponent = async (component: ProjectComponent) => {
    try {
      setIsEditingComponent(true);
      const { data, error } = await supabase
        .from('project_components')
        .update(component)
        .eq('id', component.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setComponents(prev => 
        prev.map(c => c.id === component.id ? (data as ProjectComponent) : c)
      );
      return data as ProjectComponent;
    } catch (err) {
      console.error('Error updating component:', err);
      throw err;
    } finally {
      setIsEditingComponent(false);
    }
  };

  const deleteComponent = async (componentId: string) => {
    try {
      const { error } = await supabase
        .from('project_components')
        .delete()
        .eq('id', componentId);
      
      if (error) throw error;
      
      setComponents(prev => prev.filter(c => c.id !== componentId));
      return true;
    } catch (err) {
      console.error('Error deleting component:', err);
      throw err;
    }
  };

  // Project status management
  const updateProjectStatus = async (project: Project, newStatus: ProjectStatus): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', project.id);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating project status:', err);
      return false;
    }
  };

  // Project component management
  const addProjectComponent = async (componentData: {
    name: string;
    type: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
  }): Promise<boolean> => {
    try {
      setIsAddingComponent(true);
      
      const { error } = await supabase
        .from('project_components')
        .insert({
          ...componentData,
          project_id: projectId
        });
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error adding project component:', err);
      return false;
    } finally {
      setIsAddingComponent(false);
    }
  };

  const updateProjectComponent = async (component: ProjectComponent): Promise<boolean> => {
    try {
      setIsEditingComponent(true);
      
      const { error } = await supabase
        .from('project_components')
        .update(component)
        .eq('id', component.id);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating project component:', err);
      return false;
    } finally {
      setIsEditingComponent(false);
    }
  };

  // Project task management
  const addProjectTask = async (taskData: {
    title: string;
    name?: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    assignedTo?: string;
    dueDate?: string;
  }): Promise<boolean> => {
    try {
      setIsAddingTask(true);
      
      const { error } = await supabase
        .from('project_tasks')
        .insert({
          ...taskData,
          name: taskData.name || taskData.title, // Ensure name is set
          project_id: projectId
        });
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error adding project task:', err);
      return false;
    } finally {
      setIsAddingTask(false);
    }
  };

  const updateProjectTask = async (task: ProjectTask): Promise<boolean> => {
    try {
      setIsEditingTask(true);
      
      const { error } = await supabase
        .from('project_tasks')
        .update(task)
        .eq('id', task.id);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating project task:', err);
      return false;
    } finally {
      setIsEditingTask(false);
    }
  };

  // Project progress management
  const updateProjectProgress = async (project: Project, progress: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ progress })
        .eq('id', project.id);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating project progress:', err);
      return false;
    }
  };

  return {
    components,
    loading,
    error,
    fetchComponents,
    createComponent,
    updateComponent,
    deleteComponent,
    updateProjectStatus,
    addProjectComponent,
    updateProjectComponent,
    addProjectTask,
    updateProjectTask,
    updateProjectProgress,
    isAddingComponent,
    isAddingTask,
    isEditingComponent,
    isEditingTask
  };
};
