import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CalendarClock, Clock, HeartIcon, MapPin, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isFuture, parseISO } from 'date-fns';
import { toast } from 'sonner';

interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date?: string;
  poster_url?: string;
  capacity?: number;
  attendees_count?: number;
  event_type: string;
  is_interested?: boolean;
}

const EventsUpcoming = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      // Wait a bit to simulate loading
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchUpcomingEvents();
  }, [user]);

  const toggleInterest = async (eventId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Find the event
    const event = upcomingEvents.find(e => e.id === eventId);
    if (!event) return;

    // Mock implementation for toggling interest
    if (event.is_interested) {
      toast.success("Removed from interested events");
    } else {
      toast.success("Added to interested events");
    }

    // Update local state
    setUpcomingEvents(upcomingEvents.map(e => 
      e.id === eventId 
        ? { ...e, is_interested: !e.is_interested } 
        : e
    ));
  };

  const formatEventDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  };

  const formatEventTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  };
  
  useEffect(() => {
    if (!loading) {
      // Generate dates starting from tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      // Mock data for demonstration
      const mockEvents: EventItem[] = [
        {
          id: '1',
          title: 'Summer Music Festival',
          description: 'A three-day music festival featuring local and international artists',
          location: 'Central Park, New York',
          start_date: tomorrow.toISOString(),
          end_date: nextWeek.toISOString(),
          poster_url: 'https://source.unsplash.com/random/800x600/?concert',
          capacity: 5000,
          attendees_count: 3200,
          event_type: 'in-person',
          is_interested: false
        },
        {
          id: '2',
          title: 'Digital Art Workshop',
          description: 'Learn digital art techniques from professional artists',
          location: 'Online',
          start_date: nextWeek.toISOString(),
          poster_url: 'https://source.unsplash.com/random/800x600/?digital-art',
          capacity: 100,
          attendees_count: 67,
          event_type: 'online',
          is_interested: true
        },
        {
          id: '3',
          title: 'Photography Exhibition',
          description: 'Featuring works from emerging photographers around the world',
          location: 'Modern Art Gallery, Chicago',
          start_date: nextMonth.toISOString(),
          end_date: new Date(nextMonth.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          poster_url: 'https://source.unsplash.com/random/800x600/?exhibition',
          capacity: 200,
          attendees_count: 120,
          event_type: 'in-person',
          is_interested: false
        }
      ];
      
      setUpcomingEvents(mockEvents);
    }
  }, [loading]);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Upcoming Events</h1>
            <p className="text-muted-foreground">Events happening soon</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/events/interested')}>
              <HeartIcon className="mr-2 h-4 w-4" />
              My Interests
            </Button>
            <Button onClick={() => navigate('/events')}>
              <Calendar className="mr-2 h-4 w-4" />
              All Events
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <img 
                    src={event.poster_url || 'https://source.unsplash.com/random/800x600/?event'} 
                    alt={event.title}
                    className="h-full w-full object-cover" 
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={`absolute top-2 right-2 bg-background/80 hover:bg-background/90 rounded-full ${event.is_interested ? 'text-red-500' : 'text-muted-foreground'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleInterest(event.id);
                    }}
                  >
                    <HeartIcon className={`h-5 w-5 ${event.is_interested ? 'fill-red-500' : ''}`} />
                  </Button>
                  <Badge 
                    className="absolute bottom-2 left-2" 
                    variant={event.event_type === 'online' ? 'secondary' : 'default'}
                  >
                    {event.event_type === 'online' ? 'Online' : 'In-Person'}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatEventDate(event.start_date)}
                      {event.end_date && event.end_date !== event.start_date && 
                        ` - ${formatEventDate(event.end_date)}`}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{formatEventTime(event.start_date)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.attendees_count || 0} / {event.capacity}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No Upcoming Events</h2>
            <p className="text-muted-foreground mb-6">
              There are no upcoming events scheduled at this time.
            </p>
            <Button onClick={() => navigate('/events/create')}>
              Create an Event
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventsUpcoming;
