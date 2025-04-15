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
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Check, Plus, Trash, X, Upload } from 'lucide-react';
import { FeaturedArtist } from '@/types/event';
import { v4 as uuidv4 } from 'uuid';

interface FeaturedArtistsFormProps {
  featuredArtists: FeaturedArtist[];
  setFeaturedArtists: (artists: FeaturedArtist[]) => void;
}

const FeaturedArtistsForm: React.FC<FeaturedArtistsFormProps> = ({
  featuredArtists,
  setFeaturedArtists
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  // Single artist form state
  const [artistForm, setArtistForm] = useState<FeaturedArtist>({
    id: '',
    name: '',
    type: '',
    location: '',
    email: '',
    website: '',
    description: '',
    isOnPlatform: false
  });

  const resetForm = () => {
    setArtistForm({
      id: '',
      name: '',
      type: '',
      location: '',
      email: '',
      website: '',
      description: '',
      isOnPlatform: false
    });
    setBulkInput('');
    setIsAddingMultiple(false);
    setIsImporting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArtistForm({
      ...artistForm,
      [name]: value
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setArtistForm({
      ...artistForm,
      isOnPlatform: checked
    });
  };

  const handleAddArtist = () => {
    if (!artistForm.name) return;
    
    const newArtist: FeaturedArtist = {
      ...artistForm,
      id: artistForm.id || uuidv4()
    };
    
    setFeaturedArtists([...featuredArtists, newArtist]);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleRemoveArtist = (id: string) => {
    setFeaturedArtists(featuredArtists.filter(artist => artist.id !== id));
  };

  const handleEditArtist = (artist: FeaturedArtist) => {
    setArtistForm(artist);
    setIsDialogOpen(true);
  };

  const parseImportedArtists = () => {
    try {
      if (!bulkInput.trim()) return;
      
      // Determine if it's CSV or JSON
      if (bulkInput.trim().startsWith('[') || bulkInput.trim().startsWith('{')) {
        // JSON format
        try {
          const parsed = JSON.parse(bulkInput);
          const artists = Array.isArray(parsed) ? parsed : [parsed];
          
          const validArtists = artists.map((artist: any) => ({
            id: artist.id || uuidv4(),
            name: artist.name || 'Unknown Artist',
            image_url: artist.image_url || '',
            description: artist.description || '',
            type: artist.type || '',
            location: artist.location || '',
            email: artist.email || '',
            website: artist.website || '',
            social_links: artist.social_links || [],
            isOnPlatform: !!artist.isOnPlatform,
            platformId: artist.platformId || ''
          }));
          
          setFeaturedArtists([...featuredArtists, ...validArtists]);
          resetForm();
          setIsDialogOpen(false);
        } catch (e) {
          alert('Invalid JSON format. Please check your input.');
        }
      } else {
        // CSV or line-by-line format
        const lines = bulkInput.split('\n').filter(line => line.trim());
        const newArtists: FeaturedArtist[] = [];
        
        lines.forEach(line => {
          // Check if it's CSV with commas
          const parts = line.includes(',') 
            ? line.split(',').map(p => p.trim()) 
            : [line.trim()];
          
          if (parts.length > 0 && parts[0]) {
            const artist: FeaturedArtist = {
              id: uuidv4(),
              name: parts[0],
              type: parts[1] || '',
              location: parts[2] || '',
              email: parts[3] || '',
              website: parts[4] || '',
              description: parts[5] || ''
            };
            newArtists.push(artist);
          }
        });
        
        if (newArtists.length > 0) {
          setFeaturedArtists([...featuredArtists, ...newArtists]);
          resetForm();
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Error parsing artists:', error);
      alert('Error parsing the input. Please check the format and try again.');
    }
  };

  const handleBulkImport = () => {
    parseImportedArtists();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setBulkInput(content || '');
    };
    
    reader.readAsText(file);
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Featured Artists</h2>
        <Button 
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Artists
        </Button>
      </div>
      
      {featuredArtists.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featuredArtists.map(artist => (
                <TableRow key={artist.id}>
                  <TableCell className="font-medium">{artist.name}</TableCell>
                  <TableCell>{artist.type || '—'}</TableCell>
                  <TableCell>{artist.location || '—'}</TableCell>
                  <TableCell>{artist.email || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditArtist(artist)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveArtist(artist.id)}
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
          <p className="text-muted-foreground">No featured artists added yet</p>
          <p className="text-sm mt-1">Add artists to promote them in your event</p>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {isAddingMultiple ? 'Add Multiple Artists' : 'Add Featured Artist'}
            </DialogTitle>
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddingMultiple(!isAddingMultiple)}
              >
                {isAddingMultiple ? 'Single Artist' : 'Multiple Artists'}
              </Button>
            </div>
          </DialogHeader>
          
          {!isAddingMultiple ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Artist Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={artistForm.name}
                    onChange={handleInputChange}
                    placeholder="Artist name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    name="type"
                    value={artistForm.type}
                    onChange={handleInputChange}
                    placeholder="e.g., Painter, Musician, DJ"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={artistForm.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={artistForm.email || ''}
                    onChange={handleInputChange}
                    placeholder="artist@example.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="website">Website / Social Media</Label>
                <Input
                  id="website"
                  name="website"
                  value={artistForm.website || ''}
                  onChange={handleInputChange}
                  placeholder="https://artist-website.com"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={artistForm.description || ''}
                  onChange={handleInputChange}
                  placeholder="Brief description of the artist"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isOnPlatform"
                  checked={artistForm.isOnPlatform || false}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isOnPlatform">Artist is on our platform</Label>
              </div>
              
              {artistForm.isOnPlatform && (
                <div>
                  <Label htmlFor="platformId">Platform ID</Label>
                  <Input
                    id="platformId"
                    name="platformId"
                    value={artistForm.platformId || ''}
                    onChange={handleInputChange}
                    placeholder="User ID on the platform"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bulk Import Methods:</span>
                  <div className="flex gap-2">
                    <Button
                      variant={isImporting ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIsImporting(true)}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload File
                    </Button>
                    <Button
                      variant={!isImporting ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIsImporting(false)}
                    >
                      Manual Entry
                    </Button>
                  </div>
                </div>
                
                {isImporting ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="artistsFile">Upload CSV or JSON file</Label>
                      <Input
                        id="artistsFile"
                        type="file"
                        accept=".csv,.json,.txt"
                        onChange={handleFileUpload}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: CSV (name,type,location,email,website,description), JSON (array of artist objects)
                    </p>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="bulkInput">
                      Enter artists (one per line or paste JSON)
                    </Label>
                    <Textarea
                      id="bulkInput"
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      placeholder={`Artist Name, Type, Location, Email\nAnother Artist, Painter, New York, artist@example.com\n\nOr paste JSON data`}
                      rows={10}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: Name, Type, Location, Email, Website, Description (CSV) or valid JSON
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
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
            {isAddingMultiple ? (
              <Button onClick={handleBulkImport}>
                Import Artists
              </Button>
            ) : (
              <Button onClick={handleAddArtist}>
                {artistForm.id ? 'Update Artist' : 'Add Artist'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedArtistsForm; 