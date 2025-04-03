
import { Json } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  profile_types: string[] | null;
  role_attributes: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormValues {
  username: string;
  full_name: string;
  avatar_url?: string;
  bio: string;
  profile_types: string[];
  role_attributes: Record<string, any>;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

// Define standard profile types that can be used across the application
export const PROFILE_TYPES = {
  ARTIST: 'artist',
  VENUE: 'venue',
  ORGANIZER: 'organizer',
  BRAND: 'brand',
  COLLECTOR: 'collector',
  SHOP: 'shop'
};

// Profile type definitions with descriptions for UI display
export const PROFILE_TYPE_OPTIONS = [
  {
    id: PROFILE_TYPES.ARTIST,
    label: 'Artist',
    description: 'Create a profile for your artistic work and identity',
  },
  {
    id: PROFILE_TYPES.VENUE,
    label: 'Venue',
    description: 'Manage a performance or exhibition space',
  },
  {
    id: PROFILE_TYPES.ORGANIZER,
    label: 'Organizer',
    description: 'Create and manage events and community activities',
  },
  {
    id: PROFILE_TYPES.BRAND,
    label: 'Brand',
    description: 'Manage your brand or company presence in the community',
  },
  {
    id: PROFILE_TYPES.COLLECTOR,
    label: 'Collector',
    description: 'Build a collection of art and creative works',
  },
  {
    id: PROFILE_TYPES.SHOP,
    label: 'Shop',
    description: 'Sell products and services to the community',
  },
];
