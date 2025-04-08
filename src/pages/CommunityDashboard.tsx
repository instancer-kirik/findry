import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, Video, MapPin, Clock, MessageSquare, Settings, Bell } from 'lucide-react';
import { useCommunities } from '@/hooks/use-communities';
import { useAuth } from '@/hooks/use-auth';
import CommunityForum from '@/components/communities/CommunityForum';
import CommunityCalendar from '@/components/communities/CommunityCalendar';
import CommunityEvents from '@/components/communities/CommunityEvents';
import CreateEventModal from '@/components/communities/CreateEventModal';
import { toast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const CommunityDashboard = () => {
  const { id: communityId } = useParams<{ id: string }>();
  const [selectedTab, setSelectedTab] = useState('overview');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { 
    useGetCommunity, 
    useJoinCommunity, 
    useLeaveCommunity 
  } = useCommunities();

  const { data: community, isLoading } = useGetCommunity(communityId);
  const joinCommunity = useJoinCommunity();
  const leaveCommunity = useLeaveCommunity();

  const handleJoinCommunity = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to join communities',
      });
      return;
    }
    
    if (communityId) {
      joinCommunity.mutate(communityId, {
        onSuccess: () => {
          // Update local state immediately for a more responsive UI
          queryClient.setQueryData(['community', communityId], (oldData: any) => {
            if (oldData) {
              return {
                ...oldData,
                isMember: true,
                members_count: (oldData.members_count || 0) + 1
              };
            }
            return oldData;
          });
        }
      });
    }
  };

  const handleLeaveCommunity = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to leave communities',
      });
      return;
    }
    
    if (communityId) {
      leaveCommunity.mutate(communityId, {
        onSuccess: () => {
          // Update local state immediately for a more responsive UI
          queryClient.setQueryData(['community', communityId], (oldData: any) => {
            if (oldData) {
              return {
                ...oldData,
                isMember: false,
                members_count: Math.max((oldData.members_count || 1) - 1, 0)
              };
            }
            return oldData;
          });
        }
      });
    }
  };

  const handleRefreshData = () => {
    if (communityId) {
      queryClient.invalidateQueries({ queryKey: ['community', communityId] });
      queryClient.invalidateQueries({ queryKey: ['community-events', communityId] });
      queryClient.invalidateQueries({ queryKey: ['community-posts', communityId] });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="h-24 w-full bg-muted animate-pulse rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (!community) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Community not found</h1>
          <p className="text-muted-foreground mb-6">
            The community you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Community Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={community.image_url || undefined} />
                <AvatarFallback>{community.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{community.name}</h1>
                <p className="text-muted-foreground">{community.category || 'General'}</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">{community.description || 'No description available'}</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant={community.isMember ? "outline" : "default"}
              onClick={community.isMember ? handleLeaveCommunity : handleJoinCommunity}
              disabled={joinCommunity.isPending || leaveCommunity.isPending}
            >
              {joinCommunity.isPending || leaveCommunity.isPending 
                ? 'Processing...' 
                : community.isMember 
                  ? "Leave Community" 
                  : "Join Community"}
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            {user?.id === community.created_by && (
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{community.members_count || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{community.posts_count || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Events</CardTitle>
                    <CreateEventModal communityId={communityId} onSuccess={handleRefreshData} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 overflow-auto">
                    <CommunityCalendar communityId={communityId || ''} />
                  </div>
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTab('calendar')}
                    >
                      View Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 overflow-auto">
                    {/* We'll only show a preview of the forum here */}
                    <Card className="mb-2">
                      <CardHeader className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">User123</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-1 px-3">
                        <p className="text-sm line-clamp-2">
                          Has anyone worked on integrating the new API with React? I'm having trouble with authentication.
                        </p>
                      </CardContent>
                      <CardFooter className="py-1 px-3 text-xs text-muted-foreground">
                        5 replies
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>A</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Admin</p>
                            <p className="text-xs text-muted-foreground">Yesterday</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-1 px-3">
                        <p className="text-sm line-clamp-2">
                          Welcome to our community! Introduce yourself and let us know what you're working on.
                        </p>
                      </CardContent>
                      <CardFooter className="py-1 px-3 text-xs text-muted-foreground">
                        12 replies
                      </CardFooter>
                    </Card>
                  </div>
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTab('forum')}
                    >
                      View All Discussions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <CommunityEvents communityId={communityId || ''} />
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Community Calendar</CardTitle>
                  <CreateEventModal communityId={communityId} onSuccess={handleRefreshData} />
                </div>
              </CardHeader>
              <CardContent>
                <CommunityCalendar communityId={communityId || ''} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forum">
            <CommunityForum communityId={communityId || ''} />
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardDescription>People who have joined this community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Member listing coming soon</h3>
                  <p className="text-muted-foreground mt-2">
                    We're working on the member directory feature.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CommunityDashboard; 