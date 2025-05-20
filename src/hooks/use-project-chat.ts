
import { useState } from 'react';
import { ProjectMessage, ReferenceItem } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export const useProjectChat = (projectId: string) => {
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // This is a mock implementation since the project_messages table doesn't exist in the provided schema
      // In a real implementation, you would fetch from the actual table
      // Mocking the fetch for now to make TypeScript happy
      const mockMessages: ProjectMessage[] = [];
      setMessages(mockMessages);
      
      // The commented code below would be the real implementation
      // const { data, error } = await supabase
      //   .from('project_messages')
      //   .select('*')
      //   .eq('project_id', projectId)
      //   .order('created_at', { ascending: true });
      // 
      // if (error) throw error;
      // setMessages(data as ProjectMessage[]);
    } catch (err) {
      console.error('Error fetching project messages:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (content: string, reference?: ReferenceItem) => {
    if (!user) return;
    
    try {
      // Mock function for recordEvent
      const recordEvent = (eventType: string, projectId: string) => {
        console.log(`Event ${eventType} recorded for project ${projectId}`);
        return Promise.resolve();
      };
      
      // Record chat event
      await recordEvent('chat_message', projectId);
      
      const newMessage: Omit<ProjectMessage, 'id' | 'createdAt'> = {
        projectId,
        userId: user.id,
        userName: user.email || 'Anonymous',
        userAvatar: user.user_metadata?.avatar_url,
        content,
        isNotification: false
      };
      
      if (reference) {
        newMessage.reference = {
          type: reference.type,
          id: reference.id,
          name: reference.name,
          status: reference.status
        };
      }
      
      // Mock implementation
      const mockData = {
        ...newMessage,
        id: `mock-${Date.now()}`,
        createdAt: new Date().toISOString(),
      } as ProjectMessage;
      
      setMessages(prev => [...prev, mockData]);
      return mockData;
      
      // The commented code below would be the real implementation
      // const { data, error } = await supabase
      //   .from('project_messages')
      //   .insert(newMessage)
      //   .select()
      //   .single();
      // 
      // if (error) throw error;
      // 
      // setMessages(prev => [...prev, data as ProjectMessage]);
      // return data;
    } catch (err) {
      console.error('Error adding message:', err);
      throw err;
    }
  };
  
  const addSystemNotification = async (content: string, reference?: ReferenceItem) => {
    if (!user) return;
    
    try {
      const newNotification: Omit<ProjectMessage, 'id' | 'createdAt'> = {
        projectId,
        userId: user.id,
        userName: 'System',
        content,
        isNotification: true
      };
      
      if (reference) {
        newNotification.reference = {
          type: reference.type,
          id: reference.id,
          name: reference.name,
          status: reference.status
        };
      }
      
      // Mock implementation
      const mockData = {
        ...newNotification,
        id: `mock-${Date.now()}`,
        createdAt: new Date().toISOString(),
      } as ProjectMessage;
      
      setMessages(prev => [...prev, mockData]);
      return mockData;
      
      // The commented code below would be the real implementation
      // const { data, error } = await supabase
      //   .from('project_messages')
      //   .insert(newNotification)
      //   .select()
      //   .single();
      // 
      // if (error) throw error;
      // 
      // setMessages(prev => [...prev, data as ProjectMessage]);
      // return data;
    } catch (err) {
      console.error('Error adding notification:', err);
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    fetchMessages,
    addMessage,
    addSystemNotification
  };
};
