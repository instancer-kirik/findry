
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Share, Mail, Users, Link, Copy, Check, Send } from 'lucide-react';
import { toast } from 'sonner';

interface EventSharingDialogProps {
  eventName: string;
  eventDate?: string;
  eventId: string;
}

interface FriendOption {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface CircleOption {
  id: string;
  name: string;
  memberCount: number;
  avatar?: string;
}

const EventSharingDialog: React.FC<EventSharingDialogProps> = ({
  eventName,
  eventDate,
  eventId
}) => {
  const [copied, setCopied] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailSubject, setEmailSubject] = useState(`Join me at ${eventName}`);
  const [emailMessage, setEmailMessage] = useState(
    `Hi there,\n\nI'd like to invite you to ${eventName}${eventDate ? ` on ${eventDate}` : ''}.\n\nClick the link below to view the event details and RSVP:\n\n[Event Link]\n\nHope to see you there!`
  );
  
  // Mock data for friends and circles
  const [friends] = useState<FriendOption[]>([
    { id: 'f1', name: 'Alex Johnson', email: 'alex@example.com' },
    { id: 'f2', name: 'Jamie Smith', email: 'jamie@example.com' },
    { id: 'f3', name: 'Morgan Williams', email: 'morgan@example.com' },
    { id: 'f4', name: 'Taylor Brown', email: 'taylor@example.com' },
  ]);
  
  const [circles] = useState<CircleOption[]>([
    { id: 'c1', name: 'Close Friends', memberCount: 8 },
    { id: 'c2', name: 'Work Colleagues', memberCount: 12 },
    { id: 'c3', name: 'Artist Network', memberCount: 24 },
    { id: 'c4', name: 'Local Community', memberCount: 35 },
  ]);
  
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedCircles, setSelectedCircles] = useState<string[]>([]);
  
  const eventUrl = `${window.location.origin}/events/${eventId}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId) 
        : [...prev, friendId]
    );
  };
  
  const handleCircleToggle = (circleId: string) => {
    setSelectedCircles(prev => 
      prev.includes(circleId) 
        ? prev.filter(id => id !== circleId) 
        : [...prev, circleId]
    );
  };
  
  const handleSendFriendInvites = () => {
    if (selectedFriends.length === 0) {
      toast.error('Please select at least one friend');
      return;
    }
    
    // In a real app, this would send the invites
    toast.success(`Invites sent to ${selectedFriends.length} friends`);
    setSelectedFriends([]);
  };
  
  const handleSendCircleInvites = () => {
    if (selectedCircles.length === 0) {
      toast.error('Please select at least one circle');
      return;
    }
    
    // Count total members
    const totalMembers = selectedCircles.reduce((sum, circleId) => {
      const circle = circles.find(c => c.id === circleId);
      return sum + (circle?.memberCount || 0);
    }, 0);
    
    // In a real app, this would send the invites
    toast.success(`Invites sent to ${selectedCircles.length} circles (${totalMembers} people)`);
    setSelectedCircles([]);
  };
  
  const handleSendEmail = () => {
    if (!emailRecipients) {
      toast.error('Please enter at least one email address');
      return;
    }
    
    // In a real app, this would send the email
    toast.success('Email invitation sent');
    // Don't reset the form to allow for sending to more people
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share className="h-4 w-4 mr-2" />
          Share Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Event</DialogTitle>
          <DialogDescription>
            Invite friends, circles or share the event link.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="mt-2">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="link" className="flex items-center">
              <Link className="h-4 w-4 mr-2" />
              Link
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-url">Event Link</Label>
                <div className="flex mt-1.5">
                  <Input 
                    id="event-url" 
                    value={eventUrl} 
                    readOnly 
                    className="rounded-r-none"
                  />
                  <Button 
                    onClick={handleCopyLink} 
                    variant="secondary"
                    className="rounded-l-none px-3"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-center py-4">
                <p className="text-sm text-muted-foreground mb-3">Or share directly to</p>
                <div className="flex gap-3">
                  <SocialShareButton 
                    name="Facebook" 
                    icon={<FacebookIcon />} 
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, '_blank')}
                  />
                  <SocialShareButton 
                    name="Twitter" 
                    icon={<TwitterIcon />} 
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(`Check out ${eventName}`)}`, '_blank')}
                  />
                  <SocialShareButton 
                    name="WhatsApp" 
                    icon={<WhatsAppIcon />} 
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${eventName}: ${eventUrl}`)}`, '_blank')}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="friends" className="py-4">
            <Tabs defaultValue="individual">
              <TabsList className="w-full">
                <TabsTrigger value="individual" className="flex-1">Individual Friends</TabsTrigger>
                <TabsTrigger value="circles" className="flex-1">Friend Circles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="individual" className="pt-4">
                <div className="space-y-4">
                  <div className="max-h-[240px] overflow-y-auto border rounded-md divide-y">
                    {friends.map(friend => (
                      <div key={friend.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                            {friend.avatar ? (
                              <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-xs font-medium">{friend.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{friend.name}</p>
                            <p className="text-xs text-muted-foreground">{friend.email}</p>
                          </div>
                        </div>
                        <Checkbox 
                          checked={selectedFriends.includes(friend.id)}
                          onCheckedChange={() => handleFriendToggle(friend.id)}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleSendFriendInvites} 
                    disabled={selectedFriends.length === 0}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Invites ({selectedFriends.length})
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="circles" className="pt-4">
                <div className="space-y-4">
                  <div className="max-h-[240px] overflow-y-auto border rounded-md divide-y">
                    {circles.map(circle => (
                      <div key={circle.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                            {circle.avatar ? (
                              <img src={circle.avatar} alt={circle.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <Users className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{circle.name}</p>
                            <p className="text-xs text-muted-foreground">{circle.memberCount} members</p>
                          </div>
                        </div>
                        <Checkbox 
                          checked={selectedCircles.includes(circle.id)}
                          onCheckedChange={() => handleCircleToggle(circle.id)}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleSendCircleInvites} 
                    disabled={selectedCircles.length === 0}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send to Selected Circles
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="email" className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-to">To</Label>
                <Input 
                  id="email-to"
                  placeholder="Enter email addresses (comma separated)"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="email-subject">Subject</Label>
                <Input 
                  id="email-subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="email-message">Message</Label>
                <Textarea 
                  id="email-message"
                  rows={6}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleSendEmail}
                disabled={!emailRecipients}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Email Invitation
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const SocialShareButton: React.FC<{
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ name, icon, onClick }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full"
      onClick={onClick}
    >
      <span className="sr-only">Share on {name}</span>
      {icon}
    </Button>
  );
};

// Social media icons
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 0-14h8.5a4.5 4.5 0 1 1 0 9H14"></path><path d="M18.9 14.9A9 9 0 0 1 9 22a9.39 9.39 0 0 1-5-1.5L2 22l1.7-5Z"></path></svg>
);

export default EventSharingDialog;
