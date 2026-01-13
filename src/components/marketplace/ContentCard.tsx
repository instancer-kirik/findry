import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContentCardProps } from '@/types/forms';
import { ContentItemProps as ContentItemType } from '@/types/content';

// Export the ContentItemProps interface for use in other components
export interface ContentItemProps extends ContentItemType {
  // Ensure this extends the ContentItemProps from types/content.ts
  // No need to redefine properties here as they're inherited
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
  // Determine the link based on type
  const getProfileLink = () => {
    if (type === 'artist' || type === 'musician' || type === 'visual artist' || type === 'performer') {
      return `/artist/${id}`;
    }
    if (type === 'venue' || type === 'studio' || type === 'gallery') {
      return `/venue/${id}`;
    }
    if (type === 'brand' || type === 'company' || type === 'organization') {
      return `/brand/${id}`;
    }
    return null;
  };

  const profileLink = getProfileLink();

  const cardContent = (
    <>
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect();
            }}
          >
            {selected ? 'Selected' : 'Select'}
          </Button>
        </CardFooter>
      )}
    </>
  );

  if (profileLink && !onSelect) {
    return (
      <Link to={profileLink} className="block">
        <Card 
          className={`overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer ${selected ? 'ring-2 ring-primary' : ''}`}
        >
          {cardContent}
        </Card>
      </Link>
    );
  }

  return (
    <Card 
      className={`overflow-hidden ${selected ? 'ring-2 ring-primary' : ''}`}
    >
      {cardContent}
    </Card>
  );
};

export default ContentCard;
