
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { MessageCircle, ThumbsUp, Reply, Flag, Send } from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  replies: number;
  tags?: string[];
}

// Breaking the recursive type that was causing "type instantiation is excessively deep"
interface ForumComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  // Instead of recursive comments, use a flag to indicate it has replies
  hasReplies: boolean;
  replyCount: number;
}

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Welcome to our community forum!',
    content: 'This is where we can discuss anything related to our community events and activities.',
    author: {
      id: '1',
      name: 'Admin',
      avatar: '',
    },
    createdAt: '2025-04-05T12:00:00Z',
    likes: 15,
    replies: 3,
    tags: ['Welcome', 'Announcement'],
  },
  {
    id: '2',
    title: 'Ideas for our next community event',
    content: 'I was thinking we could organize a workshop on music production. What do you all think?',
    author: {
      id: '2',
      name: 'MusicLover',
      avatar: '',
    },
    createdAt: '2025-04-06T09:15:00Z',
    likes: 8,
    replies: 7,
    tags: ['Event', 'Ideas', 'Workshop'],
  },
];

const mockComments: ForumComment[] = [
  {
    id: '1',
    content: 'Great idea! I would love to attend a music production workshop.',
    author: {
      id: '3',
      name: 'Producer123',
      avatar: '',
    },
    createdAt: '2025-04-06T10:30:00Z',
    likes: 3,
    hasReplies: true,
    replyCount: 2
  },
  {
    id: '2',
    content: 'I could potentially help lead a section on beat-making if needed.',
    author: {
      id: '4',
      name: 'BeatMaster',
      avatar: '',
    },
    createdAt: '2025-04-06T11:45:00Z',
    likes: 5,
    hasReplies: false,
    replyCount: 0
  },
];

const CommunityForum: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [newPost, setNewPost] = useState('');
  const [replyText, setReplyText] = useState('');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Community Forum</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="new-post">New Post</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussions">
            <div className="space-y-4">
              {mockPosts.map(post => (
                <div key={post.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Posted by {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {post.tags?.map(tag => (
                        <span key={tag} className="bg-muted text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm">{post.content}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>{post.replies}</span>
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Discussion
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Sample comments section for the second post */}
              <div className="border rounded-lg p-4 mt-2">
                <h4 className="font-medium mb-3">Comments</h4>
                <div className="space-y-4">
                  {mockComments.map(comment => (
                    <div key={comment.id} className="pl-4 border-l-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 h-7 px-2">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{comment.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 h-7 px-2">
                          <Reply className="h-3 w-3" />
                          <span>Reply</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 h-7 px-2">
                          <Flag className="h-3 w-3" />
                          <span>Report</span>
                        </Button>
                      </div>
                      
                      {comment.hasReplies && (
                        <Button variant="link" size="sm" className="text-xs p-0">
                          Show {comment.replyCount} replies
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center space-x-2 mt-4">
                  <Input
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" className="flex items-center gap-1">
                    <Send className="h-3.5 w-3.5" />
                    <span>Reply</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="new-post">
            <div className="space-y-4">
              <Input placeholder="Post title" className="text-lg font-medium" />
              <div className="border rounded-md">
                <textarea
                  className="w-full p-4 h-40 text-sm resize-none border-0 rounded-md focus:outline-none"
                  placeholder="What would you like to discuss?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Post Discussion</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommunityForum;
