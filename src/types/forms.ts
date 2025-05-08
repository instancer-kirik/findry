
import { ContentItemProps } from "./content";
import { TimeSlot, SpaceType } from './space';
import { Dispatch, SetStateAction } from 'react';

// Define types for form components
export type FilterType = 'all' | 'artists' | 'venues' | 'resources' | 'brands' | 'communities';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface ContentCardProps {
  id: string;
  name: string;
  type?: string;
  location?: string;
  imageUrl?: string;
  description?: string;
  selected?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
  selectionMode?: boolean;
}

export interface EventContentItem {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
  type: string; // Made required to match ContentItemProps
  location: string; // Made required to match ContentItemProps
  email?: string;
  link?: string;
  medium?: string;
  selected?: boolean;
  isNew?: boolean;
}

export interface ArtGalleryItem {
  id: string;
  name: string;
  image_url?: string;
  medium?: string;
  artist?: string;
  year?: string;
  description?: string;
}

export interface FeaturedArtist {
  id: string;
  name: string;
  image_url?: string;
  bio?: string;
  website?: string;
  social_media?: string[];
}

export interface EventDetailsFormProps {
  eventName: string;
  setEventName: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
  eventType: string;
  setEventType: Dispatch<SetStateAction<string>>;
  capacity: string; // Added to match the interface used in AdditionalSettings
  setCapacity: Dispatch<SetStateAction<string>>; // Added to match the interface used in AdditionalSettings
  tags?: string[];
  setTags?: Dispatch<SetStateAction<string[]>>;
}

export interface DateTimeFormProps {
  startDate?: Date;
  setStartDate: Dispatch<SetStateAction<Date | undefined>>;
  endDate?: Date;
  setEndDate: Dispatch<SetStateAction<Date | undefined>>;
  startTime: string;
  setStartTime: Dispatch<SetStateAction<string>>;
  endTime: string;
  setEndTime: Dispatch<SetStateAction<string>>;
  recurrenceType?: RecurrenceType;
  setRecurrenceType?: Dispatch<SetStateAction<RecurrenceType>>;
}

export interface PosterUploadProps {
  posterImage: File | null;
  setPosterImage: Dispatch<SetStateAction<File | null>>;
  posterUrl: string;
  setPosterUrl: Dispatch<SetStateAction<string>>;
}

export interface AdditionalSettingsProps {
  isPrivate: boolean;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  registrationRequired: boolean;
  setRegistrationRequired: Dispatch<SetStateAction<boolean>>;
  ticketPrice: string;
  setTicketPrice: Dispatch<SetStateAction<string>>;
  ticketUrl: string;
  setTicketUrl: Dispatch<SetStateAction<string>>;
  capacity?: string; // Added to match usage in AdditionalSettings.tsx
  setCapacity?: Dispatch<SetStateAction<string>>; // Added to match usage in AdditionalSettings.tsx
}
