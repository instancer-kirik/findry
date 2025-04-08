
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import Layout from '@/components/layout/Layout';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface EventbriteTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
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

const EventbriteCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [eventbriteData, setEventbriteData] = useLocalStorage<EventbriteIntegration | null>(EVENTBRITE_STORAGE_KEY, null);
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting to Eventbrite...');
  
  // Process auth code
  useEffect(() => {
    const processAuthCode = async () => {
      // Get code from URL query params
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      
      if (!code) {
        setStatus('error');
        setMessage('No authorization code received from Eventbrite');
        return;
      }
      
      if (!user) {
        setStatus('error');
        setMessage('You must be logged in to connect your Eventbrite account');
        return;
      }
      
      try {
        // Create a fake token response for demonstration
        const fakeTokenResponse: EventbriteTokenResponse = {
          access_token: 'fake_access_token_' + Date.now(),
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fake_refresh_token_' + Date.now()
        };
        
        // Store in localStorage
        const integrationData: EventbriteIntegration = {
          user_id: user.id,
          integration_type: 'eventbrite',
          access_token: fakeTokenResponse.access_token,
          refresh_token: fakeTokenResponse.refresh_token,
          expires_at: new Date(Date.now() + fakeTokenResponse.expires_in * 1000).toISOString(),
          is_active: true,
          created_at: new Date().toISOString()
        };
        
        setEventbriteData(integrationData);
        
        setStatus('success');
        setMessage('Successfully connected to Eventbrite!');
      } catch (error: any) {
        console.error('Error in Eventbrite callback:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to connect to Eventbrite');
      }
    };
    
    processAuthCode();
  }, [location.search, user, setEventbriteData]);
  
  return (
    <Layout>
      <div className="container max-w-lg mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Eventbrite Connection
            </CardTitle>
            <CardDescription className="text-center">
              {status === 'loading' ? 'Processing your Eventbrite connection...' : 
              status === 'success' ? 'Your Eventbrite account is now connected!' :
              'There was a problem connecting your Eventbrite account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            {status === 'loading' ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            ) : status === 'success' ? (
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                <Check className="h-10 w-10 text-green-600 dark:text-green-500" />
              </div>
            ) : (
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <X className="h-10 w-10 text-red-600 dark:text-red-500" />
              </div>
            )}
          </CardContent>
          <CardContent className="text-center">
            <p>{message}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate('/events')}
              disabled={status === 'loading'}
            >
              {status === 'success' ? 'Go to Events' : 'Back to Events'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default EventbriteCallback;
