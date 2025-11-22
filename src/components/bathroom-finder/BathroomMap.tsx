import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Star, Accessibility, Baby } from 'lucide-react';

interface PublicBathroom {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'public' | 'business' | 'restaurant' | 'gas_station' | 'park' | 'shopping_center';
  rating: number;
  reviews: number;
  distance: number;
  isOpen: boolean;
  hours?: string;
  amenities: string[];
  accessibility: boolean;
  baby_changing: boolean;
  free: boolean;
  verified: boolean;
  description?: string;
  cleanliness_rating: number;
  safety_rating: number;
}

interface BathroomMapProps {
  bathrooms: PublicBathroom[];
  userLocation?: { lat: number; lng: number };
  selectedBathroom?: string;
  onBathroomSelect?: (id: string) => void;
  className?: string;
}

const BathroomMap: React.FC<BathroomMapProps> = ({
  bathrooms,
  userLocation,
  selectedBathroom,
  onBathroomSelect,
  className = ""
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'park': return '#22c55e';
      case 'business': return '#3b82f6';
      case 'restaurant': return '#f59e0b';
      case 'gas_station': return '#ef4444';
      case 'shopping_center': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'park': return '🏞️';
      case 'business': return '🏢';
      case 'restaurant': return '🍽️';
      case 'gas_station': return '⛽';
      case 'shopping_center': return '🛍️';
      default: return '🚻';
    }
  };

  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  // This would be replaced with actual map integration (Google Maps, Mapbox, etc.)
  useEffect(() => {
    if (mapContainerRef.current) {
      // Initialize map here
      console.log('Map would be initialized with bathrooms:', bathrooms);
    }
  }, [bathrooms, userLocation]);

  return (
    <div className={`relative ${className}`}>
      {/* Map Container - This would contain the actual map */}
      <div
        ref={mapContainerRef}
        className="w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden"
      >
        {/* Placeholder Map Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* User Location */}
        {userLocation && (
          <div
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${50 + (Math.random() - 0.5) * 20}%`,
              top: `${50 + (Math.random() - 0.5) * 20}%`
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        )}

        {/* Bathroom Markers */}
        {bathrooms.map((bathroom, index) => {
          const isSelected = selectedBathroom === bathroom.id;
          const xPos = 20 + (index * 15) % 60;
          const yPos = 20 + Math.floor(index / 4) * 20;

          return (
            <div
              key={bathroom.id}
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${xPos}%`, top: `${yPos}%` }}
              onClick={() => onBathroomSelect?.(bathroom.id)}
            >
              {/* Marker */}
              <div className={`relative transition-all duration-200 ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
                <div
                  className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: getTypeColor(bathroom.type) }}
                >
                  <span className="text-xs">{getTypeIcon(bathroom.type)}</span>
                </div>

                {/* Status indicator */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
                  bathroom.isOpen ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>

              {/* Popup on hover/selection */}
              {isSelected && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-30">
                  <Card className="w-64 shadow-lg">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm truncate">{bathroom.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{bathroom.address}</p>
                        </div>
                        <Badge variant={bathroom.isOpen ? "default" : "secondary"} className="text-xs ml-2">
                          {bathroom.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        {renderRatingStars(bathroom.rating)}
                        <span className="text-xs text-muted-foreground">({bathroom.reviews})</span>
                      </div>

                      <div className="flex gap-1 mb-2">
                        {bathroom.accessibility && (
                          <Accessibility className="h-3 w-3 text-blue-500" />
                        )}
                        {bathroom.baby_changing && (
                          <Baby className="h-3 w-3 text-pink-500" />
                        )}
                        {bathroom.free && (
                          <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Free</span>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground mb-2">
                        {bathroom.distance} mi away
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" className="flex-1 h-7 text-xs">
                          <Navigation className="h-3 w-3 mr-1" />
                          Directions
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          );
        })}

        {/* Map overlay message */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-blue-500" />
            <h3 className="text-lg font-semibold mb-2">Interactive Map View</h3>
            <p className="text-sm text-muted-foreground mb-3">
              This placeholder shows bathroom locations.<br />
              Real implementation would use Google Maps, Mapbox, or similar.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>You</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Open</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
          <span className="text-lg">+</span>
        </Button>
        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
          <span className="text-lg">−</span>
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-30">
        <Card className="p-2">
          <CardContent className="p-0">
            <div className="text-xs font-medium mb-2">Legend</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-sm">🏞️</span>
                <span>Park</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">🏢</span>
                <span>Business</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">🍽️</span>
                <span>Restaurant</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">⛽</span>
                <span>Gas Station</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">🛍️</span>
                <span>Shopping</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">🚻</span>
                <span>Public</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BathroomMap;
