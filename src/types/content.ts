
import { ContentType } from './database';

export interface ContentItemProps {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  description?: string;
  image_url?: string;
  location?: string;
  tags?: string[];
  price?: number;
  date?: string;
  time?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

export interface ContentOwnershipProps {
  id: string;
  content_id: string;
  content_type: ContentType;
  owner_id: string;
  created_at: string;
  updated_at: string;
}
