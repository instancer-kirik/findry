import React from 'react';
import Layout from '../components/layout/Layout';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const isOwnProfile = !username; // If no username is provided, show the user's own profile

  // Fetch profile data from Supabase
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      // If viewing own profile, get the current user
      if (isOwnProfile) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        return data;
      } else {
        // Otherwise fetch the requested profile by username
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    enabled: true,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !profileData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader 
          profile={profileData} 
          isOwnProfile={isOwnProfile} 
        />
        <ProfileTabs 
          profile={profileData} 
          isOwnProfile={isOwnProfile} 
        />
      </div>
    </Layout>
  );
};

export default ProfilePage;
