
import { CalendarEvent } from '@/components/profile/ProfileCalendar';
import { Json } from './database';

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

// Helper functions to convert between JSON and ResourceAvailability
export const parseAvailabilityFromJson = (json: Json | null): ResourceAvailability[] | null => {
  if (!json) return null;
  try {
    // Make sure we're working with an array
    if (Array.isArray(json)) {
      return json.map(item => {
        if (typeof item === 'object' && item !== null) {
          return {
            id: String(item.id || ''),
            date: String(item.date || ''),
            timeSlots: Array.isArray(item.timeSlots) 
              ? item.timeSlots.map((slot: any) => ({
                  id: String(slot.id || ''),
                  startTime: String(slot.startTime || ''),
                  endTime: String(slot.endTime || ''),
                  status: (slot.status as 'available' | 'booked' | 'pending') || 'available',
                  price: typeof slot.price === 'number' ? slot.price : undefined
                }))
              : []
          };
        }
        return {
          id: '',
          date: '',
          timeSlots: []
        };
      });
    }
    return null;
  } catch (error) {
    console.error('Error parsing resource availability:', error);
    return null;
  }
};

export const formatAvailabilityToJson = (availability: ResourceAvailability[] | null): Json => {
  if (!availability) return null;
  return availability as unknown as Json;
};
