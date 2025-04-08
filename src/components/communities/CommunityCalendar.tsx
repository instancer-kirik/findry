
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateEventModal from './CreateEventModal';

interface CommunityCalendarProps {
  communityId: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  attendees_count?: number;
  max_attendees?: number;
  community_id: string;
}

interface CustomComponentsOptions {
  Day?: React.ComponentType<any>;
}

const CommunityCalendar: React.FC<CommunityCalendarProps> = ({ communityId }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  
  // Fetch events for this community
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['community-events', communityId],
    queryFn: async (): Promise<CalendarEvent[]> => {
      // In a real app, you'd fetch actual events from the database
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('community_id', communityId);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(event => ({
          id: event.id,
          title: event.name,
          description: event.description || '',
          start_date: event.start_date,
          end_date: event.end_date,
          location: event.location || '',
          attendees_count: event.capacity || 0,
          max_attendees: event.capacity || 0,
          community_id: communityId
        }));
      }
      
      return [];
    },
    enabled: !!communityId,
  });

  // Sample events for demonstration
  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      community_id: communityId,
      title: 'Monthly Meetup',
      description: 'Regular community meeting to discuss projects and ideas',
      start_date: new Date(date.getFullYear(), date.getMonth(), 15, 18, 0).toISOString(),
      end_date: new Date(date.getFullYear(), date.getMonth(), 15, 20, 0).toISOString(),
      location: 'Community Center',
      attendees_count: 14,
      max_attendees: 30
    },
    {
      id: '2',
      community_id: communityId,
      title: 'Workshop: Introduction to React',
      description: 'Learn the basics of React',
      start_date: new Date(date.getFullYear(), date.getMonth(), 22, 14, 0).toISOString(),
      end_date: new Date(date.getFullYear(), date.getMonth(), 22, 17, 0).toISOString(),
      location: 'Online',
      attendees_count: 25,
      max_attendees: 50
    }
  ];

  // For this demo, we'll use the sample events
  const displayEvents = events.length > 0 ? events : sampleEvents;
  
  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return displayEvents.filter(event => {
      const eventStart = new Date(event.start_date);
      return isSameDay(eventStart, day);
    });
  };

  // Get all events for the current week
  const getEventsForWeek = () => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    
    return displayEvents.filter(event => {
      const eventStart = new Date(event.start_date);
      return eventStart >= weekStart && eventStart <= weekEnd;
    });
  };

  // Navigate to previous/next day, week, or month
  const navigatePrevious = () => {
    switch (view) {
      case 'day':
        setDate(prevDate => addDays(prevDate, -1));
        setSelectedDay(prevDate => prevDate ? addDays(prevDate, -1) : undefined);
        break;
      case 'week':
        setDate(prevDate => addDays(prevDate, -7));
        break;
      case 'month':
        setDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case 'day':
        setDate(prevDate => addDays(prevDate, 1));
        setSelectedDay(prevDate => prevDate ? addDays(prevDate, 1) : undefined);
        break;
      case 'week':
        setDate(prevDate => addDays(prevDate, 7));
        break;
      case 'month':
        setDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
        break;
    }
  };

  const handleDaySelect = (day: Date | undefined) => {
    setSelectedDay(day);
    if (day) {
      setDate(day);
      setView('day');
    }
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  // Format time display from ISO string
  const formatEventTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (e) {
      return '';
    }
  };

  // Format date for header display
  const formatDateHeading = () => {
    switch (view) {
      case 'day':
        return selectedDay ? format(selectedDay, 'EEEE, MMMM d, yyyy') : '';
      case 'week':
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(date, 'MMMM yyyy');
      default:
        return '';
    }
  };

  const renderDayView = () => {
    if (!selectedDay) return null;
    const dayEvents = getEventsForDay(selectedDay);

    return (
      <div className="space-y-4">
        {dayEvents.length > 0 ? (
          dayEvents.map(event => (
            <Card key={event.id} className="hover:shadow-md cursor-pointer transition-shadow" onClick={() => handleViewEvent(event.id)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription>
                  {formatEventTime(event.start_date)} - {formatEventTime(event.end_date)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {event.location}
                  </div>
                  {event.max_attendees && (
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      {event.attendees_count || 0} / {event.max_attendees} attendees
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">View Details</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No events scheduled</h3>
            <p className="text-muted-foreground mb-6">There are no events scheduled for this day.</p>
          </div>
        )}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map(day => {
          const dayEvents = getEventsForDay(day);
          return (
            <div key={day.toString()} className="border rounded-md p-2">
              <div className="text-center mb-2">
                <div className="font-medium">{format(day, 'EEE')}</div>
                <div className={`text-2xl ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground rounded-full w-9 h-9 flex items-center justify-center mx-auto' : ''}`}>
                  {format(day, 'd')}
                </div>
              </div>
              <div className="space-y-2">
                {dayEvents.length > 0 ? (
                  dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="bg-muted p-2 rounded text-xs leading-tight cursor-pointer"
                      onClick={() => handleViewEvent(event.id)}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-muted-foreground">{formatEventTime(event.start_date)}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-xs text-muted-foreground py-4">No events</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <Calendar
        mode="single"
        selected={selectedDay}
        onSelect={handleDaySelect}
        month={date}
        onMonthChange={setDate}
        className="rounded-md border"
        // Custom day rendering to show events
        components={{
          Day: ({ date, ...props }) => {
            const dayEvents = getEventsForDay(date);
            return (
              <div 
                {...props}
                className={`${props.className} relative`}
              >
                {props.children}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="flex gap-0.5">
                      {dayEvents.slice(0, 3).map((event, index) => (
                        <div 
                          key={index} 
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                          title={event.title}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" title="More events" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }
        }}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{formatDateHeading()}</h2>
          <CreateEventModal onSuccess={() => {}} />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={() => setDate(new Date())}>Today</Button>
          </div>
          
          <Tabs defaultValue={view} onValueChange={(value) => setView(value as 'month' | 'week' | 'day')}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>
      )}

      {view === 'month' && selectedDay && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Events on {format(selectedDay, 'MMMM d, yyyy')}</h3>
          {renderDayView()}
        </div>
      )}
    </div>
  );
};

export default CommunityCalendar;
