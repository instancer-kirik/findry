
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Calendar, Clock } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from "sonner";

export interface EventSlot {
  id: string;
  startTime: string;
  endTime: string;
  title?: string;
  description?: string;
  isBooked?: boolean;
  isPending?: boolean;
  type?: 'performance' | 'setup' | 'breakdown' | 'break' | 'other';
}

export interface EventSlotManagerProps {
  slots: EventSlot[];
  onSlotsChange: (newSlots: EventSlot[]) => void;
  eventStartTime: string;
  eventEndTime: string;
  eventDate: Date;
  readOnly?: boolean;
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

const EventSlotManager: React.FC<EventSlotManagerProps> = ({
  slots,
  onSlotsChange,
  eventStartTime,
  eventEndTime,
  eventDate,
  readOnly = false
}) => {
  const [localSlots, setLocalSlots] = useState<EventSlot[]>(slots);
  const [editingSlot, setEditingSlot] = useState<EventSlot | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  React.useEffect(() => {
    setLocalSlots(slots);
  }, [slots]);

  const handleAddSlot = () => {
    const newId = `slot_${Date.now()}`;
    const defaultStartTime = eventStartTime;
    const defaultEndTime = eventEndTime;
    
    const newSlot: EventSlot = {
      id: newId,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      isBooked: false,
      isPending: false,
      type: 'other'
    };
    
    const updatedSlots = [...localSlots, newSlot];
    setLocalSlots(updatedSlots);
    onSlotsChange(updatedSlots);
  };

  const handleRemoveSlot = (slotId: string) => {
    const updatedSlots = localSlots.filter(slot => slot.id !== slotId);
    setLocalSlots(updatedSlots);
    onSlotsChange(updatedSlots);
  };

  const handleTimeChange = (slotId: string, field: 'startTime' | 'endTime', value: string) => {
    const updatedSlots = localSlots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, [field]: value };
      }
      return slot;
    });
    
    setLocalSlots(updatedSlots);
    onSlotsChange(updatedSlots);
  };

  const handleEditSlot = (slot: EventSlot) => {
    setEditingSlot({...slot});
    setIsEditDialogOpen(true);
  };

  const handleSaveSlot = () => {
    if (!editingSlot) return;
    
    const updatedSlots = localSlots.map(slot => 
      slot.id === editingSlot.id ? editingSlot : slot
    );
    
    setLocalSlots(updatedSlots);
    onSlotsChange(updatedSlots);
    setIsEditDialogOpen(false);
    setEditingSlot(null);
  };

  const handleSortSlots = () => {
    const sorted = [...localSlots].sort((a, b) => {
      // Convert time strings to comparable format
      const aTime = a.startTime.replace(':', '');
      const bTime = b.startTime.replace(':', '');
      return parseInt(aTime) - parseInt(bTime);
    });
    
    setLocalSlots(sorted);
    onSlotsChange(sorted);
    toast.success("Slots sorted by start time");
  };

  const getSlotTypeBadgeStyles = (type?: string) => {
    switch (type) {
      case 'performance':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";
      case 'setup':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case 'breakdown':
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300";
      case 'break':
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Time Slots
        </h3>
        
        {!readOnly && (
          <div className="flex">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2"
              onClick={handleAddSlot}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Slot
            </Button>
            
            {localSlots.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 ml-2"
                onClick={handleSortSlots}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
                Sort
              </Button>
            )}
          </div>
        )}
      </div>
      
      {localSlots.length === 0 ? (
        <div className="text-sm text-muted-foreground p-4 text-center border rounded-md">
          No time slots defined
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {localSlots.map(slot => (
            <div 
              key={slot.id} 
              className={cn(
                "p-3 border rounded-md",
                slot.isBooked ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20" : "",
                slot.isPending ? "border-blue-300 bg-blue-50 dark:bg-blue-950/20" : "",
                "hover:border-gray-300 transition-colors"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {slot.type && (
                    <Badge className={cn("text-xs", getSlotTypeBadgeStyles(slot.type))}>
                      {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                    </Badge>
                  )}
                  {slot.title && <span className="font-medium">{slot.title}</span>}
                </div>
                
                {!readOnly && !slot.isBooked && !slot.isPending && (
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-7 w-7" 
                      onClick={() => handleEditSlot(slot)}
                    >
                      <span className="sr-only">Edit slot</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-7 w-7" 
                      onClick={() => handleRemoveSlot(slot.id)}
                    >
                      <span className="sr-only">Remove slot</span>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Start</label>
                  <TimePicker
                    value={slot.startTime}
                    onChange={(value) => handleTimeChange(slot.id, 'startTime', value)}
                    disabled={readOnly || slot.isBooked || slot.isPending}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">End</label>
                  <TimePicker
                    value={slot.endTime}
                    onChange={(value) => handleTimeChange(slot.id, 'endTime', value)}
                    disabled={readOnly || slot.isBooked || slot.isPending}
                    className="h-8"
                  />
                </div>
              </div>
              
              {slot.description && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">{slot.description}</p>
                </div>
              )}
              
              {slot.isBooked && (
                <div className="mt-2">
                  <Badge className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                    Booked
                  </Badge>
                </div>
              )}
              
              {slot.isPending && (
                <div className="mt-2">
                  <Badge className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    Pending
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Edit Slot Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Time Slot</DialogTitle>
          </DialogHeader>
          
          {editingSlot && (
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="slot-title">Title</Label>
                <Input 
                  id="slot-title" 
                  value={editingSlot.title || ''} 
                  onChange={(e) => setEditingSlot({...editingSlot, title: e.target.value})}
                  placeholder="Slot title"
                />
              </div>
              
              <div>
                <Label htmlFor="slot-type">Type</Label>
                <SlotTypeSelector 
                  value={editingSlot.type}
                  onChange={(value) => setEditingSlot({...editingSlot, type: value as any})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="slot-start-time">Start Time</Label>
                  <TimePicker
                    value={editingSlot.startTime}
                    onChange={(value) => setEditingSlot({...editingSlot, startTime: value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="slot-end-time">End Time</Label>
                  <TimePicker
                    value={editingSlot.endTime}
                    onChange={(value) => setEditingSlot({...editingSlot, endTime: value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="slot-description">Description</Label>
                <Input
                  id="slot-description"
                  value={editingSlot.description || ''}
                  onChange={(e) => setEditingSlot({...editingSlot, description: e.target.value})}
                  placeholder="Details about this time slot"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSlot}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventSlotManager;
