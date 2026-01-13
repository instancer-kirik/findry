import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, Search, UserPlus, Sparkles, Grid, List, Clock, Plus, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateCommunityModal from '@/components/communities/CreateCommunityModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useCommunities, Community as CommunityType } from '@/hooks/use-communities';
import { formatDistanceToNow } from 'date-fns';

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
    navigate(`/communities/${community.id}`);
  };

  const myCommunities = communities.filter(c => c.isMember);
  const featuredCommunities = communities.filter(c => isNewCommunity(c.created_at));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Communities</h1>
              <p className="text-muted-foreground">
                Connect with like-minded creatives, share ideas, and collaborate on projects.
              </p>
            </div>
            <CreateCommunityModal onSuccess={refetch} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{communities.length}</p>
                    <p className="text-xs text-muted-foreground">Total Communities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <UserPlus className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{myCommunities.length}</p>
                    <p className="text-xs text-muted-foreground">Joined</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/20">
                    <Sparkles className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{featuredCommunities.length}</p>
                    <p className="text-xs text-muted-foreground">New This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-muted/50 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {communities.reduce((acc, c) => acc + (c.posts_count || 0), 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Button
                variant={selectedTab === 'all' ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTab('all')}
                className="rounded-none"
              >
                All
              </Button>
              <Button
                variant={selectedTab === 'joined' ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTab('joined')}
                className="rounded-none border-x"
              >
                Joined
              </Button>
              <Button
                variant={selectedTab === 'featured' ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTab('featured')}
                className="rounded-none"
              >
                New
              </Button>
            </div>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={`rounded-none h-9 w-9 ${viewMode === 'grid' ? 'bg-muted' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('list')}
                className={`rounded-none h-9 w-9 ${viewMode === 'list' ? 'bg-muted' : ''}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Badge>
          {COMMUNITY_CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Communities Grid/List */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCommunities.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredCommunities.map((community) => (
              viewMode === 'grid' ? (
                <Card 
                  key={community.id} 
                  className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden hover:border-primary/30"
                  onClick={() => handleCommunityClick(community)}
                >
                  {/* Cover gradient */}
                  <div className="h-16 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20" />
                  
                  <CardHeader className="p-4 pt-0 -mt-8">
                    <div className="flex items-end justify-between">
                      <Avatar className="h-16 w-16 border-4 border-background">
                        <AvatarImage src={community.image_url || undefined} />
                        <AvatarFallback className="text-lg">{community.name[0]}</AvatarFallback>
                      </Avatar>
                      {community.isMember && (
                        <Badge variant="secondary" className="mb-2">Member</Badge>
                      )}
                    </div>
                    <div className="mt-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {community.name}
                      </CardTitle>
                      <CardDescription>{community.category || 'General'}</CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                      {community.description || 'No description available'}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{community.members_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{community.posts_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs">{formatLastActivity(community.created_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 gap-2">
                    <Button 
                      variant={community.isMember ? "outline" : "default"}
                      className="flex-1"
                      onClick={(e) => {
                        community.isMember 
                          ? handleLeaveCommunity(community.id, e) 
                          : handleJoinCommunity(community.id, e);
                      }}
                      disabled={joinCommunity.isPending || leaveCommunity.isPending}
                    >
                      {joinCommunity.isPending || leaveCommunity.isPending 
                        ? "..." 
                        : community.isMember 
                          ? "Leave" 
                          : "Join"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommunityClick(community);
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card 
                  key={community.id} 
                  className="group hover:shadow-lg transition-all cursor-pointer hover:border-primary/30"
                  onClick={() => handleCommunityClick(community)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={community.image_url || undefined} />
                        <AvatarFallback className="text-lg">{community.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                            {community.name}
                          </h3>
                          {community.isMember && (
                            <Badge variant="secondary" className="shrink-0">Member</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {community.description || 'No description available'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{community.members_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{community.posts_count || 0}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {community.category || 'General'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button 
                          variant={community.isMember ? "outline" : "default"}
                          size="sm"
                          onClick={(e) => {
                            community.isMember 
                              ? handleLeaveCommunity(community.id, e) 
                              : handleJoinCommunity(community.id, e);
                          }}
                          disabled={joinCommunity.isPending || leaveCommunity.isPending}
                        >
                          {community.isMember ? "Leave" : "Join"}
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No communities found</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {searchQuery || selectedCategory 
                  ? "Try adjusting your search or filters" 
                  : "Be the first to create a community and start connecting with others!"}
              </p>
              <CreateCommunityModal onSuccess={refetch} />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Communities;
