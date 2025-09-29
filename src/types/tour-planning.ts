// Enhanced trip planning types
export interface TripPlanData {
  type: 'band_tour' | 'roadtrip';
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isPublic: boolean;
  partySize: number;
  interests: string[];
  vehicle?: VehicleSelection;
  budget: BudgetPlan;
  destinations: DestinationPlan[];
  accommodation: AccommodationPlan[];
}

export interface VehicleSelection {
  type: 'car' | 'van' | 'rv' | 'bus' | 'motorcycle' | 'bicycle';
  model?: string;
  capacity: number;
  features: VehicleFeature[];
  rentalCost?: number;
  fuelType: 'gas' | 'diesel' | 'electric' | 'hybrid';
  estimatedMPG?: number;
}

export interface VehicleFeature {
  id: string;
  name: string;
  icon?: string;
}

export interface BudgetPlan {
  total: number;
  fuel: number;
  accommodation: number;
  food: number;
  activities: number;
  emergency: number;
  vehicle?: number;
  equipment?: number;
  tickets?: number; // for band tours
}

export interface DestinationPlan {
  id: string;
  name: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  arrivalDate: Date;
  departureDate: Date;
  type: 'city' | 'nature' | 'beach' | 'mountain' | 'desert' | 'venue' | 'landmark';
  activities: string[];
  estimatedCost: number;
  notes?: string;
  isHighlight?: boolean;
}

export interface AccommodationPlan {
  id: string;
  destinationId: string;
  type: 'hotel' | 'motel' | 'airbnb' | 'camping' | 'hostel' | 'friends' | 'rv';
  name: string;
  address?: string;
  checkIn: Date;
  checkOut: Date;
  cost: number;
  amenities: string[];
  bookingConfirmation?: string;
  notes?: string;
}

export interface TripInterest {
  id: string;
  name: string;
  icon: string;
  category: 'nature' | 'culture' | 'food' | 'adventure' | 'music' | 'relaxation' | 'photography';
}

export const VEHICLE_FEATURES: VehicleFeature[] = [
  { id: 'ac', name: 'Air Conditioning', icon: 'wind' },
  { id: 'gps', name: 'GPS Navigation', icon: 'navigation' },
  { id: 'bluetooth', name: 'Bluetooth', icon: 'bluetooth' },
  { id: 'usb', name: 'USB Charging', icon: 'usb' },
  { id: 'storage', name: 'Extra Storage', icon: 'package' },
  { id: 'bed', name: 'Sleeping Area', icon: 'bed' },
  { id: 'kitchen', name: 'Kitchen', icon: 'utensils' },
  { id: 'bathroom', name: 'Bathroom', icon: 'shower' },
  { id: 'wifi', name: 'WiFi Hotspot', icon: 'wifi' },
  { id: 'sound', name: 'Premium Sound', icon: 'speaker' },
  { id: 'bike', name: 'Bike Rack', icon: 'bike' },
  { id: 'roof', name: 'Roof Rack', icon: 'luggage' },
  { id: 'awd', name: 'All-Wheel Drive', icon: 'shield' },
  { id: 'towing', name: 'Towing Capability', icon: 'truck' }
];

export const TRIP_INTERESTS: TripInterest[] = [
  { id: 'hiking', name: 'Hiking', icon: 'mountain', category: 'nature' },
  { id: 'beaches', name: 'Beaches', icon: 'umbrella', category: 'nature' },
  { id: 'wildlife', name: 'Wildlife', icon: 'bird', category: 'nature' },
  { id: 'museums', name: 'Museums', icon: 'building', category: 'culture' },
  { id: 'history', name: 'History', icon: 'castle', category: 'culture' },
  { id: 'art', name: 'Art', icon: 'palette', category: 'culture' },
  { id: 'foodie', name: 'Local Cuisine', icon: 'utensils', category: 'food' },
  { id: 'coffee', name: 'Coffee Shops', icon: 'coffee', category: 'food' },
  { id: 'breweries', name: 'Breweries', icon: 'beer', category: 'food' },
  { id: 'climbing', name: 'Rock Climbing', icon: 'mountain', category: 'adventure' },
  { id: 'surfing', name: 'Surfing', icon: 'waves', category: 'adventure' },
  { id: 'skiing', name: 'Skiing', icon: 'snowflake', category: 'adventure' },
  { id: 'concerts', name: 'Live Music', icon: 'music', category: 'music' },
  { id: 'festivals', name: 'Festivals', icon: 'tent', category: 'music' },
  { id: 'clubs', name: 'Nightlife', icon: 'moon', category: 'music' },
  { id: 'spa', name: 'Spa & Wellness', icon: 'heart', category: 'relaxation' },
  { id: 'yoga', name: 'Yoga', icon: 'activity', category: 'relaxation' },
  { id: 'meditation', name: 'Meditation', icon: 'brain', category: 'relaxation' },
  { id: 'landscape', name: 'Landscape Photography', icon: 'camera', category: 'photography' },
  { id: 'street', name: 'Street Photography', icon: 'camera', category: 'photography' },
  { id: 'astro', name: 'Astrophotography', icon: 'star', category: 'photography' }
];
