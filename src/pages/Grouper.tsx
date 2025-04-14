
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Folder, Package, Users, Calendar, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GrouperCard from '@/components/grouper/GrouperCard';
import SavedItemsTracker from '@/components/marketplace/SavedItemsTracker';
import EventComponentGroups from '@/components/events/EventComponentGroups';
import { ContentItemProps } from '@/types/content';

const Grouper = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Sample data for demonstration
  const savedGroups = [
    {
      id: '1',
      name: 'Jazz Festival Resources',
      type: 'resource' as const,
      count: 12,
      createdAt: '2025-04-10T14:30:00Z'
    },
    {
      id: '2',
      name: 'Art Exhibition Team',
      type: 'community' as const,
      count: 8,
      createdAt: '2025-04-08T10:15:00Z'
    },
    {
      id: '3',
      name: 'Summer Concert Series',
      type: 'event' as const,
      count: 5,
      createdAt: '2025-04-05T16:45:00Z'
    }
  ];

  const recentGroups = savedGroups.slice(0, 2);

  // This is just for demo purposes - in a real implementation we'd use the actual components
  const handleApplyGroup = (group: any) => {
    console.log('Applying group:', group);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Grouper</h1>
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search groups..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Group
            </Button>
          </div>
        </div>

        <Tabs defaultValue="saved" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="saved">
              <Folder className="mr-2 h-4 w-4" />
              Saved Groups
            </TabsTrigger>
            <TabsTrigger value="components">
              <Package className="mr-2 h-4 w-4" />
              Event Components
            </TabsTrigger>
            <TabsTrigger value="collections">
              <Tag className="mr-2 h-4 w-4" />
              Collections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GrouperCard 
                title="Recent Groups" 
                description="Your recently accessed groups"
                items={recentGroups}
                onViewAll={() => console.log('View all recent groups')}
              />
              
              <GrouperCard 
                title="Resource Groups" 
                description="Organized collections of resources"
                items={savedGroups.filter(g => g.type === 'resource')}
                onViewAll={() => console.log('View all resource groups')}
              />
              
              <GrouperCard 
                title="Event Groups" 
                description="Components for event planning"
                items={savedGroups.filter(g => g.type === 'event')}
                onViewAll={() => console.log('View all event groups')}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Saved Groups</CardTitle>
                <CardDescription>Manage all your organized collections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedGroups.map(group => (
                    <Card key={group.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{group.name}</CardTitle>
                          {group.type === 'resource' && <Package className="h-4 w-4 text-muted-foreground" />}
                          {group.type === 'community' && <Users className="h-4 w-4 text-muted-foreground" />}
                          {group.type === 'event' && <Calendar className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <CardDescription className="text-xs">
                          Created {new Date(group.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="capitalize">
                            {group.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {group.count} items
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="components">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Component Groups</CardTitle>
                    <CardDescription>Save and manage sets of event components</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EventComponentGroups
                      selectedArtists={[]}
                      selectedVenues={[]}
                      selectedResources={[]}
                      selectedBrands={[]}
                      selectedCommunities={[]}
                      onApplyGroup={handleApplyGroup}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <SavedItemsTracker />
            </div>
          </TabsContent>
          
          <TabsContent value="collections">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coming Soon</CardTitle>
                  <CardDescription>
                    Enhanced collection functionality is under development
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <Folder className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <p className="text-muted-foreground">
                    More powerful collection tools will be available soon!
                  </p>
                </CardContent>
              </Card>
              
              <SavedItemsTracker />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Grouper;
