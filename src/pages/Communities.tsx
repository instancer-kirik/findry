
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, Globe, CalendarDays } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Communities = () => {
  // Sample data - in a real app this would come from an API
  const communities = [
    {
      id: 1,
      name: "Digital Artists Collective",
      description: "A community for digital artists to collaborate and share work",
      members: 234,
      posts: 567,
      image: "/placeholder.svg",
      joined: true,
      new: true
    },
    {
      id: 2,
      name: "Sound Engineers Hub",
      description: "Production techniques, gear talk, and industry insights",
      members: 198,
      posts: 432,
      image: "/placeholder.svg",
      joined: true,
      new: false
    },
    {
      id: 3,
      name: "Performance Artists Network",
      description: "Connect with performance artists from around the world",
      members: 156,
      posts: 310,
      image: "/placeholder.svg",
      joined: false,
      new: false
    },
    {
      id: 4,
      name: "Film Creators Collective",
      description: "For filmmakers, cinematographers, and film enthusiasts",
      members: 321,
      posts: 650,
      image: "/placeholder.svg",
      joined: false,
      new: true
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Communities</h1>
          <Button className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Create Community
          </Button>
        </div>

        <Tabs defaultValue="my-communities" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="my-communities">My Communities</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-communities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities
                .filter(c => c.joined)
                .map(community => (
                  <CommunityCard key={community.id} community={community} />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="discover" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities
                .filter(c => !c.joined)
                .map(community => (
                  <CommunityCard key={community.id} community={community} />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="recommended" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities
                .filter(c => c.new)
                .map(community => (
                  <CommunityCard key={community.id} community={community} />
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
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
  }
}

const CommunityCard = ({ community }: CommunityProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={community.image} alt={community.name} />
              <AvatarFallback>{community.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{community.name}</CardTitle>
              {community.new && <Badge className="bg-orange-500 mt-1">New</Badge>}
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
      </CardContent>
      <CardFooter className="bg-muted/50 pt-2">
        <Button variant={community.joined ? "outline" : "default"} className="w-full">
          {community.joined ? "View Community" : "Join Community"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Communities;
