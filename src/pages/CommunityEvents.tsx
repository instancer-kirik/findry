import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Trophy, Video, MapPin, Clock } from 'lucide-react';
import CreateEventModal from '@/components/communities/CreateEventModal';

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
  community: {
    name: string;
    image: string;
  };
}

const CommunityEvents = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  // Sample data - replace with actual data from your backend
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
      maxParticipants: 20,
      community: {
        name: 'Digital Artists Collective',
        image: '/placeholder.svg'
      }
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
      maxParticipants: 100,
      community: {
        name: 'Sound Engineers Hub',
        image: '/placeholder.svg'
      }
    },
    {
      id: '3',
      title: 'Game Design Contest',
      description: 'Showcase your game design skills in our monthly contest',
      type: 'contest',
      date: '2024-04-01',
      time: '00:00',
      location: 'Online',
      participants: 28,
      maxParticipants: 50,
      community: {
        name: 'Indie Game Developers',
        image: '/placeholder.svg'
      }
    }
  ];

  const filteredEvents = selectedTab === 'all' 
    ? events 
    : events.filter(event => event.type === selectedTab);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Community Events</h1>
          <CreateEventModal onSuccess={() => {
            // TODO: Implement refresh logic
          }} />
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="meeting">Meetings</TabsTrigger>
            <TabsTrigger value="contest">Contests</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={event.community.image} />
                        <AvatarFallback>{event.community.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription>{event.community.name}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
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
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">
                    {event.type === 'contest' ? 'Enter Contest' : 'Join Event'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CommunityEvents; 