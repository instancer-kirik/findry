import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserBlock } from '@/types/garage';
import { useToast } from '@/hooks/use-toast';

export function useUserBlocks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get my blocked users
  const useGetBlockedUsers = () => {
    return useQuery({
      queryKey: ['blocked-users'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
          .from('user_blocks')
          .select('*')
          .eq('blocker_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as UserBlock[];
      },
    });
  };

  // Block a user
  const useBlockUser = () => {
    return useMutation({
      mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Must be logged in');

        const { data, error } = await supabase
          .from('user_blocks')
          .insert({
            blocker_id: user.id,
            blocked_id: userId,
            reason: reason || null,
          })
          .select()
          .single();
        
        if (error) throw error;
        return data as UserBlock;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
        queryClient.invalidateQueries({ queryKey: ['garages'] });
        toast({ title: 'User blocked', description: 'You will no longer see each other\'s content' });
      },
      onError: (error) => {
        toast({ title: 'Error blocking user', description: error.message, variant: 'destructive' });
      },
    });
  };

  // Unblock a user
  const useUnblockUser = () => {
    return useMutation({
      mutationFn: async (blockId: string) => {
        const { error } = await supabase
          .from('user_blocks')
          .delete()
          .eq('id', blockId);
        
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
        queryClient.invalidateQueries({ queryKey: ['garages'] });
        toast({ title: 'User unblocked' });
      },
      onError: (error) => {
        toast({ title: 'Error unblocking user', description: error.message, variant: 'destructive' });
      },
    });
  };

  // Check if a specific user is blocked
  const checkIsBlocked = async (userId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_blocks')
      .select('id')
      .or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`)
      .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`)
      .limit(1);
    
    if (error) return false;
    return (data?.length ?? 0) > 0;
  };

  return {
    useGetBlockedUsers,
    useBlockUser,
    useUnblockUser,
    checkIsBlocked,
  };
}
