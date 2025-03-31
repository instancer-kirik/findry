import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, CalendarDays, Search, UserPlus, Shield, Sparkles, Grid, List } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateCommunityModal from '@/components/communities/CreateCommunityModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock } from 'lucide-react';

interface Community {
  id: string;
  name: string;
  description: string;
  image: string;
  members: number;
  posts: number;
  category: string;
  tags: string[];
  isMember: boolean;
  lastActivity: string;
}

const COMMUNITY_CATEGORIES = [
  'Arts', 'Music', 'Film', 'Dance', 'Theater', 'Writing', 'Gaming'
] as const;

const Communities = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  
  const { data: communitiesData, isLoading, error, refetch } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          id,
          name,
          description,
          category,
          image_url,
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

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

  const transformedCommunities: Community[] = communitiesData?.map(community => ({
    id: community.id,
    name: community.name,
    description: community.description || 'No description available',
    members: 0,
    posts: 0,
    image: community.image_url || '/placeholder.svg',
    joined: false,
    new: new Date(community.created_at).getTime() > (Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastActivity: 'Recently',
    category: community.category || 'General',
    tags: [],
    isMember: false
  })) || [];

  const sampleCommunities: Community[] = [
    {
      id: '1',
      name: 'Digital Artists Collective',
      description: 'A community for digital artists to share their work, get feedback, and collaborate on projects.',
      image: '/placeholder.svg',
      members: 1234,
      posts: 789,
      category: 'Art & Design',
      tags: ['Digital Art', 'Illustration', 'Design', 'Collaboration'],
      isMember: true,
      lastActivity: '2 hours ago'
    },
    {
      id: '2',
      name: 'Sound Engineers Hub',
      description: 'Connect with fellow sound engineers, share techniques, and find collaboration opportunities.',
      image: '/placeholder.svg',
      members: 856,
      posts: 432,
      category: 'Audio',
      tags: ['Sound Design', 'Mixing', 'Recording', 'Audio'],
      isMember: false,
      lastActivity: '5 hours ago'
    },
    {
      id: '3',
      name: 'Indie Game Developers',
      description: 'A space for indie game developers to share resources, get feedback, and find team members.',
      image: '/placeholder.svg',
      members: 2341,
      posts: 1234,
      category: 'Gaming',
      tags: ['Game Dev', 'Unity', 'Unreal', 'Indie'],
      isMember: true,
      lastActivity: '1 day ago'
    },
    {
      id: '4',
      name: 'Creative Writers Guild',
      description: 'Share your stories, get feedback, and connect with other writers in this supportive community.',
      image: '/placeholder.svg',
      members: 987,
      posts: 567,
      category: 'Writing',
      tags: ['Writing', 'Fiction', 'Poetry', 'Feedback'],
      isMember: false,
      lastActivity: '3 days ago'
    }
  ];

  const communities: Community[] = transformedCommunities.length > 0 ? transformedCommunities : sampleCommunities;

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = searchQuery 
      ? community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = selectedCategory
      ? community.category === selectedCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });

  const featuredCommunities = communities.filter(c => c.new);
  const joinedCommunities = communities.filter(c => c.isMember);

  const handleCommunityClick = (community: Community) => {
    setSelectedCommunity(community);
  };

  const handleViewFullProfile = (communityId: string) => {
    navigate(`/community/${communityId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
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
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    My Communities
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Featured
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Moderation
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
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
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

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredCommunities.map((community) => (
                viewMode === 'grid' ? (
                  <CommunityCard key={community.id} community={community} />
                ) : (
                  <CommunityListItem key={community.id} community={community} />
                )
              ))}
            </div>
          </div>
        </div>

        {/* Community Preview Modal */}
        <Dialog open={!!selectedCommunity} onOpenChange={() => setSelectedCommunity(null)}>
          <DialogContent className="max-w-2xl">
            {selectedCommunity && (
              <>
                <DialogHeader>
                  <DialogTitle>Community Preview</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedCommunity.image} />
                      <AvatarFallback>{selectedCommunity.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedCommunity.name}</h2>
                      <p className="text-muted-foreground">{selectedCommunity.category}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{selectedCommunity.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCommunity.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Members</p>
                        <p className="text-lg font-semibold">{selectedCommunity.members}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Posts</p>
                        <p className="text-lg font-semibold">{selectedCommunity.posts}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setSelectedCommunity(null)}>
                      Close
                    </Button>
                    <Button onClick={() => handleViewFullProfile(selectedCommunity.id)}>
                      View Full Profile
                    </Button>
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

interface CommunityProps {
  community: Community;
}

const CommunityCard = ({ community }: CommunityProps) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={community.image} />
              <AvatarFallback>{community.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{community.name}</CardTitle>
              <CardDescription>{community.category}</CardDescription>
            </div>
          </div>
          {community.isMember && (
            <Badge variant="secondary">Member</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{community.members}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{community.posts}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{community.lastActivity}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant={community.isMember ? "outline" : "default"}
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            if (community.isMember) {
              // Handle leave community
            } else {
              // Handle join community
            }
          }}
        >
          {community.isMember ? "Leave Community" : "Join Community"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const CommunityListItem = ({ community }: CommunityProps) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={community.image} />
            <AvatarFallback>{community.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{community.name}</h3>
              {community.isMember && (
                <Badge variant="secondary">Member</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{community.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{community.members}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{community.posts}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{community.lastActivity}</span>
              </div>
            </div>
          </div>
          <Button 
            variant={community.isMember ? "outline" : "default"}
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              if (community.isMember) {
                // Handle leave community
              } else {
                // Handle join community
              }
            }}
          >
            {community.isMember ? "Leave Community" : "Join Community"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Communities;
