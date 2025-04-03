
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
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

interface ContentCardProps {
  item: ContentItemProps;
  onSave?: () => void;
  onSelect?: () => void;
  showSaveButton?: boolean;
  showSelectButton?: boolean;
  className?: string;
  linkTo?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onSave,
  onSelect,
  showSaveButton = false,
  showSelectButton = false,
  className = '',
  linkTo
}) => {
  const cardContent = (
    <>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">
              {item.subtype || item.type}
            </Badge>
            <CardTitle className="text-xl">{item.name}</CardTitle>
            {item.location && (
              <CardDescription className="flex items-center mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {item.location}
              </CardDescription>
            )}
          </div>
          {showSaveButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave && onSave();
              }}
            >
              <BookmarkPlus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      {(onSelect || showSelectButton) && (
        <CardFooter className="p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect && onSelect();
            }}
          >
            Select
          </Button>
        </CardFooter>
      )}
    </>
  );

  if (linkTo) {
    return (
      <Card className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${className}`}>
        <Link to={linkTo} className="block">
          {cardContent}
        </Link>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {cardContent}
    </Card>
  );
};

export default ContentCard;
