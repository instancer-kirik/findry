import { ContentItemProps } from "./content";
import { FeaturedArtist } from "./event";

// Type definitions for event creation/editing
export type FilterType = "resources" | "artists" | "venues" | "brands" | "communities" | "all";
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "custom";

// Event content item is an alias for ContentItemProps for clarity in event context
export type EventContentItem = ContentItemProps;

// Form component props
export interface EventDetailsFormProps {
  eventName: string;
  setEventName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  eventType: string;
  setEventType: (value: string) => void;
  tags?: string[];
  setTags?: (value: string[]) => void;
}

export interface DateTimeFormProps {
  startDate: Date | undefined;
  setStartDate: (value: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (value: Date | undefined) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  recurrenceType?: RecurrenceType;
  setRecurrenceType?: (value: RecurrenceType) => void;
}

export interface PosterUploadProps {
  posterImage: File | null;
  setPosterImage: (value: File | null) => void;
  posterUrl: string;
  setPosterUrl: (value: string) => void;
}

export interface AdditionalSettingsProps {
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  registrationRequired?: boolean;
  setRegistrationRequired?: (value: boolean) => void;
  ticketPrice?: string;
  setTicketPrice?: (value: string) => void;
  ticketUrl?: string;
  setTicketUrl?: (value: string) => void;
  capacity?: string;
  setCapacity?: (value: string) => void;
}

export interface ContentCardProps {
  id: string;
  name: string;
  type: string;
  location?: string;
  imageUrl?: string;
  description?: string;
  selected?: boolean;
  onSelect?: () => void;
} 