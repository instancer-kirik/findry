
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { ProjectEvent, Project } from '@/types/project';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface UseProjectInteractionsProps {
  projectId: string;
}

export const useProjectInteractions = ({ projectId }: UseProjectInteractionsProps) => {
  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Channel name format to ensure consistency
  const channelName = `project_events_${projectId}`;

  useEffect(() => {
    fetchEvents();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'project_event' }, (payload) => {
        const newEvent = payload.payload as ProjectEvent;
        setEvents(prev => [...prev, newEvent]);

        // If it's a status change, refresh the project data
        if (newEvent.type === 'status_change' || 
            newEvent.type === 'task_update' || 
            newEvent.type === 'component_update') {
          queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would fetch events from Supabase
      // For now, use mock data
      const mockEvents: ProjectEvent[] = [
        {
          type: 'status_change',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          userId: 'system',
          userName: 'System',
          details: {
            oldStatus: 'planning',
            newStatus: 'in_progress'
          }
        },
        {
          type: 'task_update',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          userId: '1',
          userName: 'Alex Chen',
          details: {
            taskId: '123',
            taskName: 'Design user interface',
            oldStatus: 'pending',
            newStatus: 'in_progress'
          }
        }
      ];

      setEvents(mockEvents);
    } catch (err) {
      console.error('Error fetching project events:', err);
      setError('Failed to fetch project events');
    } finally {
      setIsLoading(false);
    }
  };

  const recordEvent = async (eventType: ProjectEvent['type'], details: Record<string, any>) => {
    if (!user) {
      toast.error('You must be logged in to record project events');
      return null;
    }

    try {
      const event: ProjectEvent = {
        type: eventType,
        timestamp: new Date().toISOString(),
        userId: user.id,
        userName: user.user_metadata?.full_name || user.email || 'User',
        details
      };

      // In a real implementation, you would save to Supabase
      // For now, just update local state and broadcast

      // Add to local state
      setEvents(prev => [...prev, event]);

      // Broadcast to channel
      await supabase.channel(channelName).send({
        type: 'broadcast',
        event: 'project_event',
        payload: event
      });

      return event;
    } catch (err) {
      console.error('Error recording project event:', err);
      toast.error('Failed to record project event');
      return null;
    }
  };

  const updateProjectStatus = async (project: Project, newStatus: Project['status']) => {
    if (!user) {
      toast.error('You must be logged in to update project status');
      return false;
    }

    try {
      // Update the project status in Supabase
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', project.id);

      if (error) throw error;

      // Record the status change event
      await recordEvent('status_change', {
        oldStatus: project.status,
        newStatus
      });

      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      
      toast.success(`Project status updated to ${newStatus.replace('_', ' ')}`);
      return true;
    } catch (err) {
      console.error('Error updating project status:', err);
      toast.error('Failed to update project status');
      return false;
    }
  };

  return {
    events,
    isLoading,
    error,
    recordEvent,
    updateProjectStatus
  };
};
