import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, Globe, CalendarDays, Search, UserPlus, Shield, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateCommunityModal from '@/components/communities/CreateCommunityModal';
import { useToast } from '@/hooks/use-toast';

const Communities = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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

  const transformedCommunities = communitiesData?.map(community => ({
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

  const communities = transformedCommunities.length > 0 ? transformedCommunities : [
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

  const filteredCommunities = searchQuery 
    ? communities.filter(community => 
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : communities;

  const featuredCommunities = communities.filter(c => c.new);
  const joinedCommunities = communities.filter(c => c.joined);
  const suggestedCommunities = communities.filter(c => !c.joined).slice(0, 3);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Communities</span>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <UserPlus className="h-4 w-4" />
                  </Button>
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
                    <Globe className="mr-2 h-4 w-4" />
                    Explore
                  </Button>
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
              <CardFooter>
                <CreateCommunityModal onSuccess={refetch} />
              </CardFooter>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Arts</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Music</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Film</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Dance</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Theater</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Writing</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">Gaming</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="featured">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="my-communities">My Communities</TabsTrigger>
                  <TabsTrigger value="discover">Discover</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={viewMode === 'grid' ? 'bg-muted' : ''} 
                    onClick={() => setViewMode('grid')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid-2x2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/></svg>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={viewMode === 'list' ? 'bg-muted' : ''} 
                    onClick={() => setViewMode('list')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">All Communities</h2>
                  <CreateCommunityModal 
                    trigger={
                      <Button>
                        <Users className="mr-2 h-4 w-4" />
                        Create Community
                      </Button>
                    } 
                    onSuccess={refetch} 
                  />
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <>
                    <TabsContent value="featured">
                      <h2 className="text-2xl font-bold mb-4">Featured Communities</h2>
                      {featuredCommunities.length > 0 ? (
                        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}`}>
                          {featuredCommunities.map(community => (
                            viewMode === 'grid' 
                              ? <CommunityCard key={community.id} community={community} /> 
                              : <CommunityListItem key={community.id} community={community} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No featured communities yet. Create one!</p>
                      )}
                      
                      <h2 className="text-2xl font-bold my-6">Suggested For You</h2>
                      {suggestedCommunities.length > 0 ? (
                        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}`}>
                          {suggestedCommunities.map(community => (
                            viewMode === 'grid' 
                              ? <CommunityCard key={community.id} community={community} /> 
                              : <CommunityListItem key={community.id} community={community} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No suggested communities available.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="my-communities">
                      <h2 className="text-2xl font-bold mb-4">My Communities</h2>
                      {joinedCommunities.length > 0 ? (
                        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}`}>
                          {joinedCommunities.map(community => (
                            viewMode === 'grid' 
                              ? <CommunityCard key={community.id} community={community} /> 
                              : <CommunityListItem key={community.id} community={community} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                          <h3 className="text-xl font-medium mb-2">You haven't joined any communities yet</h3>
                          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Join communities to connect with people who share your interests, or create your own!
                          </p>
                          <CreateCommunityModal
                            trigger={<Button size="lg">Create Your First Community</Button>}
                            onSuccess={refetch}
                          />
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="discover">
                      <h2 className="text-2xl font-bold mb-4">Discover Communities</h2>
                      {filteredCommunities.filter(c => !c.joined).length > 0 ? (
                        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}`}>
                          {filteredCommunities.filter(c => !c.joined).map(community => (
                            viewMode === 'grid' 
                              ? <CommunityCard key={community.id} community={community} /> 
                              : <CommunityListItem key={community.id} community={community} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No communities found matching your search criteria.</p>
                      )}
                    </TabsContent>
                  </>
                )}
              </div>
              
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Start your own community</h2>
                <Card className="bg-muted/30">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="bg-background rounded-full p-6">
                        <Users className="h-12 w-12 text-primary" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg font-medium mb-2">Create a community today</h3>
                        <p className="text-muted-foreground mb-4">
                          Build your own community around your interests, passions, or projects. Connect with like-minded people and start meaningful conversations.
                        </p>
                        <CreateCommunityModal
                          trigger={<Button>Get Started</Button>}
                          onSuccess={refetch}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface CommunityProps {
  community: {
    id: number;
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
}

const CommunityCard = ({ community }: CommunityProps) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={community.image} alt={community.name} />
              <AvatarFallback>{community.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {community.name}
                {community.new && <Badge className="bg-orange-500 text-white">New</Badge>}
              </CardTitle>
              <Badge variant="outline">{community.category}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{community.description}</CardDescription>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {community.members} members
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            {community.posts} posts
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Last active: {community.lastActivity}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 pt-2">
        <Button variant={community.joined ? "outline" : "default"} className="w-full">
          {community.joined ? "View Community" : "Join Community"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const CommunityListItem = ({ community }: CommunityProps) => {
  return (
    <Card>
      <div className="flex items-center p-4">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={community.image} alt={community.name} />
          <AvatarFallback>{community.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{community.name}</h3>
            {community.new && <Badge className="bg-orange-500 text-white">New</Badge>}
            <Badge variant="outline">{community.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{community.description}</p>
          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {community.members}
            </span>
            <span className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              {community.posts}
            </span>
            <span>Last active: {community.lastActivity}</span>
          </div>
        </div>
        
        <Button variant={community.joined ? "outline" : "default"} className="ml-4" size="sm">
          {community.joined ? "View" : "Join"}
        </Button>
      </div>
    </Card>
  );
};

export default Communities;
