import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EventDetailsFormProps {
  eventName: string;
  setEventName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  capacity: string;
  setCapacity: (value: string) => void;
  eventType: string;
  setEventType: (value: string) => void;
}

const EventDetailsForm: React.FC<EventDetailsFormProps> = ({
  eventName, setEventName,
  description, setDescription,
  location, setLocation,
  capacity, setCapacity,
  eventType, setEventType
}) => {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Event Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="eventName">Event Name*</Label>
          <Input 
            id="eventName" 
            value={eventName} 
            onChange={(e) => setEventName(e.target.value)} 
            placeholder="Enter event name"
            required
          />
        </div>

        <div>
          <Label htmlFor="eventType">Event Type*</Label>
          <Select 
            value={eventType}
            onValueChange={setEventType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-person">In-Person</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Describe your event"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="location">Location*</Label>
          <Input 
            id="location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="Event location or online platform"
            required
          />
        </div>

        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input 
            id="capacity" 
            value={capacity} 
            onChange={(e) => setCapacity(e.target.value)} 
            placeholder="Maximum number of attendees"
            type="number"
          />
        </div>
      </div>
    </section>
  );
};

export default EventDetailsForm; 