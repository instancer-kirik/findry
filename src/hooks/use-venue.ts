
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VenueDetails, VenueEvent } from '@/types/venue';

export const useVenue = (venueId?: string) => {
  const [isOwner, setIsOwner] = useState(false);

  const fetchVenue = async (): Promise<VenueDetails | null> => {
    if (!venueId) return null;

    // Fetch venue data
    const { data: venue, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', venueId)
      .single();

    if (error) {
      console.error('Error fetching venue:', error);
      return null;
    }

    // Check if the user is the owner
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      const { data: ownership } = await supabase
        .from('content_ownership')
        .select('*')
        .eq('content_id', venueId)
        .eq('content_type', 'venue')
        .eq('owner_id', session.session.user.id)
        .single();

      setIsOwner(!!ownership);
    }

    // Mock some events for demo purposes
    // In a real app, you would fetch actual events from a related table
    const mockEvents: VenueEvent[] = [
      {
        id: '1',
        title: 'Weekend Concert',
        date: '2025-04-06',
        start_time: '19:00',
        end_time: '22:00',
        status: 'confirmed'
      },
      {
        id: '2',
        title: 'Art Exhibition',
        date: '2025-04-10',
        start_time: '10:00',
        end_time: '18:00',
        status: 'confirmed'
      },
      {
        id: '3',
        title: 'Poetry Reading',
        date: '2025-04-15',
        start_time: '18:30',
        end_time: '20:30',
        status: 'pending'
      }
    ];

    return {
      ...venue,
      events: mockEvents
    };
  };

  const { data: venue, isLoading, error } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: fetchVenue,
    enabled: !!venueId
  });

  return {
    venue,
    isLoading,
    error,
    isOwner
  };
};
