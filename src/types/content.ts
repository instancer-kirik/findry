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
