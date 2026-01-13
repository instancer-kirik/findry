import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, CalendarDays, Search, UserPlus, Shield, Sparkles, Grid, List, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateCommunityModal from '@/components/communities/CreateCommunityModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/hooks/use-auth';
import { useCommunities, Community as CommunityType } from '@/hooks/use-communities';
import { format, formatDistanceToNow } from 'date-fns';

const COMMUNITY_CATEGORIES = [
  'Arts', 'Music', 'Film', 'Dance', 'Theater', 'Writing', 'Gaming'
] as const;

const Communities = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useGetCommunities, useJoinCommunity, useLeaveCommunity } = useCommunities();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityType | null>(null);
  
  const { data: communities = [], isLoading, error, refetch } = useGetCommunities();
  const joinCommunity = useJoinCommunity();
  const leaveCommunity = useLeaveCommunity();

  useEffect(() => {
    if (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load communities. Please try again later.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleJoinCommunity = async (communityId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to join communities',
      });
      navigate('/login');
      return;
    }
    
    joinCommunity.mutate(communityId, {
      onSuccess: () => {
        // Refetch to update data
        refetch();
      }
    });
  };

  const handleLeaveCommunity = async (communityId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to leave communities',
      });
      navigate('/login');
      return;
    }
    
    leaveCommunity.mutate(communityId, {
      onSuccess: () => {
        // Refetch to update data
        refetch();
      }
    });
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = searchQuery 
      ? community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (community.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (community.category || '').toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = selectedCategory
      ? community.category === selectedCategory
      : true;
    
    const matchesTab = selectedTab === 'all' 
      ? true 
      : selectedTab === 'joined' 
        ? community.isMember 
        : selectedTab === 'featured' 
          ? isNewCommunity(community.created_at)
          : true;
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const isNewCommunity = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
    return createdDate > sevenDaysAgo;
  };

  const formatLastActivity = (createdAt: string) => {
    try {
      return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
    } catch (e) {
      return 'Recently';
    }
  };

  const handleCommunityClick = (community: CommunityType) => {
    // Navigate directly to community page
    navigate(`/communities/${community.id}`);
  };

  const handleViewFullProfile = (communityId: string) => {
    navigate(`/communities/${communityId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Communities</span>
                  <CreateCommunityModal onSuccess={refetch} />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="relative mb-4">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                <div className="space-y-1">
                  <Button 
                    variant={selectedTab === 'all' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedTab('all')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    All Communities
                  </Button>
                  <Button 
                    variant={selectedTab === 'joined' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedTab('joined')}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    My Communities
                  </Button>
                  <Button 
                    variant={selectedTab === 'featured' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedTab('featured')}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Featured
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="flex flex-wrap gap-2">
                  {COMMUNITY_CATEGORIES.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <Tabs defaultValue={selectedTab} className="w-full" onValueChange={setSelectedTab}>
                <TabsList>
                  <TabsTrigger value="all">All Communities</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="joined">Joined</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-muted' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-muted' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                          <div>
                            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-20 bg-muted animate-pulse rounded mt-2" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded mt-2" />
                      <div className="flex items-center gap-4 mt-4">
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <div className="h-9 w-full bg-muted animate-pulse rounded" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredCommunities.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredCommunities.map((community) => (
                viewMode === 'grid' ? (
                    <Card 
                      key={community.id} 
                      className="group hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleCommunityClick(community)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={community.image_url || undefined} />
                              <AvatarFallback>{community.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{community.name}</CardTitle>
                              <CardDescription>{community.category || 'General'}</CardDescription>
                            </div>
                          </div>
                          {community.isMember && (
                            <Badge variant="secondary">Member</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {community.description || 'No description available'}
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{community.members_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{community.posts_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatLastActivity(community.created_at)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          variant={community.isMember ? "outline" : "default"}
                          className="w-full"
                          onClick={(e) => {
                            community.isMember 
                              ? handleLeaveCommunity(community.id, e) 
                              : handleJoinCommunity(community.id, e);
                          }}
                          disabled={joinCommunity.isPending || leaveCommunity.isPending}
                        >
                          {joinCommunity.isPending || leaveCommunity.isPending 
                            ? "Processing..." 
                            : community.isMember 
                              ? "Leave Community" 
                              : "Join Community"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card 
                      key={community.id} 
                      className="group hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleCommunityClick(community)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={community.image_url || undefined} />
                            <AvatarFallback>{community.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">{community.name}</h3>
                              {community.isMember && (
                                <Badge variant="secondary">Member</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {community.description || 'No description available'}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{community.members_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{community.posts_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatLastActivity(community.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant={community.isMember ? "outline" : "default"}
                            className="shrink-0"
                            onClick={(e) => {
                              community.isMember 
                                ? handleLeaveCommunity(community.id, e) 
                                : handleJoinCommunity(community.id, e);
                            }}
                          >
                            {community.isMember ? "Leave Community" : "Join Community"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                )
              ))}
            </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-md">
                <h3 className="text-lg font-medium mb-2">No communities found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || selectedCategory 
                    ? "Try adjusting your search or filters" 
                    : "Be the first to create a community!"}
                </p>
                <CreateCommunityModal onSuccess={refetch} />
              </div>
            )}
          </div>
        </div>

        <Dialog open={!!selectedCommunity} onOpenChange={(open) => {
          if (!open) setSelectedCommunity(null);
        }}>
          <DialogContent className="max-w-2xl">
            {selectedCommunity && (
              <>
                <DialogHeader>
                  <DialogTitle>Community Preview</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedCommunity.image_url || undefined} />
                      <AvatarFallback>{selectedCommunity.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedCommunity.name}</h2>
                      <p className="text-muted-foreground">{selectedCommunity.category || 'General'}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {selectedCommunity.description || 'No description available'}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Members</p>
                        <p className="text-lg font-semibold">{selectedCommunity.members_count}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Posts</p>
                        <p className="text-lg font-semibold">{selectedCommunity.posts_count}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className="text-sm text-muted-foreground">Created {formatLastActivity(selectedCommunity.created_at)}</p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <Button 
                      variant={selectedCommunity.isMember ? "outline" : "default"}
                      onClick={(e) => {
                        selectedCommunity.isMember 
                          ? handleLeaveCommunity(selectedCommunity.id, e) 
                          : handleJoinCommunity(selectedCommunity.id, e);
                      }}
                      disabled={joinCommunity.isPending || leaveCommunity.isPending}
                    >
                      {joinCommunity.isPending || leaveCommunity.isPending 
                        ? "Processing..." 
                        : selectedCommunity.isMember 
                          ? "Leave Community" 
                          : "Join Community"}
                    </Button>
                    <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedCommunity(null)}>
                      Close
                    </Button>
                    <Button onClick={() => handleViewFullProfile(selectedCommunity.id)}>
                      View Full Profile
                    </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Communities;
