
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash, Upload, Image } from 'lucide-react';
import { ArtGalleryItem } from '@/types/event';
import { v4 as uuidv4 } from 'uuid';

interface ArtGalleryItemsFormProps {
  galleryItems: ArtGalleryItem[];
  setGalleryItems: (items: ArtGalleryItem[]) => void;
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
  
  const resetForm = () => {
    setCurrentItem({
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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentItem({
      ...currentItem,
      isForSale: checked
    });
  };

  const handleAddItem = () => {
    if (!currentItem.title || !currentItem.artistName) return;
    
    const newItem: ArtGalleryItem = {
      ...currentItem,
      id: currentItem.id || uuidv4()
    };
    
    if (currentItem.id) {
      // Update existing item
      setGalleryItems(galleryItems.map(item => 
        item.id === currentItem.id ? newItem : item
      ));
    } else {
      // Add new item
      setGalleryItems([...galleryItems, newItem]);
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleRemoveItem = (id: string) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
  };

  const handleEditItem = (item: ArtGalleryItem) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    
    setCurrentItem({
      ...currentItem,
      imageUrl: url
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gallery Items</h2>
        <Button 
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Artwork
        </Button>
      </div>
      
      {galleryItems.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Medium</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleryItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.artistName}</TableCell>
                  <TableCell>{item.medium || '—'}</TableCell>
                  <TableCell>{item.isForSale ? (item.price || 'Contact for price') : 'Not for sale'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md bg-muted/10">
          <p className="text-muted-foreground">No gallery items added yet</p>
          <p className="text-sm mt-1">Add artwork to display in your gallery or exhibition</p>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {currentItem.id ? 'Edit Artwork' : 'Add Artwork'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Artwork Title*</Label>
                  <Input
                    id="title"
                    name="title"
                    value={currentItem.title}
                    onChange={handleInputChange}
                    placeholder="Title of the artwork"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="artistName">Artist Name*</Label>
                  <Input
                    id="artistName"
                    name="artistName"
                    value={currentItem.artistName}
                    onChange={handleInputChange}
                    placeholder="Name of the artist"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="medium">Medium</Label>
                    <Input
                      id="medium"
                      name="medium"
                      value={currentItem.medium || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., Oil on canvas"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      value={currentItem.year || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., 2023"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    name="dimensions"
                    value={currentItem.dimensions || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 24 x 36 inches"
                  />
                </div>
                
                <div>
                  <Label htmlFor="collectionName">Collection</Label>
                  <Input
                    id="collectionName"
                    name="collectionName"
                    value={currentItem.collectionName || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Spring Collection 2025"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageUpload">Artwork Image</Label>
                  <div className="mt-2">
                    <div className="aspect-square bg-muted rounded-md overflow-hidden mb-2">
                      {currentItem.imageUrl ? (
                        <img 
                          src={currentItem.imageUrl} 
                          alt={currentItem.title} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6">
                          <Image className="h-12 w-12 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground text-center text-sm">
                            No image uploaded
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Label 
                      htmlFor="imageUpload" 
                      className="cursor-pointer flex h-10 items-center rounded-md px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full justify-center"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {currentItem.imageUrl ? 'Change Image' : 'Upload Image'}
                    </Label>
                    <Input 
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={currentItem.description || ''}
                    onChange={handleInputChange}
                    placeholder="Description of the artwork"
                    rows={4}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isForSale"
                    checked={currentItem.isForSale || false}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isForSale">Artwork is for sale</Label>
                </div>
                
                {currentItem.isForSale && (
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      value={currentItem.price || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., $1,200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddItem}>
              {currentItem.id ? 'Update Artwork' : 'Add Artwork'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ArtGalleryItemsForm;
