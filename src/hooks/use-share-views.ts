import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export interface ShareView {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  share_key: string;
  tags: string[];
  labels: string[];
  pinned_project_ids: string[];
  excluded_project_ids: string[];
  theme: string;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export const useShareViews = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const myViews = useQuery({
    queryKey: ['share-views', 'mine'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('share_views' as any)
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ShareView[];
    },
    enabled: !!user,
  });

  const createView = useMutation({
    mutationFn: async (view: Partial<ShareView>) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('share_views' as any)
        .insert({ ...view, owner_id: user.id } as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as ShareView;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['share-views'] }),
  });

  const updateView = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ShareView> & { id: string }) => {
      const { data, error } = await supabase
        .from('share_views' as any)
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as ShareView;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['share-views'] }),
  });

  const deleteView = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('share_views' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['share-views'] }),
  });

  return { myViews, createView, updateView, deleteView };
};

export const useShareViewByKey = (shareKey: string | undefined) => {
  return useQuery({
    queryKey: ['share-view', shareKey],
    queryFn: async () => {
      if (!shareKey) return null;
      const { data, error } = await supabase
        .from('share_views' as any)
        .select('*')
        .eq('share_key', shareKey)
        .eq('is_active', true)
        .single();
      if (error) throw error;
      return data as unknown as ShareView;
    },
    enabled: !!shareKey,
  });
};

export const useShareViewProjects = (view: ShareView | null | undefined) => {
  return useQuery({
    queryKey: ['share-view-projects', view?.id],
    queryFn: async () => {
      if (!view) return [];
      
      // Fetch projects matching tags OR pinned, excluding excluded
      let query = supabase
        .from('projects' as any)
        .select('*')
        .eq('is_public', true);

      const { data: allProjects, error } = await query;
      if (error) throw error;
      
      const projects = (allProjects || []) as any[];
      const pinnedIds = view.pinned_project_ids || [];
      const excludedIds = view.excluded_project_ids || [];
      const viewTags = view.tags || [];

      return projects.filter((p: any) => {
        if (excludedIds.includes(p.id)) return false;
        if (pinnedIds.includes(p.id)) return true;
        if (viewTags.length === 0) return false;
        const projectTags = p.tags || [];
        return viewTags.some((t: string) => projectTags.includes(t));
      });
    },
    enabled: !!view,
  });
};
