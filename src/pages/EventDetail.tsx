import React, { useState, useEffect, ReactNode } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Tag, ImagePlus, Edit, Trash2, ArrowLeft, UserCircle, Box, Users, Building2, Briefcase, LayoutGrid } from 'lucide-react';
import { format, parseISO } from 'date-fns';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/components/profile/ProfileCalendar';
import EventSlotManager from '@/components/events/EventSlotManager';
import ProfileCalendar from '@/components/profile/ProfileCalendar';
import { ContentItemProps } from '@/components/marketplace/ContentCard';
import EventComponentSearch from '@/components/events/EventComponentSearch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import EventbriteIntegration from '@/components/events/EventbriteIntegration';
import EventbriteCheckoutWidget from '@/components/events/EventbriteCheckoutWidget';

interface EventProps {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  capacity: number | null;
  image_url: string | null;
  type: string | null;
  subtype: string | null;
  tags: string[] | null;
  eventbrite_id: string | null;
}

// Hook for fetching event details with error handling
const useEventDetail = (eventId: string | undefined) => {
  const [event, setEvent] = useState<EventProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [eventSlots, setEventSlots] = useState<{ id: string; startTime: string; endTime: string; }[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<ContentItemProps | null>(null);
  const [selectedArtists, setSelectedArtists] = useState<ContentItemProps[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<ContentItemProps[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<ContentItemProps[]>([]);
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError('Event ID is missing');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch event data
        const { data, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (eventError) {
          console.error("Event fetch error:", eventError);
          throw new Error(eventError.message);
        }

        if (!data) {
          setError('Event not found');
          return;
        }

        setEvent(data);

        // Initialize with dummy data for now
        // This would be replaced with actual event slot data
        setEventSlots([
          { id: '1', startTime: '10:00', endTime: '11:00' },
          { id: '2', startTime: '14:00', endTime: '15:00' },
        ]);

        // Check if the user is the owner of the event
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          try {
            const { data: ownershipData, error: ownershipError } = await supabase
              .from('content_ownership')
              .select('id') // Only select the id to minimize data transfer
              .eq('content_id', eventId)
              .eq('content_type', 'event')
              .eq('owner_id', userData.user.id);

            if (ownershipError) {
              console.warn('Could not fetch ownership:', ownershipError);
            } else {
              setIsOwner(ownershipData && ownershipData.length > 0);
            }
          } catch (err) {
            console.warn('Error checking ownership:', err);
            setIsOwner(false);
          }
        } else {
          setIsOwner(false);
        }

        // Try to fetch associated components if they exist
        try {
          // Instead of querying a non-existent table, we'll use dummy data for now
          // In a real implementation, you would add the event_components table to Supabase
          // and properly query it
          
          // Set up some example components for the event
          // This would normally come from the database
          if (isOwner) {
            setSelectedVenue({
              id: 'venue-1',
              name: 'Main Venue',
              type: 'venue',
              location: 'Downtown',
              tags: ['Large', 'Central', 'Accessible'],
              image_url: 'https://images.unsplash.com/photo-1543968996-ee822b8176ba'
            });
            
            setSelectedArtists([{
              id: 'artist-1',
              name: 'Featured Artist',
              type: 'artist',
              location: 'New York',
              tags: ['Performer', 'Musician'],
              image_url: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f'
            }]);
          }
        } catch (err) {
          console.warn('Error setting up event components:', err);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load event');
        console.error("Event load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { 
    event, 
    isLoading, 
    error, 
    isOwner, 
    eventSlots, 
    setEventSlots,
    selectedVenue,
    setSelectedVenue,
    selectedArtists,
    setSelectedArtists,
    selectedBrands,
    setSelectedBrands,
    selectedCommunities,
    setSelectedCommunities
  };
};

// Define category types for organization
type ContentCategory = 'info' | 'people' | 'logistics';
type ContentTab = 'info' | 'artists' | 'resources' | 'venues' | 'brands' | 'schedule' | 'attendees' | 'communities';

// Component slot interface for each tab's content
interface EventTabSlot {
  label: string;
  value: ContentTab;
  icon: React.ReactNode;
  category: ContentCategory;
  order: number;
}

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { 
    event, 
    isLoading, 
    error, 
    isOwner, 
    eventSlots, 
    setEventSlots,
    selectedVenue,
    setSelectedVenue,
    selectedArtists,
    setSelectedArtists,
    selectedBrands,
    setSelectedBrands,
    selectedCommunities,
    setSelectedCommunities 
  } = useEventDetail(eventId);
  const [activeTab, setActiveTab] = useState<ContentTab>("info");
  const [activeCategory, setActiveCategory] = useState<ContentCategory>("info");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteEvent = async () => {
    if (!eventId) {
      toast({
        title: 'Error',
        description: 'Event ID is missing',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });

      navigate('/events'); // Redirect to events page after deletion
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

  const mapEventToCalendar = (event: any): CalendarEvent => {
    return {
      id: event.id,
      title: event.name,
      date: new Date(event.start_date),
      location: event.location,
      type: event.type || 'Event',
      category: event.subtype,
      imageUrl: event.image_url
    };
  };

  const calendarEvents = event ? [mapEventToCalendar(event)] : [];

  const handleSlotsChange = (newSlots: { id: string; startTime: string; endTime: string; }[]) => {
    setEventSlots(newSlots);
  };

  const handleSelectVenue = (venue: ContentItemProps) => {
    setSelectedVenue(venue);
    toast({
      title: 'Venue Added',
      description: `${venue.name} has been added to this event.`
    });
  };

  const handleSelectArtist = (artist: ContentItemProps) => {
    setSelectedArtists([...selectedArtists, artist]);
    toast({
      title: 'Artist Added',
      description: `${artist.name} has been added to this event.`
    });
  };

  const handleSelectBrand = (brand: ContentItemProps) => {
    setSelectedBrands([...selectedBrands, brand]);
    toast({
      title: 'Brand Added',
      description: `${brand.name} has been added to this event.`
    });
  };

  const handleSelectCommunity = (community: ContentItemProps) => {
    setSelectedCommunities([...selectedCommunities, community]);
    toast({
      title: 'Community Added',
      description: `${community.name} has been added to this event.`
    });
  };

  const handleRemoveVenue = () => {
    setSelectedVenue(null);
    toast({
      title: 'Venue Removed',
      description: `The venue has been removed from this event.`
    });
  };

  const handleRemoveArtist = (artistId: string) => {
    setSelectedArtists(selectedArtists.filter(artist => artist.id !== artistId));
    toast({
      title: 'Artist Removed',
      description: `The artist has been removed from this event.`
    });
  };

  const handleRemoveBrand = (brandId: string) => {
    setSelectedBrands(selectedBrands.filter(brand => brand.id !== brandId));
    toast({
      title: 'Brand Removed',
      description: `The brand has been removed from this event.`
    });
  };

  const handleRemoveCommunity = (communityId: string) => {
    setSelectedCommunities(selectedCommunities.filter(community => community.id !== communityId));
    toast({
      title: 'Community Removed',
      description: `The community has been removed from this event.`
    });
  };

  // Define all available tab slots with their metadata
  const tabSlots: EventTabSlot[] = [
    { label: "About", value: "info", icon: <LayoutGrid className="h-4 w-4" />, category: "info", order: 1 },
    { label: "Artists", value: "artists", icon: <UserCircle className="h-4 w-4" />, category: "people", order: 1 },
    { label: "Communities", value: "communities", icon: <Users className="h-4 w-4" />, category: "people", order: 2 },
    { label: "Venues", value: "venues", icon: <Building2 className="h-4 w-4" />, category: "logistics", order: 1 },
    { label: "Resources", value: "resources", icon: <Box className="h-4 w-4" />, category: "logistics", order: 1 },
    { label: "Brands", value: "brands", icon: <Briefcase className="h-4 w-4" />, category: "logistics", order: 2 },
    { label: "Schedule", value: "schedule", icon: <Calendar className="h-4 w-4" />, category: "logistics", order: 3 },
    { label: "Attendees", value: "attendees", icon: <Users className="h-4 w-4" />, category: "people", order: 3 },
  ];
  
  // Helper to get tabs for a category
  const getTabsForCategory = (category: ContentCategory): EventTabSlot[] => {
    return tabSlots
      .filter(tab => tab.category === category)
      .sort((a, b) => a.order - b.order);
  };

  // Update category when tab changes
  useEffect(() => {
    const newTab = tabSlots.find(tab => tab.value === activeTab);
    if (newTab) {
      setActiveCategory(newTab.category);
    }
  }, [activeTab]);

  if (isLoading) {
    return <Layout>Loading event...</Layout>;
  }

  if (error || !event) {
    return <Layout>Error: {error || 'Event not found'}</Layout>;
  }

  const formattedStartDate = event.start_date ? format(parseISO(event.start_date), 'MMMM dd, yyyy') : 'Not specified';
  const formattedStartTime = event.start_date ? format(parseISO(event.start_date), 'hh:mm a') : 'Not specified';
  const formattedEndTime = event.end_date ? format(parseISO(event.end_date), 'hh:mm a') : 'Not specified';

  const renderTabContent = (tabValue: ContentTab): ReactNode => {
    switch (tabValue) {
      case "info":
        return (
          <>
            <h2 className="text-xl font-semibold mb-3">About This Event</h2>
            <p className="text-gray-700 mb-6">{event.description || 'No description provided.'}</p>
            
            <h3 className="text-lg font-semibold mb-3">Time Slots</h3>
            <EventSlotManager
              slots={eventSlots}
              onSlotsChange={handleSlotsChange}
              eventStartTime={formattedStartTime}
              eventEndTime={formattedEndTime}
              eventDate={new Date(event.start_date)}
              readOnly={!isOwner}
            />
            
            {isOwner && (
              <div className="mt-6">
                <EventbriteIntegration 
                  eventId={event.id}
                  eventData={{
                    id: event.id,
                    title: event.name,
                    description: event.description || '',
                    start_date: event.start_date || '',
                    end_date: event.end_date || '',
                    location: event.location || '',
                    capacity: event.capacity || 100,
                    is_online: event.type === 'online'
                  }}
                />
              </div>
            )}
          </>
        );
      case "artists":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Event Artists</h2>
              {isOwner && (
                <Button size="sm" variant="outline" onClick={() => setActiveTab("artists")}>+ Add Artist</Button>
              )}
            </div>
            
            {selectedArtists.length > 0 ? (
              <div className="space-y-3">
                {selectedArtists.map(artist => (
                  <div key={artist.id} className="flex items-center gap-3 p-2 border rounded-md bg-card">
                    <div className="h-12 w-12 rounded bg-muted">
                      {artist.image_url && (
                        <img 
                          src={artist.image_url} 
                          alt={artist.name} 
                          className="h-full w-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{artist.name}</p>
                      <p className="text-sm text-muted-foreground">{artist.location}</p>
                    </div>
                    {isOwner && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleRemoveArtist(artist.id)}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No artists have been added to this event.</p>
                {isOwner && (
                  <p className="text-sm mt-2">Click 'Add Artist' to feature performers.</p>
                )}
              </div>
            )}
            
            {isOwner && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Add Artists</h3>
                <EventComponentSearch
                  componentType="artists"
                  onSelectItem={handleSelectArtist}
                  selectedItems={selectedArtists}
                  onRemoveItem={handleRemoveArtist}
                />
              </div>
            )}
          </>
        );
      case "resources":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Event Resources</h2>
              {isOwner && (
                <Button size="sm" variant="outline" onClick={() => setActiveTab("resources")}>+ Add Resource</Button>
              )}
            </div>
            
            <div className="text-center py-8 text-muted-foreground">
              <p>No resources have been added to this event yet.</p>
              {isOwner && (
                <p className="text-sm mt-2">Add resources like equipment, materials, or services needed for this event.</p>
              )}
            </div>
            
            {isOwner && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Add Resources</h3>
                <EventComponentSearch
                  componentType="resources"
                  onSelectItem={(resource) => {
                    setSelectedBrands([...selectedBrands, resource]);
                    toast({
                      title: 'Resource Added',
                      description: `${resource.name} has been added to this event.`
                    });
                  }}
                  selectedItems={selectedBrands}
                  onRemoveItem={(resourceId) => handleRemoveBrand(resourceId)}
                />
              </div>
            )}
          </>
        );
      case "venues":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Event Venues & Zones</h2>
              {isOwner && (
                <Button size="sm" variant="outline" onClick={() => setActiveTab("venues")}>+ Add Venue</Button>
              )}
            </div>
            
            {selectedVenue ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 border rounded-md bg-card">
                  <div className="h-12 w-12 rounded bg-muted">
                    {selectedVenue.image_url && (
                      <img 
                        src={selectedVenue.image_url} 
                        alt={selectedVenue.name} 
                        className="h-full w-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedVenue.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedVenue.location}</p>
                    <Badge variant="outline" className="mt-1">Primary Venue</Badge>
                  </div>
                  {isOwner && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={handleRemoveVenue}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No venues or zones have been added to this event.</p>
                {isOwner && (
                  <p className="text-sm mt-2">Add venues where the event will take place, or specific zones within a venue.</p>
                )}
              </div>
            )}
            
            {isOwner && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Add Venues & Zones</h3>
                <EventComponentSearch
                  componentType="venues"
                  onSelectItem={handleSelectVenue}
                  selectedItems={selectedVenue ? [selectedVenue] : []}
                  onRemoveItem={handleRemoveVenue}
                />
              </div>
            )}
          </>
        );
      case "brands":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Event Brands & Sponsors</h2>
              {isOwner && (
                <Button size="sm" variant="outline" onClick={() => setActiveTab("brands")}>+ Add Brand</Button>
              )}
            </div>
            
            {selectedBrands.length > 0 ? (
              <div className="space-y-3">
                {selectedBrands.map(brand => (
                  <div key={brand.id} className="flex items-center gap-3 p-2 border rounded-md bg-card">
                    <div className="h-12 w-12 rounded bg-muted">
                      {brand.image_url && (
                        <img 
                          src={brand.image_url} 
                          alt={brand.name} 
                          className="h-full w-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-sm text-muted-foreground">{brand.type}</p>
                    </div>
                    {isOwner && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleRemoveBrand(brand.id)}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No brands or sponsors have been added to this event.</p>
                {isOwner && (
                  <p className="text-sm mt-2">Add brands or sponsors that are supporting this event.</p>
                )}
              </div>
            )}
            
            {isOwner && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Add Brands & Sponsors</h3>
                <EventComponentSearch
                  componentType="brands"
                  onSelectItem={handleSelectBrand}
                  selectedItems={selectedBrands}
                  onRemoveItem={handleRemoveBrand}
                />
              </div>
            )}
          </>
        );
      case "communities":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Event Communities</h2>
              {isOwner && (
                <Button size="sm" variant="outline" onClick={() => setActiveTab("communities")}>+ Add Community</Button>
              )}
            </div>
            
            {selectedCommunities.length > 0 ? (
              <div className="space-y-3">
                {selectedCommunities.map(community => (
                  <div key={community.id} className="flex items-center gap-3 p-2 border rounded-md bg-card">
                    <div className="h-12 w-12 rounded bg-muted">
                      {community.image_url && (
                        <img 
                          src={community.image_url} 
                          alt={community.name} 
                          className="h-full w-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{community.name}</p>
                      <p className="text-sm text-muted-foreground">{community.type}</p>
                    </div>
                    {isOwner && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleRemoveCommunity(community.id)}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No communities have been added to this event.</p>
                {isOwner && (
                  <p className="text-sm mt-2">Add communities that are participating in or supporting this event.</p>
                )}
              </div>
            )}
            
            {isOwner && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Add Communities</h3>
                <EventComponentSearch
                  componentType="communities"
                  onSelectItem={handleSelectCommunity}
                  selectedItems={selectedCommunities}
                  onRemoveItem={handleRemoveCommunity}
                />
              </div>
            )}
          </>
        );
      case "schedule":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
            <ProfileCalendar 
              events={calendarEvents} 
              focusedEvent={mapEventToCalendar(event)}
              isOwnProfile={isOwner} 
              profileType="event"
            />
          </>
        );
      case "attendees":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Attendees</h2>
            <div className="text-center py-8 text-muted-foreground">
              <p>No attendees have registered for this event yet.</p>
              <Button className="mt-4">Register to Attend</Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-4 flex justify-between items-center">
          <Link to="/events" className="text-primary hover:underline flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
          {isOwner && (
            <div className="space-x-2">
              <Link to={`/events/${eventId}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Event
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your event
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteEvent}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Event image and basic info */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              {event.image_url ? (
                <img src={event.image_url} alt={event.name} className="w-full aspect-video object-cover" />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              
              <CardHeader className="pb-2">
                <CardTitle>{event.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formattedStartDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formattedStartTime} - {formattedEndTime}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-0">
                <div className="w-full space-y-2">
                  {event.eventbrite_id ? (
                    <EventbriteCheckoutWidget 
                      eventId={event.id} 
                      eventbriteId={event.eventbrite_id}
                      className="w-full"
                      buttonText="Get Tickets"
                    />
                  ) : (
                    <Button className="w-full">Register</Button>
                  )}
                  
                  {isOwner && (
                    <Link to={`/events/${eventId}/edit`} className="w-full">
                      <Button variant="outline" className="w-full">Edit Event</Button>
                    </Link>
                  )}
                </div>
              </CardFooter>
            </Card>

            {selectedVenue && (
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Venue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded bg-muted">
                      {selectedVenue.image_url && (
                        <img 
                          src={selectedVenue.image_url} 
                          alt={selectedVenue.name} 
                          className="h-full w-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{selectedVenue.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedVenue.location}</p>
                    </div>
                    {isOwner && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleRemoveVenue}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right columns - Tabs for details, components, calendar */}
          <div className="md:col-span-2">
            <Card>
              {/* Category-based tabs for better organization */}
              <Tabs defaultValue="info" value={activeCategory} onValueChange={(value) => setActiveCategory(value as ContentCategory)} className="w-full">
                <CardHeader className="pb-0">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="info">Overview</TabsTrigger>
                    <TabsTrigger value="people">People</TabsTrigger>
                   
                    <TabsTrigger value="logistics">Logistics</TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                {/* Content for each category - Contains nested tabs */}
                <CardContent className="pt-6">
                  {Object.keys(tabSlots.reduce((acc, tab) => ({ ...acc, [tab.category]: true }), {})).map(
                    (category) => (
                      <TabsContent key={category} value={category} className="mt-0">
                        <Tabs 
                          defaultValue={getTabsForCategory(category as ContentCategory)[0]?.value || "info"} 
                          value={activeTab}
                          onValueChange={(value) => setActiveTab(value as ContentTab)}
                        >
                          <div className="flex mb-4 border-b">
                            {getTabsForCategory(category as ContentCategory).map(tab => (
                              <Button
                                key={tab.value}
                                variant={activeTab === tab.value ? "default" : "ghost"}
                                size="sm"
                                className={`mr-2 ${activeTab === tab.value ? "" : "text-muted-foreground"}`}
                                onClick={() => setActiveTab(tab.value)}
                              >
                                {tab.icon}
                                <span className="ml-1">{tab.label}</span>
                              </Button>
                            ))}
                          </div>
                          
                          {getTabsForCategory(category as ContentCategory).map(tab => (
                            <TabsContent key={tab.value} value={tab.value} className="mt-0">
                              <Card className="border-0 shadow-none">
                                <CardContent className="p-0">
                                  {renderTabContent(tab.value)}
                                </CardContent>
                              </Card>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </TabsContent>
                    )
                  )}
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
