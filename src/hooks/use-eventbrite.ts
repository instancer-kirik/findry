
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  EventbriteEvent,
  getEventbriteAccessToken,
  getEventbriteEvents,
  getEventbriteEvent,
  syncEventToEventbrite,
  convertEventbriteToAppEvent
} from '@/integrations/eventbrite';

interface UseEventbriteOptions {
  autoFetch?: boolean;
}

interface UserIntegration {
  id: string;
  user_id: string;
  provider: string;
  access_token: string;
  is_active: boolean;
  connected_at: string;
}

interface EventIntegration {
  id: string;
  event_id: string;
  provider: string;
  provider_event_id: string;
  user_id: string;
  synced_at: string;
}

interface UseEventbriteReturn {
  events: EventbriteEvent[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  connectToEventbrite: () => Promise<void>;
  disconnectFromEventbrite: () => Promise<{ success: boolean; error?: string }>;
  syncEventToEventbrite: (event: {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    is_online: boolean;
    capacity: number;
  }) => Promise<{ success: boolean; eventbriteId?: string; error?: string }>;
  importEventsFromEventbrite: () => Promise<{ success: boolean; count: number; error?: string }>;
}

export const useEventbrite = (options: UseEventbriteOptions = {}): UseEventbriteReturn => {
  const { autoFetch = true } = options;
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<EventbriteEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Function to get the stored access token
  const fetchAccessToken = async () => {
    if (!user) return null;

    try {
      // Create the user_integrations table if it doesn't exist
      const { error: createTableError } = await supabase.rpc('table_exists', { 
        schema_name: 'public', 
        table_name: 'user_integrations' 
      });

      if (createTableError) {
        console.log('Creating user_integrations table...');
        // We need to create the table
        await supabase.rpc('execute_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS public.user_integrations (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
              provider TEXT NOT NULL,
              access_token TEXT NOT NULL,
              is_active BOOLEAN DEFAULT true,
              connected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
              UNIQUE(user_id, provider)
            );
          `
        });
      }

      // Now query the table
      const { data } = await supabase.from('user_integrations')
        .select('access_token, is_active')
        .eq('user_id', user.id)
        .eq('provider', 'eventbrite')
        .maybeSingle();

      if (data && data.is_active) {
        setAccessToken(data.access_token);
        setIsConnected(true);
        return data.access_token;
      } else {
        setIsConnected(false);
        return null;
      }
    } catch (error) {
      console.error('Error fetching Eventbrite access token:', error);
      setIsConnected(false);
      return null;
    }
  };

  // Get events from Eventbrite
  const fetchEventbriteEvents = async () => {
    if (!accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedEvents = await getEventbriteEvents(accessToken);
      setEvents(fetchedEvents);
    } catch (err) {
      setError('Failed to load events from Eventbrite');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch access token when user changes
  useEffect(() => {
    if (user) {
      fetchAccessToken();
    } else {
      setAccessToken(null);
      setIsConnected(false);
    }
  }, [user]);

  // Effect to fetch events when access token changes
  useEffect(() => {
    if (accessToken && autoFetch) {
      fetchEventbriteEvents();
    }
  }, [accessToken, autoFetch]);

  // Connect to Eventbrite (start OAuth flow)
  const connectToEventbrite = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect with Eventbrite.",
        variant: "destructive"
      });
      return;
    }

    // This will be handled by a dedicated page that starts the OAuth flow
    // For now, we'll just simulate the flow by redirecting to a local route
    // In a real implementation, we'd use getEventbriteAuthUrl() from our integration
    
    // Generate a state parameter to prevent CSRF attacks
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store the state in localStorage to verify later
    localStorage.setItem('eventbrite_oauth_state', state);
    
    // Redirect to our OAuth handler page
    window.location.href = `/eventbrite/connect?state=${state}`;
  };

  // Disconnect from Eventbrite
  const disconnectFromEventbrite = async () => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      // Create the user_integrations table if it doesn't exist
      const { error: createTableError } = await supabase.rpc('table_exists', { 
        schema_name: 'public', 
        table_name: 'user_integrations' 
      });

      if (createTableError) {
        // We need to create the table
        await supabase.rpc('execute_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS public.user_integrations (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
              provider TEXT NOT NULL,
              access_token TEXT NOT NULL,
              is_active BOOLEAN DEFAULT true,
              connected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
              UNIQUE(user_id, provider)
            );
          `
        });
      }

      const { error } = await supabase.from('user_integrations')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('provider', 'eventbrite');

      if (error) throw error;

      setAccessToken(null);
      setIsConnected(false);
      
      toast({
        title: "Success",
        description: "Disconnected from Eventbrite",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error disconnecting from Eventbrite:', error);
      
      toast({
        title: "Error",
        description: "Failed to disconnect from Eventbrite",
        variant: "destructive"
      });
      
      return { success: false, error: 'Failed to disconnect' };
    }
  };

  // Sync an event to Eventbrite
  const syncToEventbrite = async (event: {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    is_online: boolean;
    capacity: number;
  }) => {
    if (!accessToken || !user) {
      return { success: false, error: 'Not connected to Eventbrite' };
    }

    try {
      const result = await syncEventToEventbrite(accessToken, event);
      
      if (result.success && result.eventbriteId) {
        // Create event_integrations table if it doesn't exist
        const { error: createTableError } = await supabase.rpc('table_exists', { 
          schema_name: 'public', 
          table_name: 'event_integrations' 
        });
  
        if (createTableError) {
          // We need to create the table
          await supabase.rpc('execute_sql', {
            sql: `
              CREATE TABLE IF NOT EXISTS public.event_integrations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                event_id UUID NOT NULL,
                provider TEXT NOT NULL,
                provider_event_id TEXT NOT NULL,
                user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                UNIQUE(event_id, provider)
              );
            `
          });
        }

        // Store the relationship between our event and Eventbrite event
        const { error } = await supabase.from('event_integrations')
          .upsert({
            event_id: event.id,
            provider: 'eventbrite',
            provider_event_id: result.eventbriteId,
            user_id: user.id,
            synced_at: new Date().toISOString()
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Event successfully synced with Eventbrite",
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error syncing event to Eventbrite:', error);
      
      toast({
        title: "Error",
        description: "Failed to sync event with Eventbrite",
        variant: "destructive"
      });
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  };

  // Import events from Eventbrite into the app
  const importEventsFromEventbrite = async () => {
    if (!accessToken || !user) {
      return { success: false, count: 0, error: 'Not connected to Eventbrite' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch events from Eventbrite
      const eventbriteEvents = await getEventbriteEvents(accessToken);
      
      if (!eventbriteEvents.length) {
        return { success: true, count: 0 };
      }

      // Convert and insert into our database
      let successCount = 0;
      
      for (const ebEvent of eventbriteEvents) {
        const appEvent = convertEventbriteToAppEvent(ebEvent);
        
        // Insert into our events table
        const { data, error } = await supabase.from('events')
          .upsert({
            name: appEvent.title,
            description: appEvent.description,
            location: appEvent.location,
            start_date: appEvent.start_date,
            end_date: appEvent.end_date,
            image_url: appEvent.poster_url,
            capacity: appEvent.capacity,
            type: appEvent.event_type,
            eventbrite_id: ebEvent.id,
            eventbrite_url: appEvent.eventbrite_url
          })
          .select('id')
          .single();

        if (error) {
          console.error('Error importing event:', error);
          continue;
        }

        // Create event_integrations table if it doesn't exist
        const { error: createTableError } = await supabase.rpc('table_exists', { 
          schema_name: 'public', 
          table_name: 'event_integrations' 
        });

        if (createTableError) {
          // We need to create the table
          await supabase.rpc('execute_sql', {
            sql: `
              CREATE TABLE IF NOT EXISTS public.event_integrations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                event_id UUID NOT NULL,
                provider TEXT NOT NULL,
                provider_event_id TEXT NOT NULL,
                user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                UNIQUE(event_id, provider)
              );
            `
          });
        }

        // Record the integration relationship
        if (data?.id) {
          await supabase.from('event_integrations')
            .upsert({
              event_id: data.id,
              provider: 'eventbrite',
              provider_event_id: ebEvent.id,
              user_id: user.id,
              synced_at: new Date().toISOString()
            });
          
          successCount++;
        }
      }

      toast({
        title: "Import Complete",
        description: `Successfully imported ${successCount} events from Eventbrite`,
      });
      
      return { success: true, count: successCount };
    } catch (error) {
      console.error('Error importing events from Eventbrite:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      
      toast({
        title: "Import Failed",
        description: "Could not import events from Eventbrite",
        variant: "destructive"
      });
      
      return { success: false, count: 0, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    events,
    isLoading,
    error,
    isConnected,
    connectToEventbrite,
    disconnectFromEventbrite,
    syncEventToEventbrite: syncToEventbrite,
    importEventsFromEventbrite
  };
};
