import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Plus, Trash2, CalendarClock, PlusCircle } from 'lucide-react';
import { EventSlot } from '@/types/event';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { ContentItemProps } from '@/components/marketplace/ContentCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventSlotManagerProps {
  slots: EventSlot[];
  onSlotsChange: (slots: EventSlot[]) => void;
  eventStartTime?: string;
  eventEndTime?: string;
  eventDate?: Date;
  availableComponents?: ContentItemProps[];
}

const EventSlotManager: React.FC<EventSlotManagerProps> = ({
  slots = [],
  onSlotsChange,
  eventStartTime = '',
  eventEndTime = '',
  eventDate,
  availableComponents = [],
}) => {
  const [newSlot, setNewSlot] = useState<Partial<EventSlot>>({
    title: '',
    startTime: eventStartTime,
    endTime: '',
    slotType: 'performance',
    status: 'available',
  });

  // When props change, update the default new slot
  useEffect(() => {
    setNewSlot(prev => ({
      ...prev,
      startTime: eventStartTime || prev.startTime,
    }));
  }, [eventStartTime]);

  // Group available components by type
  const artists = availableComponents.filter(c => c.type === 'artist');
  const resources = availableComponents.filter(c => c.type === 'resource' || c.type === 'tool' || c.type === 'space');

  const handleAddSlot = () => {
    if (!newSlot.title || !newSlot.startTime || !newSlot.endTime) {
      return;
    }

    const slot: EventSlot = {
      id: uuidv4(),
      title: newSlot.title || '',
      startTime: newSlot.startTime || '',
      endTime: newSlot.endTime || '',
      slotType: newSlot.slotType as 'performance' | 'setup' | 'breakdown' | 'break' | 'other',
      status: 'available',
      description: newSlot.description,
      artist: newSlot.artist,
      artistId: newSlot.artistId,
      resource: newSlot.resource,
      resourceId: newSlot.resourceId,
      notes: newSlot.notes,
    };

    onSlotsChange([...slots, slot]);

    // Reset the form except for endTime becoming the new startTime for the next slot
    setNewSlot({
      title: '',
      startTime: slot.endTime,
      endTime: '',
      slotType: 'performance',
      status: 'available',
    });
  };

  const handleSlotChange = (id: string, field: keyof EventSlot, value: any) => {
    const updatedSlots = slots.map(slot => {
      if (slot.id === id) {
        return { ...slot, [field]: value };
      }
      return slot;
    });
    onSlotsChange(updatedSlots);
  };

  const handleRemoveSlot = (id: string) => {
    const updatedSlots = slots.filter(slot => slot.id !== id);
    onSlotsChange(updatedSlots);
  };

  const handleAssignArtist = (slotId: string, artistId: string) => {
    const artist = artists.find(a => a.id === artistId);
    if (artist) {
      handleSlotChange(slotId, 'artist', artist);
      handleSlotChange(slotId, 'artistId', artist.id);
    }
  };

  const handleAssignResource = (slotId: string, resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      handleSlotChange(slotId, 'resource', resource);
      handleSlotChange(slotId, 'resourceId', resource.id);
    }
  };

  return (
    <div className="event-slot-manager space-y-6">
      {/* Display event date if available */}
      {eventDate && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <CalendarClock className="h-4 w-4" />
          <span>Event Date: {format(eventDate, 'PPPP')}</span>
        </div>
      )}

      {/* Existing slots */}
      {slots.length > 0 ? (
        <div className="space-y-4">
          {slots.map(slot => (
            <Card key={slot.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium mb-2">{slot.title}</div>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <Badge variant="outline" className="capitalize">
                      {slot.slotType}
                    </Badge>
                    
                    <Badge variant="outline" className={cn(
                      slot.status === 'available' && "bg-green-100 text-green-800",
                      slot.status === 'reserved' && "bg-yellow-100 text-yellow-800",
                      slot.status === 'confirmed' && "bg-blue-100 text-blue-800",
                      slot.status === 'canceled' && "bg-red-100 text-red-800"
                    )}>
                      {slot.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Artist assignment */}
                  <div>
                    <label className="text-sm font-medium">Assigned Artist</label>
                    <Select
                      value={slot.artistId}
                      onValueChange={(value) => handleAssignArtist(slot.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Assign an artist" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {artists.map(artist => (
                          <SelectItem key={artist.id} value={artist.id}>
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Resource assignment */}
                  <div>
                    <label className="text-sm font-medium">Required Resource</label>
                    <Select
                      value={slot.resourceId}
                      onValueChange={(value) => handleAssignResource(slot.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Assign a resource" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {resources.map(resource => (
                          <SelectItem key={resource.id} value={resource.id}>
                            {resource.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleRemoveSlot(slot.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Slot
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          <p>No time slots added yet</p>
          <p className="text-sm">Add slots to organize your event schedule</p>
        </div>
      )}

      {/* Add new slot form */}
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Add New Time Slot</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Slot title"
                value={newSlot.title}
                onChange={(e) => setNewSlot({ ...newSlot, title: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Slot Type</label>
              <Select
                value={newSlot.slotType}
                onValueChange={(value) => setNewSlot({ ...newSlot, slotType: value as EventSlot['slotType'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select slot type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="setup">Setup</SelectItem>
                  <SelectItem value="breakdown">Breakdown</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                placeholder="Description of this time slot"
                value={newSlot.description || ''}
                onChange={(e) => setNewSlot({ ...newSlot, description: e.target.value })}
                className="h-20"
              />
            </div>
          </div>
        </div>
        
        <Button className="w-full mt-4" onClick={handleAddSlot} disabled={!newSlot.title || !newSlot.startTime || !newSlot.endTime}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Slot
        </Button>
      </Card>
    </div>
  );
};

export default EventSlotManager;
