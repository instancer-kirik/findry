export type PrivacyLevel = 'public' | 'friends_only' | 'private' | 'invite_only';

export interface Garage {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  location: string | null;
  address: string | null;
  coordinates: { lat: number; lng: number } | null;
  image_url: string | null;
  
  // Features
  has_lift: boolean;
  lift_capacity_lbs: number | null;
  has_storage: boolean;
  storage_sqft: number | null;
  has_tools: boolean;
  has_electricity: boolean;
  has_air_compressor: boolean;
  has_welding: boolean;
  bay_count: number;
  
  // Privacy
  privacy_level: PrivacyLevel;
  
  // Availability
  is_available_for_rent: boolean;
  hourly_rate: number | null;
  daily_rate: number | null;
  
  // Metadata
  tags: string[];
  created_at: string;
  updated_at: string;
  
  // Joined data
  owner?: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface GarageInsert {
  name: string;
  description?: string | null;
  location?: string | null;
  address?: string | null;
  coordinates?: { lat: number; lng: number } | null;
  image_url?: string | null;
  has_lift?: boolean;
  lift_capacity_lbs?: number | null;
  has_storage?: boolean;
  storage_sqft?: number | null;
  has_tools?: boolean;
  has_electricity?: boolean;
  has_air_compressor?: boolean;
  has_welding?: boolean;
  bay_count?: number;
  privacy_level?: PrivacyLevel;
  is_available_for_rent?: boolean;
  hourly_rate?: number | null;
  daily_rate?: number | null;
  tags?: string[];
}

export interface GarageInvite {
  id: string;
  garage_id: string;
  invited_user_id: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  
  // Joined data
  garage?: Garage;
  invited_user?: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface UserBlock {
  id: string;
  blocker_id: string;
  blocked_id: string;
  reason: string | null;
  created_at: string;
  
  // Joined data
  blocked_user?: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
}
