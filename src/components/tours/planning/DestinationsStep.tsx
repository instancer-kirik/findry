import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  MapPin,
  Plus,
  X,
  Calendar as CalendarIcon,
  Star,
  Mountain,
  Building,
  Trees,
  Waves,
  Sun,
  Music,
  Camera,
  Coffee,
  Trash2,
  Navigation,
  Clock,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TripPlanData, DestinationPlan } from '@/types/tour-planning';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface DestinationsStepProps {
  type: 'band_tour' | 'roadtrip';
  data: Partial<TripPlanData>;
  onUpdate: (data: Partial<TripPlanData>) => void;
}

const DestinationsStep: React.FC<DestinationsStepProps> = ({ type, data, onUpdate }) => {
  const [destinations, setDestinations] = useState<DestinationPlan[]>(data.destinations || []);
  const [isAddingDestination, setIsAddingDestination] = useState(false);
  const [newDestination, setNewDestination] = useState<Partial<DestinationPlan>>({
    type: 'city',
    activities: [],
    estimatedCost: 0
  });

  const destinationTypes = [
    { id: 'city', name: 'City', icon: Building, color: 'from-blue-500 to-indigo-500' },
    { id: 'nature', name: 'Nature', icon: Trees, color: 'from-green-500 to-emerald-500' },
    { id: 'beach', name: 'Beach', icon: Waves, color: 'from-cyan-500 to-blue-500' },
    { id: 'mountain', name: 'Mountain', icon: Mountain, color: 'from-gray-500 to-slate-600' },
    { id: 'desert', name: 'Desert', icon: Sun, color: 'from-orange-500 to-amber-500' },
    { id: 'venue', name: 'Venue', icon: Music, color: 'from-purple-500 to-pink-500' },
    { id: 'landmark', name: 'Landmark', icon: Camera, color: 'from-red-500 to-rose-500' }
  ];

  const suggestedActivities = [
    'Sightseeing', 'Hiking', 'Swimming', 'Photography', 'Local Food',
    'Museums', 'Concerts', 'Shopping', 'Camping', 'Nightlife',
    'Beach Day', 'Road Trip', 'Wildlife', 'Historical Sites', 'Adventure Sports'
  ];

  const handleAddDestination = () => {
    if (!newDestination.name || !newDestination.location) return;

    const destination: DestinationPlan = {
      id: `dest-${Date.now()}`,
      name: newDestination.name || '',
      location: newDestination.location || '',
      arrivalDate: newDestination.arrivalDate || new Date(),
      departureDate: newDestination.departureDate || new Date(),
      type: newDestination.type as DestinationPlan['type'] || 'city',
      activities: newDestination.activities || [],
      estimatedCost: newDestination.estimatedCost || 0,
      notes: newDestination.notes,
      isHighlight: newDestination.isHighlight
    };

    const updatedDestinations = [...destinations, destination];
    setDestinations(updatedDestinations);
    onUpdate({ destinations: updatedDestinations });

    setNewDestination({ type: 'city', activities: [], estimatedCost: 0 });
    setIsAddingDestination(false);
  };

  const handleRemoveDestination = (id: string) => {
    const updatedDestinations = destinations.filter(d => d.id !== id);
    setDestinations(updatedDestinations);
    onUpdate({ destinations: updatedDestinations });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(destinations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDestinations(items);
    onUpdate({ destinations: items });
  };

  const toggleActivity = (activity: string) => {
    const activities = newDestination.activities || [];
    const updated = activities.includes(activity)
      ? activities.filter(a => a !== activity)
      : [...activities, activity];
    setNewDestination({ ...newDestination, activities: updated });
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = destinationTypes.find(t => t.id === type);
    const Icon = typeConfig?.icon || MapPin;
    return <Icon className="h-4 w-4" />;
  };

  const calculateTotalCost = () => {
    return destinations.reduce((sum, dest) => sum + dest.estimatedCost, 0);
  };

  const calculateTotalDays = () => {
    if (destinations.length === 0) return 0;
    const days = destinations.reduce((sum, dest) => {
      const duration = Math.ceil((dest.departureDate.getTime() - dest.arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + duration;
    }, 0);
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Destinations</p>
                <p className="text-2xl font-bold">{destinations.length}</p>
              </div>
              <MapPin className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Days</p>
                <p className="text-2xl font-bold">{calculateTotalDays()}</p>
              </div>
              <Clock className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Est. Cost</p>
                <p className="text-2xl font-bold">${calculateTotalCost()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Destinations List */}
      {destinations.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">📍 Your Route</Label>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="destinations">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {destinations.map((dest, index) => {
                    const typeConfig = destinationTypes.find(t => t.id === dest.type);
                    const Icon = typeConfig?.icon || MapPin;

                    return (
                      <Draggable key={dest.id} draggableId={dest.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "transition-all",
                              snapshot.isDragging && "shadow-lg opacity-90"
                            )}
                          >
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
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold">{dest.name}</h4>
                                      {dest.isHighlight && (
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{dest.location}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        {format(dest.arrivalDate, 'MMM d')} - {format(dest.departureDate, 'MMM d')}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        ${dest.estimatedCost}
                                      </span>
                                    </div>
                                    {dest.activities.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {dest.activities.slice(0, 3).map((activity) => (
                                          <Badge key={activity} variant="secondary" className="text-xs">
                                            {activity}
                                          </Badge>
                                        ))}
                                        {dest.activities.length > 3 && (
                                          <Badge variant="secondary" className="text-xs">
                                            +{dest.activities.length - 3} more
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveDestination(dest.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* Add Destination Form */}
      {isAddingDestination ? (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Add New Destination</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingDestination(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Destination Name</Label>
                <Input
                  placeholder="e.g., San Francisco"
                  value={newDestination.name || ''}
                  onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g., California, USA"
                  value={newDestination.location || ''}
                  onChange={(e) => setNewDestination({ ...newDestination, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex flex-wrap gap-2">
                {destinationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant={newDestination.type === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewDestination({ ...newDestination, type: type.id as DestinationPlan['type'] })}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {type.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Arrival Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDestination.arrivalDate ? format(newDestination.arrivalDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newDestination.arrivalDate}
                      onSelect={(date) => date && setNewDestination({ ...newDestination, arrivalDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Departure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDestination.departureDate ? format(newDestination.departureDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newDestination.departureDate}
                      onSelect={(date) => date && setNewDestination({ ...newDestination, departureDate: date })}
                      disabled={(date) => (newDestination.arrivalDate ? date < newDestination.arrivalDate : false)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Activities</Label>
              <div className="flex flex-wrap gap-2">
                {suggestedActivities.map((activity) => (
                  <Badge
                    key={activity}
                    variant={newDestination.activities?.includes(activity) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleActivity(activity)}
                  >
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimated Cost ($)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newDestination.estimatedCost || ''}
                  onChange={(e) => setNewDestination({ ...newDestination, estimatedCost: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Highlight Destination?</Label>
                <Button
                  variant={newDestination.isHighlight ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewDestination({ ...newDestination, isHighlight: !newDestination.isHighlight })}
                  className="w-full"
                >
                  <Star className={cn("h-4 w-4 mr-1", newDestination.isHighlight && "fill-current")} />
                  {newDestination.isHighlight ? "Highlighted" : "Not Highlighted"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Any special notes about this destination..."
                value={newDestination.notes || ''}
                onChange={(e) => setNewDestination({ ...newDestination, notes: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingDestination(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDestination}>
                Add Destination
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsAddingDestination(true)}
          className="w-full"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Destination
        </Button>
      )}

      {/* Tips */}
      {destinations.length === 0 && (
        <div className="text-center p-8 bg-muted/50 rounded-lg">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-semibold mb-2">No destinations yet!</p>
          <p className="text-sm text-muted-foreground">
            Start planning your {type === 'band_tour' ? 'tour stops' : 'adventure'} by adding destinations above.
          </p>
        </div>
      )}

      {/* Fun tip */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
        <p className="text-sm">
          <span className="font-semibold">💡 Pro Tip:</span>{' '}
          {destinations.length === 0 && "Start with your must-see destinations, then fill in the route!"}
          {destinations.length > 0 && destinations.length < 3 && "Add a few more stops to make the journey memorable!"}
          {destinations.length >= 3 && "Great route! Drag destinations to reorder them."}
        </p>
      </div>
    </div>
  );
};

export default DestinationsStep;
