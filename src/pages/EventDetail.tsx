import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Calendar, Clock, MapPin, Users, Share2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EventSharingDialog from '@/components/events/EventSharingDialog';
import { EventSlot } from '@/types/event';
import { Json } from '@/integrations/supabase/types';

interface EventProps {
  id: string;
  name: string;
  description: string;
  image_url: string;
  location: string;
  start_date: string;
  end_date: string;
  capacity: number;
  type: string;
  tags: string[];
  subtype: string;
  created_at: string;
  updated_at: string;
  eventbrite_id?: string;
  eventbrite_url?: string;
  slots?: Json;
  requested_items?: Json;
}

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventProps | null>(null);
  const [eventSlots, setEventSlots] = useState<EventSlot[]>([]);
  const [requestedItems, setRequestedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attending, setAttending] = useState<boolean>(false);
  const [attendeeCount, setAttendeeCount] = useState<number>(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      if (!eventId) {
        setError("No event ID provided");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) throw error;

        if (data) {
          setEvent(data as EventProps);
          
          if (data.slots) {
            try {
              const parsedSlots = Array.isArray(data.slots) 
                ? data.slots 
                : typeof data.slots === 'string' 
                  ? JSON.parse(data.slots) 
                  : data.slots;
              
              setEventSlots(parsedSlots as EventSlot[]);
            } catch (err) {
              console.error("Error parsing event slots:", err);
            }
          }
          
          if (data.requested_items) {
            try {
              const parsedItems = Array.isArray(data.requested_items) 
                ? data.requested_items 
                : typeof data.requested_items === 'string' 
                  ? JSON.parse(data.requested_items) 
                  : data.requested_items;
              
              setRequestedItems(parsedItems);
            } catch (err) {
              console.error("Error parsing requested items:", err);
            }
          }
          
          setAttendeeCount(Math.floor(Math.random() * (data.capacity || 50)) || 15);
        } else {
          setError("Event not found");
        }
      } catch (err: any) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRSVP = () => {
    setAttending(!attending);

    toast({
      title: attending ? "RSVP Cancelled" : "RSVP Confirmed",
      description: attending 
        ? "You are no longer attending this event" 
        : "You are now attending this event",
    });
    
    if (attending) {
      setAttendeeCount(prev => Math.max(0, prev - 1));
    } else {
      setAttendeeCount(prev => prev + 1);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (error) {
      return 'Invalid time';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 max-w-5xl">
          <div className="animate-pulse">
            <div className="h-8 w-1/3 bg-muted rounded-md mb-4"></div>
            <div className="aspect-video w-full bg-muted rounded-md mb-6"></div>
            <div className="h-6 w-1/2 bg-muted rounded-md mb-4"></div>
            <div className="h-24 bg-muted rounded-md mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-40 bg-muted rounded-md"></div>
              <div className="h-40 bg-muted rounded-md"></div>
              <div className="h-40 bg-muted rounded-md"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">{error || "The event you're looking for doesn't exist or has been removed."}</p>
          <Button onClick={() => navigate('/discover?type=events')}>
            Discover Events
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 max-w-5xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/discover?type=events')}
          >
            ← Back to Events
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{event?.name}</h1>
            
            {event?.image_url && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
                <img 
                  src={event.image_url} 
                  alt={event.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {event?.tags && event.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
              {event?.type && (
                <Badge variant="secondary">{event.type}</Badge>
              )}
            </div>
            
            <div className="prose max-w-none mb-8 dark:prose-invert">
              <h2 className="text-xl font-semibold mb-2">About This Event</h2>
              <p className="whitespace-pre-line">{event?.description}</p>
            </div>

            {eventSlots && eventSlots.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
                <div className="space-y-3">
                  {eventSlots.map((slot, index) => (
                    <div key={slot.id || index} className="border rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{slot.title || `Slot ${index + 1}`}</h3>
                          <p className="text-sm text-muted-foreground">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                        {slot.slotType && (
                          <Badge variant="outline" className="capitalize">
                            {slot.slotType}
                          </Badge>
                        )}
                      </div>
                      {slot.description && (
                        <p className="text-sm mt-2">{slot.description}</p>
                      )}
                      {slot.isRequestOnly && (
                        <Badge variant="outline" className="mt-2 bg-yellow-100/10">
                          Request Only
                        </Badge>
                      )}
                      {slot.notes && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p className="font-medium">Notes:</p>
                          <p className="whitespace-pre-line">{slot.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {requestedItems && requestedItems.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Requested Items</h2>
                <div className="space-y-3">
                  {requestedItems.map((item, index) => (
                    <div key={item.id || index} className="border rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          {item.location && (
                            <p className="text-sm text-muted-foreground">
                              Location: {item.location}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {item.type}
                        </Badge>
                      </div>
                      {item.email && (
                        <p className="text-sm mt-2">Contact: {item.email}</p>
                      )}
                      {item.link && (
                        <p className="text-sm mt-1">
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                            <ExternalLink className="h-3 w-3 mr-1" /> Link
                          </a>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
            
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Date</h3>
                      <p className="text-muted-foreground">{event && formatDate(event.start_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Time</h3>
                      <p className="text-muted-foreground">
                        {event && formatTime(event.start_date)} - {event && event.end_date && formatTime(event.end_date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-muted-foreground">{event?.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Attendees</h3>
                      <p className="text-muted-foreground">
                        {attendeeCount} of {event?.capacity || 'unlimited'} spots filled
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button
                    className="w-full"
                    onClick={handleRSVP}
                    variant={attending ? "outline" : "default"}
                  >
                    {attending ? "Cancel RSVP" : "RSVP Now"}
                  </Button>
                  
                  {event && (
                    <EventSharingDialog 
                      eventName={event.name}
                      eventDate={formatDate(event.start_date)}
                      eventId={event.id}
                    />
                  )}

                  {event?.eventbrite_url && (
                    <Button 
                      className="w-full" 
                      variant="secondary"
                      onClick={() => window.open(event.eventbrite_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Eventbrite
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Organized by</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Event Organizer</p>
                    <Button
                      variant="link" 
                      className="p-0 h-auto text-muted-foreground"
                      onClick={() => {
                        navigate('/profile');
                      }}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
