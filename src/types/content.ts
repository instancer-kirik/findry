
import { ContentType } from './database';

export interface ContentItemProps {
  id: string;
  name: string;
  type: string;  // Can include 'shop' and 'product' now
  subtype?: string;
  description?: string;
  image_url?: string;
  location?: string;
  tags?: string[];
  price?: number;
  date?: string;
  time?: string;
  website_url?: string;
  banner_image_url?: string;
  logo_url?: string; 
  category?: string;  // For products
  shop_id?: string;   // For products
  author?: {
    name: string;
    avatar?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ContentOwnershipProps {
  id: string;
  content_id: string;
  content_type: ContentType;
  owner_id: string;
  created_at: string;
  updated_at: string;
}
