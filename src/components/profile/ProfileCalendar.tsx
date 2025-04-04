import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isSameDay, parseISO } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarIcon, 
  Clock, 
  Music, 
  Paintbrush, 
  Camera, 
  Film, 
  Mic, 
  Users, 
  Building, 
  Coffee,
  PartyPopper,
  Ticket,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date | string;
  imageUrl?: string;
  location?: string;
  type?: string;
  category?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
}

interface ProfileCalendarProps {
  events: CalendarEvent[];
  isOwnProfile?: boolean;
  profileType?: string;
  focusedEvent?: CalendarEvent;
}

const ProfileCalendar: React.FC<ProfileCalendarProps> = ({ 
  events = [], 
  isOwnProfile = false,
  profileType = "artist",
  focusedEvent
}) => {
  const initialDate = focusedEvent?.date 
    ? (focusedEvent.date instanceof Date ? focusedEvent.date : parseISO(focusedEvent.date as string)) 
    : new Date();
    
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);
  
  // Parse event dates if they are strings
  const normalizedEvents = events.map(event => ({
    ...event,
    date: event.date instanceof Date ? event.date : parseISO(event.date as string)
  }));
  
  // Filtering events for the selected date
  const selectedDateEvents = selectedDate 
    ? normalizedEvents.filter(event => isSameDay(event.date, selectedDate))
    : [];

  // Custom day rendering to show dots for events
  const renderDay = (day: Date) => {
    // Find events for this day
    const dayEvents = normalizedEvents.filter(event => isSameDay(event.date, day));
    
    return (
      <div className="flex flex-col items-center">
        <span>{day.getDate()}</span>
        {dayEvents.length > 0 && (
          <div className="flex space-x-0.5 mt-1">
            {dayEvents.length === 1 ? (
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            ) : dayEvents.length === 2 ? (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </>
            ) : (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const handlePreviousMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date);
  };

  const handleNextMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date);
  };

  // Get the appropriate icon based on event type or category
  const getEventIcon = (event: CalendarEvent) => {
    const type = event.type?.toLowerCase() || event.category?.toLowerCase() || '';
    
    if (type.includes('music') || type.includes('concert')) return <Music className="h-4 w-4" />;
    if (type.includes('art') || type.includes('exhibition')) return <Paintbrush className="h-4 w-4" />;
    if (type.includes('photo')) return <Camera className="h-4 w-4" />;
    if (type.includes('film') || type.includes('video')) return <Film className="h-4 w-4" />;
    if (type.includes('talk') || type.includes('performance')) return <Mic className="h-4 w-4" />;
    if (type.includes('workshop') || type.includes('class')) return <Users className="h-4 w-4" />;
    if (type.includes('venue') || type.includes('space')) return <Building className="h-4 w-4" />;
    if (type.includes('meetup') || type.includes('networking')) return <Coffee className="h-4 w-4" />;
    if (type.includes('party') || type.includes('festival')) return <PartyPopper className="h-4 w-4" />;
    
    // Default icon
    return <Ticket className="h-4 w-4" />;
  };

  // Get the appropriate page route based on profile type
  const getAddEventRoute = () => {
    switch (profileType) {
      case 'venue':
        return '/venue/availability/create';
      case 'resource':
        return '/resource/availability/create';
      default:
        return '/events/create';
    }
  };

  // Get the appropriate title based on profile type
  const getCalendarTitle = () => {
    switch (profileType) {
      case 'venue':
        return 'Venue Calendar';
      case 'resource':
        return 'Resource Availability';
      default:
        return 'Event Calendar';
    }
  };

  const getAddButtonText = () => {
    switch (profileType) {
      case 'venue':
        return 'Add Availability';
      case 'resource':
        return 'Add Availability';
      default:
        return 'Add Event';
    }
  };

  const getEmptyStateText = () => {
    switch (profileType) {
      case 'venue':
        return 'No venue availability for this date';
      case 'resource':
        return 'No resource availability for this date';
      default:
        return 'No events scheduled for this date';
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <CalendarIcon className="mr-2 h-6 w-6 text-primary" />
            {getCalendarTitle()}
          </h2>
          {isOwnProfile && (
            <Button variant="outline" size="sm" asChild>
              <Link to={getAddEventRoute()}>{getAddButtonText()}</Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Calendar 
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border select-none"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
              }}
            />
          </div>

          <div className="lg:col-span-2 border rounded-md p-4">
            <h3 className="font-medium text-lg mb-2">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            
            {selectedDateEvents.length > 0 ? (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <Link 
                      key={event.id} 
                      to={`/events/${event.id}`}
                      className="block"
                    >
                      <div className="flex flex-col space-y-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                        <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                          {event.imageUrl ? (
                            <img 
                              src={event.imageUrl} 
                              alt={event.title} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-secondary">
                              {getEventIcon(event)}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm leading-tight">{event.title}</h4>
                            {(event.type || event.category) && (
                              <Badge variant="outline" className="text-xs">{event.type || event.category}</Badge>
                            )}
                          </div>
                          {(event.startTime || event.location) && (
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                              {event.startTime && (
                                <span className='flex items-center'><Clock className="h-3 w-3 mr-1" />{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</span>
                              )}
                              {event.startTime && event.location && <span>·</span>}
                              {event.location && (
                                <span className='flex items-center truncate'><MapPin className="h-3 w-3 mr-1" />{event.location}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <CalendarIcon className="h-10 w-10 text-muted-foreground/40 mb-2" />
                <p className="text-muted-foreground">{getEmptyStateText()}</p>
                {isOwnProfile && (
                  <Button variant="link" size="sm" asChild className="mt-2">
                    <Link to={getAddEventRoute()}>{getAddButtonText()}</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCalendar;
