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

interface Community {
  id: string | number;
  name: string;
  description: string;
  members: number;
  posts: number;
  image: string;
  joined: boolean;
  new: boolean;
  lastActivity: string;
  category: string;
}

const COMMUNITY_CATEGORIES = [
  'Arts', 'Music', 'Film', 'Dance', 'Theater', 'Writing', 'Gaming'
] as const;

const Communities = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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
    category: community.category || 'General'
  })) || [];

  const sampleCommunities: Community[] = [
    {
      id: 1,
      name: "Digital Artists Collective",
      description: "A community for digital artists to collaborate and share work",
      members: 234,
      posts: 567,
      image: "/placeholder.svg",
      joined: true,
      new: true,
      lastActivity: "2 hours ago",
      category: "Arts"
    },
    {
      id: 2,
      name: "Sound Engineers Hub",
      description: "Production techniques, gear talk, and industry insights",
      members: 198,
      posts: 432,
      image: "/placeholder.svg",
      joined: true,
      new: false,
      lastActivity: "1 day ago",
      category: "Music"
    },
    {
      id: 3,
      name: "Performance Artists Network",
      description: "Connect with performance artists from around the world",
      members: 156,
      posts: 310,
      image: "/placeholder.svg",
      joined: false,
      new: false,
      lastActivity: "3 days ago",
      category: "Performance"
    },
    {
      id: 4,
      name: "Film Creators Collective",
      description: "For filmmakers, cinematographers, and film enthusiasts",
      members: 321,
      posts: 650,
      image: "/placeholder.svg",
      joined: false,
      new: true,
      lastActivity: "5 hours ago",
      category: "Film"
    },
    {
      id: 5,
      name: "Urban Dance Crew",
      description: "Street dance, urban choreography, and dance battles",
      members: 245,
      posts: 520,
      image: "/placeholder.svg",
      joined: false,
      new: false,
      lastActivity: "1 week ago",
      category: "Dance"
    },
    {
      id: 6,
      name: "Indie Game Developers",
      description: "Support network for independent game creators",
      members: 432,
      posts: 789,
      image: "/placeholder.svg",
      joined: true,
      new: false,
      lastActivity: "12 hours ago",
      category: "Gaming"
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
  const joinedCommunities = communities.filter(c => c.joined);

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
              <Tabs defaultValue="all" className="w-full">
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
          {community.new && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              New
            </Badge>
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
            <CalendarDays className="h-4 w-4" />
            <span>{community.lastActivity}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant={community.joined ? "secondary" : "default"}
          className="w-full"
        >
          {community.joined ? "Joined" : "Join Community"}
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
              {community.new && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  New
                </Badge>
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
                <CalendarDays className="h-4 w-4" />
                <span>{community.lastActivity}</span>
              </div>
            </div>
          </div>
          <Button 
            variant={community.joined ? "secondary" : "default"}
            className="shrink-0"
          >
            {community.joined ? "Joined" : "Join Community"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Communities;
