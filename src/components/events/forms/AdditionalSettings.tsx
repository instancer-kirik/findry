
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AdditionalSettingsProps } from '@/types/forms';

const AdditionalSettings: React.FC<AdditionalSettingsProps> = ({
  isPrivate,
  setIsPrivate,
  registrationRequired,
  setRegistrationRequired,
  ticketPrice,
  setTicketPrice,
  ticketUrl,
  setTicketUrl,
  capacity,
  setCapacity,
}) => {
  return (
    <div className="space-y-6 border p-6 rounded-lg">
      <h2 className="text-xl font-semibold">Additional Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="isPrivate" className="text-base">Private Event</Label>
            <p className="text-sm text-muted-foreground">Only invited guests can see this event</p>
          </div>
          <Switch 
            id="isPrivate" 
            checked={isPrivate} 
            onCheckedChange={setIsPrivate} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="registrationRequired" className="text-base">Registration Required</Label>
            <p className="text-sm text-muted-foreground">Attendees must register to attend</p>
          </div>
          <Switch 
            id="registrationRequired" 
            checked={registrationRequired} 
            onCheckedChange={setRegistrationRequired} 
          />
        </div>
        
        {registrationRequired && (
          <div className="space-y-4 border-t border-b py-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input 
                id="capacity" 
                type="number"
                placeholder="Maximum number of attendees" 
                value={capacity} 
                onChange={(e) => setCapacity(parseInt(e.target.value) || 0)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticketPrice">Ticket Price (optional)</Label>
              <Input 
                id="ticketPrice" 
                type="text"
                placeholder="e.g. $10 or Free" 
                value={ticketPrice} 
                onChange={(e) => setTicketPrice(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticketUrl">Ticket URL (optional)</Label>
              <Input 
                id="ticketUrl" 
                type="url"
                placeholder="e.g. https://eventbrite.com/..." 
                value={ticketUrl} 
                onChange={(e) => setTicketUrl(e.target.value)} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalSettings;
