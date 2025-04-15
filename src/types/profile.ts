
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
  role_attributes: Record<string, any>;
  profile_types: string[];
}

export interface ProfileFormValues {
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  profile_types: string[];
  role_attributes: Record<string, any>;
}

export interface ProfileTypeOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

// Type-safe constants for profile types
export const PROFILE_TYPES = {
  ARTIST: 'artist',
  VENUE: 'venue',
  ORGANIZER: 'organizer',
  BRAND: 'brand',
  COLLECTOR: 'collector',
  SHOP: 'shop',
  REGULAR: 'regular'
} as const;

export type ProfileType = typeof PROFILE_TYPES[keyof typeof PROFILE_TYPES];

export const PROFILE_TYPE_OPTIONS: ProfileTypeOption[] = [
  {
    id: PROFILE_TYPES.ARTIST,
    label: 'Artist',
    description: 'Create and share your artistic work',
    icon: '🎨',
  },
  {
    id: PROFILE_TYPES.ORGANIZER,
    label: 'Event Organizer',
    description: 'Host and manage events',
    icon: '📅',
  },
  {
    id: PROFILE_TYPES.VENUE,
    label: 'Venue',
    description: 'List and manage your venue',
    icon: '🏛️',
  },
  {
    id: PROFILE_TYPES.BRAND,
    label: 'Brand',
    description: 'Connect with artists and promote events',
    icon: '🏢',
  },
  {
    id: PROFILE_TYPES.COLLECTOR,
    label: 'Collector',
    description: 'Discover and collect art',
    icon: '🖼️',
  },
  {
    id: PROFILE_TYPES.SHOP,
    label: 'Shop',
    description: 'Sell art and merchandise',
    icon: '🛍️',
  },
  {
    id: PROFILE_TYPES.REGULAR,
    label: 'Regular User',
    description: 'Discover and attend events',
    icon: '👤',
  },
];

export const validateProfileTypes = (types: string[]): boolean => {
  return types.every(type => Object.values(PROFILE_TYPES).includes(type as ProfileType));
};

export const validateRoleAttributes = (role: string, attributes: any): boolean => {
  switch (role) {
    case PROFILE_TYPES.ARTIST:
      return !!attributes.discipline;
    case PROFILE_TYPES.BRAND:
      return !!attributes.brand_archetype && !!attributes.industry;
    case PROFILE_TYPES.VENUE:
      return !!attributes.location_type;
    case PROFILE_TYPES.ORGANIZER:
      return !!attributes.organization_type;
    case PROFILE_TYPES.COLLECTOR:
      return !!attributes.collection_focus;
    case PROFILE_TYPES.SHOP:
      return !!attributes.shop_type;
    case PROFILE_TYPES.REGULAR:
      return true;
    default:
      return false;
  }
};
