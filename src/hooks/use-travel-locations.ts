import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TravelLocation, TravelLocationReview } from '@/types/travel-location';
import { useToast } from '@/hooks/use-toast';

export function useTravelLocations(filters?: {
  type?: string;
  free?: boolean;
}) {
  return useQuery({
    queryKey: ['travel-locations', filters],
    queryFn: async () => {
      let query = supabase
        .from('travel_locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.free === true) {
        query = query.eq('free', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TravelLocation[];
    },
  });
}

export function useTravelLocation(id: string) {
  return useQuery({
    queryKey: ['travel-location', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travel_locations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as TravelLocation;
    },
    enabled: !!id,
  });
}

export function useCreateTravelLocation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (location: {
      name: string;
      type: string;
      latitude: number;
      longitude: number;
      description?: string;
      address?: string;
      amenities?: string[];
      hours?: string;
      phone?: string;
      website?: string;
      free?: boolean;
      accessibility?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('travel_locations')
        .insert({ ...location, created_by: user?.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel-locations'] });
      toast({ title: 'Location added successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to add location', description: error.message, variant: 'destructive' });
    },
  });
}

export function useLocationReviews(locationId: string) {
  return useQuery({
    queryKey: ['location-reviews', locationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travel_location_reviews')
        .select('*')
        .eq('location_id', locationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TravelLocationReview[];
    },
    enabled: !!locationId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (review: {
      location_id: string;
      rating: number;
      cleanliness_rating?: number;
      safety_rating?: number;
      content?: string;
      photos?: string[];
      visited_at?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to review');

      const { data, error } = await supabase
        .from('travel_location_reviews')
        .insert({ ...review, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['location-reviews', variables.location_id] });
      queryClient.invalidateQueries({ queryKey: ['travel-locations'] });
      toast({ title: 'Review submitted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to submit review', description: error.message, variant: 'destructive' });
    },
  });
}
