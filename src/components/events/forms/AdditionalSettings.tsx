import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface AdditionalSettingsProps {
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  registrationRequired: boolean;
  setRegistrationRequired: (value: boolean) => void;
  ticketPrice: string;
  setTicketPrice: (value: string) => void;
  ticketUrl: string;
  setTicketUrl: (value: string) => void;
}

const AdditionalSettings: React.FC<AdditionalSettingsProps> = ({
  isPrivate,
  setIsPrivate,
  registrationRequired,
  setRegistrationRequired,
  ticketPrice,
  setTicketPrice,
  ticketUrl,
  setTicketUrl
}) => {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Additional Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="isPrivate" className="cursor-pointer">Private Event</Label>
            <p className="text-sm text-muted-foreground">Only visible to invited participants</p>
          </div>
          <Switch 
            id="isPrivate" 
            checked={isPrivate}
            onCheckedChange={setIsPrivate}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="registrationRequired" className="cursor-pointer">Require Registration</Label>
            <p className="text-sm text-muted-foreground">Participants must register to attend</p>
          </div>
          <Switch 
            id="registrationRequired" 
            checked={registrationRequired}
            onCheckedChange={setRegistrationRequired}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="ticketPrice">Ticket Price</Label>
          <Input 
            id="ticketPrice" 
            value={ticketPrice} 
            onChange={(e) => setTicketPrice(e.target.value)} 
            placeholder="Leave blank for free events"
          />
        </div>
        
        <div>
          <Label htmlFor="ticketUrl">Ticket Link</Label>
          <Input 
            id="ticketUrl" 
            value={ticketUrl} 
            onChange={(e) => setTicketUrl(e.target.value)} 
            placeholder="External ticketing website URL"
          />
        </div>
      </div>
    </section>
  );
};

export default AdditionalSettings; 