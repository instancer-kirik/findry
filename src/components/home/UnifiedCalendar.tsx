import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { format, isToday, isSameDay } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CalendarItem {
  id: string;
  title: string;
  date: Date;
  location?: string;
  type: 'event' | 'meeting';
  imageUrl?: string;
}

const UnifiedCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Fetch events
  const { data: events = [] } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, name, start_date, location, image_url')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(50);

      if (error) throw error;

      return data.map(event => ({
        id: event.id,
        title: event.name,
        date: new Date(event.start_date),
        location: event.location,
        type: 'event' as const,
        imageUrl: event.image_url,
      }));
    },
  });

  // Fetch meeting schedules
  const { data: meetings = [] } = useQuery({
    queryKey: ['calendar-meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meeting_schedules')
        .select('id, title, start_time, location')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(50);

      if (error) throw error;

      return data.map(meeting => ({
        id: meeting.id,
        title: meeting.title,
        date: new Date(meeting.start_time),
        location: meeting.location,
        type: 'meeting' as const,
      }));
    },
  });

  const allItems: CalendarItem[] = [...events, ...meetings];

  // Filter items for the selected date
  const selectedDateItems = allItems.filter(item => 
    selectedDate && isSameDay(new Date(item.date), selectedDate)
  );

  // Function to render date contents (shows a dot if there are items on that day)
  const renderDateContents = (date: Date) => {
    const hasItems = allItems.some(item => isSameDay(new Date(item.date), date));
    
    return (
      <div className="relative">
        {date.getDate()}
        {hasItems && (
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Your Schedule
        </CardTitle>
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
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
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
                hasItem: (date) => allItems.some(item => isSameDay(new Date(item.date), date))
              }}
              modifiersClassNames={{
                today: 'bg-secondary',
                hasItem: 'font-semibold'
              }}
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-3">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            
            {selectedDateItems.length > 0 ? (
              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {selectedDateItems.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 rounded-md border border-muted hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => {
                      if (item.type === 'event') {
                        navigate(`/events/${item.id}`);
                      } else {
                        navigate('/meetings');
                      }
                    }}
                  >
                    <div className="flex gap-2">
                      {item.imageUrl && (
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        {item.location && (
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.location}
                          </p>
                        )}
                        <div className="flex mt-1 gap-1">
                          <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded",
                            item.type === 'event' 
                              ? "bg-primary/10 text-primary" 
                              : "bg-secondary text-secondary-foreground"
                          )}>
                            {item.type === 'event' ? 'Event' : 'Meeting'}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 bg-muted rounded flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(item.date, 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No events or meetings scheduled for this date</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="link" size="sm" onClick={() => navigate('/discover?tab=events')}>
                    Browse Events
                  </Button>
                  <Button variant="link" size="sm" onClick={() => navigate('/meetings')}>
                    Schedule Meeting
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedCalendar;
