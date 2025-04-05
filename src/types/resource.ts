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
