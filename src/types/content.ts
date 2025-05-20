
export interface ContentItemProps {
  id: string;
  name: string;
  type: string;
  location?: string;
  imageUrl?: string;
  description?: string;
  tags?: string[];
  subtype?: string;
  selected?: boolean;
  image_url?: string;
  multidisciplinary?: boolean;
  styles?: string[];
  disciplines?: string[];
  // Add properties for albums and songs
  artist_id?: string;
  artist_name?: string;
  album_id?: string;
  album_name?: string;
  release_date?: string;
  duration?: string;
  // Add properties for artworks
  creation_date?: string;
  medium?: string;
  dimensions?: string;
  // Common selection properties
  onSelect?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
  selectionMode?: boolean;
}
