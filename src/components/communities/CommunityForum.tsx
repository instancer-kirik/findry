import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Calendar, ChevronRight, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface CommunityForumProps {
  communityId: string;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  event_id?: string;
  community_id: string;
  user?: {
    name: string;
    avatar_url: string;
  };
  replies_count?: number;
}

const CommunityForum: React.FC<CommunityForumProps> = ({ communityId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchPosts();
  }, [communityId]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // First try to fetch posts from the database
      const { data: dbPosts, error } = await supabase
        .from('community_posts')
        .select('*, user:profiles(*)')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });
      
      // For development, also get the mock posts from localStorage
      const localPosts = JSON.parse(localStorage.getItem(`community_${communityId}_forum_posts`) || '[]');
      
      // Combine both sets of posts
      let allPosts: ForumPost[] = [];
      
      if (dbPosts && !error) {
        // Map the database posts to our format
        allPosts = [
          ...allPosts,
          ...dbPosts.map((post: any) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            user_id: post.user_id,
            created_at: post.created_at,
            event_id: post.event_id,
            community_id: post.community_id,
            user: post.user ? {
              name: post.user.full_name || post.user.username || 'Anonymous',
              avatar_url: post.user.avatar_url
            } : undefined,
            replies_count: post.replies_count || 0
          }))
        ];
      }
      
      // Add local posts (if they don't already exist in DB)
      localPosts.forEach((post: any) => {
        if (!allPosts.some(p => p.id === post.id)) {
          allPosts.push({
            ...post,
            user: {
              name: 'Local User',
              avatar_url: ''
            },
            replies_count: 0
          });
        }
      });
      
      // Sort by date (newest first)
      allPosts.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setPosts(allPosts);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create posts',
      });
      return;
    }
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide both a title and content',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Create a unique ID for the post
      const postId = `post-${Date.now()}`;
      
      // First try to store in the database
      try {
        const { error } = await supabase
          .from('community_posts')
          .insert({
            id: postId,
            title: newPost.title,
            content: newPost.content,
            user_id: user.id,
            community_id: communityId
          });
          
        if (error) throw error;
      } catch (dbError) {
        console.error('Database error creating post:', dbError);
        
        // Fall back to localStorage if database fails
        const localPosts = JSON.parse(localStorage.getItem(`community_${communityId}_forum_posts`) || '[]');
        localPosts.push({
          id: postId,
          title: newPost.title,
          content: newPost.content,
          user_id: user.id,
          created_at: new Date().toISOString(),
          community_id: communityId
        });
        localStorage.setItem(`community_${communityId}_forum_posts`, JSON.stringify(localPosts));
      }
      
      // Reset form and close dialog
      setNewPost({ title: '', content: '' });
      setCreatePostOpen(false);
      
      // Refresh the posts
      await fetchPosts();
      
      toast({
        title: 'Success',
        description: 'Post created successfully',
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive'
      });
    }
  };

  const formatCreatedAt = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'some time ago';
    }
  };

  const handleViewPost = (postId: string) => {
    navigate(`/community/${communityId}/forum/${postId}`);
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const renderPostList = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-3 w-16 bg-muted rounded"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
                <div className="h-4 w-full bg-muted rounded mb-1"></div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="h-4 w-24 bg-muted rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-12 border rounded-lg">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No discussions yet</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Start the conversation by creating the first post
          </p>
          <Button onClick={() => setCreatePostOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {posts.map(post => (
          <Card
            key={post.id}
            className="hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => handleViewPost(post.id)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.user?.avatar_url || undefined} />
                  <AvatarFallback>
                    {post.user?.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{post.user?.name || 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">{formatCreatedAt(post.created_at)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <h3 className="font-medium mb-1">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
              
              {post.event_id && (
                <div className="mt-2 border rounded p-2 bg-muted/30 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Shared Event</span>
                    </div>
                    <Button
                      variant="ghost" 
                      size="sm"
                      className="p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewEvent(post.event_id!);
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.replies_count || 0} replies</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Community Forum</h2>
        <Button onClick={() => setCreatePostOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>
      
      {renderPostList()}
      
      <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                placeholder="Write your post here..."
                rows={6}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCreatePostOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityForum;
