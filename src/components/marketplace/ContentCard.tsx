
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContentCardProps } from '@/types/forms';

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
