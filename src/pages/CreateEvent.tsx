import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { generateUniqueId } from '@/utils/unique-id';
import EventComponentGroups from '@/components/events/EventComponentGroups';
import EventSharingDialog from '@/components/events/EventSharingDialog';
import EventSlotManager from '@/components/events/EventSlotManager';
import { EventSlot, FeaturedArtist } from '@/types/event';
import { ContentItemProps } from '@/types/content';
import { v4 as uuidv4 } from 'uuid';
import { convertToJson } from '@/types/supabase';
import ArtGalleryItemsForm from '@/components/events/forms/ArtGalleryItemsForm';
import { ArtGalleryItem } from '@/types/event';
import { 
  FilterType, 
  RecurrenceType, 
  EventContentItem,
  EventDetailsFormProps,
  DateTimeFormProps,
  PosterUploadProps,
  AdditionalSettingsProps,
  ContentCardProps
} from '@/types/forms';
import EventDetailsForm from '@/components/events/forms/EventDetailsForm';
import DateTimeForm from '@/components/events/forms/DateTimeForm';
import PosterUpload from '@/components/events/forms/PosterUpload';
import AdditionalSettings from '@/components/events/forms/AdditionalSettings';
import ContentCard from '@/components/events/ContentCard';
import FeaturedArtistsForm from '@/components/events/forms/FeaturedArtistsForm';

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const communityId = searchParams.get('communityId');
  
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacity, setCapacity] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [posterImage, setPosterImage] = useState<File | null>(null);
  const [posterUrl, setPosterUrl] = useState<string>('');
  const [eventType, setEventType] = useState('in-person');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [isPrivate, setIsPrivate] = useState(false);
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventSlots, setEventSlots] = useState<EventSlot[]>([]);
  const [featuredArtists, setFeaturedArtists] = useState<FeaturedArtist[]>([]);
  const [galleryItems, setGalleryItems] = useState<ArtGalleryItem[]>([]);
  
  const [selectedObjects, setSelectedObjects] = useState<{
    artists: ContentItemProps[];
    resources: ContentItemProps[];
    venues: ContentItemProps[];
  }>({
    artists: [],
    resources: [],
    venues: []
  });

  const [artists, setArtists] = useState<EventContentItem[]>([
    {
      id: generateUniqueId('artist'),
      name: 'DJ Spinmaster',
      image_url: 'https://source.unsplash.com/random/400x400/?dj',
      description: 'Electronic music DJ with 10 years of experience',
      type: 'DJ',
      location: 'New York'
    },
    {
      id: generateUniqueId('artist'),
      name: 'The Groove Band',
      image_url: 'https://source.unsplash.com/random/400x400/?band',
      description: 'A 5-piece funk band with a brass section',
      type: 'Band',
      location: 'Los Angeles'
    }
  ]);

  const [venues, setVenues] = useState<EventContentItem[]>([
    {
      id: generateUniqueId('venue'),
      name: 'Downtown Gallery',
      image_url: 'https://source.unsplash.com/random/400x400/?gallery',
      description: 'Spacious gallery in the heart of downtown',
      type: 'Gallery',
      location: 'Chicago'
    },
    {
      id: generateUniqueId('venue'),
      name: 'Riverside Pavilion',
      image_url: 'https://source.unsplash.com/random/400x400/?pavilion',
      description: 'Open-air venue by the river with stunning views',
      type: 'Outdoor',
      location: 'San Francisco'
    }
  ]);

  const [resources, setResources] = useState<EventContentItem[]>([
    {
      id: generateUniqueId('resource'),
      name: 'Professional Sound System',
      image_url: 'https://source.unsplash.com/random/400x400/?sound',
      description: 'High-quality PA system with subwoofers',
      type: 'Equipment',
      location: 'Warehouse'
    },
    {
      id: generateUniqueId('resource'),
      name: 'Stage Lighting Package',
      image_url: 'https://source.unsplash.com/random/400x400/?lighting',
      description: 'Complete stage lighting setup with operator',
      type: 'Equipment',
      location: 'Warehouse'
    }
  ]);

  const [brands, setBrands] = useState<EventContentItem[]>([
    {
      id: generateUniqueId('brand'),
      name: 'SoundTech Audio',
      image_url: 'https://source.unsplash.com/random/400x400/?brand',
      description: 'Audio equipment manufacturer',
      type: 'Sponsor',
      location: 'Global'
    },
    {
      id: generateUniqueId('brand'),
      name: 'UrbanWear Clothing',
      image_url: 'https://source.unsplash.com/random/400x400/?clothing',
      description: 'Streetwear fashion brand',
      type: 'Partner',
      location: 'New York'
    }
  ]);

  const [communities, setCommunities] = useState<EventContentItem[]>([
    {
      id: generateUniqueId('community'),
      name: 'Digital Artists Collective',
      image_url: 'https://source.unsplash.com/random/400x400/?collective',
      description: 'A community of digital artists',
      type: 'Community',
      location: 'Online'
    },
    {
      id: generateUniqueId('community'),
      name: 'Local Musicians Network',
      image_url: 'https://source.unsplash.com/random/400x400/?musicians',
      description: 'Network of local musicians for collaboration',
      type: 'Community',
      location: 'Boston'
    }
  ]);

  useEffect(() => {
    setSelectedObjects({
      artists: artists.filter(a => a.selected).map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        location: a.location,
        image_url: a.image_url,
        description: a.description
      })),
      resources: resources.filter(r => r.selected).map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        location: r.location,
        image_url: r.image_url,
        description: r.description
      })),
      venues: venues.filter(v => v.selected).map(v => ({
        id: v.id,
        name: v.name,
        type: v.type,
        location: v.location,
        image_url: v.image_url,
        description: v.description
      }))
    });
  }, [artists, resources, venues]);

  const handleArtistSelection = (id: string) => {
    setArtists(artists.map(artist => 
      artist.id === id ? { ...artist, selected: !artist.selected } : artist
    ));
  };

  const handleVenueSelection = (id: string) => {
    setVenues(venues.map(venue => 
      venue.id === id ? { ...venue, selected: !venue.selected } : venue
    ));
  };

  const handleResourceSelection = (id: string) => {
    setResources(resources.map(resource => 
      resource.id === id ? { ...resource, selected: !resource.selected } : resource
    ));
  };

  const handleBrandSelection = (id: string) => {
    setBrands(brands.map(brand => 
      brand.id === id ? { ...brand, selected: !brand.selected } : brand
    ));
  };

  const handleCommunitySelection = (id: string) => {
    setCommunities(communities.map(community => 
      community.id === id ? { ...community, selected: !community.selected } : community
    ));
  };

  const handleApplyComponentGroup = (group: any) => {
    const updatedArtists = [...artists];
    const updatedVenues = [...venues];
    const updatedResources = [...resources];
    const updatedBrands = [...brands];
    const updatedCommunities = [...communities];
    
    group.components.forEach((component: any) => {
      if (component.type === 'artists') {
        component.items.forEach((item: any) => {
          const existingIndex = updatedArtists.findIndex(a => a.id === item.id);
          if (existingIndex >= 0) {
            updatedArtists[existingIndex] = { ...updatedArtists[existingIndex], selected: true };
          } else {
            updatedArtists.push({ ...item, selected: true });
          }
        });
      } else if (component.type === 'venues') {
        component.items.forEach((item: any) => {
          const existingIndex = updatedVenues.findIndex(v => v.id === item.id);
          if (existingIndex >= 0) {
            updatedVenues[existingIndex] = { ...updatedVenues[existingIndex], selected: true };
          } else {
            updatedVenues.push({ ...item, selected: true });
          }
        });
      } else if (component.type === 'resources') {
        component.items.forEach((item: any) => {
          const existingIndex = updatedResources.findIndex(r => r.id === item.id);
          if (existingIndex >= 0) {
            updatedResources[existingIndex] = { ...updatedResources[existingIndex], selected: true };
          } else {
            updatedResources.push({ ...item, selected: true });
          }
        });
      } else if (component.type === 'brands') {
        component.items.forEach((item: any) => {
          const existingIndex = updatedBrands.findIndex(b => b.id === item.id);
          if (existingIndex >= 0) {
            updatedBrands[existingIndex] = { ...updatedBrands[existingIndex], selected: true };
          } else {
            updatedBrands.push({ ...item, selected: true });
          }
        });
      } else if (component.type === 'communities') {
        component.items.forEach((item: any) => {
          const existingIndex = updatedCommunities.findIndex(c => c.id === item.id);
          if (existingIndex >= 0) {
            updatedCommunities[existingIndex] = { ...updatedCommunities[existingIndex], selected: true };
          } else {
            updatedCommunities.push({ ...item, selected: true });
          }
        });
      }
    });
    
    setArtists(updatedArtists);
    setVenues(updatedVenues);
    setResources(updatedResources);
    setBrands(updatedBrands);
    setCommunities(updatedCommunities);
    
    toast.success("Component group applied successfully!");
  };

  const uploadPosterToStorage = async (): Promise<string | null> => {
    if (!posterImage) return null;

    try {
      const fileExt = posterImage.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `event-posters/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-assets')
        .upload(filePath, posterImage);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('event-assets')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading poster:', error);
      return null;
    }
  };

  const handleCreateEvent = async () => {
    const processingId = Date.now();
    console.log(`Create button clicked (ID: ${processingId}), starting event creation process`);
    
    if (loading) {
      console.log(`Already in loading state, preventing duplicate submission (ID: ${processingId})`);
      toast.error("Please wait, event creation in progress");
      return;
    }
    
    let isProcessing = true;
    setLoading(true);
    console.log(`Set loading state to true (ID: ${processingId})`);
    
    try {
      console.log("DEBUG: Starting validation checks");
      if (!eventName) {
        console.log("DEBUG: Event name missing");
        toast.error("Event name is required");
        setLoading(false);
        isProcessing = false;
        return;
      }

      if (!startDate) {
        console.log("DEBUG: Start date missing");
        toast.error("Start date is required");
        setLoading(false);
        isProcessing = false;
        return;
      }

      if (!startTime) {
        console.log("DEBUG: Start time missing");
        toast.error("Start time is required");
        setLoading(false);
        isProcessing = false;
        return;
      }

      if (!location) {
        console.log("DEBUG: Location missing");
        toast.error("Location is required");
        setLoading(false);
        isProcessing = false;
        return;
      }

      if (!user) {
        console.log("DEBUG: User not logged in");
        toast.error("You need to be logged in to create an event");
        setLoading(false);
        isProcessing = false;
        return;
      }

      console.log("DEBUG: All validation passed, creating event data");
      const eventId = uuidv4();
      console.log(`DEBUG: Generated event ID: ${eventId}`);
      
      const formattedStartDate = startDate ? new Date(startDate) : new Date();
      if (startTime) {
        const [hours, minutes] = startTime.split(':').map(Number);
        formattedStartDate.setHours(hours, minutes);
      }
      
      let formattedEndDate = null;
      if (endDate) {
        formattedEndDate = new Date(endDate);
        if (endTime) {
          const [hours, minutes] = endTime.split(':').map(Number);
          formattedEndDate.setHours(hours, minutes);
        }
      }
      
      const requestedItems = [];
      const processedSlots = eventSlots.map(slot => {
        const processedSlot = { ...slot };
        
        if (slot.venue?.isNew) {
          const requestedVenue = {
            id: slot.venue.id,
            name: slot.venue.name,
            type: 'venue',
            status: 'requested',
            email: slot.venue.email,
            link: slot.venue.link,
            location: slot.venue.location
          };
          
          requestedItems.push(requestedVenue);
          
          const requestNote = `Requested venue: ${slot.venue.name}`;
          processedSlot.notes = processedSlot.notes 
            ? `${processedSlot.notes}\n${requestNote}` 
            : requestNote;
          
          if (slot.venue.email) {
            processedSlot.notes += `\nEmail: ${slot.venue.email}`;
          }
          if (slot.venue.link) {
            processedSlot.notes += `\nLink: ${slot.venue.link}`;
          }
          if (slot.venue.location) {
            processedSlot.notes += `\nLocation: ${slot.venue.location}`;
          }
          
          processedSlot.venue = undefined;
          processedSlot.isRequestOnly = true;
        }
        
        return processedSlot;
      });
      
      let posterUrl = '';
      if (posterImage) {
        posterUrl = await uploadPosterToStorage() || '';
      }
      
      const eventTags = [
        ...artists.filter(a => a.selected).map(a => a.type || 'artist'),
        ...resources.filter(r => r.selected).map(r => r.type || 'resource'),
        ...venues.filter(v => v.selected).map(v => v.type || 'venue'),
        eventType
      ].filter(Boolean);

      console.log("DEBUG: Event data prepared", { 
        id: eventId,
        name: eventName,
        type: eventType,
        start_date: formattedStartDate.toISOString(),
        slots: processedSlots.length,
        requested_items: requestedItems.length
      });
      
      const eventData = {
        id: eventId,
        name: eventName,
        description: description,
        type: eventType,
        start_date: formattedStartDate.toISOString(),
        end_date: formattedEndDate ? formattedEndDate.toISOString() : null,
        location: location,
        capacity: capacity ? parseInt(capacity) : null,
        image_url: posterUrl,
        tags: eventTags,
        slots: convertToJson(processedSlots),
        requested_items: convertToJson(requestedItems),
        created_by: user.id,
        featured_artists: convertToJson(featuredArtists),
        gallery_items: convertToJson(galleryItems)
      };
      
      console.log("Step 1: Creating content ownership record...", eventId);
      try {
        if (!isProcessing) {
          console.log("DEBUG: Process aborted, no longer processing");
          return;
        }
        
        const { error: ownershipError } = await supabase
          .from('content_ownership')
          .insert({
            content_id: eventId,
            content_type: 'event',
            owner_id: user.id
          });
          
        if (ownershipError) {
          console.error('Error creating content ownership:', ownershipError);
          throw new Error('Failed to establish event ownership. ' + ownershipError.message);
        }
        
        if (!isProcessing) {
          console.log("DEBUG: Process aborted after ownership creation");
          return;
        }
        
        console.log("Step 2: Content ownership created, inserting event...");
        const { error: eventError } = await supabase
          .from('events')
          .insert(eventData);
        
        if (eventError) {
          console.error('Error creating event:', eventError);
          await supabase
            .from('content_ownership')
            .delete()
            .match({ content_id: eventId, content_type: 'event' });
          throw new Error(eventError.message);
        }
        
        if (!isProcessing) {
          console.log("DEBUG: Process aborted after event creation");
          return;
        }
        
        toast.success("Event created successfully!");
            navigate(`/events/${eventId}`);
      } catch (error: any) {
        console.error('Error in event creation process:', error);
        toast.error(error.message || "Failed to create event");
    } finally {
        setLoading(false);
        isProcessing = false;
      }
    } catch (error: any) {
      console.error('Error in event creation process:', error);
      toast.error(error.message || "Failed to create event");
        setLoading(false);
      isProcessing = false;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <EventDetailsForm
            eventName={eventName}
            setEventName={setEventName}
            description={description}
            setDescription={setDescription}
            location={location}
            setLocation={setLocation}
            capacity={capacity}
            setCapacity={setCapacity}
            eventType={eventType}
            setEventType={setEventType}
          />

          <DateTimeForm
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />

          <PosterUpload
            posterImage={posterImage}
            setPosterImage={setPosterImage}
            posterUrl={posterUrl}
            setPosterUrl={setPosterUrl}
          />

          <AdditionalSettings
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            registrationRequired={registrationRequired}
            setRegistrationRequired={setRegistrationRequired}
            ticketPrice={ticketPrice}
            setTicketPrice={setTicketPrice}
            ticketUrl={ticketUrl}
            setTicketUrl={setTicketUrl}
          />

          <FeaturedArtistsForm 
            featuredArtists={featuredArtists}
            setFeaturedArtists={setFeaturedArtists}
          />

          <ArtGalleryItemsForm
            galleryItems={galleryItems}
            setGalleryItems={setGalleryItems}
          />

          <div className="mt-6 border rounded-lg p-4 bg-background">
            <EventSlotManager 
              slots={eventSlots}
              onSlotsChange={setEventSlots}
              eventStartTime={startTime || "09:00"}
              eventEndTime={endTime || "17:00"}
              eventDate={startDate || new Date()}
              availableArtists={selectedObjects.artists}
              availableResources={selectedObjects.resources}
              availableVenues={selectedObjects.venues}
            />
          </div>
          
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Event Components</h2>
              
              <EventComponentGroups
                selectedArtists={artists.filter(a => a.selected)}
                selectedVenues={venues.filter(v => v.selected)}
                selectedResources={resources.filter(r => r.selected)}
                selectedBrands={brands.filter(b => b.selected)}
                selectedCommunities={communities.filter(c => c.selected)}
                onApplyGroup={handleApplyComponentGroup}
              />
            </div>
            <p className="text-muted-foreground">
              Select artists, venues, resources, brands and communities for your event
            </p>
            
            <Tabs defaultValue="all" value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="artists">Artists</TabsTrigger>
                <TabsTrigger value="venues">Venues</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="brands">Brands</TabsTrigger>
                <TabsTrigger value="communities">Communities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...artists, ...venues, ...resources, ...brands, ...communities].map(item => (
                    <ContentCard 
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image_url={item.image_url}
                      type={item.type}
                      location={item.location}
                      isSelected={item.selected}
                      selectionMode={true}
                      onClick={() => {
                        if (artists.some(a => a.id === item.id)) handleArtistSelection(item.id);
                        else if (venues.some(v => v.id === item.id)) handleVenueSelection(item.id);
                        else if (resources.some(r => r.id === item.id)) handleResourceSelection(item.id);
                        else if (brands.some(b => b.id === item.id)) handleBrandSelection(item.id);
                        else if (communities.some(c => c.id === item.id)) handleCommunitySelection(item.id);
                      }}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="artists" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {artists.map(item => (
                    <ContentCard 
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image_url={item.image_url}
                      type={item.type}
                      location={item.location}
                      isSelected={item.selected}
                      selectionMode={true}
                      onClick={() => handleArtistSelection(item.id)}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="venues" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {venues.map(item => (
                    <ContentCard 
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image_url={item.image_url}
                      type={item.type}
                      location={item.location}
                      isSelected={item.selected}
                      selectionMode={true}
                      onClick={() => handleVenueSelection(item.id)}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map(item => (
                    <ContentCard 
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image_url={item.image_url}
                      type={item.type}
                      location={item.location} 
                      isSelected={item.selected}
                      selectionMode={true}
                      onClick={() => handleResourceSelection(item.id)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="brands" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brands.map(item => (
                    <ContentCard 
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image_url={item.image_url}
                      type={item.type}
                      location={item.location} 
                      isSelected={item.selected}
                      selectionMode={true}
                      onClick={() => handleBrandSelection(item.id)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="communities" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {communities.map(item => (
                    <ContentCard 
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image_url={item.image_url}
                      type={item.type}
                      location={item.location} 
                      isSelected={item.selected}
                      selectionMode={true}
                      onClick={() => handleCommunitySelection(item.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
         
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/events')}>
              Cancel
            </Button>
            <Button 
              type="button" 
              disabled={loading} 
              onClick={handleCreateEvent}
            >
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateEvent;
