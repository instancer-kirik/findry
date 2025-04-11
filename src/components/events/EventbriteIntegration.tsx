
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/hooks/use-auth";
import { useEventbrite } from '@/hooks/use-eventbrite';
import { ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EventbriteIntegration: React.FC = () => {
  const { user } = useAuth();
  const { 
    isAuthenticated, 
    getAuthUrl, 
    disconnectEventbrite 
  } = useEventbrite(user?.id);
  const [authenticating, setAuthenticating] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect your Eventbrite account"
      });
      return;
    }

    try {
      setAuthenticating(true);
      const authUrl = await getAuthUrl(user.id);
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error("Could not generate Eventbrite authentication URL");
      }
    } catch (error) {
      console.error("Error connecting to Eventbrite:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Eventbrite. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAuthenticating(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;
    
    try {
      await disconnectEventbrite(user.id);
      toast({
        title: "Success",
        description: "Eventbrite integration disconnected successfully"
      });
    } catch (error) {
      console.error("Error disconnecting Eventbrite:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect Eventbrite integration",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-orange-100">
            <img 
              src="https://www.eventbrite.com/favicon.ico" 
              alt="Eventbrite" 
              className="h-6 w-6"
            />
          </div>
          
          <div>
            <h3 className="font-medium">Eventbrite Integration</h3>
            <p className="text-sm text-muted-foreground">
              {isAuthenticated 
                ? "Your Eventbrite account is connected" 
                : "Connect to import and manage your Eventbrite events"}
            </p>
          </div>
        </div>
        
        {isAuthenticated ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={authenticating}
          >
            {authenticating ? "Connecting..." : "Connect"}
          </Button>
        )}
      </div>
      
      {isAuthenticated && (
        <div className="space-y-3">
          <div className="border-t pt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => window.location.href = "/eventbrite/orders"}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Eventbrite Orders
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventbriteIntegration;
