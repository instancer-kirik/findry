import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DayContentProps } from 'react-day-picker';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  location?: string;
  type?: string;
  category?: string;
  imageUrl?: string;
  startTime?: string;
  endTime?: string;
}

export interface ProfileCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  isOwnProfile?: boolean;
  profileType?: string;
}

const ProfileCalendar: React.FC<ProfileCalendarProps> = ({ 
  events = [], 
  onEventClick,
  onDateSelect,
  isOwnProfile = false,
  profileType = 'user'
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Helper to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Get events for the selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  
  // Date rendering function to highlight dates with events
  const renderDay = (props: DayContentProps) => {
    const { date, ...dayProps } = props;
    const dayEvents = getEventsForDate(date);
    const hasEvents = dayEvents.length > 0;
    
    return (
      <div className={`relative w-full h-full p-1 flex items-center justify-center ${
        hasEvents ? 'font-medium' : ''
      }`}>
        {date.getDate()}
        {hasEvents && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
        )}
      </div>
    );
  };
  
  // Change month handlers
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
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };
  
  return (
    <div className="calendar-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar View */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={handlePrevMonth}>
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
              onSelect={handleDateSelect}
              month={currentMonth}
              className="rounded-md border"
              components={{
                DayContent: renderDay
              }}
            />
            
            {isOwnProfile && (
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {profileType === 'venue' ? 'Manage Availability' : 'Create Event'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Events List */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {selectedDate
                  ? `Events for ${format(selectedDate, 'MMMM d, yyyy')}`
                  : 'All Upcoming Events'}
              </h3>
              {selectedDateEvents.length > 0 && (
                <Badge variant="outline">{selectedDateEvents.length} events</Badge>
              )}
            </div>
            
            {selectedDateEvents.length === 0 ? (
              <div className="text-center text-muted-foreground p-8 border border-dashed rounded-md">
                No events scheduled for this date
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map(event => (
                  <div 
                    key={event.id}
                    className="bg-muted/20 p-3 rounded-md cursor-pointer hover:bg-accent/20 transition-colors border"
                    onClick={() => onEventClick && onEventClick(event)}
                  >
                    <div className="font-medium">{event.title}</div>
                    
                    <div className="flex flex-col space-y-1 mt-2">
                      {(event.startTime || event.endTime) && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          <span>
                            {event.startTime && event.endTime
                              ? `${event.startTime} - ${event.endTime}`
                              : event.startTime || event.endTime}
                          </span>
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-1.5" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {event.type && (
                      <Badge variant="outline" className="mt-2">
                        {event.type}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* View all events button */}
            {events.length > 0 && selectedDateEvents.length !== events.length && (
              <Button 
                variant="link" 
                className="w-full mt-4" 
                onClick={() => setSelectedDate(undefined)}
              >
                View all events
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCalendar;
