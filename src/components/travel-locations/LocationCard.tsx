import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TravelLocation, LOCATION_TYPES } from '@/types/travel-location';
import { MapPin, Star, Navigation, Phone, Globe, Clock, Shield } from 'lucide-react';

interface LocationCardProps {
  location: TravelLocation;
  onSelect?: (id: string) => void;
  onDirections?: (location: TravelLocation) => void;
  selected?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onSelect, onDirections, selected }) => {
  const typeInfo = LOCATION_TYPES[location.type] || LOCATION_TYPES.other;

  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
      />
    ));
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${selected ? 'ring-2 ring-primary' : ''}`}
      onClick={() => onSelect?.(location.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{typeInfo.icon}</span>
              {location.name}
              {location.verified && <Shield className="h-4 w-4 text-green-500" />}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              {location.address || 'No address'}
            </CardDescription>
          </div>
          <Badge style={{ backgroundColor: typeInfo.color }} className="text-white">
            {typeInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {location.rating && (
          <div className="flex items-center gap-2">
            <div className="flex">{renderRatingStars(location.rating)}</div>
            <span className="text-sm text-muted-foreground">
              {location.rating.toFixed(1)} ({location.review_count || 0} reviews)
            </span>
          </div>
        )}

        {location.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{location.description}</p>
        )}

        {/* Quick Info Badges */}
        <div className="flex flex-wrap gap-1">
          {location.free && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              Free
            </Badge>
          )}
          {location.accessibility && (
            <Badge variant="secondary">♿ Accessible</Badge>
          )}
          {location.is_open_24h && (
            <Badge variant="secondary">24h</Badge>
          )}
          {location.amenities?.includes('restrooms') && (
            <Badge variant="secondary">🚻 Restrooms</Badge>
          )}
          {location.amenities?.includes('showers') && (
            <Badge variant="secondary">🚿 Showers</Badge>
          )}
          {location.amenities?.includes('water') && (
            <Badge variant="secondary">💧 Water</Badge>
          )}
          {location.amenities?.includes('dump_station') && (
            <Badge variant="secondary">🚰 Dump</Badge>
          )}
        </div>

        {/* Hours */}
        {location.hours && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> {location.hours}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onDirections?.(location);
            }}
          >
            <Navigation className="h-4 w-4 mr-1" />
            Directions
          </Button>
          {location.phone && (
            <Button size="sm" variant="outline" asChild>
              <a href={`tel:${location.phone}`} onClick={(e) => e.stopPropagation()}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}
          {location.website && (
            <Button size="sm" variant="outline" asChild>
              <a href={location.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <Globe className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
