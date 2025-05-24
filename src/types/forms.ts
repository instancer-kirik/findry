
export interface ContentItemProps {
  id: string;
  name: string;
  type: string;
  location: string; // Make location required to match ContentCard.tsx definition
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
  // Add property for new items
  isNew?: boolean;
  // Common selection properties
  onSelect?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
  selectionMode?: boolean;
  // Add status for ProjectDetail reference items
  status?: string;
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

// Gear packing related types
export interface GearItem {
  id: string;
  name: string;
  category: string;
  weight?: number; // in pounds or kg
  quantity: number;
  essential: boolean;
  packed: boolean; // Was is_packed before, renamed to packed
  notes?: string;
  list_id?: string; // Added missing property
  created_at?: string;
  updated_at?: string;
  assigned_to?: string; // Added missing property
}

export interface GearCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface GearList {
  id: string;
  name: string;
  description?: string;
  items: GearItem[];
  categories: GearCategory[];
  owner_id: string;
  created_at?: string;
  updated_at?: string;
  shared_with?: string[];
  tour_id?: string;
  type: string; // Added missing property
}

export interface AdditionalSettingsProps {
  isPrivate: boolean;
  setIsPrivate: React.Dispatch<React.SetStateAction<boolean>>;
  registrationRequired: boolean;
  setRegistrationRequired: React.Dispatch<React.SetStateAction<boolean>>;
  ticketPrice: string;
  setTicketPrice: React.Dispatch<React.SetStateAction<string>>;
  ticketUrl: string;
  setTicketUrl: React.Dispatch<React.SetStateAction<string>>;
  capacity: string;
  setCapacity: (capacity: string) => void;
}
export type FilterType = 'all' | 'artists' | 'venues' | 'resources' | 'brands' | 'communities';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface EventContentItem {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
  type: string; // Make type required to match ContentItemProps
  location: string; // Make location required to match ContentItemProps
  selected?: boolean;
}

export interface EventDetailsFormProps {
  eventName: string;
  setEventName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  location: string;
  setLocation: (location: string) => void;
  capacity: string;
  setCapacity: (capacity: string) => void;
  eventType: string;
  setEventType: (type: string) => void;
  tags?: string[];
  setTags?: (tags: string[]) => void;
}

export interface DateTimeFormProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  recurrenceType?: RecurrenceType;
  setRecurrenceType?: (type: RecurrenceType) => void;
}

export interface PosterUploadProps {
  posterImage: File | null;
  setPosterImage: (image: File | null) => void;
  posterUrl: string;
  setPosterUrl: (url: string) => void;
}
export interface ContentCardProps {
  id: string;
  name: string;
  type: string;
  location: string;
  imageUrl?: string;
  description?: string;
  selected?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
  selectionMode?: boolean;
}
