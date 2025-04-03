import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Calendar, Clock, User, Box, Edit } from 'lucide-react';
import { EventSlot } from '@/types/event';
import { ContentItemProps } from '@/components/marketplace/ContentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { artists, resources } from '@/components/discover/DiscoverData';

interface EventSlotManagerProps {
  slots: EventSlot[];
  onSlotsChange: (slots: EventSlot[]) => void;
  eventStartTime: string;
  eventEndTime: string;
  eventDate: Date;
  readOnly?: boolean;
}

const EventSlotManager: React.FC<EventSlotManagerProps> = ({
  slots,
  onSlotsChange,
  eventStartTime,
  eventEndTime,
  eventDate,
  readOnly = false
}) => {
  const [selectedSlot, setSelectedSlot] = useState<EventSlot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchArtistQuery, setSearchArtistQuery] = useState('');
  const [searchResourceQuery, setSearchResourceQuery] = useState('');

  const handleAddSlot = () => {
    const newSlot: EventSlot = {
      id: uuidv4(),
      title: 'New Slot',
      startTime: eventStartTime,
      endTime: eventEndTime,
      status: 'available',
      slotType: 'performance'
    };
    setSelectedSlot(newSlot);
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEditSlot = (slot: EventSlot) => {
    setSelectedSlot(slot);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleRemoveSlot = (slotId: string) => {
    onSlotsChange(slots.filter(slot => slot.id !== slotId));
  };

  const handleSaveSlot = () => {
    if (!selectedSlot) return;

    if (editMode) {
      onSlotsChange(slots.map(slot => 
        slot.id === selectedSlot.id ? selectedSlot : slot
      ));
    } else {
      onSlotsChange([...slots, selectedSlot]);
    }
    
    setIsDialogOpen(false);
  };

  const handleSlotChange = (field: keyof EventSlot, value: any) => {
    if (!selectedSlot) return;
    
    setSelectedSlot({
      ...selectedSlot,
      [field]: value
    });
  };

  const handleAssignArtist = (artist: ContentItemProps) => {
    if (!selectedSlot) return;
    
    setSelectedSlot({
      ...selectedSlot,
      artist,
      artistId: artist.id
    });
  };

  const handleAssignResource = (resource: ContentItemProps) => {
    if (!selectedSlot) return;
    
    setSelectedSlot({
      ...selectedSlot,
      resource,
      resourceId: resource.id
    });
  };

  const handleRemoveArtist = () => {
    if (!selectedSlot) return;
    
    setSelectedSlot({
      ...selectedSlot,
      artist: undefined,
      artistId: undefined
    });
  };

  const handleRemoveResource = () => {
    if (!selectedSlot) return;
    
    setSelectedSlot({
      ...selectedSlot,
      resource: undefined,
      resourceId: undefined
    });
  };

  const filteredArtists = searchArtistQuery
    ? artists.filter(artist => 
        artist.name.toLowerCase().includes(searchArtistQuery.toLowerCase()) ||
        (artist.tags && artist.tags.some(tag => 
          tag.toLowerCase().includes(searchArtistQuery.toLowerCase())
        ))
      )
    : artists;

  const filteredResources = searchResourceQuery
    ? resources.filter(resource => 
        resource.name.toLowerCase().includes(searchResourceQuery.toLowerCase()) ||
        (resource.tags && resource.tags.some(tag => 
          tag.toLowerCase().includes(searchResourceQuery.toLowerCase())
        ))
      )
    : resources;

  const sortedSlots = [...slots].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  // Time display helper
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const parsedHours = parseInt(hours);
    return `${parsedHours % 12 || 12}:${minutes} ${parsedHours >= 12 ? 'PM' : 'AM'}`;
  };

  const getSlotTypeColor = (slotType: string) => {
    switch (slotType) {
      case 'performance':
        return 'bg-blue-100 text-blue-800';
      case 'setup':
        return 'bg-green-100 text-green-800';
      case 'breakdown':
        return 'bg-orange-100 text-orange-800';
      case 'break':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Event Schedule</h3>
        {!readOnly && (
          <Button onClick={handleAddSlot} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Slot
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {sortedSlots.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-md text-muted-foreground">
            {readOnly ? "No slots scheduled for this event yet." : "Add time slots to schedule your event."}
          </div>
        ) : (
          sortedSlots.map(slot => (
            <Card key={slot.id} className="mb-2">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getSlotTypeColor(slot.slotType)}>
                        {slot.slotType.charAt(0).toUpperCase() + slot.slotType.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(slot.status)}>
                        {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                      </Badge>
                    </div>
                    <h4 className="font-semibold">{slot.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" /> 
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                    </div>
                    {slot.description && (
                      <p className="text-sm">{slot.description}</p>
                    )}
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {slot.artist && (
                        <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                          <User className="h-3 w-3 mr-1" /> 
                          {slot.artist.name}
                        </div>
                      )}
                      {slot.resource && (
                        <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                          <Box className="h-3 w-3 mr-1" /> 
                          {slot.resource.name}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!readOnly && (
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditSlot(slot)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit slot</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveSlot(slot.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove slot</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Slot' : 'Add New Slot'}</DialogTitle>
            <DialogDescription>
              Schedule a time slot and assign artists or resources.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSlot && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input 
                    value={selectedSlot.title}
                    onChange={(e) => handleSlotChange('title', e.target.value)}
                    placeholder="e.g., Opening Act, Main Performance"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    value={selectedSlot.description || ''}
                    onChange={(e) => handleSlotChange('description', e.target.value)}
                    placeholder="Describe this slot"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Start Time</label>
                    <Input 
                      type="time"
                      value={selectedSlot.startTime}
                      onChange={(e) => handleSlotChange('startTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Time</label>
                    <Input 
                      type="time"
                      value={selectedSlot.endTime}
                      onChange={(e) => handleSlotChange('endTime', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Slot Type</label>
                    <Select 
                      value={selectedSlot.slotType}
                      onValueChange={(value) => handleSlotChange('slotType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
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
                    <label className="text-sm font-medium">Status</label>
                    <Select 
                      value={selectedSlot.status}
                      onValueChange={(value) => handleSlotChange('status', value as EventSlot['status'])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea 
                    value={selectedSlot.notes || ''}
                    onChange={(e) => handleSlotChange('notes', e.target.value)}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Assigned Artist</label>
                    {selectedSlot.artist && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleRemoveArtist}
                        className="h-6 text-xs text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                  
                  {selectedSlot.artist ? (
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedSlot.artist.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedSlot.artist.location}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Input 
                        placeholder="Search artists..."
                        value={searchArtistQuery}
                        onChange={(e) => setSearchArtistQuery(e.target.value)}
                        className="mb-2"
                      />
                      <ScrollArea className="h-[150px] border rounded-md p-2">
                        {filteredArtists.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No artists found</p>
                        ) : (
                          filteredArtists.map(artist => (
                            <div 
                              key={artist.id} 
                              className="p-2 hover:bg-muted rounded-md cursor-pointer mb-1"
                              onClick={() => handleAssignArtist(artist)}
                            >
                              <p className="font-medium">{artist.name}</p>
                              <p className="text-xs text-muted-foreground">{artist.location}</p>
                            </div>
                          ))
                        )}
                      </ScrollArea>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Assigned Resource</label>
                    {selectedSlot.resource && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleRemoveResource}
                        className="h-6 text-xs text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                  
                  {selectedSlot.resource ? (
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                          <Box className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedSlot.resource.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedSlot.resource.location}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Input 
                        placeholder="Search resources..."
                        value={searchResourceQuery}
                        onChange={(e) => setSearchResourceQuery(e.target.value)}
                        className="mb-2"
                      />
                      <ScrollArea className="h-[150px] border rounded-md p-2">
                        {filteredResources.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No resources found</p>
                        ) : (
                          filteredResources.map(resource => (
                            <div 
                              key={resource.id} 
                              className="p-2 hover:bg-muted rounded-md cursor-pointer mb-1"
                              onClick={() => handleAssignResource(resource)}
                            >
                              <p className="font-medium">{resource.name}</p>
                              <p className="text-xs text-muted-foreground">{resource.location}</p>
                            </div>
                          ))
                        )}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveSlot}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventSlotManager; 