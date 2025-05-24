
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectMessage } from '@/types/project';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

export const useProjectChat = (projectId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['project-messages', projectId],
    queryFn: async (): Promise<ProjectMessage[]> => {
      if (!projectId) return [];
      
      try {
        // Mock implementation since project_messages table doesn't exist
        // Return empty array for now
        return [];
      } catch (error: any) {
        console.error('Error fetching project messages:', error);
        toast.error(`Error fetching messages: ${error.message}`);
        return [];
      }
    },
    enabled: !!projectId
  });

  const addMessage = useMutation({
    mutationFn: async (newMessage: { 
      content: string; 
      isNotification?: boolean;
      reference?: {
        type: 'component' | 'task';
        id: string;
        name: string;
        status?: string;
      };
    }) => {
      if (!projectId || !user) throw new Error('Missing required data');
      
      try {
        // Mock implementation since project_messages table doesn't exist
        const message: ProjectMessage = {
          id: Date.now().toString(),
          projectId,
          userId: user.id,
          userName: user.email || 'Unknown User',
          userAvatar: undefined,
          content: newMessage.content,
          createdAt: new Date().toISOString(),
          isNotification: newMessage.isNotification || false,
          reference: newMessage.reference ? {
            type: newMessage.reference.type as 'component' | 'task',
            id: newMessage.reference.id,
            name: newMessage.reference.name,
            status: newMessage.reference.status
          } : undefined
        };
        
        return message;
      } catch (error: any) {
        console.error('Error adding message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-messages', projectId] });
      toast.success('Message sent');
    },
    onError: (error: any) => {
      toast.error(`Error sending message: ${error.message}`);
    }
  });

  const addSystemMessage = useMutation({
    mutationFn: async (content: string, reference?: { 
      type: 'component' | 'task'; 
      id: string; 
      name: string;
      status?: string;
    }) => {
      if (!projectId) throw new Error('Project ID required');
      
      try {
        // Mock implementation since project_messages table doesn't exist
        const message: ProjectMessage = {
          id: Date.now().toString(),
          projectId,
          userId: 'system',
          userName: 'System',
          userAvatar: undefined,
          content,
          createdAt: new Date().toISOString(),
          isNotification: true,
          reference: reference ? {
            type: reference.type as 'component' | 'task',
            id: reference.id,
            name: reference.name,
            status: reference.status
          } : undefined
        };
        
        return message;
      } catch (error: any) {
        console.error('Error adding system message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-messages', projectId] });
    },
    onError: (error: any) => {
      console.error('Error adding system message:', error);
    }
  });

  return {
    messages,
    isLoading,
    addMessage: addMessage.mutateAsync,
    addSystemMessage: addSystemMessage.mutateAsync,
    isAddingMessage: addMessage.isPending || addSystemMessage.isPending
  };
};
