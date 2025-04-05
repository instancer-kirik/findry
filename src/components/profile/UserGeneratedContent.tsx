import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Image, Video, Share, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface UGCItem {
  id: string;
  type: 'image' | 'video' | 'embed';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  tags: string[];
  authorId: string;
  authorName: string;
  createdAt: string;
}

interface UserGeneratedContentProps {
  profileId: string;
  profileType: string;
  isOwner: boolean;
  initialContent?: UGCItem[];
}

const demoContent: UGCItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    title: 'Friday Night Live',
    tags: ['concert', 'live music', 'friday'],
    authorId: 'user1',
    authorName: 'John Doe',
    createdAt: '2023-09-15T14:30:00Z'
  },
  {
    id: '2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    title: 'Jazz Night',
    tags: ['jazz', 'weekend', 'performance'],
    authorId: 'user2',
    authorName: 'Jane Smith',
    createdAt: '2023-09-10T19:45:00Z'
  },
  {
    id: '3',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    title: 'Acoustic Session',
    tags: ['acoustic', 'singer-songwriter', 'intimate'],
    authorId: 'user3',
    authorName: 'Alex Johnson',
    createdAt: '2023-08-28T21:00:00Z'
  },
  {
    id: '4',
    type: 'embed',
    url: 'https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT',
    title: 'Latest Single',
    tags: ['spotify', 'music', 'new release'],
    authorId: 'user1',
    authorName: 'John Doe',
    createdAt: '2023-08-15T10:20:00Z'
  }
];

const UserGeneratedContent: React.FC<UserGeneratedContentProps> = ({
  profileId,
  profileType,
  isOwner,
  initialContent = demoContent
}) => {
  const [content, setContent] = useState<UGCItem[]>(initialContent);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  
  // Get unique tags from content
  const allTags = Array.from(new Set(content.flatMap(item => item.tags)));
  
  // Filter content based on active tab and tag filter
  const filteredContent = content.filter(item => {
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    if (filterTag && !item.tags.includes(filterTag)) return false;
    return true;
  });

  const handleAddContent = () => {
    console.log('Open modal to add new content');
    // In a real implementation, this would open a modal for adding new UGC
  };

  const handleTagClick = (tag: string) => {
    setFilterTag(filterTag === tag ? null : tag);
  };

  const renderContentItem = (item: UGCItem) => {
    if (viewMode === 'grid') {
      return (
        <div key={item.id} className="overflow-hidden rounded-md group relative">
          {item.type === 'image' && (
            <img 
              src={item.url} 
              alt={item.title || 'User generated content'} 
              className="object-cover w-full aspect-square hover:scale-105 transition-transform duration-300"
            />
          )}
          {item.type === 'video' && (
            <div className="aspect-square relative bg-black flex items-center justify-center">
              {item.thumbnail ? (
                <img src={item.thumbnail} alt="Video thumbnail" className="w-full h-full object-cover opacity-80" />
              ) : (
                <Video className="w-12 h-12 text-muted" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                  <Video className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </div>
          )}
          {item.type === 'embed' && (
            <div className="aspect-square bg-muted flex items-center justify-center p-4">
              <div className="text-center">
                <Share className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">{item.title}</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-sm font-medium truncate">{item.title}</p>
            <p className="text-white/80 text-xs">By {item.authorName}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0">
          <div className="w-20 h-20 flex-shrink-0">
            {item.type === 'image' && (
              <img 
                src={item.url} 
                alt={item.title || 'User generated content'} 
                className="object-cover w-full h-full rounded-md"
              />
            )}
            {item.type === 'video' && (
              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                <Video className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            {item.type === 'embed' && (
              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                <Share className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h4 className="font-medium">{item.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">By {item.authorName} • {new Date(item.createdAt).toLocaleDateString()}</p>
            <div className="flex flex-wrap gap-1">
              {item.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className="text-xs cursor-pointer"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Content & Media</CardTitle>
        <div className="flex items-center gap-2">
          {isOwner && (
            <Button variant="outline" size="sm" onClick={handleAddContent}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add
            </Button>
          )}
          <div className="flex rounded-md border overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="image">Photos</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="embed">Embeds</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {filterTag && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtered by:</span>
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilterTag(null)}>
              {filterTag} ×
            </Badge>
          </div>
        )}
        
        {!filterTag && (
          <div className="flex flex-wrap gap-2 mb-4">
            {allTags.slice(0, 10).map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {filteredContent.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No content available</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredContent.map(renderContentItem)}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContent.map(renderContentItem)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserGeneratedContent; 