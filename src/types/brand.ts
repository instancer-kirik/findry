
export interface BrandDetails {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  location?: string | null;
  tags?: string[] | null;
  type?: string | null;
  created_at: string;
  updated_at: string;
}
