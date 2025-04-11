
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EventbriteToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

interface EventbriteMetadata {
  organization_id?: string;
  [key: string]: any;
}

export const useEventbrite = (userId?: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [eventbriteData, setEventbriteData] = useState<{
    access_token?: string;
    refresh_token?: string;
    organization_id?: string;
  } | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    const checkEventbriteAuth = async () => {
      try {
        // First try to get data from localStorage as a fallback
        const storedData = localStorage.getItem(`eventbrite_integration_${userId}`);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setEventbriteData(parsedData);
          setIsAuthenticated(!!parsedData.access_token);
          return;
        }
        
        // If we have Supabase access, try to get data from there
        // Since the table might not exist in the database schema yet,
        // we'll use localStorage first as a fallback
        try {
          const { data, error } = await supabase
            .from('user_integrations')
            .select('*')
            .eq('user_id', userId)
            .eq('integration_type', 'eventbrite')
            .eq('is_active', true)
            .single();

          if (error) {
            console.error('Error fetching Eventbrite integration:', error);
            setIsAuthenticated(false);
            return;
          }

          if (data) {
            // Safely access metadata properties
            const metadata = data.metadata as EventbriteMetadata || {};
            const organization_id = metadata.organization_id || null;
            
            setEventbriteData({
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              organization_id: organization_id
            });
            setIsAuthenticated(true);
            
            // Save to localStorage as a fallback
            localStorage.setItem(`eventbrite_integration_${userId}`, JSON.stringify({
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              organization_id: organization_id
            }));
          } else {
            setIsAuthenticated(false);
          }
        } catch (dbError) {
          console.error('Database error:', dbError);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking Eventbrite auth:', error);
        setIsAuthenticated(false);
      }
    };

    checkEventbriteAuth();
  }, [userId]);

  const getAuthUrl = (userId: string): string => {
    try {
      // Generate a random state to verify the callback
      const state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('eventbrite_auth_state', state);
      
      // Store the user ID to associate with the integration
      localStorage.setItem('eventbrite_auth_user_id', userId);
      
      // Your Eventbrite client ID would come from environment variables
      const clientId = 'DEMO_CLIENT_ID';
      
      // The redirect URI should be the callback endpoint in your application
      const redirectUri = `${window.location.origin}/eventbrite/callback`;
      
      // Build the authorization URL
      const authUrl = `https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
      
      return authUrl;
    } catch (error) {
      console.error('Error generating auth URL:', error);
      throw error;
    }
  };

  const disconnectEventbrite = async (userId: string): Promise<void> => {
    try {
      // First, try to disconnect via Supabase
      try {
        const { error } = await supabase
          .from('user_integrations')
          .update({ is_active: false })
          .eq('user_id', userId)
          .eq('integration_type', 'eventbrite');
      
        if (error) {
          console.error('Error disconnecting Eventbrite integration from database:', error);
          // Continue to localStorage fallback even if database update fails
        }
      } catch (dbError) {
        console.error('Database error when disconnecting Eventbrite:', dbError);
        // Continue to localStorage fallback
      }
      
      // Always clear localStorage as well
      localStorage.removeItem(`eventbrite_integration_${userId}`);
      setEventbriteData(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error disconnecting Eventbrite:', error);
      throw error;
    }
  };

  const getEventbriteToken = (): string | null => {
    return eventbriteData?.access_token || null;
  };

  const getEventbriteOrganizationId = (): string | null => {
    return eventbriteData?.organization_id || null;
  };

  return {
    isAuthenticated,
    getAuthUrl,
    disconnectEventbrite,
    getEventbriteToken,
    getEventbriteOrganizationId
  };
};
