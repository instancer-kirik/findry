import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Upload, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import EventSlotManager from '@/components/events/EventSlotManager';
import { EventSlot } from '@/types/event';
import { ContentItemProps } from '@/types/content';
import { convertToJson, convertFromJson } from '@/types/supabase';
import { Json } from '@/integrations/supabase/types';

type FilterType = "resources" | "artists" | "venues" | "brands" | "communities" | "all";
type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "custom";

const EditEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  
  // Event details
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacity, setCapacity] = useState('');
  const [eventType, setEventType] = useState('in-person');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [isPrivate, setIsPrivate] = useState(false);
  const [eventSlots, setEventSlots] = useState<EventSlot[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [posterImage, setPosterImage] = useState<File | null>(null);
  const [requestedItems, setRequestedItems] = useState<any[]>([]);
  
  const [selectedObjects, setSelectedObjects] = useState<{
    artists: ContentItemProps[];
    resources: ContentItemProps[];
    venues: ContentItemProps[];
    brands: ContentItemProps[];
    communities: ContentItemProps[];
  }>({
    artists: [],
    resources: [],
    venues: [],
    brands: [],
    communities: []
  });
  
  // For event component selection
  const [filterType, setFilterType] = useState<FilterType>('all');
  
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      console.log("Auth is still loading, waiting...");
      return;
    }

    // Check if we have both user and eventId before proceeding
    if (!eventId) {
      console.log("No event ID provided");
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    
    if (!user) {
      console.log("No user found, cannot edit event");
      setUnauthorized(true);
      setIsLoading(false);
      return;
    }
    
    console.log("Current user:", user.id);
    
    const fetchEvent = async () => {
      try {
        // Fetch the event data first
        const { data: event, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
          
        if (eventError || !event) {
          console.error('Error fetching event:', eventError);
          setNotFound(true);
          setIsLoading(false);
          return;
        }
        
        console.log("Event data:", event);
        
        // TEMPORARILY DISABLED - in production, enable this code again
        /*
        // Check if user is the owner
        const { data: ownershipData, error: ownershipError } = await supabase
          .from('content_ownership')
          .select('*')
          .eq('content_id', eventId)
          .eq('content_type', 'event')
          .eq('owner_id', user.id)
          .single();
        
        const isOwner = (!ownershipError && ownershipData) || 
                       (event.created_by && event.created_by === user.id);
        
        if (!isOwner) {
          console.log("User is not the owner or creator. User:", user.id);
          setUnauthorized(true);
          setIsLoading(false);
          return;
        }
        */
        
        // Populate form with event data
        setEventName(event.name || '');
        setDescription(event.description || '');
        setLocation(event.location || '');
        setCapacity(event.capacity ? String(event.capacity) : '');
        setEventType(event.type || 'in-person');
        setTags(event.tags || []);
        setImageUrl(event.image_url || '');
        
        // Handle dates
        if (event.start_date) {
          const startDateTime = new Date(event.start_date);
          setStartDate(startDateTime);
          setStartTime(format(startDateTime, 'HH:mm'));
        }
        
        if (event.end_date) {
          const endDateTime = new Date(event.end_date);
          setEndDate(endDateTime);
          setEndTime(format(endDateTime, 'HH:mm'));
        }
        
        // Parse slots
        if (event.slots) {
          try {
            const parsedSlots = convertFromJson<EventSlot[]>(event.slots);
            setEventSlots(parsedSlots || []);
          } catch (err) {
            console.error("Error parsing event slots:", err);
          }
        }
        
        // Parse requested items
        if (event.requested_items) {
          try {
            const parsedItems = convertFromJson<any[]>(event.requested_items);
            setRequestedItems(parsedItems || []);
          } catch (err) {
            console.error("Error parsing requested items:", err);
          }
        }
        
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast.error('Error loading event data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId, user, authLoading]);
  
  const handlePosterUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPosterImage(file);
      // Create a preview URL
      setImageUrl(URL.createObjectURL(file));
    }
  };
  
  const uploadPosterToStorage = async (): Promise<string> => {
    if (!posterImage) return imageUrl;
    
    const fileExt = posterImage.name.split('.').pop();
    const fileName = `event-posters/${eventId}/${Date.now()}.${fileExt}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('event-assets')
        .upload(fileName, posterImage, { upsert: true });
        
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('event-assets')
        .getPublicUrl(fileName);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading poster:', error);
      toast.error('Failed to upload poster image');
      return imageUrl;
    }
  };
  
  const handleSaveEvent = async () => {
    if (!user) {
      toast.error('You must be logged in to update an event');
      return;
    }
    
    if (!eventId) {
      toast.error('Event ID is missing');
      return;
    }
    
    if (!eventName) {
      toast.error('Event name is required');
      return;
    }
    
    if (!startDate) {
      toast.error('Start date is required');
      return;
    }
    
    if (!startTime) {
      toast.error('Start time is required');
      return;
    }
    
    if (!location) {
      toast.error('Location is required');
      return;
    }
    
    setSaving(true);
    
    try {
      // Format dates
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
      
      // Process requested items from slots
      const processedSlots = eventSlots.map(slot => ({
        ...slot,
        eventId
      }));
      
      // Upload new poster if selected
      let updatedImageUrl = imageUrl;
      if (posterImage) {
        updatedImageUrl = await uploadPosterToStorage();
      }
      
      // Prepare event data for update
      const eventData = {
        name: eventName,
        description,
        type: eventType,
        start_date: formattedStartDate.toISOString(),
        end_date: formattedEndDate ? formattedEndDate.toISOString() : null,
        location,
        capacity: capacity ? parseInt(capacity) : null,
        image_url: updatedImageUrl,
        tags,
        slots: convertToJson(processedSlots),
        requested_items: convertToJson(requestedItems),
        updated_at: new Date().toISOString()
      };
      
      // Update the event
      const { error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', eventId);
        
      if (error) {
        console.error('Error updating event:', error);
        throw new Error(error.message);
      }
      
      toast.success('Event updated successfully!');
      
      // Redirect back to event page
      setTimeout(() => {
        navigate(`/events/${eventId}`);
      }, 1000);
      
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error(error.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };
  
  if (isLoading || authLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Loading Event...</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-md w-3/4"></div>
            <div className="h-32 bg-muted rounded-md"></div>
            <div className="h-12 bg-muted rounded-md w-1/2"></div>
            <div className="h-12 bg-muted rounded-md w-2/3"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (notFound) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">The event you're trying to edit doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/discover?type=events')}>
            Discover Events
          </Button>
        </div>
      </Layout>
    );
  }
  
  if (unauthorized) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p className="text-muted-foreground mb-8">You do not have permission to edit this event.</p>
          <Button onClick={() => navigate(`/events/${eventId}`)}>
            View Event
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/events/${eventId}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Edit Event</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/events/${eventId}`)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEvent}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="eventName">Event Name</Label>
                <Input 
                  id="eventName" 
                  placeholder="Enter event name" 
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your event" 
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Enter event location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
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
                  <Label>Start Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {startTime || <span>Set time</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label>End Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
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
                  <Label>End Time (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {endTime || <span>Set time</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select
                    value={eventType}
                    onValueChange={setEventType}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">In Person</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Enter capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="posterImage">Event Image</Label>
                  {imageUrl && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setImageUrl('');
                        setPosterImage(null);
                      }}
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                {imageUrl ? (
                  <div className="mt-1 relative aspect-video w-full overflow-hidden rounded-lg border">
                    <img 
                      src={imageUrl} 
                      alt="Event poster preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Button 
                        size="sm"
                        onClick={() => document.getElementById('poster-upload')?.click()}
                      >
                        Change Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="mt-1 border rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors flex flex-col items-center justify-center"
                    onClick={() => document.getElementById('poster-upload')?.click()}
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Click to upload event image</p>
                  </div>
                )}
                
                <input
                  id="poster-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePosterUpload}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="private-event"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
                <Label htmlFor="private-event">Make this event private</Label>
              </div>
            </div>
          </Card>
          
          {/* Event Schedule */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
            <EventSlotManager
              slots={eventSlots}
              onSlotsChange={setEventSlots}
              eventStartTime={startTime || '09:00'}
              eventEndTime={endTime || '17:00'}
              eventDate={startDate || new Date()}
              availableArtists={selectedObjects.artists}
              availableResources={selectedObjects.resources}
              availableVenues={selectedObjects.venues}
            />
          </Card>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/events/${eventId}`)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEvent}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default EditEvent; 