
import { CalendarEvent } from '@/components/profile/ProfileCalendar';

export interface ResourceAvailability {
  id: string;
  date: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'pending';
  price?: number;
}

export interface ResourceDetails {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  location?: string | null;
  type: string;
  subtype?: string | null;
  tags?: string[] | null;
  size_sqft?: number | null;
  availability?: ResourceAvailability[] | null;
  created_at: string;
  updated_at: string;
}

export const mapResourceAvailabilityToCalendarEvents = (
  resource: ResourceDetails
): CalendarEvent[] => {
  if (!resource.availability) return [];

  return resource.availability.flatMap((day) => {
    return day.timeSlots.map((slot) => ({
      id: slot.id,
      title: `${resource.name} - ${slot.status === 'available' ? 'Available' : slot.status === 'booked' ? 'Booked' : 'Pending'}`,
      date: new Date(day.date),
      location: resource.location || undefined,
      type: resource.type,
      category: resource.subtype || undefined,
      imageUrl: resource.image_url || undefined,
    }));
  });
};
