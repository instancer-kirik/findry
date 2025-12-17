import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, Instagram, Mail, Link2, Unlink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserIdentity } from '@supabase/supabase-js';

interface Provider {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  available: boolean;
  note?: string;
}

const PROVIDERS: Provider[] = [
  {
    id: 'email',
    name: 'Email',
    icon: <Mail className="h-5 w-5" />,
    color: 'bg-muted',
    available: false, // Email is always the primary
    note: 'Primary login method'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: <Github className="h-5 w-5" />,
    color: 'bg-zinc-900 dark:bg-zinc-800',
    available: true,
    note: 'Requires GitHub OAuth configured in Supabase'
  },
  {
    id: 'facebook',
    name: 'Instagram',
    icon: <Instagram className="h-5 w-5" />,
    color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
    available: true,
    note: 'Requires Facebook/Instagram OAuth configured in Supabase'
  }
];

const LinkedAccounts: React.FC = () => {
  const [identities, setIdentities] = useState<UserIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchIdentities();
  }, []);

  const fetchIdentities = async () => {
    try {
      const { data, error } = await supabase.auth.getUserIdentities();
      if (error) throw error;
      setIdentities(data?.identities || []);
    } catch (error: any) {
      console.error('Error fetching identities:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch linked accounts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkProvider = async (providerId: string) => {
    setLinkingProvider(providerId);
    try {
      const { error } = await supabase.auth.linkIdentity({
        provider: providerId as any,
        options: {
          redirectTo: `${window.location.origin}/profile`,
          scopes: providerId === 'facebook' 
            ? 'email,public_profile,instagram_basic'
            : undefined
        }
      });
      
      if (error) throw error;
      // User will be redirected, no need to update state here
    } catch (error: any) {
      console.error('Error linking provider:', error);
      toast({
        title: 'Link failed',
        description: error.message || `Could not link ${providerId}. Make sure OAuth is configured in Supabase.`,
        variant: 'destructive'
      });
      setLinkingProvider(null);
    }
  };

  const handleUnlinkProvider = async (identityId: string, provider: string) => {
    // Check if this would leave the user without any login method
    if (identities.length <= 1) {
      toast({
        title: 'Cannot unlink',
        description: 'You must have at least one login method',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.auth.unlinkIdentity({ 
        provider: provider as any,
        id: identityId
      } as any);
      
      if (error) throw error;
      
      setIdentities(prev => prev.filter(i => i.id !== identityId));
      toast({
        title: 'Unlinked',
        description: `${provider} account has been unlinked`
      });
    } catch (error: any) {
      console.error('Error unlinking provider:', error);
      toast({
        title: 'Unlink failed',
        description: error.message || 'Could not unlink account',
        variant: 'destructive'
      });
    }
  };

  const isProviderLinked = (providerId: string) => {
    return identities.some(i => i.provider === providerId);
  };

  const getIdentityForProvider = (providerId: string) => {
    return identities.find(i => i.provider === providerId);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Linked Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Linked Accounts
        </CardTitle>
        <CardDescription>
          Connect additional accounts to sign in with multiple methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {PROVIDERS.map(provider => {
          const isLinked = isProviderLinked(provider.id);
          const identity = getIdentityForProvider(provider.id);
          
          return (
            <div
              key={provider.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg text-white ${provider.color}`}>
                  {provider.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{provider.name}</span>
                    {isLinked && (
                      <Badge variant="secondary" className="text-xs">
                        Connected
                      </Badge>
                    )}
                  </div>
                  {identity?.identity_data?.email && (
                    <p className="text-sm text-muted-foreground">
                      {identity.identity_data.email}
                    </p>
                  )}
                  {!isLinked && provider.note && (
                    <p className="text-xs text-muted-foreground">
                      {provider.note}
                    </p>
                  )}
                </div>
              </div>
              
              {provider.available && (
                <div>
                  {isLinked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlinkProvider(identity!.id, provider.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Unlink className="h-4 w-4 mr-1" />
                      Unlink
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLinkProvider(provider.id)}
                      disabled={linkingProvider === provider.id}
                    >
                      {linkingProvider === provider.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Link2 className="h-4 w-4 mr-1" />
                      )}
                      Link
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LinkedAccounts;
