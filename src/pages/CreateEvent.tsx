import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import EventComponentSearch from '@/components/events/EventComponentSearch';
import { ContentItemProps } from '@/components/marketplace/ContentCard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/database';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState<number | undefined>(undefined);
  const [selectedVenue, setSelectedVenue] = useState<ContentItemProps | null>(null);
  const [selectedArtists, setSelectedArtists] = useState<ContentItemProps[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<ContentItemProps[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<ContentItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create an event',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          name,
          description,
          start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null,
          end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
          location,
          capacity,
        })
        .select()
        .single();

      if (eventError) throw eventError;

      const { error: ownershipError } = await supabase
        .from('content_ownership')
        .insert({
          content_id: event.id,
          content_type: 'event' as ContentType,
          owner_id: user.id,
        });

      if (ownershipError) throw ownershipError;

      toast({
        title: 'Event created',
        description: 'Your event has been created successfully'
      });

      navigate(`/events/${event.id}`);
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error creating event',
        description: error.message || 'An error occurred while creating the event',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveVenue = () => {
    setSelectedVenue(null);
  };

  const handleAddArtist = (artist: ContentItemProps) => {
    setSelectedArtists(prev => [...prev, artist]);
  };

  const handleRemoveArtist = (artistId: string) => {
    setSelectedArtists(prev => prev.filter(artist => artist.id !== artistId));
  };

  const handleAddBrand = (brand: ContentItemProps) => {
    setSelectedBrands(prev => [...prev, brand]);
  };

  const handleRemoveBrand = (brandId: string) => {
    setSelectedBrands(prev => prev.filter(brand => brand.id !== brandId));
  };

  const handleAddCommunity = (community: ContentItemProps) => {
    setSelectedCommunities(prev => [...prev, community]);
  };

  const handleRemoveCommunity = (communityId: string) => {
    setSelectedCommunities(prev => prev.filter(community => community.id !== communityId));
  };

  const venue = selectedVenue ? (
    <div className="flex items-center gap-2 border p-2 rounded-md bg-muted/50">
      {selectedVenue.image_url && (
        <img src={selectedVenue.image_url} alt={selectedVenue.name} className="h-8 w-8 rounded-md object-cover" />
      )}
      <div>
        <p className="text-sm font-medium">{selectedVenue.name}</p>
        {selectedVenue.location && (
          <p className="text-xs text-muted-foreground">{selectedVenue.location}</p>
        )}
      </div>
    </div>
  ) : null;

  const artist = selectedArtists.length > 0 ? (
    <div className="space-y-2">
      {selectedArtists.map(artist => (
        <div key={artist.id} className="flex justify-between items-center border p-2 rounded-md bg-muted/50">
          <div className="flex items-center gap-2">
            {artist.image_url && (
              <img src={artist.image_url} alt={artist.name} className="h-8 w-8 rounded-md object-cover" />
            )}
            <div>
              <p className="text-sm font-medium">{artist.name}</p>
              {artist.disciplines && artist.disciplines.length > 0 && (
                <p className="text-xs text-muted-foreground">{artist.disciplines.join(', ')}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveArtist(artist.id)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  ) : null;

  const brand = selectedBrands.length > 0 ? (
    <div className="space-y-2">
      {selectedBrands.map(brand => (
        <div key={brand.id} className="flex justify-between items-center border p-2 rounded-md bg-muted/50">
          <div className="flex items-center gap-2">
            {brand.image_url && (
              <img src={brand.image_url} alt={brand.name} className="h-8 w-8 rounded-md object-cover" />
            )}
            <div>
              <p className="text-sm font-medium">{brand.name}</p>
              {brand.type && (
                <p className="text-xs text-muted-foreground">{brand.type}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveBrand(brand.id)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  ) : null;

  const community = selectedCommunities.length > 0 ? (
    <div className="space-y-2">
      {selectedCommunities.map(community => (
        <div key={community.id} className="flex justify-between items-center border p-2 rounded-md bg-muted/50">
          <div className="flex items-center gap-2">
            {community.image_url && (
              <img src={community.image_url} alt={community.name} className="h-8 w-8 rounded-md object-cover" />
            )}
            <div>
              <p className="text-sm font-medium">{community.name}</p>
              {community.category && (
                <p className="text-xs text-muted-foreground">{community.category}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveCommunity(community.id)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  ) : null;

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Create a New Event</h1>

        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Event Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                      {startDate ? format(startDate, 'MMMM dd, yyyy') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={date => date > (endDate || new Date())}
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
                      {endDate ? format(endDate, 'MMMM dd, yyyy') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={date => date < (startDate || new Date())}
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
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                type="number"
                id="capacity"
                value={capacity === undefined ? '' : capacity.toString()}
                onChange={(e) => setCapacity(e.target.value === '' ? undefined : parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label>Venue</Label>
              <EventComponentSearch
                componentType="venues"
                onSelectItem={(item) => setSelectedVenue(item)}
                selectedItems={selectedVenue ? [selectedVenue] : []}
                onRemoveItem={handleRemoveVenue}
              />
              {venue}
            </div>

            <div>
              <Label>Artists</Label>
              <EventComponentSearch
                componentType="artists"
                onSelectItem={handleAddArtist}
                selectedItems={selectedArtists}
                onRemoveItem={handleRemoveArtist}
              />
              {artist}
            </div>

            <div>
              <Label>Brands</Label>
              <EventComponentSearch
                componentType="brands"
                onSelectItem={handleAddBrand}
                selectedItems={selectedBrands}
                onRemoveItem={handleRemoveBrand}
              />
              {brand}
            </div>

            <div>
              <Label>Communities</Label>
              <EventComponentSearch
                componentType="communities"
                onSelectItem={handleAddCommunity}
                selectedItems={selectedCommunities}
                onRemoveItem={handleRemoveCommunity}
              />
              {community}
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateEvent;
