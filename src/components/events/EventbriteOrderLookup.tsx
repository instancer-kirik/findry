import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, TicketCheck, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EventbriteOrderLookupProps {
  eventId?: string;
  eventbriteId?: string;
  className?: string;
}

interface OrderDetails {
  orderId: string;
  name: string;
  email: string;
  ticketCount: number;
  orderDate: string;
  tickets: {
    id: string;
    type: string;
    name: string;
    status: 'valid' | 'used' | 'cancelled';
  }[];
}

const EventbriteOrderLookup: React.FC<EventbriteOrderLookupProps> = ({
  eventId,
  eventbriteId,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email && !orderId) {
      toast({
        title: "Input required",
        description: "Please enter your email or order ID",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, we would make an API call to Eventbrite
      // For demo purposes, we'll just simulate a successful lookup with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if we have a "valid" mock order ID or email
      if (orderId === 'ORDER-123456789' || email === 'test@example.com') {
        setOrderDetails({
          orderId: 'ORDER-123456789',
          name: 'John Doe',
          email: 'test@example.com',
          ticketCount: 2,
          orderDate: new Date().toISOString(),
          tickets: [
            {
              id: 'TICKET-1',
              type: 'General Admission',
              name: 'John Doe',
              status: 'valid'
            },
            {
              id: 'TICKET-2',
              type: 'General Admission',
              name: 'Jane Doe',
              status: 'valid'
            }
          ]
        });
      } else {
        setError('No order found with the provided information');
      }
    } catch (error) {
      console.error('Error looking up order:', error);
      setError('Failed to look up order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = () => {
    // In a real implementation, this would make an API call to Eventbrite
    toast({
      title: "Cancel request submitted",
      description: "Your cancellation request has been submitted for review",
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TicketCheck className="h-5 w-5" />
          Lookup Your Order
        </CardTitle>
        <CardDescription>
          Check your ticket status or request a refund
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="border-t flex-1"></div>
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="border-t flex-1"></div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input 
              id="orderId" 
              placeholder="Enter your order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                Looking up...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Lookup Order
              </>
            )}
          </Button>
        </form>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {orderDetails && (
          <div className="mt-6 space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="font-medium">Order Details</h3>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-medium">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{orderDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{orderDetails.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tickets:</span>
                  <span>{orderDetails.ticketCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span>{new Date(orderDetails.orderDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="tickets">
                <AccordionTrigger>Tickets</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {orderDetails.tickets.map((ticket) => (
                      <div key={ticket.id} className="rounded-md border p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{ticket.name}</p>
                            <p className="text-sm text-muted-foreground">{ticket.type}</p>
                          </div>
                          <div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ticket.status === 'valid' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : ticket.status === 'used'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Button 
              variant="outline" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={handleCancelOrder}
            >
              Request Cancellation & Refund
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventbriteOrderLookup; 