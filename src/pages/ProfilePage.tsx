
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  profile_types?: string[]; // Add support for multiple profile types
}

// For handling the case where a profile is not found
interface ProfileNotFound {
  id: string;
  notFound: boolean;
}

type ProfileResult = Profile | ProfileNotFound;

// Type guard to check if the profile result is a ProfileNotFound
function isProfileNotFound(profile: ProfileResult): profile is ProfileNotFound {
  return (profile as ProfileNotFound).notFound === true;
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const isOwnProfile = !username; // If no username is provided, show the user's own profile

  console.log('ProfilePage rendered, isOwnProfile:', isOwnProfile, 'username:', username);

  // Fetch profile data from Supabase
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      // If viewing own profile, get the current user
      if (isOwnProfile) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        console.log('Fetching profile for current user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.log('Profile fetch error:', error.code, error.message);
          if (error.code === 'PGRST116') {
            // Profile not found for this user
            console.log('Profile not found for current user, returning ProfileNotFound object');
            return { id: user.id, notFound: true } as ProfileNotFound;
          }
          throw error;
        }
        console.log('Profile found:', data);
        return data as Profile;
      } else {
        // Otherwise fetch the requested profile by username
        console.log('Fetching profile for username:', username);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();
          
        if (error) throw error;
        return data as Profile;
      }
    },
    enabled: true,
  });

  const handleCreateProfile = () => {
    console.log('Navigate to profile setup');
    navigate('/profile-setup?wizard=true'); // Always use wizard mode
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Handle case where current user doesn't have a profile yet
  if (isOwnProfile && profileData && isProfileNotFound(profileData)) {
    console.log('Rendering create profile view');
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Alert className="mb-8">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Profile not found</AlertTitle>
            <AlertDescription>
              You don't have a profile set up yet. Create your profile to connect with others.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col items-center gap-6 p-8 text-center border rounded-lg bg-muted/20">
            <h1 className="text-2xl font-bold">Get Started</h1>
            <p className="max-w-md text-muted-foreground">
              Set up your profile to showcase your work, connect with other creative professionals, 
              and find collaboration opportunities.
            </p>
            <Button 
              size="lg"
              onClick={handleCreateProfile}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Create Your Profile
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    console.log('Error fetching profile:', error);
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error loading profile</h1>
            <p className="text-muted-foreground">
              There was an error loading the profile. Please try again later.
            </p>
            {isOwnProfile && (
              <Button 
                onClick={handleCreateProfile}
                className="mt-6 flex items-center gap-2"
              >
                <UserPlus className="h-5 w-5" />
                Create Your Profile
              </Button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    console.log('No profile data');
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist or you don't have permission to view it.
            </p>
            {isOwnProfile && (
              <Button 
                onClick={handleCreateProfile}
                className="mt-6 flex items-center gap-2"
              >
                <UserPlus className="h-5 w-5" />
                Create Your Profile
              </Button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  if (isProfileNotFound(profileData)) {
    console.log('Profile not found');
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist or you don't have permission to view it.
            </p>
            {isOwnProfile && (
              <Button 
                onClick={handleCreateProfile}
                className="mt-6 flex items-center gap-2"
              >
                <UserPlus className="h-5 w-5" />
                Create Your Profile
              </Button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader 
          profile={profileData as Profile} 
          isOwnProfile={isOwnProfile} 
        />
        <ProfileTabs 
          profile={profileData as Profile} 
          isOwnProfile={isOwnProfile} 
        />
      </div>
    </Layout>
  );
};

export default ProfilePage;
