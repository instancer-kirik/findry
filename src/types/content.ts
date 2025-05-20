import { ContentType } from './database';
import { Profile } from './profile';
import { SpaceType, PricingTerms, LightingDetails, AccessHours, LocationData, TimeSlot } from './space';

export interface ContentItemProps {
  id: string;
  name: string;
  type: string;  // Can include 'shop' and 'product' now
  location: string; // Changed from optional to required to match ContentCard component
  subtype?: string;
  description?: string;
  image_url?: string;
  tags?: string[];
  price?: number;
  date?: string;
  time?: string;
  website_url?: string;
  banner_image_url?: string;
  logo_url?: string; 
  category?: string;  // For products
  shop_id?: string;   // For products
  author?: Profile;   // Changed from simple object to Profile type
  created_at?: string;
  updated_at?: string;
  multidisciplinary?: boolean;
  styles?: string[];
  disciplines?: string[];
  email?: string;     // Added for contact information
  link?: string;      // Added for external links
  isRequestOnly?: boolean; // Added for requested resources
  isNew?: boolean;    // Added to track newly created items
  status?: string;    // Added for tracking request status
  selected?: boolean; // Added for selection in event creation
  
  // Album and song properties
  artist_id?: string; // Added for album/song attribution
  artist_name?: string;
  album_id?: string;
  album_name?: string;
  release_date?: string;
  duration?: string;
  
  // Artwork properties
  creation_date?: string;
  medium?: string;
  dimensions?: string;
  
  // Space-specific properties
  space_type?: SpaceType;
  square_footage?: number;
  equipment_list?: string[];
  availability_schedule?: TimeSlot[];
  pricing_terms?: PricingTerms;
  acoustics_rating?: number;
  lighting_details?: LightingDetails;
  access_hours?: AccessHours;
  location_data?: LocationData;
  photos?: string[];
  virtual_tour_url?: string;

  // Artist-specific properties
  creative_discipline?: string[];
  space_requirements?: SpaceRequirements;
  project_timeline?: TimeSlot;
  budget_range?: BudgetRange;
  equipment_needs?: string[];
  preferred_hours?: AccessHours;
  portfolio_urls?: string[];
  group_size?: number;
  noise_level?: number;

  // Match-specific properties
  compatibility_score?: number;
  matched_at?: string;
  
  // Tour/roadtrip planning properties
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
  venue_id?: string;
  venue_name?: string;
  start_date?: string;
  end_date?: string;
  arrival_time?: string;
  departure_time?: string;
  distance_from_previous?: number;
  travel_time_from_previous?: number;
  accommodation?: string;
  is_stop_point?: boolean;  // For roadtrip stops that aren't events
  order?: number;  // For ordering stops in a tour/trip
  
  // Other multimedia properties
  title?: string; // For event titles and other objects
}

export interface ContentOwnershipProps {
  id: string;
  content_id: string;
  content_type: ContentType;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// New interface definitions based on the schema
export interface SpaceRequirements {
  min_square_footage: number;
  preferred_types: SpaceType[];
  required_equipment: string[];
  min_acoustics_rating: number;
  natural_light_required: boolean;
  storage_needed: boolean;
  special_requirements: string[];
}

export interface BudgetRange {
  min: number;
  max: number;
}

// Tour planning related interfaces
export interface TourPlan {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  is_public: boolean;
  type: 'band_tour' | 'roadtrip';
  stops: TourStop[];
  gear_list_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TourStop {
  id: string;
  tour_id: string;
  name: string;
  location: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  date: string;
  arrival_time?: string;
  departure_time?: string;
  venue_id?: string;
  event_id?: string;
  description?: string;
  order: number;
  accommodation?: string;
  distance_from_previous?: number;
  travel_time_from_previous?: number;
  is_stop_point: boolean;
}

export interface GearList {
  id: string;
  name: string;
  owner_id: string;
  type: 'band' | 'personal' | 'production';
  items: GearItem[];
  created_at: string;
  updated_at: string;
}

export interface GearItem {
  id: string;
  list_id: string;
  name: string;
  category: string;
  quantity: number;
  weight?: number;
  notes?: string;
  is_packed: boolean;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface GearCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}
