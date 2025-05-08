
import React from 'react';
import { Button } from '@/components/ui/button';
import { EventContentItem } from '@/types/forms';
import { X } from 'lucide-react';

interface ArtGalleryItemsFormProps {
  selectedItems: EventContentItem[];
  onRemoveItem?: (itemId: string) => void;
}

export const ArtGalleryItemsForm: React.FC<ArtGalleryItemsFormProps> = ({
  selectedItems,
  onRemoveItem
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h4 className="text-sm font-medium">Gallery Items</h4>
        
        {selectedItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No gallery items selected yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  {item.image_url && (
                    <div className="h-10 w-10 bg-muted rounded overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.medium && (
                      <p className="text-xs text-muted-foreground">{item.medium}</p>
                    )}
                  </div>
                </div>
                {onRemoveItem && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onRemoveItem(item.id)}
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

export default ArtGalleryItemsForm;
