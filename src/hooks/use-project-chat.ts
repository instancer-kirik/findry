import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface ProjectMessage {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
  is_notification?: boolean;
}

interface UseProjectChatParams {
  projectId: string;
  projectName: string;
}

export const useProjectChat = ({ projectId, projectName }: UseProjectChatParams) => {
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Channel name format to ensure consistency
  const channelName = `project_chat_${projectId}`;
  
  // Initialize and fetch messages
  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'new_message' }, (payload) => {
        const newMsg = payload.payload as ProjectMessage;
        
        // Add message to the list
        setMessages(prev => 
          // Avoid duplicates
          prev.some(msg => msg.id === newMsg.id) 
            ? prev 
            : [...prev, newMsg]
        );
        
        // Handle notifications for messages from other users
        if (newMsg.user_id !== user?.id) {
          notifyNewMessage(newMsg);
        }
      })
      .on('broadcast', { event: 'project_update' }, (payload) => {
        const notification = payload.payload as ProjectMessage;
        
        // Add notification to the list
        setMessages(prev => 
          prev.some(msg => msg.id === notification.id) 
            ? prev 
            : [...prev, notification]
        );
        
        // Always notify for project updates
        notifyProjectUpdate(notification);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, user?.id]);
  
  // Fetch messages from the database
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would fetch messages from Supabase
      // Example query:
      // const { data, error } = await supabase
      //   .from('project_messages')
      //   .select('*')
      //   .eq('project_id', projectId)
      //   .order('created_at', { ascending: true });
      
      // For now, use mock data
      const mockMessages: ProjectMessage[] = [
        {
          id: '1',
          project_id: projectId,
          user_id: '1',
          user_name: 'Alex Chen',
          user_avatar: '/placeholder.svg',
          content: "Hi team! I've started working on the authentication component.",
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '2',
          project_id: projectId,
          user_id: '2',
          user_name: 'Sarah Johnson',
          user_avatar: '/placeholder.svg',
          content: "Great! I'll handle the UI components. Let me know if you need any design help.",
          created_at: new Date(Date.now() - 72000000).toISOString(),
        },
        {
          id: '3',
          project_id: projectId,
          user_id: 'system',
          user_name: 'System',
          content: 'Task "Implement login form" marked as completed by Mike Wilson',
          created_at: new Date(Date.now() - 36000000).toISOString(),
          is_notification: true,
        },
        {
          id: '4',
          project_id: projectId,
          user_id: '4',
          user_name: 'Jamie Rivera',
          user_avatar: '/placeholder.svg',
          content: 'Just pushed the latest changes to the repo. Can someone review the PR?',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        }
      ];
      
      setMessages(mockMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };
  
  // Send a regular chat message
  const sendMessage = async (content: string) => {
    if (!user) {
      toast.error('You must be logged in to send messages');
      return;
    }
    
    try {
      // Generate message ID
      const messageId = `msg_${Date.now()}`;
      
      // Create message object
      const message: ProjectMessage = {
        id: messageId,
        project_id: projectId,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email || 'User',
        user_avatar: user.user_metadata?.avatar_url,
        content,
        created_at: new Date().toISOString(),
      };
      
      // In a real implementation, you would save to Supabase
      // Example:
      // const { error } = await supabase.from('project_messages').insert(message);
      // if (error) throw error;
      
      // Add to local state
      setMessages(prev => [...prev, message]);
      
      // Broadcast to channel
      await supabase.channel(channelName).send({
        type: 'broadcast',
        event: 'new_message',
        payload: message
      });
      
      return message;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      return null;
    }
  };
  
  // Send a project update notification
  const sendProjectUpdate = async (content: string) => {
    if (!user) {
      toast.error('You must be logged in to send updates');
      return;
    }
    
    try {
      // Generate message ID
      const messageId = `notify_${Date.now()}`;
      
      // Create notification object
      const notification: ProjectMessage = {
        id: messageId,
        project_id: projectId,
        user_id: 'system',
        user_name: 'System',
        content,
        created_at: new Date().toISOString(),
        is_notification: true,
      };
      
      // In a real implementation, you would save to Supabase
      // Example:
      // const { error } = await supabase.from('project_messages').insert(notification);
      // if (error) throw error;
      
      // Add to local state
      setMessages(prev => [...prev, notification]);
      
      // Broadcast to channel
      await supabase.channel(channelName).send({
        type: 'broadcast',
        event: 'project_update',
        payload: notification
      });
      
      return notification;
    } catch (err) {
      console.error('Error sending project update:', err);
      toast.error('Failed to send project update');
      return null;
    }
  };
  
  // Display notification for new messages
  const notifyNewMessage = (message: ProjectMessage) => {
    toast.success(`New message in ${projectName}`, {
      description: `${message.user_name}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`,
      action: {
        label: "View",
        onClick: () => navigate(`/projects/${projectId}?tab=chat`),
      }
    });
  };
  
  // Display notification for project updates
  const notifyProjectUpdate = (notification: ProjectMessage) => {
    toast.info(`Update in ${projectName}`, {
      description: notification.content,
      action: {
        label: "View",
        onClick: () => navigate(`/projects/${projectId}?tab=chat`),
      }
    });
  };
  
  return {
    messages,
    loading,
    error,
    sendMessage,
    sendProjectUpdate,
  };
}; 