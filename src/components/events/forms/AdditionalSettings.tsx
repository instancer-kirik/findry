import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AdditionalSettingsProps } from '@/types/forms';

interface AdditionalSettingsProps {
  capacity: number;
  setCapacity: React.Dispatch<React.SetStateAction<number>>;
  isPrivate: boolean;
  setIsPrivate: React.Dispatch<React.SetStateAction<boolean>>;
  registrationRequired: boolean;
  setRegistrationRequired: React.Dispatch<React.SetStateAction<boolean>>;
  ticketPrice: string;
  setTicketPrice: React.Dispatch<React.SetStateAction<string>>;
  ticketUrl: string;
  setTicketUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const AdditionalSettings: React.FC<AdditionalSettingsProps> = ({
  isPrivate,
  setIsPrivate,
  registrationRequired,
  setRegistrationRequired,
  ticketPrice,
  setTicketPrice,
  ticketUrl,
  setTicketUrl,
  capacity,
  setCapacity
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="isPrivate">Private Event</Label>
          <p className="text-xs text-muted-foreground">
            Private events are only visible to invited attendees
          </p>
        </div>
        <Switch 
          id="isPrivate" 
          checked={isPrivate} 
          onCheckedChange={setIsPrivate}
        />
      </div>

      {setRegistrationRequired && (
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="registrationRequired">Require Registration</Label>
            <p className="text-xs text-muted-foreground">
              Attendees must register to attend this event
            </p>
          </div>
          <Switch 
            id="registrationRequired" 
            checked={registrationRequired} 
            onCheckedChange={setRegistrationRequired}
          />
        </div>
      )}

      {setCapacity && (
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input 
            id="capacity" 
            type="number" 
            placeholder="e.g., 100" 
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)} 
          />
        </div>
      )}

      {setTicketPrice && (
        <div className="space-y-2">
          <Label htmlFor="ticketPrice">Ticket Price</Label>
          <Input 
            id="ticketPrice" 
            type="text" 
            placeholder="e.g., $10, Free, etc." 
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)} 
          />
        </div>
      )}

      {setTicketUrl && (
        <div className="space-y-2">
          <Label htmlFor="ticketUrl">Ticket URL</Label>
          <Input 
            id="ticketUrl" 
            type="text" 
            placeholder="e.g., https://example.com/tickets" 
            value={ticketUrl}
            onChange={(e) => setTicketUrl(e.target.value)} 
          />
        </div>
      )}
    </div>
  );
};

export default AdditionalSettings;
