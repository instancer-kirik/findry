
import React, { useState, useEffect } from 'react';
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

export interface EventSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  isPending?: boolean;
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
  const [hours, setHours] = useState<string>('00');
  const [minutes, setMinutes] = useState<string>('00');

  // Parse value into hours and minutes
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':');
      setHours(hour || '00');
      setMinutes(minute || '00');
    }
  }, [value]);

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

const EventSlotManager: React.FC<EventSlotManagerProps> = ({
  slots,
  onSlotsChange,
  eventStartTime,
  eventEndTime,
  eventDate,
  readOnly = false
}) => {
  const [localSlots, setLocalSlots] = useState<EventSlot[]>(slots);

  useEffect(() => {
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
      isPending: false
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Time Slots
        </h3>
        
        {!readOnly && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-2"
            onClick={handleAddSlot}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Slot
          </Button>
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
                "p-3 border rounded-md flex items-center gap-2",
                slot.isBooked ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20" : "",
                slot.isPending ? "border-blue-300 bg-blue-50 dark:bg-blue-950/20" : ""
              )}
            >
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Start Time</label>
                  <TimePicker
                    value={slot.startTime}
                    onChange={(value) => handleTimeChange(slot.id, 'startTime', value)}
                    disabled={readOnly || slot.isBooked || slot.isPending}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">End Time</label>
                  <TimePicker
                    value={slot.endTime}
                    onChange={(value) => handleTimeChange(slot.id, 'endTime', value)}
                    disabled={readOnly || slot.isBooked || slot.isPending}
                    className="h-8"
                  />
                </div>
              </div>
              
              {slot.isBooked && (
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                  Booked
                </div>
              )}
              
              {slot.isPending && (
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  Pending
                </div>
              )}
              
              {!readOnly && !slot.isBooked && !slot.isPending && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7" 
                  onClick={() => handleRemoveSlot(slot.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventSlotManager;
