import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export const useCommunityShareViews = (communityId?: string) => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['community-share-views', communityId],
    enabled: !!communityId,
    queryFn: async () => {
      const { data: links, error } = await supabase
        .from('community_share_views' as any)
        .select('*')
        .eq('community_id', communityId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const viewIds = (links || []).map((l: any) => l.share_view_id);
      if (viewIds.length === 0) return [];
      const { data: views } = await supabase
        .from('share_views' as any)
        .select('*')
        .in('id', viewIds);
      const vmap = new Map(((views as any[]) || []).map((v: any) => [v.id, v]));
      return (links as any[]).map((l: any) => ({ ...l, view: vmap.get(l.share_view_id) }));
    },
  });

  const attach = useMutation({
    mutationFn: async (shareViewId: string) => {
      if (!user || !communityId) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('community_share_views' as any)
        .insert({ community_id: communityId, share_view_id: shareViewId, added_by: user.id } as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['community-share-views', communityId] }),
  });

  const detach = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('community_share_views' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['community-share-views', communityId] }),
  });

  return { list, attach, detach };
};