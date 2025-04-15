
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, DollarSign, Maximize } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArtGalleryItem } from '@/types/event';

interface ArtGalleryCardProps {
  item: ArtGalleryItem;
  showDetails?: boolean;
}

const ArtGalleryCard: React.FC<ArtGalleryCardProps> = ({
  item,
  showDetails = false
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-md transition-all cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="aspect-square w-full overflow-hidden relative">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          
          {item.isForSale && (
            <Badge className="absolute top-2 right-2 bg-green-600">
              For Sale
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium line-clamp-1">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.artistName}</p>
          
          {showDetails && (
            <div className="mt-2 space-y-1 text-sm">
              {item.medium && (
                <p className="text-muted-foreground">{item.medium}, {item.year}</p>
              )}
              
              {item.dimensions && (
                <p className="text-muted-foreground flex items-center">
                  <Maximize className="h-3 w-3 mr-1" />
                  {item.dimensions}
                </p>
              )}
              
              {item.price && (
                <p className="font-medium flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {item.price}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{item.title}</DialogTitle>
            <DialogDescription>
              By {item.artistName} {item.year && `(${item.year})`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square overflow-hidden rounded-md">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-contain bg-muted"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                {item.medium && (
                  <p><span className="font-medium">Medium:</span> {item.medium}</p>
                )}
                
                {item.dimensions && (
                  <p><span className="font-medium">Dimensions:</span> {item.dimensions}</p>
                )}
                
                {item.collectionName && (
                  <p><span className="font-medium">Collection:</span> {item.collectionName}</p>
                )}
              </div>
              
              {item.description && (
                <div>
                  <h4 className="font-medium mb-1">About this piece</h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              )}
              
              {item.isForSale && item.price && (
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-xl font-bold">{item.price}</p>
                    </div>
                    <Button>
                      Inquire About This Piece
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtGalleryCard;
