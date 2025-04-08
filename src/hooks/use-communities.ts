import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export interface Community {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
  created_by: string | null;
  members_count?: number;
  posts_count?: number;
  isMember?: boolean;
}

interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export const useCommunities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all communities
  const useGetCommunities = () => {
    return useQuery({
      queryKey: ['communities'],
      queryFn: async () => {
        // Fetch all communities
        const { data: communities, error } = await supabase
          .from('communities')
          .select(`
            id,
            name,
            description,
            category,
            image_url,
            created_at,
            created_by
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // If user is logged in, check which communities they're part of
        let userMemberships: Record<string, boolean> = {};
        if (user) {
          const { data: memberships } = await supabase
            .from('community_members')
            .select('community_id')
            .eq('user_id', user.id);
            
          if (memberships) {
            memberships.forEach(m => {
              userMemberships[m.community_id] = true;
            });
          }
        }

        // Get member counts for each community
        const memberCountPromises = communities.map(async (community) => {
          const { count, error } = await supabase
            .from('community_members')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', community.id);
            
          return {
            communityId: community.id,
            count: count || 0,
            error
          };
        });

        // Get post counts for each community
        const postCountPromises = communities.map(async (community) => {
          const { count, error } = await supabase
            .from('community_posts')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', community.id);
            
          return {
            communityId: community.id,
            count: count || 0,
            error
          };
        });

        const memberCounts = await Promise.all(memberCountPromises);
        const postCounts = await Promise.all(postCountPromises);

        // Map counts to communities
        const mappedCommunities = communities.map((community) => {
          const memberCount = memberCounts.find(c => c.communityId === community.id)?.count || 0;
          const postCount = postCounts.find(c => c.communityId === community.id)?.count || 0;
          
          return {
            ...community,
            members_count: memberCount,
            posts_count: postCount,
            isMember: userMemberships[community.id] || false
          };
        });

        return mappedCommunities;
      },
      enabled: true,
    });
  };

  // Get a single community by ID
  const useGetCommunity = (communityId?: string) => {
    return useQuery({
      queryKey: ['community', communityId],
      queryFn: async () => {
        if (!communityId) return null;

        // Fetch the community
        const { data, error } = await supabase
          .from('communities')
          .select(`
            id,
            name,
            description,
            category,
            image_url,
            created_at,
            created_by
          `)
          .eq('id', communityId)
          .single();

        if (error) throw error;
        if (!data) return null;

        // Check if user is a member
        let isMember = false;
        if (user) {
          const { data: membership } = await supabase
            .from('community_members')
            .select('*')
            .eq('community_id', communityId)
            .eq('user_id', user.id)
            .single();
            
          isMember = !!membership;
        }

        // Get member count
        const { count: memberCount } = await supabase
          .from('community_members')
          .select('*', { count: 'exact', head: true })
          .eq('community_id', communityId);

        // Get post count
        const { count: postCount } = await supabase
          .from('community_posts')
          .select('*', { count: 'exact', head: true })
          .eq('community_id', communityId);

        return {
          ...data,
          members_count: memberCount || 0,
          posts_count: postCount || 0,
          isMember
        };
      },
      enabled: !!communityId,
    });
  };

  // Join a community
  const useJoinCommunity = () => {
    return useMutation({
      mutationFn: async (communityId: string) => {
        if (!user) throw new Error('User not authenticated');

        // Check if already a member
        const { data: existingMembership } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', communityId)
          .eq('user_id', user.id)
          .single();

        if (existingMembership) {
          throw new Error('Already a member of this community');
        }

        // Join the community
        const { data, error } = await supabase
          .from('community_members')
          .insert({
            community_id: communityId,
            user_id: user.id,
            role: 'member',
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: (_, communityId) => {
        toast({
          title: 'Success',
          description: 'You have joined the community',
        });
        queryClient.invalidateQueries({ queryKey: ['communities'] });
        queryClient.invalidateQueries({ queryKey: ['community', communityId] });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to join community',
          variant: 'destructive',
        });
      }
    });
  };

  // Leave a community
  const useLeaveCommunity = () => {
    return useMutation({
      mutationFn: async (communityId: string) => {
        if (!user) throw new Error('User not authenticated');

        // Check if a member
        const { data: membership, error: membershipError } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', communityId)
          .eq('user_id', user.id)
          .single();

        if (membershipError || !membership) {
          throw new Error('Not a member of this community');
        }

        // Check if user is the admin of this community
        if (membership.role === 'admin') {
          // Count how many admins this community has
          const { count, error: countError } = await supabase
            .from('community_members')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', communityId)
            .eq('role', 'admin');
            
          if (countError) throw countError;
          
          // If this is the only admin, don't allow leaving
          if (count === 1) {
            throw new Error('You are the only admin of this community. Assign another admin before leaving.');
          }
        }

        // Leave the community
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('community_id', communityId)
          .eq('user_id', user.id);

        if (error) throw error;
        return { success: true };
      },
      onSuccess: (_, communityId) => {
        toast({
          title: 'Success',
          description: 'You have left the community',
        });
        queryClient.invalidateQueries({ queryKey: ['communities'] });
        queryClient.invalidateQueries({ queryKey: ['community', communityId] });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to leave community',
          variant: 'destructive',
        });
      }
    });
  };

  // Check if user is a member of a community
  const checkMembership = async (communityId: string): Promise<boolean> => {
    if (!user) return false;

    const { data, error } = await supabase
      .from('community_members')
      .select('*')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) return false;
    return true;
  };

  return {
    useGetCommunities,
    useGetCommunity,
    useJoinCommunity,
    useLeaveCommunity,
    checkMembership
  };
}; 