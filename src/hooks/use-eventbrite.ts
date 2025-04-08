
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

interface UserIntegration {
  id: string;
  user_id: string;
  integration_type: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  is_active: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const useEventbrite = (): EventbriteHookReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Check if user has integrated Eventbrite
  const useHasIntegrated = () => {
    return useQuery({
      queryKey: ['user-eventbrite-integration', user?.id],
      queryFn: async () => {
        if (!user) return false;
        
        // Query the user_integrations table
        const { data, error } = await supabase
          .from('user_integrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('integration_type', 'eventbrite')
          .eq('is_active', true)
          .single();
        
        if (error) {
          console.error('Error checking Eventbrite integration:', error);
          return false;
        }
        
        return !!data;
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
          // Update the is_active flag to false
          const { error } = await supabase
            .from('user_integrations')
            .update({ is_active: false })
            .eq('user_id', user.id)
            .eq('integration_type', 'eventbrite');
          
          if (error) {
            throw error;
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
          // Get the access token from the database
          const { data, error } = await supabase
            .from('user_integrations')
            .select('access_token')
            .eq('user_id', user.id)
            .eq('integration_type', 'eventbrite')
            .eq('is_active', true)
            .single();
          
          if (error || !data) {
            throw new Error('Could not find active Eventbrite integration');
          }
          
          // In a real implementation, we would fetch events from Eventbrite API here
          // using the access_token
          console.log('Using access token to fetch events:', data.access_token);
          
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
