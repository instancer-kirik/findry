
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Palette, Users, Music, Building, Store, Bot, ArrowRight, Star } from 'lucide-react';

export interface ContentItemProps {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  location: string;
  tags: string[];
  image?: string;
  multidisciplinary?: boolean;
  styles?: string[];
  disciplines?: string[];
}

interface ContentCardProps {
  item: ContentItemProps;
}

const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'artist':
        return <Music className="h-5 w-5" />;
      case 'brand':
        return <Store className="h-5 w-5" />;
      case 'venue':
        return <Building className="h-5 w-5" />;
      case 'resource':
      case 'space':
      case 'tool':
      case 'offerer':
        return <Bot className="h-5 w-5" />;
      case 'community':
        return <Users className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getTypeLabel = () => {
    // Capitalize the first letter of the type
    const type = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    return item.subtype ? `${type} - ${item.subtype}` : type;
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'artist':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'brand':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'venue':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'resource':
      case 'space':
      case 'tool':
      case 'offerer':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'community':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'project':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'event':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getDetailPath = () => {
    switch (item.type) {
      case 'event':
        return `/events/${item.id}`;
      case 'artist':
        return `/artists/${item.id}`;
      case 'venue':
        return `/venues/${item.id}`;
      default:
        return `/${item.type}s/${item.id}`;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getTypeColor()}>
            <div className="flex items-center gap-1">
              {getIcon()}
              <span>{getTypeLabel()}</span>
            </div>
          </Badge>
          
          {item.multidisciplinary && (
            <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-0">
              <div className="flex items-center gap-1">
                <Palette className="h-3 w-3" />
                <span>Multi</span>
              </div>
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl">{item.name}</CardTitle>
        <CardDescription>{item.location}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        {item.styles && item.styles.length > 0 && (
          <div className="mt-3">
            <div className="text-sm text-muted-foreground mb-1">Styles:</div>
            <div className="flex flex-wrap gap-1">
              {item.styles.slice(0, 2).map((style, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/10">
                  {style}
                </Badge>
              ))}
              {item.styles.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{item.styles.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {item.disciplines && item.disciplines.length > 0 && (
          <div className="mt-3">
            <div className="text-sm text-muted-foreground mb-1">Disciplines:</div>
            <div className="flex flex-wrap gap-1">
              {item.disciplines.map((discipline, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/10">
                  {discipline}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full justify-between hover:bg-transparent hover:text-primary">
          <Link to={getDetailPath()}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
