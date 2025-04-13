import React, { useState } from 'react';
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
import { Copy, Check, Share2, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface EventSharingDialogProps {
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  children?: React.ReactNode;
}

const EventSharingDialog: React.FC<EventSharingDialogProps> = ({
  eventId = 'demo-event-id',
  eventName = 'Sample Event',
  eventDate = 'Upcoming Event',
  children
}) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Ensure we have a valid event ID
  const validEventId = eventId && eventId !== 'demo-event-id' ? eventId : 'demo-event-id';
  const shareUrl = `${window.location.origin}/events/${validEventId}`;
  
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
          
          <div className="flex justify-center">
            <Button onClick={shareEvent} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share Event
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
