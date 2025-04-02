
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Gift, Plus, Check, X, Clock, MoreHorizontal, User, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface Offer {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  amount?: number;
  currency?: string;
  sender_id?: string;
  sender_name?: string;
  sender_avatar?: string;
  receiver_id?: string;
  receiver_name?: string;
  receiver_avatar?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  project_id?: string;
  project_name?: string;
}

// Mock data for initial development - will be replaced with Supabase data
const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Photography Session Offer',
    description: 'Looking for a professional photographer for a 3-hour product photoshoot. Will provide studio space and equipment.',
    status: 'pending',
    amount: 450,
    currency: 'USD',
    sender_id: 'user1',
    sender_name: 'Jane Cooper',
    sender_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    receiver_id: 'current_user',
    receiver_name: 'You',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    project_id: 'proj1',
    project_name: 'Summer Collection Launch'
  },
  {
    id: '2',
    title: 'Music Production Collaboration',
    description: 'Seeking a music producer to finalize 3 tracks for an upcoming EP. Need mixing and mastering expertise.',
    status: 'accepted',
    amount: 800,
    currency: 'USD',
    sender_id: 'current_user',
    sender_name: 'You',
    receiver_id: 'user2',
    receiver_name: 'Alex Morgan',
    receiver_avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
    expires_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    project_id: 'proj2',
    project_name: 'Sunset Beats EP'
  },
  {
    id: '3',
    title: 'Logo Design Request',
    description: 'Need a minimalist logo for a new coffee brand. Looking for clean, modern aesthetic.',
    status: 'declined',
    amount: 350,
    currency: 'USD',
    sender_id: 'user3',
    sender_name: 'Michael Brown',
    sender_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    receiver_id: 'current_user',
    receiver_name: 'You',
    expires_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    project_id: 'proj3',
    project_name: 'Roast Revival Branding'
  },
  {
    id: '4',
    title: 'Video Editing Project',
    description: 'Looking for someone to edit 15 minutes of footage for a promotional video.',
    status: 'pending',
    amount: 600,
    currency: 'USD',
    sender_id: 'current_user',
    sender_name: 'You',
    receiver_id: 'user4',
    receiver_name: 'Sarah Wilson',
    receiver_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    project_id: 'proj4',
    project_name: 'Product Launch Video'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'accepted': return 'bg-green-500';
    case 'declined': return 'bg-red-500';
    case 'expired': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'accepted': return <Check className="h-4 w-4" />;
    case 'declined': return <X className="h-4 w-4" />;
    case 'expired': return <Clock className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '',
    description: '',
    amount: 0,
    currency: 'USD',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // This would be replaced with actual Supabase data fetch in a real implementation
  useEffect(() => {
    // Simulating data loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOffers = (() => {
    switch (activeTab) {
      case 'sent':
        return offers.filter(offer => offer.sender_id === 'current_user');
      case 'received':
        return offers.filter(offer => offer.receiver_id === 'current_user');
      case 'pending':
        return offers.filter(offer => offer.status === 'pending');
      case 'accepted':
        return offers.filter(offer => offer.status === 'accepted');
      case 'declined':
        return offers.filter(offer => offer.status === 'declined');
      default:
        return offers;
    }
  })();

  const handleCreateOffer = () => {
    if (!newOffer.title) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    // In a real implementation, this would be a Supabase insert
    const createdAt = new Date().toISOString();
    const newOfferItem: Offer = {
      id: `offer_${Date.now()}`,
      title: newOffer.title!,
      description: newOffer.description,
      status: 'pending',
      amount: newOffer.amount,
      currency: newOffer.currency || 'USD',
      sender_id: 'current_user',
      sender_name: 'You',
      receiver_id: 'temp_receiver',
      receiver_name: 'Recipient Name',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: createdAt,
      updated_at: createdAt,
    };

    setOffers([newOfferItem, ...offers]);
    setIsCreateOfferOpen(false);
    setNewOffer({
      title: '',
      description: '',
      amount: 0,
      currency: 'USD',
    });
    
    toast({
      title: 'Success',
      description: 'Offer created successfully',
    });
  };

  const handleOfferAction = (id: string, action: 'accept' | 'decline') => {
    const updatedOffers = offers.map(offer => {
      if (offer.id === id) {
        return {
          ...offer,
          status: action === 'accept' ? 'accepted' : 'declined',
          updated_at: new Date().toISOString(),
        };
      }
      return offer;
    });
    
    setOffers(updatedOffers);
    
    toast({
      title: action === 'accept' ? 'Offer Accepted' : 'Offer Declined',
      description: action === 'accept' 
        ? 'You have successfully accepted the offer' 
        : 'You have declined the offer',
    });
  };

  const calculateTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const timeLeft = expiry.getTime() - now.getTime();
    
    if (timeLeft <= 0) return { expired: true, text: 'Expired' };
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return { 
        expired: false, 
        text: `${days}d ${hours}h left`,
        percentage: (timeLeft / (7 * 24 * 60 * 60 * 1000)) * 100, // Assuming 7 days total
      };
    }
    
    return { 
      expired: false, 
      text: `${hours}h left`,
      percentage: (timeLeft / (7 * 24 * 60 * 60 * 1000)) * 100,
    };
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Offers</h1>
          <Dialog open={isCreateOfferOpen} onOpenChange={setIsCreateOfferOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Offer</DialogTitle>
                <DialogDescription>
                  Create an offer to collaborate with other creatives
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newOffer.title || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                    placeholder="Offer title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOffer.description || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                    placeholder="Describe your offer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newOffer.amount || ''}
                      onChange={(e) => setNewOffer({ ...newOffer, amount: parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={newOffer.currency || 'USD'}
                      onValueChange={(value) => setNewOffer({ ...newOffer, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Recipient selection would go here in a full implementation */}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOfferOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOffer}>
                  Create Offer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Offers</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="declined">Declined</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="h-20 bg-muted rounded-t-lg"></CardHeader>
                    <CardContent className="pt-6">
                      <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                      <div className="h-3 bg-muted rounded mb-2 w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOffers.map((offer) => {
                  const isReceived = offer.receiver_id === 'current_user';
                  const isPending = offer.status === 'pending';
                  let timeRemaining = { expired: false, text: '', percentage: 100 };
                  
                  if (offer.expires_at) {
                    timeRemaining = calculateTimeRemaining(offer.expires_at);
                  }
                  
                  return (
                    <Card key={offer.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{offer.title}</CardTitle>
                          <div className="flex items-center">
                            <Badge variant={offer.status === 'pending' ? 'outline' : 'secondary'}
                              className="flex items-center gap-1 mr-2">
                              {getStatusIcon(offer.status)}
                              <span className="capitalize">{offer.status}</span>
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Schedule Meeting
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={isReceived ? offer.sender_avatar : offer.receiver_avatar} />
                              <AvatarFallback>{isReceived ? offer.sender_name?.charAt(0) : offer.receiver_name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-2">
                              <p className="text-sm font-medium">
                                {isReceived ? `From: ${offer.sender_name}` : `To: ${offer.receiver_name}`}
                              </p>
                            </div>
                          </div>
                          {offer.amount && (
                            <div className="ml-auto">
                              <Badge variant="secondary" className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />
                                {offer.amount} {offer.currency}
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {offer.description || 'No description provided'}
                        </p>
                        
                        {offer.project_name && (
                          <div className="mb-4">
                            <Badge variant="outline" className="text-xs">
                              Project: {offer.project_name}
                            </Badge>
                          </div>
                        )}
                        
                        {offer.status === 'pending' && offer.expires_at && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Offer expires in:</span>
                              <span className={timeRemaining.expired ? 'text-destructive' : ''}>
                                {timeRemaining.text}
                              </span>
                            </div>
                            <Progress 
                              value={timeRemaining.percentage} 
                              className={`h-1 ${timeRemaining.percentage < 30 ? 'bg-red-200' : 'bg-slate-200'}`}
                            />
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(offer.created_at).toLocaleDateString()}
                        </div>
                        
                        {isReceived && isPending && (
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOfferAction(offer.id, 'decline')}
                            >
                              Decline
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleOfferAction(offer.id, 'accept')}
                            >
                              Accept
                            </Button>
                          </div>
                        )}
                        
                        {(!isReceived || !isPending) && (
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-medium">No offers found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {activeTab === 'all'
                    ? "You don't have any offers yet. Click 'Create Offer' to get started."
                    : `You don't have any ${activeTab} offers.`}
                </p>
                <Button className="mt-4" onClick={() => setIsCreateOfferOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Offer
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OffersPage;
