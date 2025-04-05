
import { Json } from '@/integrations/supabase/types';

export interface Resource {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  type: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResourceDetails extends Resource {
  availability: ResourceAvailability[];
  location?: string | null;
  size_sqft?: number | null;
  image_url?: string | null;
  tags?: string[] | null;
  subtype?: string | null;
}

export interface ResourceAvailability {
  id: string;
  date: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
}

export function parseAvailability(availability: Json | null): ResourceAvailability[] {
  if (!availability) return [];
  
  try {
    // Handle both direct object and parsed JSON string
    const data = typeof availability === 'string' 
      ? JSON.parse(availability) 
      : availability;
    
    if (!Array.isArray(data)) return [];
    
    return data.map((day: any) => ({
      id: day.id?.toString() || '',
      date: day.date?.toString() || '',
      timeSlots: Array.isArray(day.timeSlots) 
        ? day.timeSlots.map((slot: any) => ({
            id: slot.id?.toString() || '',
            startTime: slot.startTime?.toString() || '',
            endTime: slot.endTime?.toString() || '',
            status: slot.status?.toString() || 'available',
            price: Number(slot.price) || 0
          }))
        : []
    }));
  } catch (error) {
    console.error('Error parsing resource availability:', error);
    return [];
  }
}

// Alias for parseAvailability for clearer semantics
export const parseAvailabilityFromJson = parseAvailability;

// Function to format ResourceAvailability[] to Json for database storage
export function formatAvailabilityToJson(availability: ResourceAvailability[]): Json {
  try {
    // Simple conversion since our structure is already JSON-compatible
    return availability as unknown as Json;
  } catch (error) {
    console.error('Error formatting resource availability to JSON:', error);
    return null;
  }
}

// Helper to map resource availability to calendar events
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  resourceId?: string;
}

export function mapResourceAvailabilityToCalendarEvents(
  resource: ResourceDetails
): CalendarEvent[] {
  if (!resource.availability || !Array.isArray(resource.availability)) {
    return [];
  }

  return resource.availability.flatMap(day => {
    return day.timeSlots.map(slot => {
      // Parse the date and time strings
      const [year, month, date] = day.date.split('-').map(Number);
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);
      
      // Create Date objects for start and end times
      const start = new Date(year, month - 1, date, startHour, startMinute);
      const end = new Date(year, month - 1, date, endHour, endMinute);
      
      return {
        id: slot.id,
        title: `${slot.status.charAt(0).toUpperCase() + slot.status.slice(1)} - $${slot.price}`,
        start,
        end,
        status: slot.status,
        resourceId: resource.id,
      };
    });
  });
}
