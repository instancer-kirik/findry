import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Tag, ImagePlus, Edit, Trash2, ArrowLeft } from 'lucide-react';
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
}

// Hook for fetching event details with error handling
const useEventDetail = (eventId: string | undefined) => {
  const [event, setEvent] = useState<EventProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [eventSlots, setEventSlots] = useState<{ id: string; startTime: string; endTime: string; }[]>([]);
  
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
      } catch (err: any) {
        setError(err.message || 'Failed to load event');
        console.error("Event load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { event, isLoading, error, isOwner, eventSlots, setEventSlots };
};

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { 
    event, 
    isLoading, 
    error, 
    isOwner, 
    eventSlots, 
    setEventSlots 
  } = useEventDetail(eventId);
  const [selectedVenue, setSelectedVenue] = useState<ContentItemProps | null>(null);
  const [selectedArtists, setSelectedArtists] = useState<ContentItemProps[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<ContentItemProps[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<ContentItemProps[]>([]);
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

  if (isLoading) {
    return <Layout>Loading event...</Layout>;
  }

  if (error || !event) {
    return <Layout>Error: {error || 'Event not found'}</Layout>;
  }

  const formattedStartDate = event.start_date ? format(parseISO(event.start_date), 'MMMM dd, yyyy') : 'Not specified';
  const formattedStartTime = event.start_date ? format(parseISO(event.start_date), 'hh:mm a') : 'Not specified';
  const formattedEndTime = event.end_date ? format(parseISO(event.end_date), 'hh:mm a') : 'Not specified';

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-4 flex justify-between items-center">
          <Link to="/events" className="text-blue-500 hover:underline flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
          {isOwner && (
            <div className="space-x-2">
              <Link to={`/events/${eventId}/edit`} className="text-blue-500 hover:underline">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h1 className="text-2xl font-bold">{event.name}</h1>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formattedStartDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formattedStartTime} - {formattedEndTime}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.tags && event.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Description</h2>
              <p>{event.description || 'No description provided.'}</p>
            </div>

            <section className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Time Slots</h3>
              <EventSlotManager
                slots={eventSlots}
                onSlotsChange={handleSlotsChange}
                eventStartTime={formattedStartTime}
                eventEndTime={formattedEndTime}
                eventDate={new Date(event.start_date)}
                readOnly={!isOwner}
              />
            </section>
          </div>

          <div>
            {event.image_url ? (
              <img src={event.image_url} alt={event.name} className="w-full rounded-md aspect-video object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                No Image
              </div>
            )}

            <section className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Calendar</h3>
              <ProfileCalendar 
                events={calendarEvents} 
                focusedEvent={mapEventToCalendar(event)}
                isOwnProfile={isOwner} 
                profileType="event"
              />
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
