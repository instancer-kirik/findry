import React from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '@/hooks/use-profile';
import { useAuth } from '@/hooks/use-auth.ts';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileTabsContent from '@/components/profile/ProfileTabsContent';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserId = async () => {
      if (!username) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!error && data) {
        setUserId(data.id);
      }
    };

    fetchUserId();
  }, [username]);

  const { profile, loading, error } = useProfile(userId || user?.id);

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-muted-foreground">
            {error?.message || 'Failed to load profile'}
          </p>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onEditProfile={() => {
          // Handle edit profile
        }}
      />

      <ProfileTabs profile={profile}>
        <ProfileTabsContent profile={profile} isOwnProfile={isOwnProfile} />
      </ProfileTabs>
    </div>
  );
};

export default ProfilePage;
