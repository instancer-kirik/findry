
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContentCardProps } from '@/types/forms';

// Export the ContentItemProps interface for use in other components
export interface ContentItemProps {
  id: string;
  name: string;
  type: string;
  location: string;
  subtype?: string;
  description?: string;
  image_url?: string;
  isSelected?: boolean;
  selectionMode?: boolean;
  tags?: string[];
  price?: number;
  date?: string;
  time?: string;
  website_url?: string;
  banner_image_url?: string;
  logo_url?: string;
  category?: string;
  shop_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  multidisciplinary?: boolean;
  styles?: string[];
  disciplines?: string[];
  email?: string;
  link?: string;
  isRequestOnly?: boolean;
  isNew?: boolean;
  status?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  name,
  type,
  location,
  imageUrl,
  description,
  selected,
  onSelect,
}) => {
  return (
    <Card 
      className={`overflow-hidden ${selected ? 'ring-2 ring-primary' : ''}`}
    >
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        <h3 className="font-medium">{name}</h3>
        {type && <p className="text-xs text-muted-foreground">{type}</p>}
        {location && <p className="text-xs mt-1">{location}</p>}
        {description && (
          <p className="text-sm mt-2 line-clamp-2">{description}</p>
        )}
      </CardContent>
      {onSelect && (
        <CardFooter className="px-4 pb-4 pt-0">
          <Button 
            variant={selected ? "default" : "outline"}
            className="w-full"
            onClick={onSelect}
          >
            {selected ? 'Selected' : 'Select'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ContentCard;
