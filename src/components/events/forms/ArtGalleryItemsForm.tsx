
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArtGalleryItem } from '@/types/event';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { v4 as uuidv4 } from 'uuid';
import { X, Plus, Image } from 'lucide-react';
import ArtGalleryCard from '@/components/events/ArtGalleryCard';

interface ArtGalleryItemsFormProps {
  galleryItems: ArtGalleryItem[];
  setGalleryItems: React.Dispatch<React.SetStateAction<ArtGalleryItem[]>>;
}

const ArtGalleryItemsForm: React.FC<ArtGalleryItemsFormProps> = ({
  galleryItems,
  setGalleryItems
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ArtGalleryItem>({
    id: '',
    title: '',
    artistName: '',
    medium: '',
    year: '',
    description: '',
    imageUrl: '',
    price: '',
    dimensions: '',
    isForSale: false,
    collectionName: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNew = () => {
    setCurrentItem({
      id: uuidv4(),
      title: '',
      artistName: '',
      medium: '',
      year: '',
      description: '',
      imageUrl: '',
      price: '',
      dimensions: '',
      isForSale: false,
      collectionName: ''
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: ArtGalleryItem) => {
    setCurrentItem(item);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
  };

  const handleSave = () => {
    if (!currentItem.title || !currentItem.artistName) {
      return;
    }

    if (isEditing) {
      setGalleryItems(galleryItems.map(item => 
        item.id === currentItem.id ? currentItem : item
      ));
    } else {
      setGalleryItems([...galleryItems, currentItem]);
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Art Gallery Items</h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleAddNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Artwork
        </Button>
      </div>

      {galleryItems.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/30">
          <Image className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No gallery items added yet</p>
          <Button 
            variant="link" 
            className="mt-2"
            onClick={handleAddNew}
          >
            Add your first artwork
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map(item => (
            <Card key={item.id} className="overflow-hidden h-full">
              <ArtGalleryCard item={item} showDetails />
              <CardFooter className="flex justify-end gap-2 p-2">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleDelete(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Artwork' : 'Add New Artwork'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={currentItem.title}
                onChange={e => setCurrentItem({...currentItem, title: e.target.value})}
                placeholder="Title of the artwork"
              />
            </div>
            
            <div>
              <Label htmlFor="artistName">Artist Name</Label>
              <Input
                id="artistName"
                value={currentItem.artistName}
                onChange={e => setCurrentItem({...currentItem, artistName: e.target.value})}
                placeholder="Name of the artist"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="medium">Medium</Label>
                <Input
                  id="medium"
                  value={currentItem.medium || ''}
                  onChange={e => setCurrentItem({...currentItem, medium: e.target.value})}
                  placeholder="e.g., Oil on canvas"
                />
              </div>
              
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={currentItem.year || ''}
                  onChange={e => setCurrentItem({...currentItem, year: e.target.value})}
                  placeholder="e.g., 2023"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={currentItem.dimensions || ''}
                onChange={e => setCurrentItem({...currentItem, dimensions: e.target.value})}
                placeholder="e.g., 24x36 inches"
              />
            </div>
            
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={currentItem.imageUrl || ''}
                onChange={e => setCurrentItem({...currentItem, imageUrl: e.target.value})}
                placeholder="URL of the artwork image"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentItem.description || ''}
                onChange={e => setCurrentItem({...currentItem, description: e.target.value})}
                placeholder="Description of the artwork"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="collectionName">Collection Name (optional)</Label>
              <Input
                id="collectionName"
                value={currentItem.collectionName || ''}
                onChange={e => setCurrentItem({...currentItem, collectionName: e.target.value})}
                placeholder="Collection this piece belongs to"
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="isForSale" className="flex-grow">This piece is for sale</Label>
              <Switch
                id="isForSale"
                checked={currentItem.isForSale || false}
                onCheckedChange={checked => setCurrentItem({...currentItem, isForSale: checked})}
              />
            </div>
            
            {currentItem.isForSale && (
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={currentItem.price || ''}
                  onChange={e => setCurrentItem({...currentItem, price: e.target.value})}
                  placeholder="e.g., $1,200"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? 'Update' : 'Add'} Artwork
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtGalleryItemsForm;
