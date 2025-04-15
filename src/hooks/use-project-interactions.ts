
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import { toast } from 'sonner';

interface UseProjectInteractionsProps {
  projectId: string;
}

export const useProjectInteractions = ({ projectId }: UseProjectInteractionsProps) => {
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
  
  return {
    recordEvent,
    updateProjectStatus
  };
};
