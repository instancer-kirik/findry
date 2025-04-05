
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { format, isToday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  location?: string;
  type?: string;
  category?: string;
  imageUrl?: string;
  focusedEvent?: boolean;
}

interface ProfileCalendarProps {
  events: CalendarEvent[];
  isOwnProfile?: boolean;
  profileType?: string;
  focusedEvent?: CalendarEvent;
}

const ProfileCalendar: React.FC<ProfileCalendarProps> = ({ 
  events, 
  isOwnProfile = false,
  profileType = 'artist',
  focusedEvent
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    focusedEvent ? new Date(focusedEvent.date) : new Date()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    focusedEvent ? new Date(focusedEvent.date) : new Date()
  );

  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => 
    selectedDate && isSameDay(new Date(event.date), selectedDate)
  );

  // Function to render date contents (shows a dot if there are events on that day)
  const renderDateContents = (date: Date) => {
    const hasEvents = events.some(event => isSameDay(new Date(event.date), date));
    
    return (
      <div className="relative">
        {date.getDate()}
        {hasEvents && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </div>
    );
  };

  // Next and previous month handlers
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-xl font-semibold">Calendar</h3>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center min-w-[120px] px-2">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border"
              components={{
                DayContent: (props) => renderDateContents(props.date)
              }}
              modifiers={{
                today: (date) => isToday(date),
                hasEvent: (date) => events.some(event => isSameDay(new Date(event.date), date))
              }}
              modifiersClassNames={{
                today: 'bg-secondary',
                hasEvent: 'font-semibold'
              }}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3 max-h-[240px] overflow-y-auto">
                {selectedDateEvents.map((event) => (
                  <div 
                    key={event.id}
                    className={cn(
                      "p-2 rounded-md border border-muted",
                      focusedEvent && focusedEvent.id === event.id ? "ring-2 ring-primary" : ""
                    )}
                  >
                    <div className="flex gap-2">
                      {event.imageUrl && (
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{event.title}</h4>
                        {event.location && (
                          <p className="text-xs text-muted-foreground truncate">{event.location}</p>
                        )}
                        <div className="flex mt-1 gap-1">
                          {event.type && (
                            <span className="text-xs px-1.5 py-0.5 bg-muted rounded">
                              {event.type}
                            </span>
                          )}
                          {event.category && (
                            <span className="text-xs px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded">
                              {event.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <Info className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No events scheduled for this date</p>
                {isOwnProfile && (
                  <Button variant="link" className="mt-2">
                    + Add {profileType === 'resource' ? 'Availability' : 'Event'}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCalendar;
