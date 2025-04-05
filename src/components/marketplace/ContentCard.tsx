import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Tag, Check, Calendar, Plus, Heart, ExternalLink, Bookmark, Share2, Users, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Profile } from '@/types/profile';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = React.useState(false);
  
  // Get profile path based on content type
  const getProfilePath = () => {
    switch (type) {
      case 'artist':
        return `/artists/${id}`;
      case 'venue':
        return `/venues/${id}`;
      case 'resource':
      case 'space':
      case 'tool':
        return `/resources/${id}`;
      case 'brand':
        return `/brands/${id}`;
      case 'event':
        return `/events/${id}`;
      default:
        return `/profile/${id}`;
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    
    toast.success(
      isSaved ? 'Removed from saved items' : 'Added to saved items', 
      { description: isSaved ? `${name} was removed from your saved items.` : `${name} was added to your saved items.` }
    );
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If in selection mode, use the onClick handler
    if (selectionMode && onClick) {
      onClick();
      return;
    }
    
    // Otherwise navigate to the profile page
    const path = getProfilePath();
    navigate(path);
    
    // Update window location to ensure proper URL is displayed in browser
    // This is important for SEO and sharing links
    window.history.pushState({}, '', path);
  };

  const handleAddToCollection = (e: React.MouseEvent, collectionName: string) => {
    e.stopPropagation();
    toast.success(`Added to ${collectionName}`, {
      description: `${name} has been added to your ${collectionName} collection.`
    });
  };

  const handleCreateEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/events/create?${type}=${id}`);
  };

  const handleSelectForEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/discover?select=true&target=event&${type}=${id}`);
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md cursor-pointer",
        isSelected && "ring-2 ring-primary",
        selectionMode && "hover:scale-[1.02]"
      )}
      onClick={handleCardClick}
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

        {/* Save/Like Button (not in selection mode) */}
        {!selectionMode && (
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "absolute top-2 right-2 h-8 w-8 rounded-full",
              "bg-background/60 hover:bg-background/80 backdrop-blur-sm",
              isSaved && "text-primary hover:text-primary"
            )}
            onClick={handleSave}
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
          </Button>
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
      
      <CardFooter className="pt-0 flex justify-between items-center">
        <Link 
          to={getProfilePath()} 
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          View Profile <ExternalLink className="h-3 w-3" />
        </Link>
        
        {!selectionMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={(e) => e.stopPropagation()}>
                <Plus className="h-3.5 w-3.5" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Add to</DropdownMenuLabel>
              <DropdownMenuItem onClick={(e) => handleSave(e as React.MouseEvent)}>
                <Bookmark className="mr-2 h-4 w-4" />
                {isSaved ? 'Remove from Saved' : 'Save'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => handleAddToCollection(e as React.MouseEvent, 'Favorites')}>
                <Heart className="mr-2 h-4 w-4" />
                Add to Favorites
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleAddToCollection(e as React.MouseEvent, 'Collaborators')}>
                <Users className="mr-2 h-4 w-4" />
                Add to Collaborators
              </DropdownMenuItem>
              {/* Conditional options based on content type */}
              {(type === 'artist' || type === 'venue' || type === 'resource') && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => handleSelectForEvent(e as React.MouseEvent)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Select for Event
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleCreateEvent(e as React.MouseEvent)}>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Create Event With {type === 'artist' ? 'Artist' : type === 'venue' ? 'Venue' : 'Resource'}
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                // Implement share functionality
                navigator.clipboard.writeText(window.location.origin + getProfilePath());
                toast.success('Link copied to clipboard');
              }}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
