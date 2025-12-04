import React from 'react';
import Layout from '@/components/layout/Layout';
import { useUGC } from '@/hooks/use-ugc';
import { UGCFeedCard } from '@/components/ugc/UGCFeedCard';
import { UGCUploadModal } from '@/components/ugc/UGCUploadModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Image, Video, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function Feed() {
  const { content, isLoading, refetch } = useUGC();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<'recent' | 'trending'>('recent');

  const filteredContent = React.useMemo(() => {
    let filtered = content;

    // Filter by type
    if (activeTab !== 'all') {
      filtered = filtered.filter(c => c.content_type === activeTab);
    }

    // Sort
    if (sortBy === 'trending') {
      filtered = [...filtered].sort((a, b) => b.likes_count - a.likes_count);
    }

    return filtered;
  }, [content, activeTab, sortBy]);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Feed</h1>
              <p className="text-muted-foreground">
                Discover content from artists, venues, and brands
              </p>
            </div>
            {user && (
              <UGCUploadModal 
                onSuccess={refetch}
                trigger={
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Post
                  </Button>
                }
              />
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-1">
                  <Image className="w-3 h-3" />
                  <span className="hidden sm:inline">Photos</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  <span className="hidden sm:inline">Videos</span>
                </TabsTrigger>
                <TabsTrigger value="embed">Embeds</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button
                variant={sortBy === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('recent')}
                className="gap-1"
              >
                <Clock className="w-3 h-3" />
                Recent
              </Button>
              <Button
                variant={sortBy === 'trending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('trending')}
                className="gap-1"
              >
                <TrendingUp className="w-3 h-3" />
                Trending
              </Button>
            </div>
          </div>

          {/* Content Grid */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-64 w-full" />
                </div>
              ))}
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Image className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">No content yet</h3>
                <p className="text-muted-foreground text-sm">
                  Be the first to share something!
                </p>
              </div>
              {user && (
                <UGCUploadModal 
                  onSuccess={refetch}
                  trigger={
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Share Content
                    </Button>
                  }
                />
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredContent.map(item => (
                <UGCFeedCard 
                  key={item.id} 
                  content={item}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
