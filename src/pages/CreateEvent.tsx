import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ContentItemProps } from '@/components/marketplace/ContentCard';
import EventComponentSearch from '@/components/events/EventComponentSearch';
import { useToast } from '@/hooks/use-toast';

const CreateEvent: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState<number | undefined>(undefined);
  const [selectedComponents, setSelectedComponents] = useState<ContentItemProps[]>([]);
  const { toast } = useToast();

  const handleComponentSelect = (item: ContentItemProps) => {
    setSelectedComponents(prev => [...prev, item]);
  };

  const handleComponentRemove = (itemId: string) => {
    setSelectedComponents(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      name,
      description,
      startDate,
      endDate,
      location,
      capacity,
      selectedComponents
    });
    toast({
      title: 'Event Created',
      description: 'Your event has been created successfully.',
    });
  };

  // Fix the variable references
  const venue = selectedComponents.find(item => item.type === 'venues');
  const artist = selectedComponents.find(item => item.type === 'artists');
  const brand = selectedComponents.find(item => item.type === 'brands');
  const community = selectedComponents.find(item => item.type === 'communities');

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Create Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Event Name"
              required
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event Description"
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) =>
                      date < (startDate || new Date())
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Event Location"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              type="number"
              id="capacity"
              value={capacity || ''}
              onChange={(e) => setCapacity(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              placeholder="Event Capacity"
              className="w-full"
            />
          </div>

          <div>
            <Label>Add Components</Label>
            <EventComponentSearch
              onSelectItem={handleComponentSelect}
              selectedItems={selectedComponents}
              onRemoveItem={handleComponentRemove}
              componentType="all"
            />
          </div>

          {venue && (
            <div>
              <Label>Venue</Label>
              <Input
                type="text"
                value={venue.name}
                readOnly
                className="w-full"
              />
            </div>
          )}

          {artist && (
            <div>
              <Label>Artist</Label>
              <Input
                type="text"
                value={artist.name}
                readOnly
                className="w-full"
              />
            </div>
          )}

          {brand && (
            <div>
              <Label>Brand</Label>
              <Input
                type="text"
                value={brand.name}
                readOnly
                className="w-full"
              />
            </div>
          )}

          {community && (
            <div>
              <Label>Community</Label>
              <Input
                type="text"
                value={community.name}
                readOnly
                className="w-full"
              />
            </div>
          )}

          <Button type="submit" className="w-full">Create Event</Button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateEvent;
