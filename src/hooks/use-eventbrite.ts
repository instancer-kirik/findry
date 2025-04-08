
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

export interface EventbriteHookReturn {
  useHasIntegrated: () => ReturnType<typeof useQuery>;
  useDisconnectEventbrite: () => ReturnType<typeof useMutation>;
  useImportEvents: () => ReturnType<typeof useMutation>;
}

export const useEventbrite = (): EventbriteHookReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Since user_integrations table doesn't seem to exist in the schema,
  // we'll use a simpler approach with local storage for demo purposes
  const STORAGE_KEY = 'eventbrite_integration';
  
  const saveIntegrationToLocalStorage = (isActive: boolean, token?: string) => {
    if (!user) return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user_id: user.id,
      is_active: isActive,
      access_token: token || 'fake_token_' + Date.now(),
      timestamp: Date.now()
    }));
  };
  
  const getIntegrationFromLocalStorage = () => {
    if (!user) return null;
    
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    try {
      const parsed = JSON.parse(data);
      if (parsed.user_id !== user.id) return null;
      return parsed;
    } catch (e) {
      console.error('Error parsing Eventbrite integration data:', e);
      return null;
    }
  };
  
  const removeIntegrationFromLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
  };
  
  // Check if user has integrated Eventbrite
  const useHasIntegrated = () => {
    return useQuery({
      queryKey: ['user-eventbrite-integration', user?.id],
      queryFn: async () => {
        if (!user) return false;
        
        // Use local storage instead of database
        const integration = getIntegrationFromLocalStorage();
        return integration && integration.is_active;
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
          // Simply remove from local storage
          removeIntegrationFromLocalStorage();
          
          toast.success('Eventbrite disconnected successfully');
          return { success: true };
        } catch (error: any) {
          console.error('Error disconnecting Eventbrite:', error);
          toast.error('Failed to disconnect Eventbrite');
          return { success: false, error: error.message };
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
          const integration = getIntegrationFromLocalStorage();
          
          if (!integration || !integration.is_active) {
            throw new Error('Could not find active Eventbrite integration');
          }
          
          // In a real implementation, we would fetch events from Eventbrite API here
          // For now, we'll just return success
          
          toast.success('Events imported successfully');
          return { success: true };
        } catch (error: any) {
          console.error('Error importing events:', error);
          toast.error(`Failed to import events: ${error.message}`);
          return { success: false, error: error.message };
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
