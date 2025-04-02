
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Package, Plus, Edit, Trash2, MoreHorizontal, Camera, Music, Video, FileText, Laptop, Box } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface Item {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  description?: string;
  image_url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

const itemTypeIcons: Record<string, React.ReactNode> = {
  'equipment': <Package size={16} />,
  'photo': <Camera size={16} />,
  'audio': <Music size={16} />,
  'video': <Video size={16} />,
  'document': <FileText size={16} />,
  'software': <Laptop size={16} />,
  'other': <Box size={16} />,
};

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: '',
    type: 'equipment',
    description: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      
      try {
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (resourcesError) throw resourcesError;
        
        if (resourcesData) {
          setItems(resourcesData);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load items',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [toast]);

  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => item.type === activeTab);

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      const newTags = [...(newItem.tags || []), tagInput.trim()];
      setNewItem({ ...newItem, tags: newTags });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...(newItem.tags || [])];
    newTags.splice(index, 1);
    setNewItem({ ...newItem, tags: newTags });
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.type) {
      toast({
        title: 'Error',
        description: 'Name and type are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: resourceData, error: resourceError } = await supabase
        .from('resources')
        .insert([{
          name: newItem.name,
          type: newItem.type,
          subtype: newItem.subtype,
          description: newItem.description,
          tags: newItem.tags,
        }])
        .select();

      if (resourceError) throw resourceError;

      if (resourceData && resourceData[0]) {
        // Add ownership record
        const { error: ownershipError } = await supabase
          .from('content_ownership')
          .insert([{
            content_id: resourceData[0].id,
            content_type: 'resource',
            owner_id: (await supabase.auth.getUser()).data.user?.id,
          }]);

        if (ownershipError) throw ownershipError;

        setItems([resourceData[0], ...items]);
        setIsAddItemOpen(false);
        setNewItem({
          name: '',
          type: 'equipment',
          description: '',
          tags: [],
        });
        
        toast({
          title: 'Success',
          description: 'Item added successfully',
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(items.filter(item => item.id !== id));
      
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Items</h1>
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogDescription>
                  Add a new item to your inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Item name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newItem.type}
                      onValueChange={(value) => setNewItem({ ...newItem, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="photo">Photo</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subtype">Subtype (Optional)</Label>
                    <Input
                      id="subtype"
                      value={newItem.subtype || ''}
                      onChange={(e) => setNewItem({ ...newItem, subtype: e.target.value })}
                      placeholder="Subtype"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Item description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(newItem.tags || []).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-1 rounded-full hover:bg-background p-1"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Add tags (press Enter to add)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="photo">Photos</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="software">Software</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="h-28 bg-muted rounded-t-lg"></CardHeader>
                    <CardContent className="pt-6">
                      <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                      <div className="h-3 bg-muted rounded mb-2 w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden group">
                    <div className="h-40 bg-muted relative overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-16 w-16 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {item.name}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            {itemTypeIcons[item.type] || <Package size={16} />}
                            <span className="ml-1 capitalize">{item.type}{item.subtype ? ` - ${item.subtype}` : ''}</span>
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description || 'No description provided'}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(item.tags || []).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <div className="text-xs text-muted-foreground">
                        Added: {new Date(item.created_at).toLocaleDateString()}
                      </div>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-medium">No items found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {activeTab === 'all'
                    ? "You haven't added any items yet. Click 'Add Item' to get started."
                    : `You don't have any ${activeTab} items yet.`}
                </p>
                <Button className="mt-4" onClick={() => setIsAddItemOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Item
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ItemsPage;
