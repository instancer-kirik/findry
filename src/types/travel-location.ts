export type LocationType = 
  | 'campsite'
  | 'rv_park'
  | 'dump_station'
  | 'water_station'
  | 'rest_area'
  | 'truck_stop'
  | 'gas_station'
  | 'parking'
  | 'scenic_view'
  | 'trailhead'
  | 'boat_launch'
  | 'other';

export interface TravelLocation {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  amenities?: string[] | null;
  hours?: string | null;
  phone?: string | null;
  website?: string | null;
  free?: boolean | null;
  accessibility?: boolean | null;
  baby_changing?: boolean | null;
  is_open_24h?: boolean | null;
  rating?: number | null;
  cleanliness_rating?: number | null;
  safety_rating?: number | null;
  review_count?: number | null;
  photos?: string[] | null;
  verified?: boolean | null;
  reported_issues?: string[] | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TravelLocationReview {
  id: string;
  location_id: string;
  user_id: string;
  rating: number;
  cleanliness_rating?: number | null;
  safety_rating?: number | null;
  content?: string | null;
  photos?: string[] | null;
  visited_at?: string | null;
  created_at: string;
  updated_at: string;
}

export const LOCATION_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  campsite: { label: 'Campsite', icon: '🏕️', color: '#22c55e' },
  rv_park: { label: 'RV Park', icon: '🚐', color: '#0891b2' },
  dump_station: { label: 'Dump Station', icon: '🚰', color: '#7c3aed' },
  water_station: { label: 'Water Fill', icon: '💧', color: '#0ea5e9' },
  rest_area: { label: 'Rest Area', icon: '🅿️', color: '#6366f1' },
  truck_stop: { label: 'Truck Stop', icon: '🚛', color: '#f59e0b' },
  gas_station: { label: 'Gas Station', icon: '⛽', color: '#ef4444' },
  parking: { label: 'Parking', icon: '🅿️', color: '#64748b' },
  scenic_view: { label: 'Scenic View', icon: '🌄', color: '#ec4899' },
  trailhead: { label: 'Trailhead', icon: '🥾', color: '#84cc16' },
  boat_launch: { label: 'Boat Launch', icon: '🚤', color: '#06b6d4' },
  other: { label: 'Other', icon: '📍', color: '#6b7280' },
};

export const AMENITY_OPTIONS = [
  'restrooms',
  'showers',
  'water',
  'dump_station',
  'electric_hookup',
  'wifi',
  'laundry',
  'store',
  'propane',
  'pet_area',
  'picnic_tables',
  'fire_pits',
  'trash',
  'security',
] as const;
