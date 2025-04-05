export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ContentType = "resource" | "project" | "event" | "community" | "artist" | "venue" | "brand" | "shop";

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

export interface Artist {
  id: string;
  name: string;
  image_url: string | null;
  location: string | null;
  disciplines: string[] | null;
  styles: string[] | null;
  tags: string[] | null;
  type: string | null;
  subtype: string | null;
  multidisciplinary: boolean | null;
  created_at: string;
  updated_at: string;
  bio?: string | null;
  social_links?: string[] | null;
}
