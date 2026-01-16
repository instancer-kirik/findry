import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Garage, GarageInsert, GarageInvite, PrivacyLevel } from '@/types/garage';
import { useToast } from '@/hooks/use-toast';

export function useGarages() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all visible garages
  const useGetGarages = () => {
    return useQuery({
      queryKey: ['garages'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('garages')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Garage[];
      },
    });
  };

  // Fetch user's own garages
  const useGetMyGarages = () => {
    return useQuery({
      queryKey: ['my-garages'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
          .from('garages')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Garage[];
      },
    });
  };

  // Fetch single garage
  const useGetGarage = (garageId?: string) => {
    return useQuery({
      queryKey: ['garage', garageId],
      queryFn: async () => {
        if (!garageId) return null;

        const { data, error } = await supabase
          .from('garages')
          .select('*')
          .eq('id', garageId)
          .single();
        
        if (error) throw error;
        return data as Garage;
      },
      enabled: !!garageId,
    });
  };

  // Create garage
  const useCreateGarage = () => {
    return useMutation({
      mutationFn: async (garage: GarageInsert) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Must be logged in to create a garage');

        const { data, error } = await supabase
          .from('garages')
          .insert({ ...garage, owner_id: user.id })
          .select()
          .single();
        
        if (error) throw error;
        return data as Garage;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['garages'] });
        queryClient.invalidateQueries({ queryKey: ['my-garages'] });
        toast({ title: 'Garage created successfully' });
      },
      onError: (error) => {
        toast({ title: 'Error creating garage', description: error.message, variant: 'destructive' });
      },
    });
  };

  // Update garage
  const useUpdateGarage = () => {
    return useMutation({
      mutationFn: async ({ id, ...updates }: Partial<Garage> & { id: string }) => {
        const { data, error } = await supabase
          .from('garages')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data as Garage;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['garages'] });
        queryClient.invalidateQueries({ queryKey: ['my-garages'] });
        queryClient.invalidateQueries({ queryKey: ['garage', data.id] });
        toast({ title: 'Garage updated successfully' });
      },
      onError: (error) => {
        toast({ title: 'Error updating garage', description: error.message, variant: 'destructive' });
      },
    });
  };

  // Delete garage
  const useDeleteGarage = () => {
    return useMutation({
      mutationFn: async (garageId: string) => {
        const { error } = await supabase
          .from('garages')
          .delete()
          .eq('id', garageId);
        
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['garages'] });
        queryClient.invalidateQueries({ queryKey: ['my-garages'] });
        toast({ title: 'Garage deleted successfully' });
      },
      onError: (error) => {
        toast({ title: 'Error deleting garage', description: error.message, variant: 'destructive' });
      },
    });
  };

  // Invite user to garage
  const useInviteToGarage = () => {
    return useMutation({
      mutationFn: async ({ garageId, userId }: { garageId: string; userId: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Must be logged in');

        const { data, error } = await supabase
          .from('garage_invites')
          .insert({
            garage_id: garageId,
            invited_user_id: userId,
            invited_by: user.id,
          })
          .select()
          .single();
        
        if (error) throw error;
        return data as GarageInvite;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['garage-invites'] });
        toast({ title: 'Invitation sent' });
      },
      onError: (error) => {
        toast({ title: 'Error sending invite', description: error.message, variant: 'destructive' });
      },
    });
  };

  // Respond to garage invite
  const useRespondToInvite = () => {
    return useMutation({
      mutationFn: async ({ inviteId, status }: { inviteId: string; status: 'accepted' | 'declined' }) => {
        const { data, error } = await supabase
          .from('garage_invites')
          .update({ status })
          .eq('id', inviteId)
          .select()
          .single();
        
        if (error) throw error;
        return data as GarageInvite;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['garage-invites'] });
        queryClient.invalidateQueries({ queryKey: ['garages'] });
        toast({ title: `Invitation ${data.status}` });
      },
      onError: (error) => {
        toast({ title: 'Error responding to invite', description: error.message, variant: 'destructive' });
      },
    });
  };

  // Get my invites
  const useGetMyInvites = () => {
    return useQuery({
      queryKey: ['garage-invites'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
          .from('garage_invites')
          .select('*')
          .eq('invited_user_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as GarageInvite[];
      },
    });
  };

  return {
    useGetGarages,
    useGetMyGarages,
    useGetGarage,
    useCreateGarage,
    useUpdateGarage,
    useDeleteGarage,
    useInviteToGarage,
    useRespondToInvite,
    useGetMyInvites,
  };
}
