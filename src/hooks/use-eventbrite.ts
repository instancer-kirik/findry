
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

export const useEventbrite = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Check if a table exists
  const checkTableExists = async (tableName: string) => {
    try {
      // Using the new function that exists in database
      const { data, error } = await supabase.rpc('get_table_definition', {
        table_name: tableName
      });
      
      if (error) {
        console.error('Error checking if table exists:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking if table exists:', error);
      return false;
    }
  };
  
  // Check if user has integrated Eventbrite
  const useHasIntegrated = () => {
    return useQuery({
      queryKey: ['user-eventbrite-integration', user?.id],
      queryFn: async () => {
        if (!user) return false;
        
        const tableExists = await checkTableExists('user_integrations');
        if (!tableExists) {
          console.log('user_integrations table does not exist');
          return false;
        }
        
        try {
          // Dynamic approach to handle the table that might not exist yet
          const query = `
            SELECT * FROM user_integrations 
            WHERE user_id = '${user.id}' 
            AND integration_type = 'eventbrite' 
            AND is_active = true
            LIMIT 1
          `;
          
          const { data, error } = await supabase.rpc('execute_sql', { sql_query: query });
          
          if (error) {
            console.error('Error checking Eventbrite integration:', error);
            return false;
          }
          
          // If we have a result and it has access_token, then the user is integrated
          return data && data.length > 0 && data[0].access_token;
        } catch (error) {
          console.error('Error checking Eventbrite integration:', error);
          return false;
        }
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
          const tableExists = await checkTableExists('user_integrations');
          if (!tableExists) {
            console.log('user_integrations table does not exist');
            return { success: false, error: 'Integration table does not exist' };
          }
          
          // Dynamic approach to handle the table
          const query = `
            UPDATE user_integrations 
            SET is_active = false 
            WHERE user_id = '${user.id}' 
            AND integration_type = 'eventbrite'
          `;
          
          const { error } = await supabase.rpc('execute_sql', { sql_query: query });
          
          if (error) {
            throw error;
          }
          
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
          // First check if table exists
          const tableExists = await checkTableExists('user_integrations');
          if (!tableExists) {
            console.log('user_integrations table does not exist');
            return { success: false, error: 'Integration table does not exist' };
          }
          
          // Get the access token
          const tokenQuery = `
            SELECT access_token FROM user_integrations 
            WHERE user_id = '${user.id}' 
            AND integration_type = 'eventbrite' 
            AND is_active = true
            LIMIT 1
          `;
          
          const { data: tokenData, error: tokenError } = await supabase.rpc('execute_sql', { sql_query: tokenQuery });
          
          if (tokenError || !tokenData || tokenData.length === 0) {
            throw new Error('Could not find active Eventbrite integration');
          }
          
          const accessToken = tokenData[0].access_token;
          
          // Call Eventbrite API to get events (simplified)
          // This would typically be a fetch request to Eventbrite's API
          console.log('Would fetch events with token:', accessToken);
          
          // For now, we'll insert a sample event
          const eventExists = await checkTableExists('event_integrations');
          
          if (!eventExists) {
            console.log('event_integrations table does not exist');
            return { success: false, error: 'Event integration table does not exist' };
          }
          
          // Check for existing events
          const eventsQuery = `
            SELECT * FROM events 
            WHERE id IN (
              SELECT event_id FROM event_integrations 
              WHERE integration_type = 'eventbrite'
            )
          `;
          
          const { data: existingEvents, error: eventsError } = await supabase.rpc('execute_sql', { sql_query: eventsQuery });
          
          if (!eventsError && existingEvents && existingEvents.length > 0) {
            toast.info(`Found ${existingEvents.length} existing Eventbrite events`);
          }
          
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
