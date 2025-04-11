import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import ContentCard from '@/components/marketplace/ContentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Image, Plus, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { generateUniqueId } from '@/utils/unique-id';
import EventComponentGroups from '@/components/events/EventComponentGroups';
import EventSharingDialog from '@/components/events/EventSharingDialog';
import EventSlotManager from '@/components/events/EventSlotManager';
import { EventSlot } from '@/types/event';
import { ContentItemProps } from '@/types/content';

interface EventContentItem {
  id: string;
  name: string;
  type: string;
  location: string;
  image_url?: string;
  description?: string;
  tags?: string[];
  selected?: boolean;
}

type FilterType = "resources" | "artists" | "venues" | "brands" | "communities" | "all";

type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "custom";

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const handlePosterUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    setPosterImage(file);
    
    const url = URL.createObjectURL(file);
    setPosterUrl(url);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to create an event");
      return;
    }
    
    if (!eventName) {
      toast.error("Event name is required");
      return;
    }

    if (!startDate) {
      toast.error("Start date is required");
      return;
    }

    if (!startTime) {
      toast.error("Start time is required");
      return;
    }

    setLoading(true);

    try {
      let posterImageUrl = null;
      if (posterImage) {
        posterImageUrl = await uploadPosterToStorage();
      }

      const selectedArtists = artists.filter(a => a.selected);
      const selectedVenues = venues.filter(v => v.selected);
      const selectedResources = resources.filter(r => r.selected);
      const selectedBrands = brands.filter(b => b.selected);
      const selectedCommunities = communities.filter(c => c.selected);

      const startDateTime = startDate && startTime 
        ? new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`)
        : null;
        
      const endDateTime = endDate && endTime
        ? new Date(`${format(endDate, 'yyyy-MM-dd')}T${endTime}`)
        : startDate && endTime 
          ? new Date(`${format(startDate, 'yyyy-MM-dd')}T${endTime}`)
          : null;

      const eventData = {
        title: eventName,
        description,
        location,
        start_date: startDateTime?.toISOString(),
        end_date: endDateTime?.toISOString(),
        capacity: capacity ? parseInt(capacity) : null,
        poster_url: posterImageUrl,
        event_type: eventType,
        recurrence_type: recurrenceType,
        is_private: isPrivate,
        ticket_price: ticketPrice,
        ticket_url: ticketUrl,
        registration_required: registrationRequired,
        created_by: user.id,
        created_at: new Date().toISOString(),
        slots: eventSlots
      };

      console.log("Event data:", eventData);
      console.log("Selected components:", {
        artists: selectedArtists,
        venues: selectedVenues,
        resources: selectedResources,
        brands: selectedBrands,
        communities: selectedCommunities
      });

      toast.success("Event created successfully!");
      
      const mockEventId = `event_${Date.now()}`;
      
      if (window.confirm("Event created successfully! Would you like to share it with others?")) {
        navigate(`/events/${mockEventId}`);
      } else {
        navigate('/events');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredContent = () => {
    switch (filterType) {
      case 'artists':
        return artists;
      case 'venues':
        return venues;
      case 'resources':
        return resources;
      case 'brands':
        return brands;
      case 'communities':
        return communities;
      case 'all':
      default:
        return [
          ...artists, 
          ...venues, 
          ...resources, 
          ...brands,
          ...communities
        ];
    }
  };

  const handleItemClick = (itemId: string) => {
    if (artists.some(a => a.id === itemId)) {
      handleArtistSelection(itemId);
    } else if (venues.some(v => v.id === itemId)) {
      handleVenueSelection(itemId);
    } else if (resources.some(r => r.id === itemId)) {
      handleResourceSelection(itemId);
    } else if (brands.some(b => b.id === itemId)) {
      handleBrandSelection(itemId);
    } else if (communities.some(c => c.id === itemId)) {
      handleCommunitySelection(itemId);
    }
  };

  const tabKeys = {
    all: generateUniqueId('tab-all'),
    artists: generateUniqueId('tab-artists'),
    venues: generateUniqueId('tab-venues'),
    resources: generateUniqueId('tab-resources'),
    brands: generateUniqueId('tab-brands'),
    communities: generateUniqueId('tab-communities')
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="eventName">Event Name*</Label>
                <Input 
                  id="eventName" 
                  value={eventName} 
                  onChange={(e) => setEventName(e.target.value)} 
                  placeholder="Enter event name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="eventType">Event Type*</Label>
                <Select 
                  value={eventType}
                  onValueChange={setEventType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe your event"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="location">Location*</Label>
                <Input 
                  id="location" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="Event location or online platform"
                  required
                />
              </div>

              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input 
                  id="capacity" 
                  value={capacity} 
                  onChange={(e) => setCapacity(e.target.value)} 
                  placeholder="Maximum number of attendees"
                  type="number"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Event Poster</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="posterImage">Upload Poster Image</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Label 
                    htmlFor="posterUpload" 
                    className="cursor-pointer flex h-10 items-center rounded-md px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Label>
                  <Input 
                    id="posterUpload"
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-muted-foreground">
                    {posterImage ? posterImage.name : "No file chosen"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended size: 1200x630 pixels (16:9 ratio)
                </p>
              </div>
              
              <div>
                {posterUrl ? (
                  <div className="aspect-video rounded-md overflow-hidden bg-muted">
                    <img 
                      src={posterUrl} 
                      alt="Event poster preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-md flex items-center justify-center bg-muted">
                    <div className="text-center text-muted-foreground">
                      <Image className="h-8 w-8 mx-auto mb-2" />
                      <p>Poster preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
          
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Event Schedule</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Start Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="startTime">Start Time*</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="startTime" 
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="endTime" 
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="recurrenceType">Recurrence</Label>
              <Select 
                value={recurrenceType}
                onValueChange={(value) => setRecurrenceType(value as RecurrenceType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recurrence pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">One-time event</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>
          
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Additional Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isPrivate" className="cursor-pointer">Private Event</Label>
                  <p className="text-sm text-muted-foreground">Only visible to invited participants</p>
                </div>
                <Switch 
                  id="isPrivate" 
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="registrationRequired" className="cursor-pointer">Require Registration</Label>
                  <p className="text-sm text-muted-foreground">Participants must register to attend</p>
                </div>
                <Switch 
                  id="registrationRequired" 
                  checked={registrationRequired}
                  onCheckedChange={setRegistrationRequired}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ticketPrice">Ticket Price</Label>
                <Input 
                  id="ticketPrice" 
                  value={ticketPrice} 
                  onChange={(e) => setTicketPrice(e.target.value)} 
                  placeholder="Leave blank for free events"
                />
              </div>
              
              <div>
                <Label htmlFor="ticketUrl">Ticket Link</Label>
                <Input 
                  id="ticketUrl" 
                  value={ticketUrl} 
                  onChange={(e) => setTicketUrl(e.target.value)} 
                  placeholder="External ticketing website URL"
                />
              </div>
            </div>
          </section>
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
            
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setFilterType("all")}>All</TabsTrigger>
                <TabsTrigger value="artists" onClick={() => setFilterType("artists")}>Artists</TabsTrigger>
                <TabsTrigger value="venues" onClick={() => setFilterType("venues")}>Venues</TabsTrigger>
                <TabsTrigger value="resources" onClick={() => setFilterType("resources")}>Resources</TabsTrigger>
                <TabsTrigger value="brands" onClick={() => setFilterType("brands")}>Brands</TabsTrigger>
                <TabsTrigger value="communities" onClick={() => setFilterType("communities")}>Communities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" key={tabKeys.all} className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredContent().map(item => (
                    <ContentCard 
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image_url={item.image_url}
                      type={item.type}
                      location={item.location}
                      isSelected={item.selected}
                      selectionMode={true}
                      onClick={() => handleItemClick(item.id)}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="artists" key={tabKeys.artists} className="pt-4">
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
              
              <TabsContent value="venues" key={tabKeys.venues} className="pt-4">
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
              
              <TabsContent value="resources" key={tabKeys.resources} className="pt-4">
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

              <TabsContent value="brands" key={tabKeys.brands} className="pt-4">
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

              <TabsContent value="communities" key={tabKeys.communities} className="pt-4">
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
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateEvent;
