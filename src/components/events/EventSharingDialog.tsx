
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

  const shareUrl = `${window.location.origin}/events/${eventId}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const sendInvite = () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Mock sending an invite
    console.log(`Sending invite to ${email} for event ${eventId}`);
    toast.success(`Invitation sent to ${email}`);
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
      .catch((error) => console.log('Error sharing', error));
    } else {
      copyToClipboard();
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
                placeholder="Enter email address" 
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
