
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarIcon, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  imageUrl?: string;
  location?: string;
  type?: string;
}

interface ProfileCalendarProps {
  events: CalendarEvent[];
  isOwnProfile?: boolean;
}

const ProfileCalendar: React.FC<ProfileCalendarProps> = ({ events = [], isOwnProfile = false }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Filtering events for the selected date
  const selectedDateEvents = selectedDate 
    ? events.filter(event => isSameDay(new Date(event.date), selectedDate))
    : [];

  // Filtering events for the current month (for dots on calendar)
  const currentMonthEvents = events.filter(event => 
    new Date(event.date).getMonth() === currentMonth.getMonth() &&
    new Date(event.date).getFullYear() === currentMonth.getFullYear()
  );

  // Custom day rendering to show dots for events
  const renderDay = (day: Date) => {
    // Find events for this day
    const dayEvents = events.filter(event => isSameDay(new Date(event.date), day));
    
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

  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <CalendarIcon className="mr-2 h-6 w-6 text-primary" />
            Event Calendar
          </h2>
          {isOwnProfile && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/events/create">Add Event</Link>
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
                              <CalendarIcon className="h-10 w-10 text-secondary-foreground/40" />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{event.title}</h4>
                            {event.type && (
                              <Badge variant="outline">{event.type}</Badge>
                            )}
                          </div>
                          
                          {event.location && (
                            <p className="text-sm text-muted-foreground mt-1">{event.location}</p>
                          )}
                          
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(event.date), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <CalendarIcon className="h-10 w-10 text-muted-foreground/40 mb-2" />
                <p className="text-muted-foreground">No events scheduled for this date</p>
                {isOwnProfile && (
                  <Button variant="link" size="sm" asChild className="mt-2">
                    <Link to="/events/create">Add an event</Link>
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
