export interface PublicBathroom {
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
  photos?: string[];
  last_updated?: Date;
  reported_issues?: string[];
}

export interface BathroomFilters {
  type: string;
  accessibility: boolean;
  babyChanging: boolean;
  freeOnly: boolean;
  openNow: boolean;
  maxDistance: string;
  minRating?: number;
  hasPhotos?: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: Date;
}

export interface BathroomReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isVerified: boolean;
  rating: number;
  cleanlinessRating: number;
  safetyRating: number;
  comment: string;
  photos?: string[];
  createdAt: Date;
  helpful: number;
  notHelpful: number;
  userVote?: 'helpful' | 'not-helpful';
  tags: string[];
  bathroomId: string;
}

export interface BathroomIssueReport {
  id: string;
  bathroomId: string;
  userId: string;
  issueType: 'closed' | 'dirty' | 'broken' | 'unsafe' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  status: 'open' | 'investigating' | 'resolved';
  photos?: string[];
}

export interface BathroomSearchParams {
  query?: string;
  location?: UserLocation;
  filters: BathroomFilters;
  sortBy?: 'distance' | 'rating' | 'recent';
  limit?: number;
  offset?: number;
}

export interface BathroomSearchResult {
  bathrooms: PublicBathroom[];
  total: number;
  hasMore: boolean;
  searchTime: number;
}

export type BathroomType = 'public' | 'business' | 'restaurant' | 'gas_station' | 'park' | 'shopping_center';

export type ViewMode = 'list' | 'map';

export interface MapBounds {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
}

export interface BathroomMarker extends PublicBathroom {
  isSelected?: boolean;
  isVisible?: boolean;
}

export const BATHROOM_TYPES: Record<BathroomType, { label: string; icon: string; color: string }> = {
  public: { label: 'Public', icon: '🚻', color: '#6b7280' },
  business: { label: 'Business', icon: '🏢', color: '#3b82f6' },
  restaurant: { label: 'Restaurant', icon: '🍽️', color: '#f59e0b' },
  gas_station: { label: 'Gas Station', icon: '⛽', color: '#ef4444' },
  park: { label: 'Park', icon: '🏞️', color: '#22c55e' },
  shopping_center: { label: 'Shopping Center', icon: '🛍️', color: '#8b5cf6' },
};

export const COMMON_AMENITIES = [
  'toilet_paper',
  'soap',
  'hand_dryer',
  'paper_towels',
  'mirror',
  'changing_table',
  'grab_bars',
  'hand_sanitizer',
  'air_freshener',
  'vending_machine',
] as const;

export type AmenityType = typeof COMMON_AMENITIES[number];

export const AMENITY_LABELS: Record<AmenityType, string> = {
  toilet_paper: 'Toilet Paper',
  soap: 'Soap',
  hand_dryer: 'Hand Dryer',
  paper_towels: 'Paper Towels',
  mirror: 'Mirror',
  changing_table: 'Baby Changing Table',
  grab_bars: 'Grab Bars',
  hand_sanitizer: 'Hand Sanitizer',
  air_freshener: 'Air Freshener',
  vending_machine: 'Vending Machine',
};

export const REVIEW_TAGS = [
  'Clean',
  'Well-stocked',
  'Spacious',
  'Good lighting',
  'Safe area',
  'Quick access',
  'Family friendly',
  'Well maintained',
  'Private',
  'Quiet',
  'Busy',
  'Small',
  'Outdated',
  'Needs repair',
] as const;

export type ReviewTag = typeof REVIEW_TAGS[number];
