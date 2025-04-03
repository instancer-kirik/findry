import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfileTabsContent from '../components/profile/ProfileTabsContent';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, Calendar, Star, Clock, Music, Award, User, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Profile } from '@/types/profile';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { EventSlot } from '@/types/event';
import { artists } from '@/components/discover/DiscoverData';
import { format } from 'date-fns';

// Mock upcoming events where this artist might perform
const upcomingEventsMock = [
  {
    id: '101',
    title: 'Downtown Jazz Festival',
    date: new Date(2023, 7, 15),
    location: 'Central Park, New York',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: '102',
    title: 'Rhythm & Blues Night',
    date: new Date(2023, 7, 22),
    location: 'Blue Moon Club, Chicago',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }
];

// Available time slots for the artist
const availableTimeSlotsMock: EventSlot[] = [
  {
    id: "101",
    title: "Morning Session",
    startTime: "09:00",
    endTime: "12:00",
    status: "available",
    slotType: "performance"
  },
  {
    id: "102",
    title: "Afternoon Session",
    startTime: "13:00",
    endTime: "17:00",
    status: "available",
    slotType: "performance"
  },
  {
    id: "103",
    title: "Evening Performance",
    startTime: "19:00",
    endTime: "22:00",
    status: "available",
    slotType: "performance"
  }
];

// Artist's past performances
const pastPerformancesMock = [
  {
    id: '201',
    title: 'Winter Music Festival',
    date: new Date(2023, 1, 15),
    location: 'Mountain Arena, Denver',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: '202',
    title: 'Summer Beats Concert',
    date: new Date(2023, 5, 10),
    location: 'Oceanside Amphitheater, Miami',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

const ArtistProfile: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSelecting = searchParams.get('select') === 'true';
  const eventId = searchParams.get('eventId');
  const slotId = searchParams.get('slotId');
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  
  const handleSelectArtist = () => {
    if (isSelecting && eventId) {
      // In a real application, this would make an API call to assign the artist to the event slot
      toast.success('Artist selected for event!', {
        description: 'You will be redirected to the event details.',
      });
      
      // Redirect back to the event with the artist selection
      setTimeout(() => {
        if (slotId) {
          navigate(`/events/${eventId}?slot=${slotId}&artist=${artistId}`);
        } else {
          navigate(`/events/${eventId}?artist=${artistId}`);
        }
      }, 1500);
    } else {
      // Show availability dialog
      setShowAvailabilityDialog(true);
    }
  };
  
  const handleBookArtist = () => {
    // In a real app, this would create a new event or redirect to the event creation page
    navigate(`/events/create?artist=${artistId}`);
    setShowAvailabilityDialog(false);
  };
  
  // Fetch artist data from Supabase or use mock data if not available
  const { data: artistData, isLoading, error } = useQuery({
    queryKey: ['artist', artistId],
    queryFn: async () => {
      console.log('Fetching artist data for ID:', artistId);
      
      if (!artistId) {
        throw new Error('Artist ID is required');
      }
      
      // First try to fetch from artists table in Supabase
      try {
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('*')
          .eq('id', artistId)
          .single();
          
        if (artistError) {
          throw artistError;
        }
        
        if (artistData) {
          // For presentation purposes, we're mapping artist data to a profile structure
          const profileData: Profile = {
            id: artistData.id,
            username: artistData.name.toLowerCase().replace(/\s+/g, '.'),
            full_name: artistData.name,
            avatar_url: artistData.image_url,
            bio: artistData.subtype || "Artist on Findry",
            profile_types: ["artist"],
            created_at: artistData.created_at,
            updated_at: artistData.updated_at
          };
          
          return {
            artist: artistData,
            profile: profileData
          };
        }
      } catch (error) {
        console.error('Supabase fetch error:', error);
        
        // Fall back to mock data
        const mockArtist = artists.find(a => a.id === artistId);
        if (mockArtist) {
          const profileData: Profile = {
            id: mockArtist.id,
            username: mockArtist.name.toLowerCase().replace(/\s+/g, '.'),
            full_name: mockArtist.name,
            avatar_url: mockArtist.image_url,
            bio: mockArtist.subtype || "Artist on Findry",
            profile_types: ["artist"],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          return {
            artist: mockArtist,
            profile: profileData
          };
        }
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
        <div className="flex justify-between items-start">
          <ProfileHeader 
            profile={artistData.profile} 
            isOwnProfile={false} 
          />
          
          {isSelecting ? (
            <Button onClick={handleSelectArtist} size="lg" className="mt-4">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Select for Event
            </Button>
          ) : (
            <Button onClick={handleSelectArtist} size="lg" className="mt-4">
              <Calendar className="mr-2 h-5 w-5" />
              Book this Artist
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performances">Performances</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Artist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {artistData.artist.tags?.map(tag => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground">
                      {artistData.artist.subtype} based in {artistData.artist.location}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Music className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Style</p>
                          <p className="text-sm text-muted-foreground">
                            {artistData.artist.styles?.join(', ') || 'Various'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Experience</p>
                          <p className="text-sm text-muted-foreground">
                            Professional
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingEventsMock.map(event => (
                      <div key={event.id} className="mb-4 last:mb-0">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(event.date, 'MMMM d, yyyy')}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">View All Events</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performances" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Past Performances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastPerformancesMock.map(performance => (
                    <Card key={performance.id}>
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={performance.imageUrl} 
                          alt={performance.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold text-lg">{performance.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(performance.date, 'MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {performance.location}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <ProfileTabsContent 
              profile={artistData.profile} 
              isOwnProfile={false} 
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showAvailabilityDialog} onOpenChange={setShowAvailabilityDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book {artistData.profile.full_name}</DialogTitle>
            <DialogDescription>
              Select an available time slot or create a new event
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Available Time Slots</h4>
              {availableTimeSlotsMock.map(slot => (
                <div 
                  key={slot.id}
                  className="p-3 border rounded-md hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => {
                    navigate(`/events/create?artist=${artistId}&slot=${slot.id}`);
                    setShowAvailabilityDialog(false);
                  }}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{slot.title}</span>
                    <Badge variant="outline">{`${slot.startTime} - ${slot.endTime}`}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAvailabilityDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookArtist}>
              Create New Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ArtistProfile;
