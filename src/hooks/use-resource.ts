
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ResourceDetails, ResourceAvailability, TimeSlot } from '@/types/resource';

export const useResource = (resourceId?: string) => {
  const [isOwner, setIsOwner] = useState(false);

  const fetchResource = async (): Promise<ResourceDetails | null> => {
    if (!resourceId) return null;

    // Fetch resource data
    const { data: resource, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single();

    if (error) {
      console.error('Error fetching resource:', error);
      return null;
    }

    // Check if the user is the owner
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      const { data: ownership } = await supabase
        .from('content_ownership')
        .select('*')
        .eq('content_id', resourceId)
        .eq('content_type', 'resource')
        .eq('owner_id', session.session.user.id)
        .single();

      setIsOwner(!!ownership);
    }

    // Generate mock availability if none exists
    if (!resource.availability) {
      const today = new Date();
      const mockAvailability: ResourceAvailability[] = [];
      
      // Create mock availability for the next 14 days
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const timeSlots: TimeSlot[] = [];
        
        // Create time slots for each day
        for (let hour = 9; hour < 18; hour++) {
          const status = Math.random() > 0.7 ? 'booked' : 'available';
          timeSlots.push({
            id: `slot-${i}-${hour}`,
            startTime: `${hour}:00`,
            endTime: `${hour + 1}:00`,
            status,
            price: resource.type === 'space' ? 50 : 25
          });
        }
        
        mockAvailability.push({
          id: `day-${i}`,
          date: date.toISOString().split('T')[0],
          timeSlots
        });
      }
      
      resource.availability = mockAvailability;
    }

    return resource;
  };

  const { data: resource, isLoading, error } = useQuery({
    queryKey: ['resource', resourceId],
    queryFn: fetchResource,
    enabled: !!resourceId
  });

  return {
    resource,
    isLoading,
    error,
    isOwner
  };
};
