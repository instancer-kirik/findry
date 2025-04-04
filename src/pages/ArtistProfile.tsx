
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CalendarDays, 
  Globe, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  ExternalLink,
  MapPin,
  Music,
  Paintbrush,
  Camera,
  Film,
  User
} from 'lucide-react';

import Layout from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProfileCalendar from '@/components/profile/ProfileCalendar';
import { useToast } from '@/hooks/use-toast';

import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

interface ArtistData {
  id: string;
  name: string;
  type: string;
  subtype: string;
  disciplines: string[];
  styles: string[];
  location: string;
  bio: string;
  image_url: string;
  multidisciplinary: boolean;
  availability?: any[];
  social_links?: {
    website?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    other?: string;
  };
  tags: string[];
  highlights?: string[];
  created_at: string;
  updated_at: string;
}

const getDisciplineIcon = (discipline: string) => {
  switch (discipline.toLowerCase()) {
    case 'music':
      return <Music className="h-4 w-4" />;
    case 'visual':
      return <Paintbrush className="h-4 w-4" />;
    case 'photography':
      return <Camera className="h-4 w-4" />;
    case 'film':
      return <Film className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const ArtistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch artist data
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('*')
          .eq('id', id)
          .single();
        
        if (artistError) throw artistError;
        if (!artistData) throw new Error('Artist not found');

        // Create default social links if none exist
        const defaultSocialLinks = {
          website: '',
          instagram: '',
          twitter: '',
          facebook: '',
          youtube: '',
          other: ''
        };

        // Set the artist data with social links
        setArtist({
          ...artistData,
          social_links: artistData.social_links || defaultSocialLinks,
          bio: artistData.bio || 'No biography available'
        });

        // Fetch associated user profile if any
        const { data: ownership, error: ownershipError } = await supabase
          .from('content_ownership')
          .select('owner_id')
          .eq('content_id', id)
          .eq('content_type', 'artist')
          .single();

        if (!ownershipError && ownership) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', ownership.owner_id)
            .single();

          if (!profileError && profileData) {
            setUserProfile({
              id: profileData.id,
              username: profileData.username,
              full_name: profileData.full_name,
              avatar_url: profileData.avatar_url,
              bio: profileData.bio,
              profile_types: profileData.profile_types,
              created_at: profileData.created_at,
              updated_at: profileData.updated_at,
              role_attributes: {} // Adding this to match the Profile type
            });
          }
        }
      } catch (error) {
        console.error('Error fetching artist:', error);
        toast({
          title: 'Error',
          description: 'Failed to load artist profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const toggleFollow = async () => {
    setIsFollowing(prev => !prev);
    toast({
      title: isFollowing ? 'Unfollowed' : 'Following',
      description: isFollowing ? 'You are no longer following this artist' : 'You are now following this artist',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-muted"></div>
              <div>
                <div className="h-8 w-48 bg-muted rounded mb-2"></div>
                <div className="h-5 w-32 bg-muted rounded"></div>
              </div>
            </div>
            <div className="mt-8 grid gap-6">
              <div className="h-40 bg-muted rounded"></div>
              <div className="h-80 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!artist) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Artist Not Found</h1>
            <p className="text-muted-foreground">The artist you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" asChild>
              <Link to="/discover">Back to Discover</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={artist.image_url} alt={artist.name} />
                    <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{artist.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {artist.location || 'Location not specified'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Artist Bio */}
                <div>
                  <h3 className="font-medium mb-2">Bio</h3>
                  <p className="text-muted-foreground text-sm">{artist.bio}</p>
                </div>
                
                <Separator />
                
                {/* Disciplines & Styles */}
                <div>
                  <h3 className="font-medium mb-2">Disciplines</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.disciplines?.map(discipline => (
                      <Badge key={discipline} variant="secondary" className="flex items-center gap-1">
                        {getDisciplineIcon(discipline)}
                        {discipline}
                      </Badge>
                    ))}
                    {!artist.disciplines?.length && (
                      <span className="text-sm text-muted-foreground">No disciplines specified</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Styles</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.styles?.map(style => (
                      <Badge key={style} variant="outline">{style}</Badge>
                    ))}
                    {!artist.styles?.length && (
                      <span className="text-sm text-muted-foreground">No styles specified</span>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {/* Tags */}
                <div>
                  <h3 className="font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-muted/60">{tag}</Badge>
                    ))}
                    {!artist.tags?.length && (
                      <span className="text-sm text-muted-foreground">No tags specified</span>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {/* Social Links */}
                <div>
                  <h3 className="font-medium mb-2">Links</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {artist.social_links?.website && (
                      <Button variant="outline" size="sm" className="justify-start" asChild>
                        <a href={artist.social_links.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                    {artist.social_links?.instagram && (
                      <Button variant="outline" size="sm" className="justify-start" asChild>
                        <a href={`https://instagram.com/${artist.social_links.instagram}`} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-4 w-4 mr-2" />
                          Instagram
                        </a>
                      </Button>
                    )}
                    {artist.social_links?.twitter && (
                      <Button variant="outline" size="sm" className="justify-start" asChild>
                        <a href={`https://twitter.com/${artist.social_links.twitter}`} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {artist.social_links?.facebook && (
                      <Button variant="outline" size="sm" className="justify-start" asChild>
                        <a href={artist.social_links.facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-4 w-4 mr-2" />
                          Facebook
                        </a>
                      </Button>
                    )}
                    {artist.social_links?.youtube && (
                      <Button variant="outline" size="sm" className="justify-start" asChild>
                        <a href={artist.social_links.youtube} target="_blank" rel="noopener noreferrer">
                          <Youtube className="h-4 w-4 mr-2" />
                          Youtube
                        </a>
                      </Button>
                    )}
                    {artist.social_links?.other && (
                      <Button variant="outline" size="sm" className="justify-start" asChild>
                        <a href={artist.social_links.other} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Other
                        </a>
                      </Button>
                    )}
                    {!artist.social_links || Object.values(artist.social_links).every(link => !link) && (
                      <span className="text-sm text-muted-foreground">No social links available</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 pt-4">
                  <Button onClick={toggleFollow}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline">
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-2/3">
            <Tabs defaultValue="portfolio">
              <TabsList className="w-full">
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              
              <TabsContent value="portfolio" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio</CardTitle>
                    <CardDescription>View {artist.name}'s creative work</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Portfolio placeholders */}
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground">Portfolio item {i+1}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalendarDays className="mr-2 h-5 w-5" />
                      Availability Calendar
                    </CardTitle>
                    <CardDescription>Check {artist.name}'s availability and book sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileCalendar availability={artist.availability || []} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="projects" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>Current and past projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No projects to display</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {artist.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Biography</h3>
                      <p className="text-muted-foreground">{artist.bio}</p>
                    </div>
                    
                    {artist.highlights && artist.highlights.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Career Highlights</h3>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {artist.highlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium mb-2">Member Since</h3>
                      <p className="text-muted-foreground">
                        {new Date(artist.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtistProfile;
