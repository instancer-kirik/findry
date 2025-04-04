
import React from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  location?: string;
  type?: string;
  category?: string;
  imageUrl?: string;
}

export interface ProfileCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
}

const ProfileCalendar: React.FC<ProfileCalendarProps> = ({ 
  events = [], 
  onEventClick,
  onDateSelect
}) => {
  // Mock implementation for now
  return (
    <div className="calendar-container">
      <div className="text-lg font-medium mb-4">Calendar</div>
      <div className="bg-muted/20 p-4 rounded-md">
        {events.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">
            No events scheduled
          </div>
        ) : (
          <div className="space-y-2">
            {events.map(event => (
              <div 
                key={event.id}
                className="bg-card p-3 rounded-md cursor-pointer hover:bg-accent/50"
                onClick={() => onEventClick && onEventClick(event)}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-muted-foreground">
                  {event.date.toLocaleDateString()} · {event.location || 'No location'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCalendar;
