
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { EventDetailsFormProps } from "@/types/forms";

export const EventDetailsForm: React.FC<EventDetailsFormProps> = ({
  eventName,
  setEventName,
  description,
  setDescription,
  location,
  setLocation,
  eventType,
  setEventType,
  tags,
  setTags
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="eventName">Event Name</Label>
        <Input
          id="eventName"
          placeholder="Enter event name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="eventType">Event Type</Label>
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger>
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="concert">Concert</SelectItem>
              <SelectItem value="exhibition">Exhibition</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="gallery">Gallery</SelectItem>
              <SelectItem value="festival">Festival</SelectItem>
              <SelectItem value="networking">Networking</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter event description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
};

export default EventDetailsForm;
