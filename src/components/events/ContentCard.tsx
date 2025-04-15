import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, MapPin } from 'lucide-react';

interface ContentCardProps {
  id: string;
  name: string;
  type?: string;
  location?: string;
  image_url?: string;
  isSelected?: boolean;
  selectionMode?: boolean;
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  id,
  name,
  type,
  location,
  image_url,
  isSelected = false,
  selectionMode = false,
  onClick
}) => {
  return (
    <Card 
      className={`overflow-hidden cursor-pointer hover:border-primary transition-all ${
        isSelected ? 'border-primary bg-primary/5' : ''
      }`}
      onClick={onClick}
    >
      {image_url && (
        <div className="aspect-video w-full relative">
          <img 
            src={image_url} 
            alt={name} 
            className="object-cover w-full h-full"
          />
          {selectionMode && isSelected && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground p-1 rounded-full">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
      )}
      
      <CardContent className="p-4">
        <h3 className="font-medium">{name}</h3>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {type && (
            <Badge variant="secondary" className="text-xs">
              {type}
            </Badge>
          )}
        </div>
        
        {location && (
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{location}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentCard; 