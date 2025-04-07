import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface ChatNotification {
  id: string;
  source: 'chat' | 'project' | 'system';
  sourceId: string;
  sourceName: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatarUrl?: string;
}

export const useChatNotifications = () => {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Subscribe to notification channels
  useEffect(() => {
    if (!user) return;
    
    // User-specific notification channel
    const userNotificationChannel = `user_notifications_${user.id}`;
    
    // Subscribe to user notifications
    const channel = supabase.channel(userNotificationChannel)
      .on('broadcast', { event: 'new_notification' }, (payload) => {
        const notification = payload.payload as ChatNotification;
        
        // Add to state if not already present
        setNotifications(prev => {
          if (prev.some(n => n.id === notification.id)) {
            return prev;
          }
          return [notification, ...prev];
        });
        
        // Update unread count
        setUnreadCount(prev => prev + 1);
        
        // Show toast notification
        displayNotificationToast(notification);
      })
      .subscribe();
      
    // Listen for project chat messages
    const projectsChannel = supabase.channel('project_chats')
      .on('broadcast', { event: 'new_message' }, (payload) => {
        if (!payload.payload.projectId || payload.payload.userId === user.id) return;
        
        // Create notification from project message
        const projectNotification: ChatNotification = {
          id: `proj_${Date.now()}`,
          source: 'project',
          sourceId: payload.payload.projectId,
          sourceName: payload.payload.projectName || 'Project Chat',
          senderId: payload.payload.userId,
          senderName: payload.payload.userName || 'Team Member',
          message: payload.payload.content,
          timestamp: new Date().toISOString(),
          read: false,
          avatarUrl: payload.payload.userAvatar
        };
        
        // Add to state
        setNotifications(prev => [projectNotification, ...prev]);
        
        // Update unread count
        setUnreadCount(prev => prev + 1);
        
        // Show toast notification
        displayNotificationToast(projectNotification);
      })
      .subscribe();
    
    // Fetch initial notifications
    fetchNotifications();
    
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(projectsChannel);
    };
  }, [user?.id]);
  
  // Fetch user's notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      // In a real implementation, fetch from Supabase
      // Example query:
      // const { data, error } = await supabase
      //   .from('user_notifications')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('created_at', { ascending: false })
      //   .limit(20);
      
      // For demo purposes, use mock data
      const mockNotifications: ChatNotification[] = [
        {
          id: '1',
          source: 'chat',
          sourceId: 'chat1',
          sourceName: 'Sarah Johnson',
          senderId: 'user1',
          senderName: 'Sarah Johnson',
          message: 'Hey! I saw your recent work. It looks amazing!',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          avatarUrl: '/placeholder.svg'
        },
        {
          id: '2',
          source: 'project',
          sourceId: 'project1',
          sourceName: 'Website Redesign',
          senderId: 'user2',
          senderName: 'Mike Wilson',
          message: 'I completed the homepage design. Can you review it?',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: true,
          avatarUrl: '/placeholder.svg'
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      // Update in state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // In a real implementation, update in Supabase
      // Example:
      // await supabase
      //   .from('user_notifications')
      //   .update({ read: true })
      //   .eq('id', notificationId)
      //   .eq('user_id', user.id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Update in state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      
      // Reset unread count
      setUnreadCount(0);
      
      // In a real implementation, update in Supabase
      // Example:
      // await supabase
      //   .from('user_notifications')
      //   .update({ read: true })
      //   .eq('user_id', user.id)
      //   .eq('read', false);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Navigate to the source of the notification
  const navigateToSource = (notification: ChatNotification) => {
    // Mark as read first
    markAsRead(notification.id);
    
    // Navigate based on source type
    switch (notification.source) {
      case 'chat':
        navigate(`/chats?id=${notification.sourceId}`);
        break;
      case 'project':
        navigate(`/projects/${notification.sourceId}?tab=chat`);
        break;
      case 'system':
        // Handle system notifications (e.g., announcements)
        navigate('/dashboard');
        break;
    }
  };
  
  // Display toast notification
  const displayNotificationToast = (notification: ChatNotification) => {
    const title = notification.source === 'project' 
      ? `New message in ${notification.sourceName}` 
      : `New message from ${notification.senderName}`;
      
    toast(title, {
      description: notification.message.length > 60 
        ? `${notification.message.substring(0, 60)}...` 
        : notification.message,
      action: {
        label: 'View',
        onClick: () => navigateToSource(notification)
      }
    });
  };
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    navigateToSource
  };
}; 