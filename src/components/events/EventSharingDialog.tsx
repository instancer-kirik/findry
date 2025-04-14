import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Share2, Mail, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface EventSharingDialogProps {
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  children?: React.ReactNode;
}

interface Community {
  id: string;
  name: string;
  image_url: string | null;
}

const EventSharingDialog: React.FC<EventSharingDialogProps> = ({
  eventId = 'demo-event-id',
  eventName = 'Sample Event',
  eventDate = 'Upcoming Event',
  children
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Ensure we have a valid event ID
  const validEventId = eventId && eventId !== 'demo-event-id' ? eventId : 'demo-event-id';
  const shareUrl = `${window.location.origin}/events/${validEventId}`;
  
  useEffect(() => {
    if (isOpen && user) {
      fetchUserCommunities();
    }
  }, [isOpen, user]);

  const fetchUserCommunities = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get communities where the user is a member
      const { data: memberships, error: membershipError } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', user.id);
      
      if (membershipError) throw membershipError;
      
      if (!memberships || memberships.length === 0) {
        setCommunities([]);
        return;
      }
      
      // Get the community details
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .select('id, name, image_url')
        .in('id', memberships.map(m => m.community_id));
      
      if (communityError) throw communityError;
      
      setCommunities(communityData || []);
    } catch (error) {
      console.error('Failed to fetch communities:', error);
      toast.error('Failed to load your communities');
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const sendInvite = () => {
    if (!email.trim()) {
      toast.error('Please enter at least one email address');
      return;
    }
    
    const emails = email.split(',').map(e => e.trim());
    const invalidEmails = emails.filter(e => !e.includes('@'));
    
    if (invalidEmails.length > 0) {
      toast.error(`Invalid email address${invalidEmails.length > 1 ? 'es' : ''}: ${invalidEmails.join(', ')}`);
      return;
    }
    
    // Mock sending invites to multiple recipients
    console.log(`Sending invites to ${emails.join(', ')} for event ${validEventId}`);
    
    if (emails.length === 1) {
      toast.success(`Invitation sent to ${emails[0]}`);
    } else {
      toast.success(`Invitations sent to ${emails.length} recipients`);
    }
    
    setEmail('');
  };
  
  const toggleCommunitySelection = (communityId: string) => {
    setSelectedCommunities(prev => 
      prev.includes(communityId)
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId]
    );
  };
  
  const shareToCommunities = async () => {
    if (selectedCommunities.length === 0) {
      toast.error('Please select at least one community');
      return;
    }
    
    try {
      setIsSharing(true);
      
      // For each selected community, create a relationship and a forum post
      for (const communityId of selectedCommunities) {
        // 1. Store the event-community relationship
        await storeEventCommunityRelationship(communityId);
        
        // 2. Create a forum post about the event
        await createCommunityForumPost(communityId);
      }
      
      toast.success(`Event shared to ${selectedCommunities.length} ${selectedCommunities.length === 1 ? 'community' : 'communities'}`);
      setSelectedCommunities([]);
    } catch (error) {
      console.error('Error sharing to communities:', error);
      toast.error('Failed to share to one or more communities');
    } finally {
      setIsSharing(false);
    }
  };
  
  const storeEventCommunityRelationship = async (communityId: string) => {
    if (!user) return;
    
    // First, check if the relationship already exists
    const existingRelationships = JSON.parse(localStorage.getItem('event_community_relationships') || '[]');
    const alreadyExists = existingRelationships.some(
      (rel: any) => rel.event_id === validEventId && rel.community_id === communityId
    );
    
    if (!alreadyExists) {
      // Store in localStorage (temporary solution)
      const relationship = {
        event_id: validEventId,
        community_id: communityId,
        user_id: user.id,
        created_at: new Date().toISOString()
      };
      
      existingRelationships.push(relationship);
      localStorage.setItem('event_community_relationships', JSON.stringify(existingRelationships));
      
      // Also store in community-specific storage
      const storageKey = `community_${communityId}_events`;
      const communityEvents = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      if (!communityEvents.some((e: any) => e.event_id === validEventId)) {
        communityEvents.push({
          event_id: validEventId,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem(storageKey, JSON.stringify(communityEvents));
      }
      
      // Try to store in actual database if it exists
      try {
        const { error } = await supabase
          .from('event_community_relationships')
          .insert({
            event_id: validEventId,
            community_id: communityId,
            created_by: user.id
          });
        
        if (error) console.error('Database error storing relationship:', error);
      } catch (e) {
        // Silently fail - localStorage is our fallback
      }
    }
  };
  
  const createCommunityForumPost = async (communityId: string) => {
    // For this MVP, we'll just log the intent to create a forum post
    // In a full implementation, you would create an actual forum post in the database
    console.log(`Creating forum post for event ${validEventId} in community ${communityId}`);
    
    // Store a mock forum post in localStorage
    const forumPosts = JSON.parse(localStorage.getItem(`community_${communityId}_forum_posts`) || '[]');
    forumPosts.push({
      id: `post-${Date.now()}`,
      title: `New Event: ${eventName}`,
      content: `I've shared a new event: ${eventName} on ${eventDate}. Check it out!`,
      user_id: user?.id,
      created_at: new Date().toISOString(),
      event_id: validEventId,
      community_id: communityId
    });
    localStorage.setItem(`community_${communityId}_forum_posts`, JSON.stringify(forumPosts));
  };
  
  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: eventName,
        text: `Check out this event: ${eventName}`,
        url: shareUrl,
      })
      .then(() => toast.success('Shared successfully'))
      .catch((error) => {
        console.log('Error sharing', error);
        // Fall back to clipboard if Web Share API fails
        copyToClipboard();
      });
    } else {
      copyToClipboard();
      toast.info('Share link copied to clipboard - paste it in your preferred app or message');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Event</DialogTitle>
          <DialogDescription>
            Invite others to "{eventName}" on {eventDate}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="share-link">Event Link</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="share-link" 
                value={shareUrl} 
                readOnly 
                className="flex-1"
              />
              <Button size="icon" onClick={copyToClipboard} variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="share-email">Email Invite</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="share-email" 
                type="email" 
                placeholder="Enter email addresses (comma separated)" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={sendInvite} variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Share to Your Communities
            </Label>
            
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary"></div>
              </div>
            ) : communities.length > 0 ? (
              <>
                <ScrollArea className="h-[200px] rounded-md border p-2">
                  <div className="space-y-2">
                    {communities.map(community => (
                      <div key={community.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`community-${community.id}`}
                          checked={selectedCommunities.includes(community.id)}
                          onCheckedChange={() => toggleCommunitySelection(community.id)}
                        />
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={community.image_url || undefined} />
                          <AvatarFallback>{community.name[0]}</AvatarFallback>
                        </Avatar>
                        <Label
                          htmlFor={`community-${community.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {community.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <Button 
                  className="w-full"
                  onClick={shareToCommunities}
                  disabled={selectedCommunities.length === 0 || isSharing}
                >
                  {isSharing ? 'Sharing...' : 'Share to Selected Communities'}
                </Button>
              </>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                {user ? 
                  "You haven't joined any communities yet." : 
                  "Sign in to share with your communities."}
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="flex justify-center">
            <Button onClick={shareEvent} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share via Social Media
            </Button>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventSharingDialog;
