import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, ExternalLink } from 'lucide-react';
import { UGCContent } from '@/types/ugc';
import { useUGC, useUserLikedContent } from '@/hooks/use-ugc';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UGCFeedCardProps {
  content: UGCContent;
  onCommentClick?: () => void;
  currentUserId?: string;
}

export function UGCFeedCard({ content, onCommentClick, currentUserId }: UGCFeedCardProps) {
  const { toggleLike, deleteContent } = useUGC();
  const { data: isLiked } = useUserLikedContent(content.id);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const isOwner = currentUserId === content.author_id;

  const handleLike = () => {
    toggleLike.mutate(content.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: content.title || 'Check this out',
        url: window.location.origin + '/feed/' + content.id,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + '/feed/' + content.id);
    }
  };

  const renderMedia = () => {
    switch (content.content_type) {
      case 'image':
        return (
          <img 
            src={content.url} 
            alt={content.title || 'User content'} 
            className="w-full aspect-square object-cover"
          />
        );
      case 'video':
        return (
          <video 
            src={content.url} 
            className="w-full aspect-video object-cover"
            controls
            poster={content.thumbnail_url || undefined}
          />
        );
      case 'embed':
        return (
          <div className="aspect-video bg-muted flex items-center justify-center">
            <a 
              href={content.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-8 h-8" />
              <span className="text-sm">View embedded content</span>
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={content.author?.avatar_url || undefined} />
            <AvatarFallback>
              {content.author?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">
              {content.author?.full_name || content.author?.username || 'Anonymous'}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(content.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleShare}>
              Share
            </DropdownMenuItem>
            {isOwner && (
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => deleteContent.mutate(content.id)}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Media */}
      <div className="relative">
        {renderMedia()}
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("gap-2", isLiked && "text-red-500")}
            onClick={handleLike}
          >
            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
            {content.likes_count > 0 && content.likes_count}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" onClick={onCommentClick}>
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Title & Description */}
        {(content.title || content.description) && (
          <div className="space-y-1">
            {content.title && (
              <p className="font-semibold">{content.title}</p>
            )}
            {content.description && (
              <p 
                className={cn(
                  "text-sm text-muted-foreground",
                  !showFullDescription && "line-clamp-2"
                )}
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {content.description}
              </p>
            )}
          </div>
        )}

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {content.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
