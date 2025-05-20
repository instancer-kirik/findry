
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TourStop } from '@/types/content';

interface CreateStopFormProps {
  tourType: 'band_tour' | 'roadtrip';
  onSubmit: (stop: Omit<TourStop, 'id' | 'tour_id'>) => void;
  onCancel: () => void;
  defaultOrder: number;
}

const CreateStopForm: React.FC<CreateStopFormProps> = ({ tourType, onSubmit, onCancel, defaultOrder }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(defaultOrder);
  const [accommodation, setAccommodation] = useState('');
  const [isStopPoint, setIsStopPoint] = useState(false);
  const [venueId, setVenueId] = useState('');
  const [venueOptions] = useState([
    { id: 'venue-1', name: 'The Fillmore' },
    { id: 'venue-2', name: 'Red Rocks Amphitheatre' },
    { id: 'venue-3', name: 'House of Blues' },
    { id: 'venue-4', name: 'Madison Square Garden' },
  ]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !location || !date) {
      return; // Basic validation
    }
    
    onSubmit({
      name,
      location,
      address,
      date: date.toISOString(),
      arrival_time: arrivalTime,
      departure_time: departureTime,
      description,
      order,
      accommodation,
      is_stop_point: isStopPoint,
      venue_id: venueId || undefined
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Stop Name</Label>
          <Input
            id="name"
            placeholder="Enter stop name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            min={1}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">City/Location</Label>
        <Input
          id="location"
          placeholder="Enter city or location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Full Address</Label>
        <Input
          id="address"
          placeholder="Enter full address (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      
      {tourType === 'band_tour' && (
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Select value={venueId} onValueChange={setVenueId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a venue (optional)" />
            </SelectTrigger>
            <SelectContent>
              {venueOptions.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>{venue.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="arrival">Arrival Time</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
            </span>
            <Input
              id="arrival"
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="rounded-l-none"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="departure">Departure Time</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
            </span>
            <Input
              id="departure"
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="rounded-l-none"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accommodation">Accommodation</Label>
        <Input
          id="accommodation"
          placeholder="Where will you stay? (hotel, friend's place, etc.)"
          value={accommodation}
          onChange={(e) => setAccommodation(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Notes</Label>
        <Textarea
          id="description"
          placeholder="Any additional notes about this stop"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="stop-point"
          checked={isStopPoint}
          onCheckedChange={setIsStopPoint}
        />
        <Label htmlFor="stop-point">
          This is just a stop point (not a {tourType === 'band_tour' ? 'performance' : 'main destination'})
        </Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Stop
        </Button>
      </div>
    </form>
  );
};

export default CreateStopForm;
