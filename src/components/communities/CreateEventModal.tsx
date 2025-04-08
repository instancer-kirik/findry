import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from 'lucide-react';
import { format, parseISO, formatISO } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

interface CreateEventModalProps {
  onSuccess?: () => void;
  communityId?: string;
}

const CreateEventModal = ({ onSuccess, communityId }: CreateEventModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'event',
    startTime: '',
    endTime: '',
    location: '',
    maxAttendees: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'event',
      startTime: '',
      endTime: '',
      location: '',
      maxAttendees: '',
    });
    setDate(undefined);
  };

  const handleRedirectToCreateEvent = () => {
    if (communityId) {
      navigate(`/events/create?communityId=${communityId}`);
      setOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an event",
        variant: "destructive"
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date for the event",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.startTime) {
      toast({
        title: "Error",
        description: "Please enter a start time for the event",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format dates properly
      const startDate = new Date(date);
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      startDate.setHours(startHours, startMinutes);
      
      let endDate = null;
      if (formData.endTime) {
        endDate = new Date(date);
        const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
        endDate.setHours(endHours, endMinutes);
      }
      
      // Create the event
      const eventId = uuidv4();
      const { error: eventError } = await supabase.from('events').insert({
        id: eventId,
        name: formData.title,
        description: formData.description,
        type: formData.type,
        start_date: formatISO(startDate),
        end_date: endDate ? formatISO(endDate) : null,
        location: formData.location,
        capacity: formData.maxAttendees ? parseInt(formData.maxAttendees) : null
      });
      
      if (eventError) {
        console.error('Error creating event:', eventError);
        throw new Error(eventError.message);
      }
      
      // Store the relationship between the event and community
      if (communityId) {
        try {
          // Store in content_ownership which is the proper way to link content
          const { error: ownershipError } = await supabase
            .from('content_ownership')
            .insert({
              content_id: eventId,
              content_type: 'event',
              owner_id: user.id
            });
            
          if (ownershipError) {
            console.error('Error creating content ownership:', ownershipError);
          }
          
          // Store additional metadata in localStorage to link event and community
          const storageKey = `community_${communityId}_events`;
          const existingEvents = JSON.parse(localStorage.getItem(storageKey) || '[]');
          existingEvents.push({
            event_id: eventId,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem(storageKey, JSON.stringify(existingEvents));
          
          // Also store in event_community_relationships for when we create that table
          const existingRelationships = JSON.parse(localStorage.getItem('event_community_relationships') || '[]');
          existingRelationships.push({
            event_id: eventId,
            community_id: communityId,
            user_id: user.id,
            created_at: new Date().toISOString()
          });
          localStorage.setItem('event_community_relationships', JSON.stringify(existingRelationships));
        } catch (relationshipError) {
          console.error('Failed to store event relationship:', relationshipError);
          toast({
            title: "Warning",
            description: "Event was created, but we couldn't fully link it to the community.",
            variant: "default"
          });
        }
      }
      
      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      
      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleRedirectToCreateEvent}
          >
            Use Full Event Creator
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAttendees">Maximum Attendees</Label>
            <Input
              id="maxAttendees"
              type="number"
              value={formData.maxAttendees}
              onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
