import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Instagram, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInstagramAuth } from '../auth/InstagramLogin';
import { supabase } from '@/lib/supabase';

interface InstagramTestProps {
  className?: string;
}

export const InstagramTest: React.FC<InstagramTestProps> = ({ className }) => {
  const { instagramToken, instagramUser, publishToInstagram, isConnected } = useInstagramAuth();
  const [isPublishing, setIsPublishing] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('Testing Instagram integration with Findry! 🎉 #FindryApp #EventPlatform');

  const handleTestPublish = async () => {
    if (!isConnected) {
      toast.error('Please connect your Instagram account first');
      return;
    }

    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL to test publishing');
      return;
    }

    try {
      setIsPublishing(true);

      const result = await publishToInstagram(imageUrl.trim(), caption);

      toast.success('Successfully published to Instagram!', {
        description: `Post ID: ${result.id}`,
      });

      // Clear form
      setImageUrl('');
      setCaption('Testing Instagram integration with Findry! 🎉 #FindryApp #EventPlatform');

    } catch (error) {
      console.error('Publishing error:', error);
      toast.error('Failed to publish to Instagram', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleConnectInstagram = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email,public_profile,instagram_basic,instagram_content_publish,pages_show_list',
        },
      });

      if (error) {
        toast.error('Failed to connect Instagram');
        console.error('Instagram connection error:', error);
      }
    } catch (error) {
      console.error('Instagram connection error:', error);
      toast.error('Something went wrong connecting to Instagram');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="w-5 h-5 text-pink-500" />
          Instagram Integration Test
        </CardTitle>
        <CardDescription>
          Test your Instagram OAuth connection and content publishing
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            {isConnected ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            <div>
              <p className="font-medium">
                {isConnected ? 'Connected to Instagram' : 'Instagram Not Connected'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isConnected && instagramUser
                  ? `@${instagramUser.username} (${instagramUser.account_type})`
                  : 'Connect your Instagram account to publish content'
                }
              </p>
            </div>
          </div>

          {!isConnected && (
            <Button onClick={handleConnectInstagram} size="sm">
              <Instagram className="w-4 h-4 mr-2" />
              Connect
            </Button>
          )}
        </div>

        {/* Publishing Test Form */}
        {isConnected && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Image URL (for testing)
              </label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/your-image.jpg"
                disabled={isPublishing}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use a publicly accessible image URL for testing
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Caption
              </label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption..."
                rows={3}
                disabled={isPublishing}
              />
            </div>

            <Button
              onClick={handleTestPublish}
              disabled={isPublishing || !imageUrl.trim()}
              className="w-full"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Test Publish to Instagram
                </>
              )}
            </Button>
          </div>
        )}

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && isConnected && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs font-mono">
              <strong>Debug Info:</strong><br />
              Token: {instagramToken ? `${instagramToken.substring(0, 20)}...` : 'None'}<br />
              User ID: {instagramUser?.id || 'None'}<br />
              Account Type: {instagramUser?.account_type || 'Unknown'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
