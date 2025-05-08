
import React from 'react';
import { Button } from '@/components/ui/button';
import { EventContentItem } from '@/types/forms';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { X, Plus } from 'lucide-react';

export interface FeaturedArtistsFormProps {
  selectedArtists?: EventContentItem[];
  setSelectedArtists?: (artists: EventContentItem[]) => void;
  featuredArtists?: any[];  // To support the old property
  setFeaturedArtists?: (artists: any[]) => void;  // To support the old property
  onAddArtist?: (artist: EventContentItem) => void;
  onRemoveArtist?: (artistId: string) => void;
}

export const FeaturedArtistsForm: React.FC<FeaturedArtistsFormProps> = ({
  selectedArtists = [],
  onRemoveArtist,
  featuredArtists = [],
  setFeaturedArtists
}) => {
  // Use the appropriate data source based on what's provided
  const displayArtists = selectedArtists.length > 0 ? selectedArtists : featuredArtists;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h4 className="text-sm font-medium">Featured Artists</h4>
        
        {displayArtists.length === 0 ? (
          <p className="text-sm text-muted-foreground">No artists selected yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {displayArtists.map((artist) => (
              <div 
                key={artist.id}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {artist.image_url ? (
                      <AvatarImage src={artist.image_url} alt={artist.name} />
                    ) : (
                      <AvatarFallback>{artist.name.substring(0, 2)}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm font-medium">{artist.name}</span>
                </div>
                {onRemoveArtist && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onRemoveArtist(artist.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedArtistsForm;
