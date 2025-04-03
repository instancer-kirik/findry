import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, Users, Tag, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import AnimatedSection from '../components/ui-custom/AnimatedSection';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EventSlot } from '@/types/event';
import EventSlotManager from '@/components/events/EventSlotManager';

// Import data
import {
  artists,
  venues,
  communities,
  brands
} from '../components/discover/DiscoverData';
import { ContentItemProps } from '../components/marketplace/ContentCard';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  location: z.string().min(5, { message: 'Location is required' }),
  date: z.date({ required_error: 'Event date is required' }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
  eventType: z.string().min(1, { message: 'Event type is required' }),
  capacity: z.string().min(1, { message: 'Capacity is required' }),
  tags: z.string().optional(),
  venueId: z.string().optional(),
  hostId: z.string().optional(),
  sponsorId: z.string().optional(),
  communityId: z.string().optional(),
  isPublic: z.boolean().default(true)
});

type FormValues = z.infer<typeof formSchema>;

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<ContentItemProps | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<ContentItemProps | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<ContentItemProps | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<ContentItemProps | null>(null);
  const [eventSlots, setEventSlots] = useState<EventSlot[]>([]);
  const [formStep, setFormStep] = useState<'details' | 'schedule'>('details');
  
  // Parse query params to pre-fill form
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    // Check for venue
    const venueId = queryParams.get('venue');
    if (venueId) {
      const venue = venues.find(v => v.id === venueId);
      if (venue) {
        setSelectedVenue(venue);
        form.setValue('location', venue.location);
        form.setValue('venueId', venue.id);
        // Add venue tags
        setSelectedTags(prev => [...prev, ...venue.tags]);
      }
    }
    
    // Check for artist
    const artistId = queryParams.get('artist');
    if (artistId) {
      const artist = artists.find(a => a.id === artistId);
      if (artist) {
        setSelectedArtist(artist);
        form.setValue('hostId', artist.id);
        // Add artist tags
        setSelectedTags(prev => [...prev, ...artist.tags]);
      }
    }
    
    // Check for brand sponsor
    const brandId = queryParams.get('brand');
    if (brandId) {
      const brand = brands.find(b => b.id === brandId);
      if (brand) {
        setSelectedBrand(brand);
        form.setValue('sponsorId', brand.id);
        // Add brand tags
        setSelectedTags(prev => [...prev, ...brand.tags]);
      }
    }
    
    // Check for community
    const communityId = queryParams.get('community');
    if (communityId) {
      const community = communities.find(c => c.id === communityId);
      if (community) {
        setSelectedCommunity(community);
        form.setValue('communityId', community.id);
        // Add community tags
        setSelectedTags(prev => [...prev, ...community.tags]);
      }
    }
  }, [location.search]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      startTime: '',
      endTime: '',
      eventType: '',
      capacity: '',
      tags: '',
      venueId: '',
      hostId: '',
      sponsorId: '',
      communityId: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Event data:', data);
    console.log('Selected tags:', selectedTags);
    console.log('Selected venue:', selectedVenue);
    console.log('Selected artist:', selectedArtist);
    console.log('Selected brand:', selectedBrand);
    console.log('Selected community:', selectedCommunity);
    console.log('Event slots:', eventSlots);
    
    // In a real app, we would save this data to a database
    // For now, we'll just show a success message and redirect
    toast.success('Event created successfully!', {
      description: `Your event "${data.title}" has been scheduled for ${format(data.date, 'PPP')}.`,
    });
    
    // Redirect to the events page
    setTimeout(() => {
      navigate('/events');
    }, 1500);
  };

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleRemoveVenue = () => {
    setSelectedVenue(null);
    form.setValue('location', '');
    form.setValue('venueId', '');
  };

  const handleRemoveArtist = () => {
    setSelectedArtist(null);
    form.setValue('hostId', '');
  };

  const handleRemoveBrand = () => {
    setSelectedBrand(null);
    form.setValue('sponsorId', '');
  };

  const handleRemoveCommunity = () => {
    setSelectedCommunity(null);
    form.setValue('communityId', '');
  };

  const handleSlotsChange = (slots: EventSlot[]) => {
    setEventSlots(slots);
  };
  
  const goToSchedule = () => {
    const result = form.trigger();
    if (result) {
      setFormStep('schedule');
    }
  };
  
  const goToDetails = () => {
    setFormStep('details');
  };

  const submitForm = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-in-up">
          <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <AnimatedSection animation="fade-in-up" delay={100}>
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <div className="space-x-2">
                      <Button 
                        variant={formStep === 'details' ? "default" : "outline"}
                        onClick={goToDetails}
                        size="sm"
                      >
                        Event Details
                      </Button>
                      <Button 
                        variant={formStep === 'schedule' ? "default" : "outline"}
                        onClick={goToSchedule}
                        size="sm"
                        disabled={formStep === 'details'}
                      >
                        Schedule
                      </Button>
                    </div>
                    
                    {formStep === 'schedule' && (
                      <Button onClick={submitForm} className="ml-auto">
                        Create Event
                      </Button>
                    )}
                  </div>
                </div>
                
                {formStep === 'details' && (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(goToSchedule)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter event title" {...field} />
                              </FormControl>
                              <FormDescription>
                                A catchy title for your event
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="eventType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select event type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="concert">Concert</SelectItem>
                                  <SelectItem value="workshop">Workshop</SelectItem>
                                  <SelectItem value="exhibition">Exhibition</SelectItem>
                                  <SelectItem value="networking">Networking</SelectItem>
                                  <SelectItem value="festival">Festival</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Category of the event
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your event" 
                                className="min-h-32" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Provide details about what attendees can expect
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  className="pl-10" 
                                  placeholder="Event location" 
                                  {...field} 
                                  disabled={selectedVenue !== null}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Address or venue name where the event will take place
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Event Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-10" type="time" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-10" type="time" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="capacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capacity</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-10" type="number" min="1" placeholder="Number of attendees" {...field} />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Maximum number of attendees
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tags"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tags</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    className="pl-10" 
                                    placeholder="Add a tag and press Enter" 
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        e.preventDefault();
                                        handleAddTag(e.currentTarget.value.trim());
                                        e.currentTarget.value = '';
                                      }
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selectedTags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="gap-1">
                                    {tag}
                                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <FormDescription>
                                Add relevant tags to help people find your event
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit">
                          Next: Schedule
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                
                {formStep === 'schedule' && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Event Schedule</CardTitle>
                        <CardDescription>
                          Add time slots and assign artists or resources to your event
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <EventSlotManager 
                          slots={eventSlots}
                          onSlotsChange={handleSlotsChange}
                          eventStartTime={form.getValues('startTime')}
                          eventEndTime={form.getValues('endTime')}
                          eventDate={form.getValues('date')}
                        />
                      </CardContent>
                    </Card>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={goToDetails}>
                        Back to Details
                      </Button>
                      <Button onClick={submitForm}>
                        Create Event
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
          
          <div className="lg:col-span-2">
            <AnimatedSection animation="fade-in-left" delay={150}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedVenue && (
                    <div className="p-3 bg-muted rounded-md relative">
                      <button 
                        type="button" 
                        onClick={handleRemoveVenue}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <h3 className="font-medium">Venue</h3>
                      <p className="text-sm">{selectedVenue.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedVenue.location}</p>
                    </div>
                  )}
                  
                  {selectedArtist && (
                    <div className="p-3 bg-muted rounded-md relative">
                      <button 
                        type="button" 
                        onClick={handleRemoveArtist}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <h3 className="font-medium">Artist/Host</h3>
                      <p className="text-sm">{selectedArtist.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedArtist.location}</p>
                    </div>
                  )}
                  
                  {selectedBrand && (
                    <div className="p-3 bg-muted rounded-md relative">
                      <button 
                        type="button" 
                        onClick={handleRemoveBrand}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <h3 className="font-medium">Brand/Sponsor</h3>
                      <p className="text-sm">{selectedBrand.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedBrand.location}</p>
                    </div>
                  )}
                  
                  {selectedCommunity && (
                    <div className="p-3 bg-muted rounded-md relative">
                      <button 
                        type="button" 
                        onClick={handleRemoveCommunity}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <h3 className="font-medium">Community</h3>
                      <p className="text-sm">{selectedCommunity.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedCommunity.location}</p>
                    </div>
                  )}
                  
                  {!selectedVenue && !selectedArtist && !selectedBrand && !selectedCommunity && (
                    <div className="text-center p-4 text-muted-foreground">
                      <p>No components selected</p>
                      <p className="text-xs mt-2">Select components from Discover page to use them in your event</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEvent;
