
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventbrite } from '@/hooks/use-eventbrite';
import { toast } from 'sonner';

export const EventbriteIntegration = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { 
    useHasIntegrated, 
    useDisconnectEventbrite, 
    useImportEvents 
  } = useEventbrite();
  
  // Use the hooks
  const { data: isIntegrated, isLoading: isIntegratedLoading } = useHasIntegrated();
  const disconnectMutation = useDisconnectEventbrite();
  const importEventsMutation = useImportEvents();

  // Create real Eventbrite OAuth URL
  const handleConnect = () => {
    // In a real app, you would redirect to the Eventbrite OAuth page
    const clientId = import.meta.env.VITE_EVENTBRITE_CLIENT_ID || 'mock-client-id';
    const redirectUri = `${window.location.origin}/eventbrite-callback`;
    
    // Redirect to authorization page
    window.location.href = `https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  };

  const handleDisconnect = async () => {
    try {
      await disconnectMutation.mutateAsync();
    } catch (error) {
      console.error('Error disconnecting from Eventbrite:', error);
      toast.error('Failed to disconnect from Eventbrite');
    }
  };

  const handleImportEvents = async () => {
    try {
      setIsImporting(true);
      await importEventsMutation.mutateAsync();
      toast.success('Events imported successfully!');
    } catch (error) {
      console.error('Error importing events:', error);
      toast.error('Failed to import events from Eventbrite');
    } finally {
      setIsImporting(false);
    }
  };

  if (isIntegratedLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Eventbrite Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eventbrite Integration</CardTitle>
      </CardHeader>
      <CardContent>
        {isIntegrated ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your account is connected to Eventbrite. You can import your events or disconnect your account.
            </p>
            
            <Tabs defaultValue="import">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="import">Import Events</TabsTrigger>
                <TabsTrigger value="disconnect">Disconnect</TabsTrigger>
              </TabsList>
              
              <TabsContent value="import" className="space-y-4 pt-4">
                <p className="text-sm">
                  Import your events from Eventbrite to manage them within our platform.
                </p>
                <Button 
                  onClick={handleImportEvents} 
                  disabled={isImporting || importEventsMutation.isPending}
                  className="w-full"
                >
                  {isImporting || importEventsMutation.isPending ? 'Importing...' : 'Import Events'}
                </Button>
              </TabsContent>
              
              <TabsContent value="disconnect" className="space-y-4 pt-4">
                <p className="text-sm">
                  Disconnecting will remove access to your Eventbrite account from our platform.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect} 
                  disabled={disconnectMutation.isPending}
                  className="w-full"
                >
                  {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect from Eventbrite'}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your Eventbrite account to import and manage your events directly from our platform.
            </p>
            <Button onClick={handleConnect} className="w-full">
              Connect to Eventbrite
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventbriteIntegration;
