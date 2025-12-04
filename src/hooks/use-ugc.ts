import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UGCContent, UGCUploadData, UGCComment } from '@/types/ugc';
import { toast } from 'sonner';

export function useUGC(options?: { 
  authorId?: string; 
  eventId?: string;
  venueId?: string;
  artistId?: string;
  brandId?: string;
}) {
  const queryClient = useQueryClient();

  const { data: content, isLoading, refetch } = useQuery({
    queryKey: ['ugc-content', options],
    queryFn: async () => {
      let query = supabase
        .from('ugc_content')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (options?.authorId) {
        query = query.eq('author_id', options.authorId);
      }
      if (options?.eventId) {
        query = query.eq('event_id', options.eventId);
      }
      if (options?.venueId) {
        query = query.eq('venue_id', options.venueId);
      }
      if (options?.artistId) {
        query = query.eq('artist_id', options.artistId);
      }
      if (options?.brandId) {
        query = query.eq('brand_id', options.brandId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Fetch author profiles separately
      const authorIds = [...new Set(data.map(d => d.author_id).filter(Boolean))];
      let profiles: Record<string, any> = {};
      
      if (authorIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', authorIds);
        
        if (profileData) {
          profiles = Object.fromEntries(profileData.map(p => [p.id, p]));
        }
      }
      
      return data.map(item => ({
        ...item,
        content_type: item.content_type as 'image' | 'video' | 'embed',
        author: item.author_id ? profiles[item.author_id] : undefined,
      })) as UGCContent[];
    },
  });

  const uploadMedia = useCallback(async (file: File, userId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('ugc-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('ugc-media')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }, []);

  const createContent = useMutation({
    mutationFn: async ({ 
      file, 
      uploadData 
    }: { 
      file?: File; 
      uploadData: UGCUploadData & { url?: string } 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let url = uploadData.url;
      let thumbnailUrl = null;

      // Upload file if provided
      if (file) {
        url = await uploadMedia(file, user.id);
        
        // For videos, we could generate a thumbnail, but for now just use the URL
        if (uploadData.content_type === 'video') {
          thumbnailUrl = url;
        }
      }

      if (!url) throw new Error('No URL provided');

      const { data, error } = await supabase
        .from('ugc_content')
        .insert({
          author_id: user.id,
          content_type: uploadData.content_type,
          title: uploadData.title,
          description: uploadData.description,
          url,
          thumbnail_url: thumbnailUrl,
          tags: uploadData.tags || [],
          venue_id: uploadData.venue_id,
          event_id: uploadData.event_id,
          artist_id: uploadData.artist_id,
          brand_id: uploadData.brand_id,
          is_public: uploadData.is_public ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ugc-content'] });
      toast.success('Content uploaded successfully!');
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const deleteContent = useMutation({
    mutationFn: async (contentId: string) => {
      const { error } = await supabase
        .from('ugc_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ugc-content'] });
      toast.success('Content deleted');
    },
  });

  const toggleLike = useMutation({
    mutationFn: async (contentId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('ugc_likes')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('ugc_likes')
          .delete()
          .eq('id', existingLike.id);
        return { liked: false };
      } else {
        // Like
        await supabase
          .from('ugc_likes')
          .insert({ content_id: contentId, user_id: user.id });
        return { liked: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ugc-content'] });
    },
  });

  const addComment = useMutation({
    mutationFn: async ({ contentId, text }: { contentId: string; text: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ugc_comments')
        .insert({
          content_id: contentId,
          author_id: user.id,
          text,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ugc-comments'] });
    },
  });

  return {
    content: content || [],
    isLoading,
    refetch,
    createContent,
    deleteContent,
    toggleLike,
    addComment,
    uploadMedia,
  };
}

export function useUGCComments(contentId: string) {
  return useQuery({
    queryKey: ['ugc-comments', contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ugc_comments')
        .select('*')
        .eq('content_id', contentId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Fetch author profiles
      const authorIds = [...new Set(data.map(d => d.author_id).filter(Boolean))];
      let profiles: Record<string, any> = {};
      
      if (authorIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', authorIds);
        
        if (profileData) {
          profiles = Object.fromEntries(profileData.map(p => [p.id, p]));
        }
      }
      
      return data.map(item => ({
        ...item,
        author: item.author_id ? profiles[item.author_id] : undefined,
      })) as UGCComment[];
    },
    enabled: !!contentId,
  });
}

export function useUserLikedContent(contentId: string) {
  return useQuery({
    queryKey: ['ugc-user-liked', contentId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('ugc_likes')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', user.id)
        .single();

      return !!data;
    },
    enabled: !!contentId,
  });
}
