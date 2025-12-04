export interface UGCContent {
  id: string;
  author_id: string;
  content_type: 'image' | 'video' | 'embed';
  title: string | null;
  description: string | null;
  url: string;
  thumbnail_url: string | null;
  tags: string[];
  venue_id: string | null;
  event_id: string | null;
  artist_id: string | null;
  brand_id: string | null;
  likes_count: number;
  views_count: number;
  is_public: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface UGCComment {
  id: string;
  content_id: string;
  author_id: string;
  text: string;
  created_at: string;
  updated_at: string;
  author?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface UGCLike {
  id: string;
  content_id: string;
  user_id: string;
  created_at: string;
}

export interface UGCUploadData {
  content_type: 'image' | 'video' | 'embed';
  title?: string;
  description?: string;
  tags?: string[];
  venue_id?: string;
  event_id?: string;
  artist_id?: string;
  brand_id?: string;
  is_public?: boolean;
}
