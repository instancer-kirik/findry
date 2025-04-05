import { CalendarEvent } from '@/components/profile/ProfileCalendar';

export interface VenueDetails {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  location?: string | null;
  capacity?: number | null;
  type?: string | null;
  amenities?: string[] | null;
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
  events?: VenueEvent[];
}

export interface VenueEvent {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export const mapVenueEventsToCalendarEvents = (
  venue: VenueDetails
): CalendarEvent[] => {
  if (!venue.events) return [];

  return venue.events.map((event) => ({
    id: event.id,
    title: event.title,
    date: new Date(event.date),
    location: venue.location || undefined,
    type: venue.type || undefined,
    imageUrl: venue.image_url || undefined,
    startTime: event.start_time,
    endTime: event.end_time
  }));
};
