import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import BathroomMap from "@/components/bathroom-finder/BathroomMap";
import {
  MapPin,
  Search,
  Navigation,
  Star,
  Clock,
  Users,
  Accessibility,
  Baby,
  Car,
  Shield,
  Filter,
  List,
  Map as MapIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface PublicBathroom {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type:
    | "public"
    | "business"
    | "restaurant"
    | "gas_station"
    | "park"
    | "shopping_center";
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

// Sample data - in real app this would come from an API or database
const sampleBathrooms: PublicBathroom[] = [
  {
    id: "1",
    name: "Central Park Public Restrooms",
    address: "123 Park Ave, Downtown",
    latitude: 40.7829,
    longitude: -73.9654,
    type: "park",
    rating: 4.2,
    reviews: 156,
    distance: 0.3,
    isOpen: true,
    hours: "6:00 AM - 10:00 PM",
    amenities: ["toilet_paper", "soap", "hand_dryer"],
    accessibility: true,
    baby_changing: true,
    free: true,
    verified: true,
    description:
      "Clean, well-maintained public restrooms in the heart of downtown park.",
    cleanliness_rating: 4.0,
    safety_rating: 4.5,
  },
  {
    id: "2",
    name: "Starbucks - Main Street",
    address: "456 Main St, City Center",
    latitude: 40.7614,
    longitude: -73.9776,
    type: "business",
    rating: 3.8,
    reviews: 89,
    distance: 0.7,
    isOpen: true,
    hours: "5:30 AM - 11:00 PM",
    amenities: ["toilet_paper", "soap", "hand_dryer", "mirror"],
    accessibility: false,
    baby_changing: false,
    free: true,
    verified: true,
    description:
      "Coffee shop restroom, clean and usually available for customers.",
    cleanliness_rating: 4.2,
    safety_rating: 4.0,
  },
  {
    id: "3",
    name: "Shell Gas Station",
    address: "789 Highway Blvd",
    latitude: 40.7505,
    longitude: -73.9934,
    type: "gas_station",
    rating: 3.2,
    reviews: 34,
    distance: 1.2,
    isOpen: true,
    hours: "24 hours",
    amenities: ["toilet_paper", "soap"],
    accessibility: true,
    baby_changing: false,
    free: true,
    verified: false,
    description: "24-hour gas station restroom, basic amenities available.",
    cleanliness_rating: 3.0,
    safety_rating: 3.5,
  },
  {
    id: "4",
    name: "Westfield Shopping Center",
    address: "321 Shopping Way",
    latitude: 40.7282,
    longitude: -73.9942,
    type: "shopping_center",
    rating: 4.5,
    reviews: 203,
    distance: 1.8,
    isOpen: true,
    hours: "10:00 AM - 9:00 PM",
    amenities: [
      "toilet_paper",
      "soap",
      "hand_dryer",
      "mirror",
      "changing_table",
    ],
    accessibility: true,
    baby_changing: true,
    free: true,
    verified: true,
    description:
      "Large shopping center with multiple clean restroom facilities.",
    cleanliness_rating: 4.3,
    safety_rating: 4.7,
  },
  {
    id: "5",
    name: "McDonald's - River Road",
    address: "987 River Rd",
    latitude: 40.7899,
    longitude: -73.9441,
    type: "restaurant",
    rating: 3.5,
    reviews: 67,
    distance: 2.3,
    isOpen: false,
    hours: "6:00 AM - 11:00 PM (Closed)",
    amenities: ["toilet_paper", "soap", "hand_dryer"],
    accessibility: true,
    baby_changing: true,
    free: true,
    verified: true,
    description: "Fast food restaurant restroom, clean and accessible.",
    cleanliness_rating: 3.8,
    safety_rating: 3.9,
  },
];

const BathroomFinder: React.FC = () => {
  const [bathrooms, setBathrooms] = useState<PublicBathroom[]>([]);
  const [filteredBathrooms, setFilteredBathrooms] = useState<PublicBathroom[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedBathroom, setSelectedBathroom] = useState<string | undefined>(
    undefined,
  );
  const [filters, setFilters] = useState({
    type: "all",
    accessibility: false,
    babyChanging: false,
    freeOnly: true,
    openNow: false,
    maxDistance: "5",
  });
  const { toast } = useToast();

  useEffect(() => {
    setBathrooms(sampleBathrooms);
    setFilteredBathrooms(sampleBathrooms);
  }, []);

  useEffect(() => {
    const filtered = bathrooms.filter((bathroom) => {
      // Search filter
      const matchesSearch =
        bathroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bathroom.address.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesType =
        filters.type === "all" || bathroom.type === filters.type;

      // Accessibility filter
      const matchesAccessibility =
        !filters.accessibility || bathroom.accessibility;

      // Baby changing filter
      const matchesBabyChanging =
        !filters.babyChanging || bathroom.baby_changing;

      // Free only filter
      const matchesFree = !filters.freeOnly || bathroom.free;

      // Open now filter
      const matchesOpenNow = !filters.openNow || bathroom.isOpen;

      // Distance filter
      const matchesDistance =
        bathroom.distance <= parseFloat(filters.maxDistance);

      return (
        matchesSearch &&
        matchesType &&
        matchesAccessibility &&
        matchesBabyChanging &&
        matchesFree &&
        matchesOpenNow &&
        matchesDistance
      );
    });

    setFilteredBathrooms(filtered);
  }, [bathrooms, searchQuery, filters]);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "Location found",
            description: "Showing bathrooms near your current location.",
          });
          setLoading(false);
        },
        (error) => {
          toast({
            title: "Location error",
            description:
              "Could not get your location. Please enter an address manually.",
            variant: "destructive",
          });
          setLoading(false);
        },
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "park":
        return "🏞️";
      case "business":
        return "🏢";
      case "restaurant":
        return "🍽️";
      case "gas_station":
        return "⛽";
      case "shopping_center":
        return "🛍️";
      default:
        return "🚻";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "park":
        return "Park";
      case "business":
        return "Business";
      case "restaurant":
        return "Restaurant";
      case "gas_station":
        return "Gas Station";
      case "shopping_center":
        return "Shopping Center";
      default:
        return "Public";
    }
  };

  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const BathroomCard: React.FC<{ bathroom: PublicBathroom }> = ({
    bathroom,
  }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{getTypeIcon(bathroom.type)}</span>
              {bathroom.name}
              {bathroom.verified && (
                <Shield className="h-4 w-4 text-green-500" />
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              {bathroom.address} • {bathroom.distance} mi away
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              {renderRatingStars(bathroom.rating)}
              <span className="text-sm text-muted-foreground">
                ({bathroom.reviews})
              </span>
            </div>
            <Badge
              variant={bathroom.isOpen ? "default" : "secondary"}
              className="text-xs"
            >
              {bathroom.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {bathroom.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {bathroom.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {getTypeLabel(bathroom.type)}
          </Badge>
          {bathroom.free && (
            <Badge variant="outline" className="text-xs text-green-600">
              Free
            </Badge>
          )}
          {bathroom.accessibility && (
            <Badge
              variant="outline"
              className="text-xs flex items-center gap-1"
            >
              <Accessibility className="h-3 w-3" />
              Accessible
            </Badge>
          )}
          {bathroom.baby_changing && (
            <Badge
              variant="outline"
              className="text-xs flex items-center gap-1"
            >
              <Baby className="h-3 w-3" />
              Baby Changing
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Hours:</span>
            </div>
            <p className="text-muted-foreground">
              {bathroom.hours || "Unknown"}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Star className="h-4 w-4" />
              <span className="font-medium">Ratings:</span>
            </div>
            <div className="space-y-1 text-xs">
              <div>Cleanliness: {bathroom.cleanliness_rating}/5</div>
              <div>Safety: {bathroom.safety_rating}/5</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1">
            <Navigation className="h-4 w-4 mr-1" />
            Directions
          </Button>
          <Button size="sm" variant="outline">
            <MapPin className="h-4 w-4 mr-1" />
            View on Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const FilterDrawer = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Options</DrawerTitle>
          <DrawerDescription>
            Customize your bathroom search criteria
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Bathroom Type
            </label>
            <Select
              value={filters.type}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="gas_station">Gas Station</SelectItem>
                <SelectItem value="park">Park</SelectItem>
                <SelectItem value="shopping_center">Shopping Center</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Maximum Distance
            </label>
            <Select
              value={filters.maxDistance}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, maxDistance: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 mile</SelectItem>
                <SelectItem value="2">2 miles</SelectItem>
                <SelectItem value="5">5 miles</SelectItem>
                <SelectItem value="10">10 miles</SelectItem>
                <SelectItem value="25">25 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="accessibility"
                checked={filters.accessibility}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, accessibility: !!checked }))
                }
              />
              <label htmlFor="accessibility" className="text-sm">
                Wheelchair Accessible
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="babyChanging"
                checked={filters.babyChanging}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, babyChanging: !!checked }))
                }
              />
              <label htmlFor="babyChanging" className="text-sm">
                Baby Changing Station
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="freeOnly"
                checked={filters.freeOnly}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, freeOnly: !!checked }))
                }
              />
              <label htmlFor="freeOnly" className="text-sm">
                Free Only
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="openNow"
                checked={filters.openNow}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, openNow: !!checked }))
                }
              />
              <label htmlFor="openNow" className="text-sm">
                Open Now
              </label>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Apply Filters</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            🚻 Public Bathroom Finder
          </h1>
          <p className="text-lg text-muted-foreground">
            Find clean, accessible public restrooms near you
          </p>
        </div>

        {/* Search and Location */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                onClick={getCurrentLocation}
                disabled={loading}
                className="whitespace-nowrap"
              >
                <Navigation className="h-4 w-4 mr-2" />
                {loading ? "Finding..." : "Use My Location"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FilterDrawer />
            <Badge variant="outline">
              {filteredBathrooms.length} bathroom
              {filteredBathrooms.length !== 1 ? "s" : ""} found
            </Badge>
          </div>
          <Tabs
            value={view}
            onValueChange={(value: string) => setView(value as "list" | "map")}
          >
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-1">
                <MapIcon className="h-4 w-4" />
                Map
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Results */}
        {view === "list" ? (
          <div className="space-y-4">
            {filteredBathrooms.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">
                    No bathrooms found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or location
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredBathrooms.map((bathroom) => (
                <BathroomCard key={bathroom.id} bathroom={bathroom} />
              ))
            )}
          </div>
        ) : (
          <BathroomMap
            bathrooms={filteredBathrooms}
            userLocation={userLocation}
            selectedBathroom={selectedBathroom}
            onBathroomSelect={setSelectedBathroom}
          />
        )}

        {/* Quick Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Finding Clean Facilities</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Look for verified locations with high ratings</li>
                  <li>
                    • Chain restaurants and stores often maintain cleaner
                    facilities
                  </li>
                  <li>• Shopping centers typically have the best amenities</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Accessibility Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Check for wheelchair accessibility icons</li>
                  <li>• Baby changing stations are marked separately</li>
                  <li>• Call ahead for specific accessibility needs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BathroomFinder;
