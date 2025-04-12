import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Calendar, Clock, Search, User, Wrench, X, MapPin, UserPlus, Landmark, SquarePlus, Mail, Link } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { toast } from "sonner";
import { ContentItemProps } from '@/types/content';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { EventSlot } from '@/types/event';

// Extend ContentItemProps to include isNew flag - this is already defined in types/content.ts
// But we'll use the type from there instead of redefining
type ExtendedContentItemProps = ContentItemProps;

export interface EventSlotManagerProps {
  slots: EventSlot[];
  onSlotsChange: (slots: EventSlot[]) => void;
  eventStartTime: string;
  eventEndTime: string;
  eventDate: Date;
  readOnly?: boolean;
  availableArtists: ContentItemProps[];
  availableResources: ContentItemProps[];
  availableVenues: ContentItemProps[];
}

// Internal time picker component definition
const TimePicker: React.FC<{
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}> = ({
  value,
  onChange,
  disabled = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState<string>(value ? value.split(':')[0] : '00');
  const [minutes, setMinutes] = useState<string>(value ? value.split(':')[1] : '00');

  // Generate hours and minutes options
  const hoursOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );
  
  const minutesOptions = Array.from({ length: 12 }, (_, i) => 
    (i * 5).toString().padStart(2, '0')
  );

  // Update time when selection changes
  const handleTimeChange = (type: 'hours' | 'minutes', newValue: string) => {
    if (type === 'hours') {
      setHours(newValue);
      onChange(`${newValue}:${minutes}`);
    } else {
      setMinutes(newValue);
      onChange(`${hours}:${newValue}`);
    }
  };

  return (
    <Popover open={isOpen && !disabled} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || 'Select time'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Hours</span>
            <Select
              value={hours}
              onValueChange={(val) => handleTimeChange('hours', val)}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hoursOptions.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end pb-1 text-xl">:</div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Minutes</span>
            <Select
              value={minutes}
              onValueChange={(val) => handleTimeChange('minutes', val)}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {minutesOptions.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const SlotTypeSelector: React.FC<{
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  return (
    <Select 
      value={value || 'other'} 
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="h-8">
        <SelectValue placeholder="Slot type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="performance">Performance</SelectItem>
        <SelectItem value="setup">Setup</SelectItem>
        <SelectItem value="breakdown">Breakdown</SelectItem>
        <SelectItem value="break">Break</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  );
};

export function EventSlotManager({
  slots,
  onSlotsChange,
  eventStartTime,
  eventEndTime,
  eventDate,
  availableArtists,
  availableResources,
  availableVenues
}: EventSlotManagerProps) {
  const [localSlots, setLocalSlots] = useState<EventSlot[]>(slots);
  const [editingSlot, setEditingSlot] = useState<EventSlot | null>(null);
  const [selectedObject, setSelectedObject] = useState<{
    type: 'artist' | 'resource' | 'venue';
    item: ContentItemProps | null;
  }>({
    type: 'artist',
    item: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ContentItemProps[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    email: '',
    link: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    setLocalSlots(slots);
  }, [slots]);

  useEffect(() => {
    onSlotsChange(localSlots);
  }, [localSlots, onSlotsChange]);

  const inferTitle = (slot: EventSlot) => {
    if (slot.artist) return `${slot.artist.name}'s Performance`;
    if (slot.resource) return `${slot.resource.name} Setup`;
    if (slot.venue) return `Venue: ${slot.venue.name}`;
    return 'Unbooked Slot';
  };

  const handleAddSlot = () => {
    const newSlot: EventSlot = {
      id: Date.now().toString(),
      title: '',
      description: '',
      startTime: eventStartTime,
      endTime: eventEndTime,
      artist: undefined,
      resource: undefined,
      venue: undefined,
      status: 'available',
      slotType: 'performance'
    };
    setLocalSlots([...localSlots, newSlot]);
    setEditingSlot(newSlot);
  };

  const handleRemoveSlot = (id: string) => {
    setLocalSlots(localSlots.filter(slot => slot.id !== id));
  };

  const handleEditSlot = (slot: EventSlot) => {
    setEditingSlot(slot);
    setSelectedObject({
      type: 'artist',
      item: slot.artist
    });
  };

  const handleSaveSlot = (updatedSlot: EventSlot) => {
    const slotWithTitle = {
      ...updatedSlot,
      title: inferTitle(updatedSlot)
    };
    setLocalSlots(localSlots.map(slot => 
      slot.id === updatedSlot.id ? slotWithTitle : slot
    ));
    setEditingSlot(null);
    setSelectedObject({
      type: 'artist',
      item: null
    });
  };

  const handleSearch = async (type: 'artist' | 'resource' | 'venue') => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from(type === 'artist' ? 'artists' : type === 'resource' ? 'resources' : 'venues')
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleObjectSelect = (type: 'artist' | 'resource' | 'venue', item: ContentItemProps) => {
    setSelectedObject({ type, item });
    if (editingSlot) {
      const updatedSlot = { ...editingSlot };
      if (type === 'artist') {
        updatedSlot.artist = item;
        updatedSlot.status = item.isRequestOnly ? 'requested' : 'reserved';
      } else if (type === 'resource') {
        updatedSlot.resource = item;
        updatedSlot.status = item.isRequestOnly ? 'requested' : 'reserved';
      } else if (type === 'venue') {
        updatedSlot.venue = item;
        updatedSlot.status = item.isRequestOnly ? 'requested' : 'reserved';
      }
      console.log('Updating slot with new item:', { type, item, status: updatedSlot.status });
      setEditingSlot(updatedSlot);
    }
  };

  const handleCreateNewItem = async () => {
    if (!newItem.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    // Create a local object with an isRequestOnly flag
    const tempId = `temp_${Date.now()}`;
    const newRequestedItem: ExtendedContentItemProps = {
      id: tempId,
      name: newItem.name,
      email: newItem.email,
      link: newItem.link,
      location: newItem.location,
      type: selectedObject.type,
      isRequestOnly: true,
      isNew: true
    };

    if (editingSlot) {
      const updatedSlot = { ...editingSlot };
      if (selectedObject.type === 'artist') {
        updatedSlot.artist = newRequestedItem;
        updatedSlot.status = 'requested';
      } else if (selectedObject.type === 'resource') {
        updatedSlot.resource = newRequestedItem;
        updatedSlot.status = 'requested';
      } else if (selectedObject.type === 'venue') {
        updatedSlot.venue = newRequestedItem;
        updatedSlot.status = 'requested';
      }
      console.log('Creating new requested item:', { type: selectedObject.type, item: newRequestedItem, status: updatedSlot.status });
      setEditingSlot(updatedSlot);
    }

    setIsCreatingNew(false);
    setNewItem({
      name: '',
      email: '',
      link: '',
      location: '',
      notes: ''
    });
    toast.success(`${selectedObject.type} request added to event`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Available</Badge>;
      case 'reserved':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Reserved</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Canceled</Badge>;
      case 'requested':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Requested</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Available</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Time Slots</h3>
        <Button onClick={handleAddSlot}>
          <Plus className="w-4 h-4 mr-2" />
          Add Slot
        </Button>
      </div>

      <div className="space-y-4">
        {localSlots.map(slot => (
          <div key={slot.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{inferTitle(slot)}</h4>
                  {getStatusBadge(slot.status)}
                  {(slot.artist?.isRequestOnly || slot.resource?.isRequestOnly || slot.venue?.isRequestOnly) && (
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Seeking provider</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {slot.startTime} - {slot.endTime}
                </div>
                {slot.description && (
                  <p className="text-sm text-gray-500">{slot.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {slot.artist && (
                    <div className="flex items-center gap-1 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{slot.artist.name}</span>
                      {slot.artist.isRequestOnly && <span className="text-xs text-indigo-500">(requested)</span>}
                      {slot.artist.email && (
                        <a href={`mailto:${slot.artist.email}`} className="text-blue-500 hover:underline">
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {slot.artist.link && (
                        <a href={slot.artist.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          <Link className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                  {slot.venue && (
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{slot.venue.name}</span>
                      {slot.venue.isRequestOnly && <span className="text-xs text-indigo-500">(requested)</span>}
                      {slot.venue.email && (
                        <a href={`mailto:${slot.venue.email}`} className="text-blue-500 hover:underline">
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {slot.venue.link && (
                        <a href={slot.venue.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          <Link className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                  {slot.resource && (
                    <div className="flex items-center gap-1 text-sm">
                      <Wrench className="w-4 h-4 text-gray-500" />
                      <span>{slot.resource.name}</span>
                      {slot.resource.isRequestOnly && <span className="text-xs text-indigo-500">(requested)</span>}
                      {slot.resource.email && (
                        <a href={`mailto:${slot.resource.email}`} className="text-blue-500 hover:underline">
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {slot.resource.link && (
                        <a href={slot.resource.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          <Link className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSlot(slot)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSlot(slot.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingSlot && (
        <Dialog open={!!editingSlot} onOpenChange={(open) => !open && setEditingSlot(null)}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Slot</DialogTitle>
              <DialogDescription>
                Add or request a provider for this time slot
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Select Type</Label>
                <Select
                  value={selectedObject.type}
                  onValueChange={(value) => {
                    setSelectedObject({ ...selectedObject, type: value as 'artist' | 'resource' | 'venue' });
                    setSearchQuery('');
                    setSearchResults([]);
                    setIsCreatingNew(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select object type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="artist">Artist</SelectItem>
                    <SelectItem value="resource">Resource</SelectItem>
                    <SelectItem value="venue">Venue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder={`Add or search for ${selectedObject.type}s...`}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(selectedObject.type);
                    }}
                  />
                </div>

                {isCreatingNew ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        placeholder="Enter name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        placeholder="Enter location"
                        value={newItem.location}
                        onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email (optional)</Label>
                      <Input
                        placeholder="Enter email"
                        value={newItem.email}
                        onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Link (optional)</Label>
                      <Input
                        placeholder="Enter link"
                        value={newItem.link}
                        onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        placeholder="Add any additional notes or requirements"
                        value={newItem.notes}
                        onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                      />
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> This will add the {selectedObject.type} as a requested resource. 
                        Someone else will need to confirm they can provide it.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                    {searchQuery && (
                      <div
                        className="border rounded-lg p-4 cursor-pointer border-dashed hover:border-primary"
                        onClick={() => {
                          setNewItem({ ...newItem, name: searchQuery });
                          setIsCreatingNew(true);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-primary" />
                          <h4 className="font-medium">Request "{searchQuery}"</h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Add as requested {selectedObject.type}</p>
                      </div>
                    )}
                    {searchResults.map(item => (
                      <div
                        key={item.id}
                        className={`border rounded-lg p-4 cursor-pointer ${
                          selectedObject.item?.id === item.id ? 'border-primary' : ''
                        }`}
                        onClick={() => handleObjectSelect(selectedObject.type, item)}
                      >
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.location}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {editingSlot.startTime}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Input
                          type="time"
                          value={editingSlot.startTime}
                          onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {editingSlot.endTime}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Input
                          type="time"
                          value={editingSlot.endTime}
                          onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editingSlot.status}
                    onValueChange={(value) => setEditingSlot({ 
                      ...editingSlot, 
                      status: value as 'available' | 'reserved' | 'confirmed' | 'canceled' | 'requested'
                    })}
                    defaultValue="requested"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="requested">Requested</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Slot Type</Label>
                  <Select
                    value={editingSlot.slotType}
                    onValueChange={(value) => setEditingSlot({ 
                      ...editingSlot, 
                      slotType: value as 'performance' | 'setup' | 'breakdown' | 'break' | 'other'
                    })}
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
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes about this slot..."
                    value={editingSlot.notes || ''}
                    onChange={(e) => setEditingSlot({ ...editingSlot, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingSlot(null)}>
                Cancel
              </Button>
              {isCreatingNew ? (
                <Button onClick={handleCreateNewItem} variant="request">
                  Request & Save
                </Button>
              ) : (
                <Button onClick={() => handleSaveSlot(editingSlot)}>
                  Save
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default EventSlotManager;
