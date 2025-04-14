import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Trophy, Video, MapPin, Clock } from 'lucide-react';
import CreateEventModal from '@/components/communities/CreateEventModal';
import CommunityEvents from '@/components/communities/CommunityEvents';

const CommunityEventsPage = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Community Events</h1>
          <CreateEventModal onSuccess={() => {
            // Refresh will happen via the components
          }} />
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Communities</TabsTrigger>
            <TabsTrigger value="my">My Communities</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <CommunityEvents communityId="all" />
          </TabsContent>
          
          <TabsContent value="my">
            <CommunityEvents communityId="user" />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CommunityEventsPage; 