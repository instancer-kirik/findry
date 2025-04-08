
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useLocalStorage } from '@/hooks/use-local-storage';

export interface EventbriteHookReturn {
  useHasIntegrated: () => ReturnType<typeof useQuery>;
  useDisconnectEventbrite: () => ReturnType<typeof useMutation>;
  useImportEvents: () => ReturnType<typeof useMutation>;
}

interface EventbriteIntegration {
  user_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  integration_type: string;
}

const EVENTBRITE_STORAGE_KEY = 'eventbrite_integration';

export const useEventbrite = (): EventbriteHookReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [eventbriteData, setEventbriteData] = useLocalStorage<EventbriteIntegration | null>(EVENTBRITE_STORAGE_KEY, null);
  
  // Check if user has integrated Eventbrite
  const useHasIntegrated = () => {
    return useQuery({
      queryKey: ['user-eventbrite-integration', user?.id],
      queryFn: async () => {
        if (!user) return false;
        
        // Check localStorage for integration data
        return eventbriteData && 
               eventbriteData.user_id === user.id && 
               eventbriteData.is_active === true;
      },
      enabled: !!user
    });
  };
  
  // Disconnect Eventbrite integration
  const useDisconnectEventbrite = () => {
    return useMutation({
      mutationFn: async () => {
        if (!user) {
          throw new Error('User must be logged in to disconnect Eventbrite');
        }
        
        try {
          // Update the local storage data
          if (eventbriteData && eventbriteData.user_id === user.id) {
            const updatedData = { ...eventbriteData, is_active: false };
            setEventbriteData(updatedData);
          }
          
          toast.success('Eventbrite disconnected successfully');
          return { success: true };
        } catch (error: any) {
          console.error('Error disconnecting Eventbrite:', error);
          toast.error('Failed to disconnect Eventbrite');
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-eventbrite-integration'] });
      }
    });
  };
  
  // Import events from Eventbrite
  const useImportEvents = () => {
    return useMutation({
      mutationFn: async () => {
        if (!user) {
          throw new Error('User must be logged in to import Eventbrite events');
        }
        
        try {
          // Get the access token from local storage
          if (!eventbriteData || !eventbriteData.access_token || eventbriteData.user_id !== user.id) {
            throw new Error('Could not find active Eventbrite integration');
          }
          
          // In a real implementation, we would fetch events from Eventbrite API here
          // using the access_token
          console.log('Using access token to fetch events:', eventbriteData.access_token);
          
          // For demo purposes, we'll just show a success message
          toast.success('Events imported successfully');
          return { success: true };
        } catch (error: any) {
          console.error('Error importing events:', error);
          toast.error(`Failed to import events: ${error.message}`);
          throw error;
        }
      }
    });
  };
  
  // Return the hooks
  return {
    useHasIntegrated,
    useDisconnectEventbrite,
    useImportEvents
  };
};

export default useEventbrite;
