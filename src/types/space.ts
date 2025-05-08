
// Space-related type definitions based on the shared schema
export enum SpaceType {
  Studio = 'Studio',
  Gallery = 'Gallery',
  PracticeRoom = 'PracticeRoom',
  Workshop = 'Workshop',
  Treehouse = 'Treehouse',
  Other = 'Other'
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
}

export interface PricingTerms {
  hourly_rate: number;
  daily_rate?: number;
  weekly_rate?: number;
  monthly_rate?: number;
  deposit_required: boolean;
  deposit_amount?: number;
}

export interface LightingDetails {
  natural_light: boolean;
  adjustable: boolean;
  color_temperature?: number;
  special_features: string[];
}

export interface AccessHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
  special_hours: Array<[string, TimeSlot[]]>;
}

export interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
  public_transport: string[];
  parking_available: boolean;
  loading_zone: boolean;
  noise_restrictions: string[];
}

export interface Space {
  id: string;
  name: string;
  space_type: SpaceType;
  square_footage: number;
  equipment_list: string[];
  availability_schedule: TimeSlot[];
  pricing_terms: PricingTerms;
  acoustics_rating: number;
  lighting_details: LightingDetails;
  access_hours: AccessHours;
  location_data: LocationData;
  photos: string[];
  virtual_tour_url?: string;
  created_at?: string;
  updated_at?: string;
}
