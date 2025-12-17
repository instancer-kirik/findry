
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '@/hooks/use-profile';
import { useAuth } from '@/hooks/use-auth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileTabsContent from '@/components/profile/ProfileTabsContent';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!username) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .single();

        if (error) {
          console.error("Error fetching user ID:", error);
          setFetchError("Could not find user with that username");
          return;
        }

        if (data) {
          setUserId(data.id);
        }
      } catch (err) {
        console.error("Error:", err);
        setFetchError("An unexpected error occurred");
      }
    };

    fetchUserId();
  }, [username]);

  const { profile, loading, refreshProfile } = useProfile();

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

  if (fetchError || !profile) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-muted-foreground">
            {fetchError || 'Failed to load profile'}
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

      <ProfileTabs profile={profile} isOwnProfile={isOwnProfile}>
        <ProfileTabsContent profile={profile} isOwnProfile={isOwnProfile} />
      </ProfileTabs>
    </div>
  );
};

export default ProfilePage;
