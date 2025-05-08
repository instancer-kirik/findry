
import { ContentItemProps } from "./content";
import { TimeSlot, SpaceType } from "./space";

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

// New form interfaces for Space management
export interface SpaceFormProps {
  name: string;
  setName: (value: string) => void;
  spaceType: SpaceType;
  setSpaceType: (value: SpaceType) => void;
  squareFootage: number;
  setSquareFootage: (value: number) => void;
  equipmentList: string[];
  setEquipmentList: (value: string[]) => void;
  description: string;
  setDescription: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
}

export interface SpacePricingFormProps {
  hourlyRate: number;
  setHourlyRate: (value: number) => void;
  dailyRate?: number;
  setDailyRate: (value?: number) => void;
  weeklyRate?: number;
  setWeeklyRate: (value?: number) => void;
  monthlyRate?: number;
  setMonthlyRate: (value?: number) => void;
  depositRequired: boolean;
  setDepositRequired: (value: boolean) => void;
  depositAmount?: number;
  setDepositAmount: (value?: number) => void;
}

export interface SpaceAvailabilityFormProps {
  availabilitySchedule: TimeSlot[];
  setAvailabilitySchedule: (value: TimeSlot[]) => void;
  accessHours: {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  };
  setAccessHours: (value: any) => void;
}

export interface FeaturedArtistsForm {
  selectedArtists: EventContentItem[];
  setSelectedArtists: (artists: EventContentItem[]) => void;
  onAddArtist: (artist: EventContentItem) => void;
  onRemoveArtist: (artistId: string) => void;
}
