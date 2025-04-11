
import { ContentType } from './database';
import { Profile } from './profile';

export interface ContentItemProps {
  id: string;
  name: string;
  type: string;  // Can include 'shop' and 'product' now
  location: string; // Changed from optional to required to match ContentCard component
  subtype?: string;
  description?: string;
  image_url?: string;
  tags?: string[];
  price?: number;
  date?: string;
  time?: string;
  website_url?: string;
  banner_image_url?: string;
  logo_url?: string; 
  category?: string;  // For products
  shop_id?: string;   // For products
  author?: Profile;   // Changed from simple object to Profile type
  created_at?: string;
  updated_at?: string;
  multidisciplinary?: boolean;
  styles?: string[];
  disciplines?: string[];
  email?: string;     // Added for contact information
  link?: string;      // Added for external links
  isRequestOnly?: boolean; // Added for requested resources
}

export interface ContentOwnershipProps {
  id: string;
  content_id: string;
  content_type: ContentType;
  owner_id: string;
  created_at: string;
  updated_at: string;
}
