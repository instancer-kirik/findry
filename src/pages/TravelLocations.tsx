import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import TravelMap from '@/components/travel-locations/TravelMap';
import LocationCard from '@/components/travel-locations/LocationCard';
import { useTravelLocations } from '@/hooks/use-travel-locations';
import { LOCATION_TYPES, TravelLocation } from '@/types/travel-location';
import {
  MapPin, Search, Navigation, Filter, List, Map as MapIcon, Plus, Loader2
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger
} from '@/components/ui/sheet';

const MAPBOX_TOKEN_KEY = 'mapbox_public_token';

const TravelLocations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [view, setView] = useState<'list' | 'map'>('map');
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>();
  const [mapboxToken, setMapboxToken] = useState(() => localStorage.getItem(MAPBOX_TOKEN_KEY) || '');
  const [filters, setFilters] = useState({
    type: undefined as string | undefined,
    free: false,
  });
  const { toast } = useToast();

  const { data: locations = [], isLoading } = useTravelLocations({
    type: filters.type,
    free: filters.free || undefined,
  });

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({ title: 'Location found', description: 'Showing locations near you.' });
        },
        () => {
          toast({
            title: 'Location error',
            description: 'Could not get your location.',
            variant: 'destructive',
          });
        }
      );
    }
  };

  const handleDirections = (location: TravelLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(url, '_blank');
  };

  const saveMapboxToken = (token: string) => {
    setMapboxToken(token);
    localStorage.setItem(MAPBOX_TOKEN_KEY, token);
    toast({ title: 'Token saved' });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              Travel Locations
            </h1>
            <p className="text-muted-foreground mt-1">
              Find campsites, RV parks, dump stations, and more
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={getCurrentLocation}>
              <Navigation className="h-4 w-4 mr-2" />
              Near Me
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        </div>

        {/* Mapbox Token Input */}
        {!mapboxToken && (
          <Card className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div className="flex-1">
                  <Label className="text-amber-800 dark:text-amber-200">Mapbox Public Token Required</Label>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                    Enter your Mapbox public token to enable the map. Get one free at{' '}
                    <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">
                      mapbox.com
                    </a>
                  </p>
                  <Input
                    placeholder="pk.eyJ1..."
                    onBlur={(e) => e.target.value && saveMapboxToken(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.type || 'all'}
            onValueChange={(value) =>
              setFilters({ ...filters, type: value === 'all' ? undefined : value })
            }
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(LOCATION_TYPES).map(([key, { label, icon }]) => (
                <SelectItem key={key} value={key}>
                  {icon} {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Locations</SheetTitle>
                <SheetDescription>Narrow down your search</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="free"
                    checked={filters.free}
                    onCheckedChange={(checked) => setFilters({ ...filters, free: !!checked })}
                  />
                  <Label htmlFor="free">Free only</Label>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* View Toggle */}
          <div className="flex rounded-md border">
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('map')}
              className="rounded-l-none"
            >
              <MapIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </span>
          ) : (
            `${filteredLocations.length} location${filteredLocations.length !== 1 ? 's' : ''} found`
          )}
        </div>

        {/* Content */}
        {view === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TravelMap
                locations={filteredLocations}
                userLocation={userLocation}
                selectedLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
                mapboxToken={mapboxToken}
                className="h-[500px] lg:h-[600px]"
              />
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  selected={selectedLocation === location.id}
                  onSelect={setSelectedLocation}
                  onDirections={handleDirections}
                />
              ))}
              {filteredLocations.length === 0 && !isLoading && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No locations found. Try adjusting your filters.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                selected={selectedLocation === location.id}
                onSelect={setSelectedLocation}
                onDirections={handleDirections}
              />
            ))}
            {filteredLocations.length === 0 && !isLoading && (
              <Card className="col-span-full">
                <CardContent className="p-12 text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No locations found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add the first location
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TravelLocations;
