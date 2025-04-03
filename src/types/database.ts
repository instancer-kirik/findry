export type ContentType = 'project' | 'event' | 'resource' | 'community' | 'shop';

export interface ContentOwnership {
  id: string;
  content_id: string;
  content_type: ContentType;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ShopData {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  website_url: string | null;
  banner_image_url: string | null;
  logo_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ProductData {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

// Shop definition for frontend usage
export interface Shop {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  website_url: string | null;
  banner_image_url: string | null;
  logo_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

// Product definition for frontend usage
export interface ShopProduct {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}
