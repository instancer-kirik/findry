
export interface ContentItemProps {
  id: string;
  name: string;
  type: string;
  location?: string;
  imageUrl?: string;
  description?: string;
  tags?: string[];
  subtype?: string;
  selected?: boolean;
  image_url?: string;
  multidisciplinary?: boolean;
  styles?: string[];
  disciplines?: string[];
  // Add properties for albums and songs
  artist_id?: string;
  artist_name?: string;
  album_id?: string;
  album_name?: string;
  release_date?: string;
  duration?: string;
  // Add properties for artworks
  creation_date?: string;
  medium?: string;
  dimensions?: string;
  // Add properties for event slot manager
  isRequestOnly?: boolean;
  email?: string;
  link?: string;
  // Add properties for bulk import
  created_at?: string;
  updated_at?: string;
  // Common selection properties
  onSelect?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
  selectionMode?: boolean;
}

// Tour planning types
export interface TourStop {
  id: string;
  tour_id?: string;
  name: string;
  location: string;
  address?: string;
  date: string;
  arrival_time?: string;
  departure_time?: string;
  description?: string;
  order: number;
  accommodation?: string;
  is_stop_point?: boolean;
  venue_id?: string;
  distance_from_previous?: string;
  travel_time_from_previous?: string;
}

export interface TourPlan {
  id?: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  is_public: boolean;
  type: 'band_tour' | 'roadtrip';
  stops: TourStop[];
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}
