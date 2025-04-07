import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getEventbriteAccessToken } from '@/integrations/eventbrite';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X, Loader2 } from 'lucide-react';

const EventbriteCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your Eventbrite connection...');
  
  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (!user) {
        setStatus('error');
        setMessage('You must be logged in to connect with Eventbrite.');
        return;
      }
      
      // Get the authorization code from URL
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      
      // Verify state parameter to prevent CSRF attacks
      const savedState = localStorage.getItem('eventbrite_oauth_state');
      localStorage.removeItem('eventbrite_oauth_state'); // Clean up
      
      if (error) {
        setStatus('error');
        setMessage(`Authorization failed: ${error}`);
        return;
      }
      
      if (!code) {
        setStatus('error');
        setMessage('No authorization code received from Eventbrite.');
        return;
      }
      
      if (state !== savedState) {
        setStatus('error');
        setMessage('Invalid state parameter. This could be a security issue.');
        return;
      }
      
      try {
        // Exchange the code for an access token
        const accessToken = await getEventbriteAccessToken(code);
        
        if (!accessToken) {
          throw new Error('Failed to get access token from Eventbrite.');
        }
        
        // Save the token to database
        const { error: dbError } = await supabase
          .from('user_integrations')
          .upsert({
            user_id: user.id,
            provider: 'eventbrite',
            access_token: accessToken,
            is_active: true,
            connected_at: new Date().toISOString()
          });
        
        if (dbError) {
          throw dbError;
        }
        
        setStatus('success');
        setMessage('Successfully connected to Eventbrite!');
      } catch (err) {
        console.error('Error in Eventbrite OAuth callback:', err);
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    };
    
    handleOAuthCallback();
  }, [searchParams, user]);
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Eventbrite Integration</CardTitle>
            <CardDescription>
              Connecting your Eventbrite account
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              {status === 'loading' && (
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              )}
              {status === 'success' && (
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              )}
              {status === 'error' && (
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                  <X className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              )}
              <p className="text-lg">
                {message}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate('/events')}
              variant={status === 'error' ? 'outline' : 'default'}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {status === 'success' ? 'Go to Events' : 'Back to Events'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default EventbriteCallback; 