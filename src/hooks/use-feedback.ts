import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FeedbackItem {
  id: string;
  user_id: string | null;
  project_id: string | null;
  category: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export function useFeedback() {
  const queryClient = useQueryClient();

  const useGetAllFeedback = () => {
    return useQuery({
      queryKey: ['feedback', 'all'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as FeedbackItem[];
      },
    });
  };

  const useGetFeedbackByProject = (projectId: string) => {
    return useQuery({
      queryKey: ['feedback', 'project', projectId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as FeedbackItem[];
      },
      enabled: !!projectId,
    });
  };

  const useUpdateFeedbackStatus = () => {
    return useMutation({
      mutationFn: async ({ id, status, priority }: { id: string; status?: string; priority?: string }) => {
        const updates: Partial<FeedbackItem> = {};
        if (status) updates.status = status;
        if (priority) updates.priority = priority;

        const { data, error } = await supabase
          .from('feedback')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['feedback'] });
      },
    });
  };

  return {
    useGetAllFeedback,
    useGetFeedbackByProject,
    useUpdateFeedbackStatus,
  };
}
