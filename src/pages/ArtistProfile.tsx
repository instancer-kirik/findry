
import React from 'react';
import Layout from '../components/layout/Layout';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ArtistProfile: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();
  
  console.log('ArtistProfile rendered, artistId:', artistId);

  // Fetch artist data from Supabase
  const { data: artistData, isLoading, error } = useQuery({
    queryKey: ['artist', artistId],
    queryFn: async () => {
      console.log('Fetching artist data for ID:', artistId);
      
      // First try to fetch from artists table
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artistId)
        .single();
        
      if (artistError) {
        console.log('Artist fetch error:', artistError);
        throw artistError;
      }
      
      // If we have artist data, fetch the associated profile
      if (artistData) {
        // For demo purposes, we're just using a mock profile
        // In a real app, you'd fetch the associated profile or map the artist data to a profile structure
        const mockProfile = {
          id: artistData.id,
          username: artistData.name.toLowerCase().replace(/\s+/g, '.'),
          full_name: artistData.name,
          avatar_url: artistData.image_url,
          bio: artistData.description || "Artist on Findry",
          profile_types: ["artist"],
        };
        
        return {
          artist: artistData,
          profile: mockProfile
        };
      }
      
      throw new Error('Artist not found');
    },
    enabled: !!artistId,
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

  if (error || !artistData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Alert className="mb-8">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Artist not found</AlertTitle>
            <AlertDescription>
              The artist you're looking for doesn't exist or has been removed.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/discover')}
              className="mt-4"
            >
              Discover Artists
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader 
          profile={artistData.profile} 
          isOwnProfile={false} 
        />
        <ProfileTabs 
          profile={artistData.profile} 
          isOwnProfile={false} 
        />
      </div>
    </Layout>
  );
};

export default ArtistProfile;
