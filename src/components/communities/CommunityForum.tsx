
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  reply_to?: string | null;
  replies?: Post[];
}

interface CommunityForumProps {
  communityId: string;
}

const CommunityForum: React.FC<CommunityForumProps> = ({ communityId }) => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const queryClient = useQueryClient();

  // Fetch posts for this community
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['community-posts', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles(username, avatar_url)
        `)
        .eq('community_id', communityId)
        .is('reply_to', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include username and avatar
      const transformedPosts = data?.map(post => {
        const profileData = post.profiles;
        return {
          id: post.id,
          content: post.content,
          created_at: post.created_at,
          user_id: post.user_id,
          username: profileData?.username || 'Unknown user',
          avatar_url: profileData?.avatar_url || '',
          replies: [] as Post[]
        };
      }) || [];

      // Get replies for each post - check if reply_to column exists first
      try {
        // Check if reply_to column exists
        const { data: tableInfo } = await supabase.rpc('get_table_definition', {
          table_name: 'community_posts'
        });
        
        const hasReplyToColumn = tableInfo?.some((col: any) => 
          col.column_name === 'reply_to'
        );
        
        if (hasReplyToColumn) {
          for (const post of transformedPosts) {
            const { data: replies, error: repliesError } = await supabase
              .from('community_posts')
              .select(`
                id,
                content,
                created_at,
                user_id,
                profiles(username, avatar_url)
              `)
              .eq('community_id', communityId)
              .eq('reply_to', post.id)
              .order('created_at', { ascending: true });

            if (!repliesError && replies) {
              post.replies = replies.map((reply: any) => ({
                id: reply.id,
                content: reply.content,
                created_at: reply.created_at,
                user_id: reply.user_id,
                username: reply.profiles?.username || 'Unknown user',
                avatar_url: reply.profiles?.avatar_url || '',
                reply_to: post.id
              }));
            }
          }
        }
      } catch (e) {
        console.error('Error fetching replies:', e);
        // Continue without replies if there's an error
      }

      return transformedPosts;
    },
    enabled: !!communityId
  });

  // Add a new post mutation
  const addPostMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('You must be logged in to post');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          content,
          user_id: user.id,
          community_id: communityId
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setNewPost('');
      queryClient.invalidateQueries({ queryKey: ['community-posts', communityId] });
      toast({
        title: 'Post created',
        description: 'Your post has been published to the community.',
      });
    },
    onError: (error) => {
      console.error('Error adding post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create your post. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    addPostMutation.mutate(newPost);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Forum</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-48 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Forum</h2>
      </div>

      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create a Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <Textarea 
                placeholder="Share something with the community..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!newPost.trim() || addPostMutation.isPending}
                >
                  {addPostMutation.isPending ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.avatar_url} alt={post.username} />
                    <AvatarFallback>{post.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {post.username} 
                        {post.user_id === user?.id && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-line">{post.content}</p>
                    
                    {/* Replies section */}
                    {post.replies && post.replies.length > 0 && (
                      <div className="mt-4 space-y-4">
                        <div className="text-sm font-medium">Replies</div>
                        <div className="space-y-4 pl-4 border-l-2 border-muted">
                          {post.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={reply.avatar_url} alt={reply.username} />
                                <AvatarFallback>{reply.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-sm">
                                    {reply.username}
                                    {reply.user_id === user?.id && (
                                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatDate(reply.created_at)}
                                  </div>
                                </div>
                                <p className="text-sm">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No posts yet. Be the first to start a discussion!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CommunityForum;
