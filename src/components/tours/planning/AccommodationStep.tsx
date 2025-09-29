import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Hotel,
  Home,
  Tent,
  Users,
  Wifi,
  Car,
  Coffee,
  Bath,
  Utensils,
  Wind,
  Calendar as CalendarIcon,
  DollarSign,
  Plus,
  X,
  Trash2,
  MapPin,
  Star,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TripPlanData, AccommodationPlan, DestinationPlan } from '@/types/tour-planning';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AccommodationStepProps {
  type: 'band_tour' | 'roadtrip';
  data: Partial<TripPlanData>;
  onUpdate: (data: Partial<TripPlanData>) => void;
}

const AccommodationStep: React.FC<AccommodationStepProps> = ({ type, data, onUpdate }) => {
  const [accommodations, setAccommodations] = useState<AccommodationPlan[]>(data.accommodation || []);
  const [isAddingAccommodation, setIsAddingAccommodation] = useState(false);
  const [newAccommodation, setNewAccommodation] = useState<Partial<AccommodationPlan>>({
    type: 'hotel',
    amenities: [],
    cost: 0
  });

  const accommodationTypes = [
    { id: 'hotel', name: 'Hotel', icon: Hotel, color: 'from-blue-500 to-indigo-500', avgCost: 120 },
    { id: 'motel', name: 'Motel', icon: Home, color: 'from-purple-500 to-pink-500', avgCost: 60 },
    { id: 'airbnb', name: 'Airbnb', icon: Home, color: 'from-green-500 to-emerald-500', avgCost: 90 },
    { id: 'camping', name: 'Camping', icon: Tent, color: 'from-orange-500 to-amber-500', avgCost: 30 },
    { id: 'hostel', name: 'Hostel', icon: Users, color: 'from-cyan-500 to-blue-500', avgCost: 40 },
    { id: 'friends', name: 'Friends/Family', icon: Users, color: 'from-pink-500 to-rose-500', avgCost: 0 },
    { id: 'rv', name: 'RV/Van', icon: Car, color: 'from-gray-500 to-slate-600', avgCost: 20 }
  ];

  const amenities = [
    { id: 'wifi', name: 'WiFi', icon: Wifi },
    { id: 'parking', name: 'Parking', icon: Car },
    { id: 'breakfast', name: 'Breakfast', icon: Coffee },
    { id: 'bathroom', name: 'Private Bath', icon: Bath },
    { id: 'kitchen', name: 'Kitchen', icon: Utensils },
    { id: 'ac', name: 'AC/Heating', icon: Wind },
    { id: 'pool', name: 'Pool', icon: Hotel },
    { id: 'gym', name: 'Gym', icon: Hotel },
    { id: 'laundry', name: 'Laundry', icon: Home },
    { id: 'petfriendly', name: 'Pet Friendly', icon: Users }
  ];

  const handleAddAccommodation = () => {
    if (!newAccommodation.name || !newAccommodation.destinationId) return;

    const accommodation: AccommodationPlan = {
      id: `acc-${Date.now()}`,
      destinationId: newAccommodation.destinationId || '',
      type: newAccommodation.type as AccommodationPlan['type'] || 'hotel',
      name: newAccommodation.name || '',
      address: newAccommodation.address,
      checkIn: newAccommodation.checkIn || new Date(),
      checkOut: newAccommodation.checkOut || new Date(),
      cost: newAccommodation.cost || 0,
      amenities: newAccommodation.amenities || [],
      bookingConfirmation: newAccommodation.bookingConfirmation,
      notes: newAccommodation.notes
    };

    const updatedAccommodations = [...accommodations, accommodation];
    setAccommodations(updatedAccommodations);
    onUpdate({ accommodation: updatedAccommodations });

    setNewAccommodation({ type: 'hotel', amenities: [], cost: 0 });
    setIsAddingAccommodation(false);
  };

  const handleRemoveAccommodation = (id: string) => {
    const updatedAccommodations = accommodations.filter(a => a.id !== id);
    setAccommodations(updatedAccommodations);
    onUpdate({ accommodation: updatedAccommodations });
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = newAccommodation.amenities || [];
    const updated = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    setNewAccommodation({ ...newAccommodation, amenities: updated });
  };

  const getDestinationName = (destinationId: string) => {
    const destination = data.destinations?.find(d => d.id === destinationId);
    return destination ? destination.name : 'Unknown';
  };

  const calculateTotalCost = () => {
    return accommodations.reduce((sum, acc) => sum + acc.cost, 0);
  };

  const calculateAverageNightCost = () => {
    if (accommodations.length === 0) return 0;
    const totalNights = accommodations.reduce((sum, acc) => {
      const nights = Math.ceil((acc.checkOut.getTime() - acc.checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0);
    return totalNights > 0 ? Math.round(calculateTotalCost() / totalNights) : 0;
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = accommodationTypes.find(t => t.id === type);
    const Icon = typeConfig?.icon || Hotel;
    return <Icon className="h-4 w-4" />;
  };

  const getAmenityIcon = (amenityId: string) => {
    const amenity = amenities.find(a => a.id === amenityId);
    const Icon = amenity?.icon || Hotel;
    return <Icon className="h-3 w-3" />;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bookings</p>
                <p className="text-2xl font-bold">{accommodations.length}</p>
              </div>
              <Hotel className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">${calculateTotalCost()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg/Night</p>
                <p className="text-2xl font-bold">${calculateAverageNightCost()}</p>
              </div>
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert if no destinations */}
      {(!data.destinations || data.destinations.length === 0) && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Add destinations first to plan your accommodations for each stop.
          </AlertDescription>
        </Alert>
      )}

      {/* Accommodations List */}
      {accommodations.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">🏨 Your Stays</Label>
          <div className="space-y-2">
            {accommodations.map((acc) => {
              const typeConfig = accommodationTypes.find(t => t.id === acc.type);
              const Icon = typeConfig?.icon || Hotel;

              return (
                <Card key={acc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          "p-2 rounded-lg bg-gradient-to-r text-white",
                          typeConfig?.color
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">{acc.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {getDestinationName(acc.destinationId)}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {format(acc.checkIn, 'MMM d')} - {format(acc.checkOut, 'MMM d')}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${acc.cost}
                            </span>
                          </div>
                          {acc.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {acc.amenities.slice(0, 4).map((amenity) => (
                                <Badge key={amenity} variant="secondary" className="text-xs">
                                  {getAmenityIcon(amenity)}
                                  <span className="ml-1">{amenity}</span>
                                </Badge>
                              ))}
                              {acc.amenities.length > 4 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{acc.amenities.length - 4} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAccommodation(acc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Accommodation Form */}
      {isAddingAccommodation && data.destinations && data.destinations.length > 0 ? (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Add Accommodation</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingAccommodation(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Accommodation Name</Label>
                <Input
                  placeholder="e.g., Hilton Downtown"
                  value={newAccommodation.name || ''}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Destination</Label>
                <Select
                  value={newAccommodation.destinationId}
                  onValueChange={(value) => setNewAccommodation({ ...newAccommodation, destinationId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.destinations?.map((dest) => (
                      <SelectItem key={dest.id} value={dest.id}>
                        {dest.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex flex-wrap gap-2">
                {accommodationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant={newAccommodation.type === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewAccommodation({ ...newAccommodation, type: type.id as AccommodationPlan['type'] })}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {type.name}
                      <span className="ml-2 text-xs opacity-70">(~${type.avgCost}/night)</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newAccommodation.checkIn ? format(newAccommodation.checkIn, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newAccommodation.checkIn}
                      onSelect={(date) => date && setNewAccommodation({ ...newAccommodation, checkIn: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newAccommodation.checkOut ? format(newAccommodation.checkOut, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newAccommodation.checkOut}
                      onSelect={(date) => date && setNewAccommodation({ ...newAccommodation, checkOut: date })}
                      disabled={(date) => (newAccommodation.checkIn ? date <= newAccommodation.checkIn : false)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenities.map((amenity) => {
                  const Icon = amenity.icon;
                  return (
                    <Badge
                      key={amenity.id}
                      variant={newAccommodation.amenities?.includes(amenity.name) ? "default" : "outline"}
                      className="cursor-pointer py-2 justify-start"
                      onClick={() => toggleAmenity(amenity.name)}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {amenity.name}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Cost ($)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newAccommodation.cost || ''}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, cost: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Booking Confirmation #</Label>
                <Input
                  placeholder="Optional"
                  value={newAccommodation.bookingConfirmation || ''}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, bookingConfirmation: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                placeholder="Optional address"
                value={newAccommodation.address || ''}
                onChange={(e) => setNewAccommodation({ ...newAccommodation, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Any special notes about this accommodation..."
                value={newAccommodation.notes || ''}
                onChange={(e) => setNewAccommodation({ ...newAccommodation, notes: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingAccommodation(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAccommodation}>
                Add Accommodation
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsAddingAccommodation(true)}
          className="w-full"
          variant="outline"
          disabled={!data.destinations || data.destinations.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Accommodation
        </Button>
      )}

      {/* Tips */}
      {accommodations.length === 0 && (
        <div className="text-center p-8 bg-muted/50 rounded-lg">
          <Hotel className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-semibold mb-2">No accommodations yet!</p>
          <p className="text-sm text-muted-foreground">
            {data.destinations && data.destinations.length > 0
              ? "Add places to stay for your destinations."
              : "Add destinations first, then plan where you'll stay."}
          </p>
        </div>
      )}

      {/* Accommodation tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Save on Stays
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Mix hotels with camping for variety</li>
              <li>• Book early for better rates</li>
              <li>• Consider hostels in expensive cities</li>
              <li>• Stay with friends when possible</li>
              {type === 'band_tour' && <li>• Look for band-friendly motels</li>}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600" />
              Accommodation Tips
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check cancellation policies</li>
              <li>• Read reviews carefully</li>
              <li>• Verify parking availability</li>
              <li>• Screenshot confirmation codes</li>
              {type === 'band_tour' && <li>• Ensure equipment security</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccommodationStep;
