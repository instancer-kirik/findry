import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Tag, Check, Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Profile } from '@/types/profile';

export interface ContentItemProps {
  id: string;
  name: string;
  type: string;
  location: string;
  tags?: string[];
  subtype?: string;
  image_url?: string;
  multidisciplinary?: boolean;
  styles?: string[];
  disciplines?: string[];
  author?: Profile;
}

export interface ContentCardProps extends ContentItemProps {
  onClick?: () => void;
  isSelected?: boolean;
  selectionMode?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  id,
  name, 
  type, 
  location, 
  tags = [], 
  subtype,
  image_url,
  multidisciplinary,
  styles = [],
  disciplines = [],
  author,
  onClick,
  isSelected = false,
  selectionMode = false
}) => {
  const defaultImage = 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md cursor-pointer",
        isSelected && "ring-2 ring-primary",
        selectionMode && "hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image_url || defaultImage}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        
        {selectionMode && (
          <div className={cn(
            "absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all",
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : "bg-background/80 text-foreground border"
          )}>
            {isSelected && <Check className="h-3 w-3" />}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="secondary" className="capitalize">{type}</Badge>
              {subtype && subtype !== type && (
                <Badge variant="outline" className="bg-background/30 capitalize">{subtype}</Badge>
              )}
            </div>
            
            {selectionMode && !isSelected && (
              <Button size="sm" variant="secondary" className="h-7 w-7 p-0" onClick={(e) => {
                e.stopPropagation();
                onClick && onClick();
              }}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="font-semibold line-clamp-1">{name}</h3>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-0 h-5">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        {!selectionMode && (
          <div className="w-full flex justify-end">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Select
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
