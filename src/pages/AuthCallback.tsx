import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth session from the URL hash/params
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed');
          navigate('/login', { replace: true });
          return;
        }

        if (data.session) {
          // Check if this is an Instagram/Facebook login
          const provider = data.session.user.app_metadata.provider;

          if (provider === 'facebook') {
            // Store Instagram-related data if available
            const providerToken = data.session.provider_token;

            if (providerToken) {
              // You could store this in localStorage or state management
              localStorage.setItem('instagram_token', providerToken);

              // Optionally, fetch Instagram user data immediately
              try {
                const response = await fetch(
                  `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${providerToken}`
                );

                if (response.ok) {
                  const instagramData = await response.json();
                  console.log('Instagram user connected:', instagramData);
                  toast.success(`Welcome ${instagramData.username}! Instagram connected successfully.`);
                } else {
                  toast.success('Successfully logged in with Facebook!');
                }
              } catch (instagramError) {
                console.error('Error fetching Instagram data:', instagramError);
                toast.success('Successfully logged in!');
              }
            } else {
              toast.success('Successfully logged in with Facebook!');
            }
          } else {
            toast.success('Successfully logged in!');
          }

          // Redirect to the main app or dashboard
          navigate('/', { replace: true });
        } else {
          // No session found, redirect to login
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Something went wrong during authentication');
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Completing Authentication...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we finish setting up your account.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
