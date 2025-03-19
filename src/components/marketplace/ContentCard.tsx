
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Share2, Heart, Bookmark, MessageSquare, User, Building, Music, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export interface ContentItemProps {
  id: string;
  name: string;
  type: string;
  location: string;
  tags: string[];
  subtype?: string;
  description?: string;
}

interface ContentCardProps {
  item: ContentItemProps;
}

const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const getTypeIcon = () => {
    switch (item.type) {
      case 'artist':
        return <Music className="h-5 w-5 text-primary" />;
      case 'brand':
        return <Building className="h-5 w-5 text-primary" />;
      case 'venue':
        return <Building className="h-5 w-5 text-primary" />;
      case 'space':
      case 'tool':
      case 'offerer':
        return <User className="h-5 w-5 text-primary" />;
      default:
        return <User className="h-5 w-5 text-primary" />;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from liked items" : "Added to liked items",
      description: isLiked ? `${item.name} removed from your likes` : `${item.name} added to your likes`,
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved items" : "Added to saved items",
      description: isSaved ? `${item.name} removed from your saved items` : `${item.name} added to your saved items`,
    });
  };

  const handleShare = (platform: string) => {
    toast({
      title: "Shared successfully",
      description: `${item.name} has been shared via ${platform}`,
    });
  };

  const handleMessage = () => {
    toast({
      title: "Message sent",
      description: `You can now chat with ${item.name}`,
    });
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <h3 className="font-medium text-base">{item.name}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleShare("Email")}>
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("Text")}>
                Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("Social")}>
                Social Media
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("Copy")}>
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {item.subtype && (
          <Badge variant="outline" className="mb-2">
            {item.subtype}
          </Badge>
        )}
        
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-3 w-3" />
          <span>{item.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 3}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col gap-1">
                    {item.tags.slice(3).map((tag, index) => (
                      <span key={index}>{tag}</span>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-3 pb-3">
        <div className="flex justify-between w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-2 ${isLiked ? 'text-red-500' : ''}`}
            onClick={handleLike}
          >
            <Heart className="h-4 w-4 mr-1" fill={isLiked ? "currentColor" : "none"} />
            <span className="text-xs">Like</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-2 ${isSaved ? 'text-primary' : ''}`}
            onClick={handleSave}
          >
            <Bookmark className="h-4 w-4 mr-1" fill={isSaved ? "currentColor" : "none"} />
            <span className="text-xs">Save</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="px-2"
            onClick={handleMessage}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-xs">Message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
