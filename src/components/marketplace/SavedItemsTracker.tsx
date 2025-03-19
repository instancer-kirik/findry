
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Heart, Bookmark, Clock, User, Building, Music } from 'lucide-react';

const SavedItemsTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("liked");
  
  // Sample saved items
  const likedItems = [
    { id: "1", name: "Elena Rivera", type: "artist" },
    { id: "2", name: "Summit Beats", type: "brand" },
    { id: "3", name: "The Acoustic Lounge", type: "venue" }
  ];
  
  const savedItems = [
    { id: "1", name: "Jazz Corner", type: "venue" },
    { id: "2", name: "Rhythm Collective", type: "brand" }
  ];
  
  const applications = [
    { id: "1", name: "Electric Stadium", type: "venue", status: "pending" },
    { id: "2", name: "SoundWave Media", type: "brand", status: "accepted" }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'artist':
        return <Music className="h-4 w-4" />;
      case 'brand':
        return <Building className="h-4 w-4" />;
      case 'venue':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'accepted':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="liked" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="liked" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Liked</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Applied</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="liked" className="pt-4">
            <div className="space-y-2">
              {likedItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                </div>
              ))}
              {likedItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No liked items yet.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="pt-4">
            <div className="space-y-2">
              {savedItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                </div>
              ))}
              {savedItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No saved items yet.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="applications" className="pt-4">
            <div className="space-y-2">
              {applications.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className={`text-xs capitalize ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))}
              {applications.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No applications yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SavedItemsTracker;
