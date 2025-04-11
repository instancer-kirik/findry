
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EventbriteCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processEventbriteCallback = async () => {
      try {
        // Get the code and state from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const storedState = localStorage.getItem('eventbrite_auth_state');
        
        // Check if state matches to prevent CSRF attacks
        if (!state || state !== storedState) {
          throw new Error('Invalid state parameter');
        }
        
        // Make sure we have the code
        if (!code) {
          throw new Error('No authorization code received');
        }
        
        // Get the user ID we stored before the auth flow
        const userId = localStorage.getItem('eventbrite_auth_user_id');
        if (!userId) {
          throw new Error('No user ID found');
        }
        
        // Exchange the code for tokens
        // In a real implementation, this would be done server-side
        // For demo purposes, we'll simulate a successful response
        const mockTokenResponse = {
          access_token: `demo_access_token_${Date.now()}`,
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: `demo_refresh_token_${Date.now()}`,
        };
        
        // Get organization details (simulated)
        const mockOrganizationId = `demo_organization_${Date.now()}`;
        
        // Store the integration data
        try {
          // Try to store in Supabase if available
          const { error } = await supabase
            .from('user_integrations')
            .upsert({
              user_id: userId,
              integration_type: 'eventbrite',
              access_token: mockTokenResponse.access_token,
              refresh_token: mockTokenResponse.refresh_token,
              expires_at: new Date(Date.now() + (mockTokenResponse.expires_in * 1000)).toISOString(),
              is_active: true,
              metadata: { organization_id: mockOrganizationId }
            });
          
          if (error) {
            console.error('Error storing Eventbrite integration:', error);
            // Fall back to localStorage if database storage fails
          }
        } catch (dbError) {
          console.error('Database error when storing Eventbrite integration:', dbError);
          // Fall back to localStorage
        }
        
        // Always store in localStorage as well for backup
        localStorage.setItem(`eventbrite_integration_${userId}`, JSON.stringify({
          access_token: mockTokenResponse.access_token,
          refresh_token: mockTokenResponse.refresh_token,
          organization_id: mockOrganizationId
        }));
        
        // Clean up the auth flow data
        localStorage.removeItem('eventbrite_auth_state');
        localStorage.removeItem('eventbrite_auth_user_id');
        
        toast({
          title: "Success",
          description: "Eventbrite account connected successfully"
        });
        
        // Wait a moment to show success
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        
      } catch (error: any) {
        console.error('Error processing Eventbrite callback:', error);
        setError(error.message || 'Failed to connect Eventbrite account');
        toast({
          title: "Error",
          description: error.message || 'Failed to connect Eventbrite account',
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    processEventbriteCallback();
  }, [navigate, toast]);

  return (
    <Layout>
      <div className="container mx-auto py-16 text-center">
        {loading ? (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h2 className="text-2xl font-bold">Connecting your Eventbrite account...</h2>
            <p className="text-muted-foreground">Please wait while we complete the authorization.</p>
          </div>
        ) : error ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-destructive">Connection Failed</h2>
            <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Eventbrite Connected Successfully!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your Eventbrite account has been connected. You can now manage your Eventbrite events.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventbriteCallback;
