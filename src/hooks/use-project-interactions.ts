
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectComponent, ProjectTask } from '@/types/project';
import { toast } from 'sonner';

interface UseProjectInteractionsProps {
  projectId: string;
}

export const useProjectInteractions = ({ projectId }: UseProjectInteractionsProps) => {
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingComponent, setIsEditingComponent] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  
  // Record a project event for analytics or history
  const recordEvent = async (
    eventType: 'status_change' | 'task_update' | 'component_update' | 'comment' | 'member_joined',
    details: Record<string, any>
  ) => {
    try {
      // Mock implementation for now
      console.log(`Recorded event: ${eventType}`, details);
      return true;
    } catch (err) {
      console.error(`Error recording project event:`, err);
      return false;
    }
  };
  
  // Update the project status and record the change
  const updateProjectStatus = async (project: Project, newStatus: Project['status']): Promise<boolean> => {
    try {
      // Don't update if status is the same
      if (project.status === newStatus) {
        return true;
      }
      
      // Update the project status in the database
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', project.id);
        
      if (error) throw error;
      
      // Record the status change event
      await recordEvent('status_change', { 
        previousStatus: project.status,
        newStatus: newStatus,
        projectId: project.id,
        projectName: project.name
      });
      
      toast.success(`Project status updated to ${newStatus.replace('_', ' ')}`);
      return true;
    } catch (err: any) {
      console.error('Error updating project status:', err);
      toast.error(`Failed to update project status: ${err.message}`);
      return false;
    }
  };
  
  // Add a new component to the project
  const addProjectComponent = async (component: Omit<ProjectComponent, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    setIsAddingComponent(true);
    try {
      const { data, error } = await supabase.rpc('insert_project_component', {
        p_project_id: projectId,
        p_name: component.name,
        p_description: component.description || '',
        p_status: component.status,
        p_type: component.type,
        p_dependencies: component.dependencies || []
      });
      
      if (error) throw error;
      
      await recordEvent('component_update', {
        action: 'created',
        componentId: data.id,
        componentName: component.name,
        projectId
      });
      
      toast.success(`Component "${component.name}" added successfully`);
      return true;
    } catch (err: any) {
      console.error('Error adding project component:', err);
      toast.error(`Failed to add component: ${err.message}`);
      return false;
    } finally {
      setIsAddingComponent(false);
    }
  };
  
  // Update an existing component
  const updateProjectComponent = async (component: ProjectComponent): Promise<boolean> => {
    setIsEditingComponent(true);
    try {
      const { error } = await supabase.rpc('update_project_component', {
        p_id: component.id,
        p_name: component.name,
        p_description: component.description || '',
        p_status: component.status,
        p_type: component.type,
        p_dependencies: component.dependencies || []
      });
      
      if (error) throw error;
      
      await recordEvent('component_update', {
        action: 'updated',
        componentId: component.id,
        componentName: component.name,
        projectId
      });
      
      toast.success(`Component "${component.name}" updated successfully`);
      return true;
    } catch (err: any) {
      console.error('Error updating project component:', err);
      toast.error(`Failed to update component: ${err.message}`);
      return false;
    } finally {
      setIsEditingComponent(false);
    }
  };
  
  // Add a new task to the project
  const addProjectTask = async (task: Omit<ProjectTask, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    setIsAddingTask(true);
    try {
      const { data, error } = await supabase.rpc('insert_project_task', {
        p_project_id: projectId,
        p_title: task.title || task.name,
        p_description: task.description || '',
        p_status: task.status,
        p_priority: task.priority,
        p_assigned_to: task.assignedTo || '',
        p_due_date: task.dueDate || ''
      });
      
      if (error) throw error;
      
      await recordEvent('task_update', {
        action: 'created',
        taskId: data.id,
        taskName: task.title || task.name,
        projectId
      });
      
      toast.success(`Task "${task.title || task.name}" added successfully`);
      return true;
    } catch (err: any) {
      console.error('Error adding project task:', err);
      toast.error(`Failed to add task: ${err.message}`);
      return false;
    } finally {
      setIsAddingTask(false);
    }
  };
  
  // Update an existing task
  const updateProjectTask = async (task: ProjectTask): Promise<boolean> => {
    setIsEditingTask(true);
    try {
      const { error } = await supabase.rpc('update_project_task', {
        p_id: task.id,
        p_title: task.title || task.name,
        p_description: task.description || '',
        p_status: task.status,
        p_priority: task.priority,
        p_assigned_to: task.assignedTo || '',
        p_due_date: task.dueDate || ''
      });
      
      if (error) throw error;
      
      await recordEvent('task_update', {
        action: 'updated',
        taskId: task.id,
        taskName: task.title || task.name,
        projectId
      });
      
      toast.success(`Task "${task.title || task.name}" updated successfully`);
      return true;
    } catch (err: any) {
      console.error('Error updating project task:', err);
      toast.error(`Failed to update task: ${err.message}`);
      return false;
    } finally {
      setIsEditingTask(false);
    }
  };
  
  // Update project progress percentage
  const updateProjectProgress = async (project: Project, newProgress: number): Promise<boolean> => {
    try {
      if (newProgress < 0 || newProgress > 100) {
        throw new Error('Progress must be between 0 and 100');
      }
      
      const { error } = await supabase
        .from('projects')
        .update({ 
          progress: newProgress,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);
        
      if (error) throw error;
      
      toast.success(`Project progress updated to ${newProgress}%`);
      return true;
    } catch (err: any) {
      console.error('Error updating project progress:', err);
      toast.error(`Failed to update progress: ${err.message}`);
      return false;
    }
  };
  
  return {
    recordEvent,
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
