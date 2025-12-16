import React from 'react';
import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InstagramLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const InstagramLogin: React.FC<InstagramLoginProps> = ({
  onSuccess,
  onError,
  className
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInstagramLogin = async () => {
    try {
      setIsLoading(true);

      // Sign in with Facebook (which includes Instagram access)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          scopes: 'email,public_profile,instagram_basic,instagram_content_publish',
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Instagram login error:', error);
        toast.error('Failed to connect with Instagram');
        onError?.(error.message);
        return;
      }

      // Success will be handled by the auth callback
      onSuccess?.();

    } catch (error) {
      console.error('Instagram login error:', error);
      toast.error('Something went wrong with Instagram login');
      onError?.(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleInstagramLogin}
      disabled={isLoading}
      className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white ${className}`}
      variant="default"
    >
      <Instagram className="w-5 h-5 mr-2" />
      {isLoading ? 'Connecting...' : 'Continue with Instagram'}
    </Button>
  );
};

// Hook for Instagram-specific functionality
export const useInstagramAuth = () => {
  const [instagramToken, setInstagramToken] = React.useState<string | null>(null);
  const [instagramUser, setInstagramUser] = React.useState<any>(null);

  React.useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Check if this is a Facebook/Instagram login
          if (session.user.app_metadata.provider === 'facebook') {
            // Extract Instagram token from the session
            const providerToken = session.provider_token;
            setInstagramToken(providerToken || null);

            // You can fetch Instagram user data here if needed
            if (providerToken) {
              try {
                // Example API call to get Instagram user info
                const response = await fetch(
                  `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${providerToken}`
                );

                if (response.ok) {
                  const userData = await response.json();
                  setInstagramUser(userData);
                }
              } catch (error) {
                console.error('Error fetching Instagram user data:', error);
              }
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setInstagramToken(null);
          setInstagramUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const publishToInstagram = async (mediaUrl: string, caption: string) => {
    if (!instagramToken || !instagramUser) {
      throw new Error('Instagram not connected');
    }

    try {
      // Step 1: Create media object
      const createMediaResponse = await fetch(
        `https://graph.instagram.com/${instagramUser.id}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_url: mediaUrl,
            caption: caption,
            access_token: instagramToken,
          }),
        }
      );

      if (!createMediaResponse.ok) {
        throw new Error('Failed to create Instagram media');
      }

      const mediaData = await createMediaResponse.json();

      // Step 2: Publish the media
      const publishResponse = await fetch(
        `https://graph.instagram.com/${instagramUser.id}/media_publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creation_id: mediaData.id,
            access_token: instagramToken,
          }),
        }
      );

      if (!publishResponse.ok) {
        throw new Error('Failed to publish to Instagram');
      }

      const publishData = await publishResponse.json();
      return publishData;

    } catch (error) {
      console.error('Instagram publishing error:', error);
      throw error;
    }
  };

  return {
    instagramToken,
    instagramUser,
    publishToInstagram,
    isConnected: !!instagramToken && !!instagramUser,
  };
};
