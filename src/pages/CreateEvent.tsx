
import React, { useState } from 'react';
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

// Define a simpler event content item type
interface EventContentItem {
  id: string;
  name: string;
  image?: string;
  description?: string;
  type?: string;
  selected?: boolean;
  location?: string; // Add location to match ContentItemProps expectations
}

// Define the possible filter types for events
type FilterType = "resources" | "artists" | "venues" | "all";

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [capacity, setCapacity] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Mock data for event components
  const [artists, setArtists] = useState<EventContentItem[]>([
    {
      id: '1',
      name: 'DJ Spinmaster',
      image: 'https://source.unsplash.com/random/400x400/?dj',
      description: 'Electronic music DJ with 10 years of experience',
      type: 'DJ',
      location: 'New York'
    },
    {
      id: '2',
      name: 'The Groove Band',
      image: 'https://source.unsplash.com/random/400x400/?band',
      description: 'A 5-piece funk band with a brass section',
      type: 'Band',
      location: 'Los Angeles'
    }
  ]);

  const [venues, setVenues] = useState<EventContentItem[]>([
    {
      id: '1',
      name: 'Downtown Gallery',
      image: 'https://source.unsplash.com/random/400x400/?gallery',
      description: 'Spacious gallery in the heart of downtown',
      type: 'Gallery',
      location: 'Chicago'
    },
    {
      id: '2',
      name: 'Riverside Pavilion',
      image: 'https://source.unsplash.com/random/400x400/?pavilion',
      description: 'Open-air venue by the river with stunning views',
      type: 'Outdoor',
      location: 'San Francisco'
    }
  ]);

  const [resources, setResources] = useState<EventContentItem[]>([
    {
      id: '1',
      name: 'Professional Sound System',
      image: 'https://source.unsplash.com/random/400x400/?sound',
      description: 'High-quality PA system with subwoofers',
      type: 'Equipment',
      location: 'Warehouse'
    },
    {
      id: '2',
      name: 'Stage Lighting Package',
      image: 'https://source.unsplash.com/random/400x400/?lighting',
      description: 'Complete stage lighting setup with operator',
      type: 'Equipment',
      location: 'Warehouse'
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

  const handleSubmit = (e: React.FormEvent) => {
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

    // Get selected components
    const selectedArtists = artists.filter(a => a.selected);
    const selectedVenues = venues.filter(v => v.selected);
    const selectedResources = resources.filter(r => r.selected);

    // In a real app, you would submit this data to your backend
    console.log({
      eventName,
      description,
      location,
      startDate,
      endDate,
      capacity: capacity ? parseInt(capacity) : null,
      selectedArtists,
      selectedVenues,
      selectedResources
    });

    toast.success("Event created successfully!");
    navigate('/');
  };

  // Filter content based on the selected filter type
  const getFilteredContent = () => {
    switch (filterType) {
      case 'artists':
        return artists;
      case 'venues':
        return venues;
      case 'resources':
        return resources;
      case 'all':
      default:
        return [...artists, ...venues, ...resources];
    }
  };

  // Convert our EventContentItem to match what ContentCard expects
  const adaptItemForContentCard = (item: EventContentItem) => {
    return {
      id: item.id,
      name: item.name,
      image_url: item.image,
      description: item.description,
      type: item.type || "unknown",
      location: item.location || "",
      selected: item.selected || false
    };
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Event Details</h2>
            
            <div>
              <Label htmlFor="eventName">Event Name</Label>
              <Input 
                id="eventName" 
                value={eventName} 
                onChange={(e) => setEventName(e.target.value)} 
                placeholder="Enter event name"
                required
              />
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
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Event location"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="rounded-md border"
                />
              </div>
              
              <div>
                <Label>End Date</Label>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className="rounded-md border"
                />
              </div>
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
          </section>
          
          {/* Event Components */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Event Components</h2>
            <p className="text-muted-foreground">
              Select artists, venues, and resources for your event
            </p>
            
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setFilterType("all")}>All</TabsTrigger>
                <TabsTrigger value="artists" onClick={() => setFilterType("artists")}>Artists</TabsTrigger>
                <TabsTrigger value="venues" onClick={() => setFilterType("venues")}>Venues</TabsTrigger>
                <TabsTrigger value="resources" onClick={() => setFilterType("resources")}>Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredContent().map(item => (
                    <ContentCard 
                      key={item.id}
                      {...adaptItemForContentCard(item)}
                      onSelect={() => {
                        if (artists.some(a => a.id === item.id)) {
                          handleArtistSelection(item.id);
                        } else if (venues.some(v => v.id === item.id)) {
                          handleVenueSelection(item.id);
                        } else {
                          handleResourceSelection(item.id);
                        }
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
                      {...adaptItemForContentCard(item)}
                      onSelect={() => handleArtistSelection(item.id)}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="venues" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {venues.map(item => (
                    <ContentCard 
                      key={item.id}
                      {...adaptItemForContentCard(item)}
                      onSelect={() => handleVenueSelection(item.id)}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map(item => (
                    <ContentCard 
                      key={item.id}
                      {...adaptItemForContentCard(item)}
                      onSelect={() => handleResourceSelection(item.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateEvent;
