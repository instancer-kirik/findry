
import React from 'react';
import { Button } from '@/components/ui/button';
import { TourStop } from '@/types/content';
import { format } from 'date-fns';
import { MapPin, Clock, ArrowUp, ArrowDown, Music, Car, Coffee, Hotel, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStopsListProps {
  stops: TourStop[];
  onDelete: (stopId: string) => void;
  onReorder: (stopId: string, newOrder: number) => void;
}

const TourStopsList: React.FC<TourStopsListProps> = ({ stops, onDelete, onReorder }) => {
  // Sort by order
  const sortedStops = [...stops].sort((a, b) => a.order - b.order);
  
  const handleMoveUp = (stop: TourStop) => {
    if (stop.order > 1) {
      onReorder(stop.id, stop.order - 1);
    }
  };
  
  const handleMoveDown = (stop: TourStop) => {
    if (stop.order < stops.length) {
      onReorder(stop.id, stop.order + 1);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Tour Stops</h3>
      
      {sortedStops.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">No stops added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedStops.map((stop, index) => (
            <div 
              key={stop.id} 
              className={cn(
                "border rounded-lg p-3",
                stop.is_stop_point ? "bg-muted/30" : "bg-background"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {stop.order}
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center">
                      {stop.is_stop_point ? (
                        <Coffee className="h-4 w-4 mr-1" />
                      ) : (
                        stop.venue_id ? <Music className="h-4 w-4 mr-1" /> : <Car className="h-4 w-4 mr-1" />
                      )}
                      {stop.name}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {stop.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(stop.date), 'E, MMM d')}
                        {stop.arrival_time && ` • Arrive: ${stop.arrival_time}`}
                        {stop.departure_time && ` • Depart: ${stop.departure_time}`}
                      </div>
                      {stop.accommodation && (
                        <div className="flex items-center">
                          <Hotel className="h-3 w-3 mr-1" />
                          {stop.accommodation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleMoveUp(stop)} disabled={stop.order === 1}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleMoveDown(stop)} disabled={stop.order === stops.length}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(stop.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {index < sortedStops.length - 1 && stop.distance_from_previous && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Next: {stop.distance_from_previous} miles • {stop.travel_time_from_previous} travel time
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TourStopsList;
