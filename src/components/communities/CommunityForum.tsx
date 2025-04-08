import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsUp, Heart, Reply, MoreVertical, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CommunityPost {
  id: string;
  community_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url: string;
    full_name: string;
  };
  replies?: CommunityPost[];
  reply_to?: string | null;
  likes_count?: number;
  is_liked?: boolean;
}

interface CommunityForumProps {
  communityId: string;
}

const CommunityForum: React.FC<CommunityForumProps> = ({ communityId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPostContent, setNewPostContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [activeTab, setActiveTab] = useState('latest');

  // Fetch posts for this community
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['community-posts', communityId],
    queryFn: async (): Promise<CommunityPost[]> => {
      const { data: postsData, error } = await supabase
        .from('community_posts')
        .select(`
          id,
          community_id,
          user_id,
          content,
          created_at,
          updated_at,
          reply_to,
          user:user_id (id, username, avatar_url, full_name)
        `)
        .eq('community_id', communityId)
        .is('reply_to', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch replies for each post
      const postsWithReplies = await Promise.all(
        postsData.map(async (post) => {
          // Get replies for this post
          const { data: replies, error: repliesError } = await supabase
            .from('community_posts')
            .select(`
              id,
              community_id,
              user_id,
              content,
              created_at,
              updated_at,
              reply_to,
              user:user_id (id, username, avatar_url, full_name)
            `)
            .eq('community_id', communityId)
            .eq('reply_to', post.id)
            .order('created_at', { ascending: true });

          if (repliesError) {
            console.error('Error fetching replies:', repliesError);
            return { ...post, replies: [] };
          }

          return { ...post, replies };
        })
      );

      // Sort by created_at for the active tab
      if (activeTab === 'latest') {
        return postsWithReplies.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        // For 'popular' tab we would need a likes count - this is a simplified version
        return postsWithReplies;
      }
    },
    enabled: !!communityId,
  });

  // Create a new post
  const createPost = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('You must be logged in to post');
      if (!content.trim()) throw new Error('Post cannot be empty');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          community_id: communityId,
          user_id: user.id,
          content,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setNewPostContent('');
      queryClient.invalidateQueries({ queryKey: ['community-posts', communityId] });
      toast({
        title: 'Success',
        description: 'Your post has been published',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to publish post',
        variant: 'destructive',
      });
    },
  });

  // Create a reply to a post
  const createReply = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!user) throw new Error('You must be logged in to reply');
      if (!content.trim()) throw new Error('Reply cannot be empty');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          community_id: communityId,
          user_id: user.id,
          content,
          reply_to: postId,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setReplyContent('');
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ['community-posts', communityId] });
      toast({
        title: 'Success',
        description: 'Your reply has been published',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to publish reply',
        variant: 'destructive',
      });
    },
  });

  const handleSubmitPost = () => {
    createPost.mutate(newPostContent);
  };

  const handleSubmitReply = (postId: string) => {
    createReply.mutate({ postId, content: replyContent });
  };

  const handleStartReply = (postId: string) => {
    setReplyingTo(postId);
    setReplyContent('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'some time ago';
    }
  };

  return (
    <div className="space-y-6">
      {/* Post creation form */}
      <Card>
        <CardHeader>
          <CardTitle>Create a post</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-20 resize-none"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            variant="default" 
            onClick={handleSubmitPost}
            disabled={!user || createPost.isPending || !newPostContent.trim()}
          >
            {createPost.isPending ? 'Posting...' : 'Post'}
          </Button>
        </CardFooter>
      </Card>

      {/* Filter tabs */}
      <Tabs defaultValue="latest" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Posts list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-16 bg-muted rounded" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.user?.avatar_url} />
                      <AvatarFallback>{post.user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{post.user?.username || 'Anonymous'}</h3>
                      <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Save Post</DropdownMenuItem>
                      <DropdownMenuItem>Copy Link</DropdownMenuItem>
                      {user?.id === post.user_id && (
                        <DropdownMenuItem className="text-red-500">Delete Post</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{post.content}</p>
              </CardContent>
              <CardFooter className="py-2 flex gap-3 justify-start border-t">
                <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{post.likes_count || 0}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground h-8"
                  onClick={() => handleStartReply(post.id)}
                >
                  <Reply className="h-4 w-4 mr-1" />
                  <span>{post.replies?.length || 0}</span>
                </Button>
              </CardFooter>

              {/* Display replies */}
              {post.replies && post.replies.length > 0 && (
                <div className="px-6 pb-3 space-y-3">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="border-l-2 pl-4 py-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.user?.avatar_url} />
                          <AvatarFallback>{reply.user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <h4 className="font-medium text-sm">{reply.user?.username || 'Anonymous'}</h4>
                            <span className="text-xs text-muted-foreground">{formatDate(reply.created_at)}</span>
                          </div>
                          <p className="text-sm mt-1">{reply.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm" className="text-muted-foreground h-6 text-xs">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              <span>{reply.likes_count || 0}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {replyingTo === post.id && (
                <div className="px-6 pb-4 flex gap-3 items-end">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-16 resize-none pr-10"
                    />
                    <Button 
                      size="icon"
                      className="absolute right-2 bottom-2 h-6 w-6"
                      disabled={!replyContent.trim() || createReply.isPending}
                      onClick={() => handleSubmitReply(post.id)}
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCancelReply}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Be the first to start a conversation in this community!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityForum; 