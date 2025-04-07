import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ticket } from 'lucide-react';
import EventbriteOrderLookup from '@/components/events/EventbriteOrderLookup';
import EventbriteCheckoutWidget from '@/components/events/EventbriteCheckoutWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EventbriteOrders: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="ghost" 
              className="mb-2 -ml-4" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Ticket Management</h1>
            <p className="text-muted-foreground">Manage your Eventbrite tickets and orders</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="lookup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lookup">Look Up Order</TabsTrigger>
                <TabsTrigger value="upcoming">My Tickets</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lookup" className="mt-6">
                <EventbriteOrderLookup />
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Tickets</CardTitle>
                    <CardDescription>
                      View and manage your upcoming tickets
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Ticket className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No tickets found</h3>
                      <p className="text-muted-foreground mb-6">
                        You don't have any upcoming tickets. Sign in to your Eventbrite account to view your tickets.
                      </p>
                      <Button 
                        onClick={() => window.open('https://www.eventbrite.com/signin/', '_blank')}
                      >
                        Sign in to Eventbrite
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Purchase</CardTitle>
                <CardDescription>
                  Buy tickets for upcoming events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Summer Music Festival</h3>
                    <p className="text-sm text-muted-foreground mb-4">Jun 15, 2023 • Central Park</p>
                    <EventbriteCheckoutWidget
                      eventId="event-123"
                      eventbriteId="eb-123456789"
                      buttonVariant="outline"
                      buttonText="Get Tickets"
                    />
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Digital Art Workshop</h3>
                    <p className="text-sm text-muted-foreground mb-4">Jul 10, 2023 • Online</p>
                    <EventbriteCheckoutWidget
                      eventId="event-456"
                      eventbriteId="eb-987654321"
                      buttonVariant="outline"
                      buttonText="Get Tickets"
                    />
                  </div>
                  
                  <Button
                    variant="link"
                    className="text-sm w-full"
                    onClick={() => navigate('/events')}
                  >
                    Browse all events
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventbriteOrders; 