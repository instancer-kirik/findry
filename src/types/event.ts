
import { Profile } from "./profile";
import { ContentItemProps } from "@/types/content";
import { Json } from "@/integrations/supabase/types";

export interface EventSlot {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  artist?: ContentItemProps;
  artistId?: string;
  resource?: ContentItemProps;
  resourceId?: string;
  venue?: ContentItemProps;
  venueId?: string;
  status: 'available' | 'reserved' | 'confirmed' | 'canceled' | 'requested';
  slotType: 'performance' | 'setup' | 'breakdown' | 'break' | 'other';
  notes?: string;
  isRequestOnly?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  organizerId: string;
  capacity: string;
  attendees?: number;
  price?: string;
  imageUrl?: string;
  tags: string[];
  type: string;
  attending?: boolean;
  interested?: boolean;
  slots?: EventSlot[];
  requested_items?: any[];
  artists?: ContentItemProps[];
  resources?: ContentItemProps[];
  venueId?: string;
  venue?: ContentItemProps;
  communityId?: string;
  community?: ContentItemProps;
  sponsorId?: string;
  sponsor?: ContentItemProps;
  isPublic: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventFormValues {
  title: string;
  description: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  eventType: string;
  capacity: string;
  tags?: string;
  venueId?: string;
  hostId?: string;
  sponsorId?: string;
  communityId?: string;
  isPublic: boolean;
  slots?: EventSlot[];
  requested_items?: any[];
}
