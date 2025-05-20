import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  MapPin, 
  Mic2, 
  Music, 
  User, 
  Users, 
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  ExternalLink
} from 'lucide-react';
import ProfileCalendar, { CalendarEvent } from '@/components/profile/ProfileCalendar';
import { Artist } from '@/types/database';
import { ContentItemProps } from '@/types/content';

const ArtistProfile = () => {
  // Extract the actual artistId and artistSlug from the URL using useParams
  const params = useParams<{ artistId?: string; artistSlug?: string }>();
  const artistId = params.artistId;
  const artistSlug = params.artistSlug;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [mediaItems, setMediaItems] = useState<ContentItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistAndMedia = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setMediaItems([]);
        
        console.log('Fetching artist with params:', { artistId, artistSlug });
        
        if (!artistId && !artistSlug) {
          setError('No artist identifier provided');
          setIsLoading(false);
          return;
        }
        
        // Mock artist data for development
        const mockArtist: Artist = {
          id: artistId || 'mock-artist-id',
          name: 'Mock Artist Name',
          bio: 'This is a mock artist bio for development purposes.',
          image_url: 'https://via.placeholder.com/400',
          location: 'New York, NY',
          disciplines: ['Music', 'Visual Art'],
          styles: ['Contemporary', 'Experimental'],
          tags: ['indie', 'performer'],
          type: 'artist',
          subtype: 'musician',
          multidisciplinary: true,
          social_links: ['instagram', 'twitter', 'website'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setArtist(mockArtist);
        generateMockEvents(mockArtist);
        
        // Generate mock media items
        const mockMediaItems: ContentItemProps[] = [
          {
            id: "album-1",
            type: "album",
            name: "First Album",
            image_url: "https://via.placeholder.com/300",
            release_date: "2023-01-15",
            description: "Debut album",
            artist_id: mockArtist.id,
            artist_name: mockArtist.name,
            created_at: "2023-01-15T00:00:00Z",
            location: "New York"
          },
          {
            id: "song-1",
            type: "song",
            name: "First Song",
            album_id: "album-1",
            album_name: "First Album",
            artist_id: mockArtist.id,
            artist_name: mockArtist.name,
            duration: "3:45",
            description: "Lead single",
            created_at: "2023-01-15T00:00:00Z",
            location: "New York"
          },
          {
            id: "artwork-1",
            type: "artwork",
            name: "Abstract Piece",
            image_url: "https://via.placeholder.com/300",
            medium: "Acrylic on canvas",
            dimensions: "24x36 inches",
            creation_date: "2023-03-10",
            description: "Abstract painting with vibrant colors",
            artist_id: mockArtist.id,
            created_at: "2023-03-10T00:00:00Z",
            location: "New York"
          }
        ];
        
        setMediaItems(mockMediaItems);

      } catch (error: any) {
        console.error('Error in fetchArtistAndMedia:', error);
        setError(`An unexpected error occurred: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    const generateMockEvents = (artist: Artist) => {
      const mockEvents: CalendarEvent[] = [];
      const today = new Date();
      
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + Math.floor(Math.random() * 30));
        
        mockEvents.push({
          id: `event-${i}`,
          title: `Performance at ${['Club Vibe', 'The Venue', 'Jazz Hub', 'City Hall', 'Music Festival'][i % 5]}`,
          date,
          location: ['New York', 'Los Angeles', 'Berlin', 'Tokyo', 'London'][i % 5],
          type: 'performance',
          category: artist.disciplines && artist.disciplines[0] ? artist.disciplines[0] : 'music'
        });
      }
      
      setEvents(mockEvents);
    };
    
    fetchArtistAndMedia();
  }, [artistId, artistSlug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col md:flex-row gap-8 animate-pulse">
            <div className="md:w-1/3">
              <div className="w-full h-64 bg-muted rounded-lg"></div>
              <div className="mt-4 space-y-2">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Artist</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild>
              <Link to="/discover">Browse Artists</Link>
            </Button>
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
            <h1 className="text-2xl font-bold mb-4">Artist not found</h1>
            <p className="text-muted-foreground mb-6">The artist you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/discover">Browse Artists</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const bio = artist?.bio || '';
  const socialLinks = artist?.social_links || [];

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {/* Debugging information */}
        <div className="mb-8 p-4 border border-red-300 bg-red-50 rounded-md">
          <h3 className="font-bold text-red-800 mb-2">Debug Information</h3>
          <div className="text-sm font-mono">
            <p><strong>artistId:</strong> {artistId || 'not provided'}</p>
            <p><strong>artistSlug:</strong> {artistSlug || 'not provided'}</p>
            <p><strong>URL Path:</strong> {window.location.pathname}</p>
            <p><strong>URL Search:</strong> {window.location.search}</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-muted/20 rounded-lg overflow-hidden">
              <div className="aspect-square overflow-hidden bg-muted">
                {artist.image_url ? (
                  <img 
                    src={artist.image_url} 
                    alt={artist.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <User className="h-20 w-20 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h1 className="text-2xl font-bold">{artist.name}</h1>
                {artist.location && (
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{artist.location}</span>
                  </div>
                )}
                
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {artist.disciplines?.map((discipline, index) => (
                      <Badge key={index} variant="secondary">
                        {discipline}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {artist.styles?.map((style, index) => (
                      <Badge key={index} variant="outline">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {artist.social_links && artist.social_links.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Connect</h3>
                    <div className="flex gap-2">
                      {artist.social_links.includes('instagram') && (
                        <Button variant="outline" size="icon" asChild>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {artist.social_links.includes('twitter') && (
                        <Button variant="outline" size="icon" asChild>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {artist.social_links.includes('youtube') && (
                        <Button variant="outline" size="icon" asChild>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            <Youtube className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {artist.social_links.includes('facebook') && (
                        <Button variant="outline" size="icon" asChild>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {artist.social_links.includes('website') && (
                        <Button variant="outline" size="icon" asChild>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <Button className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-2/3">
            <Tabs defaultValue="about">
              <TabsList className="mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="performances">Performances</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">Bio</h2>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {bio}
                  </div>
                </div>
                
                {artist.disciplines && artist.disciplines.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-2">Disciplines</h2>
                    <div className="flex flex-wrap gap-2">
                      {artist.disciplines.map((discipline, index) => (
                        <div key={index} className="bg-muted/40 px-3 py-1 rounded-full text-sm">
                          {discipline}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {artist.styles && artist.styles.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-2">Styles</h2>
                    <div className="flex flex-wrap gap-2">
                      {artist.styles.map((style, index) => (
                        <div key={index} className="bg-muted/40 px-3 py-1 rounded-full text-sm">
                          {style}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {artist.tags && artist.tags.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-2">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {artist.tags.map((tag, index) => (
                        <div key={index} className="bg-muted/40 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="performances">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Upcoming Performances</h2>
                  
                  <div className="grid gap-4">
                    {events.map(event => (
                      <div key={event.id} className="bg-muted/20 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{event.date.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="media">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Media</h2>
                  
                  {mediaItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mediaItems.map(item => (
                        <div key={item.id} className="bg-muted/20 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            {item.type === 'album' && <Music className="h-5 w-5 mr-2" />}
                            {item.type === 'song' && <Mic2 className="h-5 w-5 mr-2" />}
                            {item.type === 'artwork' && <User className="h-5 w-5 mr-2" />}
                            <h3 className="font-medium">{item.name}</h3>
                          </div>
                          {item.image_url && (
                            <div className="aspect-video bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground">Type: {item.subtype || item.type}</p>
                          {item.album_name && <p className="text-sm text-muted-foreground">Album: {item.album_name}</p>}
                          {item.duration && <p className="text-sm text-muted-foreground">Duration: {item.duration}</p>}
                          {item.release_date && <p className="text-sm text-muted-foreground">Released: {new Date(item.release_date).toLocaleDateString()}</p>}
                          {item.medium && <p className="text-sm text-muted-foreground">Medium: {item.medium}</p>}
                          {item.dimensions && <p className="text-sm text-muted-foreground">Dimensions: {item.dimensions}</p>}
                          {item.description && <p className="text-xs mt-1 line-clamp-2">{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No media items found for this artist yet.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="calendar">
                <ProfileCalendar events={events} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtistProfile;
