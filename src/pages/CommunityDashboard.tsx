import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, Video, MapPin, Clock, MessageSquare, Settings, Bell } from 'lucide-react';
import CreateEventModal from '@/components/communities/CreateEventModal';

interface Community {
  id: string;
  name: string;
  description: string;
  image: string;
  members: number;
  events: number;
  posts: number;
  category: string;
  tags: string[];
  isMember: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'meeting' | 'contest' | 'event';
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
}

const CommunityDashboard = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Sample data - replace with actual data from your backend
  const community: Community = {
    id: id || '1',
    name: 'Digital Artists Collective',
    description: 'A community for digital artists to share their work, get feedback, and collaborate on projects.',
    image: '/placeholder.svg',
    members: 1234,
    events: 45,
    posts: 789,
    category: 'Art & Design',
    tags: ['Digital Art', 'Illustration', 'Design', 'Collaboration'],
    isMember: true
  };

  const events: Event[] = [
    {
      id: '1',
      title: 'Digital Art Workshop',
      description: 'Join us for a hands-on workshop on digital art techniques',
      type: 'event',
      date: '2024-03-25',
      time: '14:00',
      location: 'Virtual',
      participants: 12,
      maxParticipants: 20
    },
    {
      id: '2',
      title: 'Monthly Community Meeting',
      description: 'Regular community meeting to discuss upcoming projects',
      type: 'meeting',
      date: '2024-03-28',
      time: '19:00',
      location: 'Virtual',
      participants: 45,
      maxParticipants: 100
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Community Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={community.image} />
                <AvatarFallback>{community.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{community.name}</h1>
                <p className="text-muted-foreground">{community.category}</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">{community.description}</p>
            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant={community.isMember ? "outline" : "default"}>
              {community.isMember ? "Leave Community" : "Join Community"}
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
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
              <div className="text-2xl font-bold">{community.members}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{community.events}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{community.posts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Events</CardTitle>
                  <CreateEventModal onSuccess={() => {
                    // TODO: Implement refresh logic
                  }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-start justify-between p-4 rounded-lg border">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {event.participants}/{event.maxParticipants}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add recent activity items here */}
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Events</CardTitle>
                  <CreateEventModal onSuccess={() => {
                    // TODO: Implement refresh logic
                  }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <Card key={event.id} className="group hover:shadow-lg transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{event.participants}/{event.maxParticipants} participants</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardContent className="p-4 pt-0">
                        <Button className="w-full">
                          {event.type === 'contest' ? 'Enter Contest' : 'Join Event'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Member list coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Posts coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CommunityDashboard; 