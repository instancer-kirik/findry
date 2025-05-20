
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Plus, Music, Guitar, Truck, Luggage, X } from 'lucide-react';
import { GearList, GearItem, GearCategory } from '@/types/content';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const GearPacking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'band' | 'personal' | 'production'>('band');
  const [gearLists, setGearLists] = useState<GearList[]>([]);
  const [selectedList, setSelectedList] = useState<GearList | null>(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);
  
  // Predefined gear categories
  const [categories] = useState<GearCategory[]>([
    { id: 'cat-1', name: 'Instruments', description: 'Musical instruments', icon: 'music' },
    { id: 'cat-2', name: 'Accessories', description: 'Picks, strings, capos', icon: 'guitar' },
    { id: 'cat-3', name: 'Electronics', description: 'Cables, pedals, adapters', icon: 'truck' },
    { id: 'cat-4', name: 'Personal', description: 'Clothes, toiletries, etc.', icon: 'luggage' },
    { id: 'cat-5', name: 'Documents', description: 'IDs, contracts, permits', icon: 'package' },
    { id: 'cat-6', name: 'Production', description: 'PA systems, lights', icon: 'truck' },
    { id: 'cat-7', name: 'Merch', description: 'T-shirts, albums, etc.', icon: 'package' },
    { id: 'cat-8', name: 'Food & Drinks', description: 'Snacks, water', icon: 'package' },
    { id: 'cat-9', name: 'Other', description: 'Miscellaneous items', icon: 'package' },
  ]);
  
  const createGearList = (list: Omit<GearList, 'id' | 'created_at' | 'updated_at'>) => {
    // In a real app, this would save to a database
    const newList: GearList = {
      ...list,
      id: `list-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setGearLists([...gearLists, newList]);
    setSelectedList(newList);
    setIsCreatingList(false);
    toast.success('Packing list created!');
  };
  
  const addGearItem = (item: Omit<GearItem, 'id' | 'list_id' | 'created_at' | 'updated_at'>) => {
    if (!selectedList) return;
    
    // In a real app, this would save to a database
    const newItem: GearItem = {
      ...item,
      id: `item-${Date.now()}`,
      list_id: selectedList.id,
    };
    
    const updatedList = {
      ...selectedList,
      items: [...selectedList.items, newItem],
      updated_at: new Date().toISOString()
    };
    
    setSelectedList(updatedList);
    setGearLists(gearLists.map(list => 
      list.id === updatedList.id ? updatedList : list
    ));
    
    setIsAddingItem(false);
    toast.success('Item added to packing list');
  };
  
  const updateGearItem = (item: GearItem) => {
    if (!selectedList) return;
    
    const updatedItems = selectedList.items.map(existingItem => 
      existingItem.id === item.id ? { ...item, updated_at: new Date().toISOString() } : existingItem
    );
    
    const updatedList = {
      ...selectedList,
      items: updatedItems,
      updated_at: new Date().toISOString()
    };
    
    setSelectedList(updatedList);
    setGearLists(gearLists.map(list => 
      list.id === updatedList.id ? updatedList : list
    ));
    
    setEditingItem(null);
    toast.success('Item updated');
  };
  
  const deleteGearItem = (itemId: string) => {
    if (!selectedList) return;
    
    const updatedList = {
      ...selectedList,
      items: selectedList.items.filter(item => item.id !== itemId),
      updated_at: new Date().toISOString()
    };
    
    setSelectedList(updatedList);
    setGearLists(gearLists.map(list => 
      list.id === updatedList.id ? updatedList : list
    ));
    
    toast.success('Item removed from list');
  };
  
  const toggleItemPacked = (itemId: string, isPacked: boolean) => {
    if (!selectedList) return;
    
    const updatedItems = selectedList.items.map(item => 
      item.id === itemId ? { ...item, packed: isPacked, updated_at: new Date().toISOString() } : item
    );
    
    const updatedList = {
      ...selectedList,
      items: updatedItems,
      updated_at: new Date().toISOString()
    };
    
    setSelectedList(updatedList);
    setGearLists(gearLists.map(list => 
      list.id === updatedList.id ? updatedList : list
    ));
  };
  
  const deleteGearList = (listId: string) => {
    setGearLists(gearLists.filter(list => list.id !== listId));
    if (selectedList && selectedList.id === listId) {
      setSelectedList(null);
    }
    toast.success('Packing list deleted');
  };
  
  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    switch(category?.icon) {
      case 'music': return <Music className="h-4 w-4" />;
      case 'guitar': return <Guitar className="h-4 w-4" />;
      case 'truck': return <Truck className="h-4 w-4" />;
      case 'luggage': return <Luggage className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };
  
  const renderGearList = () => {
    if (!selectedList) return null;
    
    const itemsByCategory: Record<string, GearItem[]> = {};
    selectedList.items.forEach(item => {
      if (!itemsByCategory[item.category]) {
        itemsByCategory[item.category] = [];
      }
      itemsByCategory[item.category].push(item);
    });
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{selectedList.name}</h2>
          <div className="flex space-x-2">
            <Button onClick={() => setIsAddingItem(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
        </div>
        
        {Object.keys(itemsByCategory).length === 0 ? (
          <div className="text-center py-10 border rounded-lg">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">This list is empty</h3>
            <p className="text-muted-foreground mb-6">Add items to your packing list</p>
            <Button onClick={() => setIsAddingItem(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(itemsByCategory).sort().map(category => (
              <div key={category} className="space-y-2">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(category)}
                  <h3 className="text-lg font-medium">{category}</h3>
                </div>
                
                <div className="space-y-1">
                  {itemsByCategory[category].map(item => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "flex items-center justify-between p-3 border rounded-lg",
                        item.packed && "bg-muted/50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          checked={item.packed} 
                          onCheckedChange={(checked) => toggleItemPacked(item.id, checked === true)}
                        />
                        <div className={cn(item.packed && "line-through text-muted-foreground")}>
                          <span className="font-medium">{item.name}</span>
                          {item.quantity > 1 && <span className="ml-2 text-muted-foreground">x{item.quantity}</span>}
                          {item.notes && <p className="text-sm text-muted-foreground">{item.notes}</p>}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteGearItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="pt-6 border-t">
              <div className="flex justify-between">
                <div>
                  <p className="text-muted-foreground">Total Items: {selectedList.items.length}</p>
                  <p className="text-muted-foreground">Packed: {selectedList.items.filter(item => item.packed).length}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedList(null)}>
                  Back to Lists
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Gear Packing</h1>
            
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Tour Planner
            </Button>
          </div>
          
          <Tabs
            defaultValue="band"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as 'band' | 'personal' | 'production');
              setSelectedList(null);
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-[600px] mb-8">
              <TabsTrigger value="band" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Band Gear
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <Luggage className="h-4 w-4" />
                Personal Items
              </TabsTrigger>
              <TabsTrigger value="production" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Production Equipment
              </TabsTrigger>
            </TabsList>
            
            {['band', 'personal', 'production'].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                {selectedList ? (
                  renderGearList()
                ) : isCreatingList ? (
                  <div className="bg-card border rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold mb-6">Create New Packing List</h2>
                    <GearListForm
                      type={tabValue as 'band' | 'personal' | 'production'}
                      onSubmit={createGearList}
                      onCancel={() => setIsCreatingList(false)}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-3">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                          {tabValue === 'band' ? 'Band Gear Lists' : 
                           tabValue === 'personal' ? 'Personal Packing Lists' : 
                           'Production Equipment Lists'}
                        </h2>
                        <Button onClick={() => setIsCreatingList(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create List
                        </Button>
                      </div>
                    </div>
                    
                    {gearLists.filter(list => list.type === tabValue).length > 0 ? (
                      gearLists
                        .filter(list => list.type === tabValue)
                        .map(list => (
                          <div key={list.id} className="bg-card border rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg">{list.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {list.items.length} items • {list.items.filter(item => item.packed).length} packed
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => deleteGearList(list.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mt-4">
                              <Button onClick={() => setSelectedList(list)}>View & Edit</Button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="col-span-1 md:col-span-3 text-center py-12 border rounded-lg bg-card">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No packing lists yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Create a packing list to keep track of your {tabValue === 'band' ? 'band gear' : 
                            tabValue === 'personal' ? 'personal items' : 'production equipment'}
                        </p>
                        <Button onClick={() => setIsCreatingList(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First List
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      {/* Add Item Dialog */}
      <Dialog
        open={isAddingItem || !!editingItem}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingItem(false);
            setEditingItem(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item to Packing List'}</DialogTitle>
          </DialogHeader>
          
          <GearItemForm
            categories={categories}
            initialData={editingItem}
            onSubmit={editingItem ? updateGearItem : addGearItem}
            onCancel={() => {
              setIsAddingItem(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

interface GearListFormProps {
  type: 'band' | 'personal' | 'production';
  onSubmit: (list: Omit<GearList, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const GearListForm: React.FC<GearListFormProps> = ({ type, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) return;
    
    onSubmit({
      name,
      owner_id: 'current-user', // In a real app, use the actual user ID
      type,
      items: [],
      categories: [],
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">List Name</Label>
        <Input
          id="name"
          placeholder="Enter a name for your packing list"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create List
        </Button>
      </div>
    </form>
  );
};

interface GearItemFormProps {
  categories: GearCategory[];
  initialData?: GearItem | null;
  onSubmit: (item: GearItem | Omit<GearItem, 'id' | 'list_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const GearItemForm: React.FC<GearItemFormProps> = ({ categories, initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || categories[0].name);
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [weight, setWeight] = useState(initialData?.weight || 0);
  const [isPacked, setIsPacked] = useState(initialData?.packed || false);
  const [assignedTo, setAssignedTo] = useState(initialData?.assigned_to || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !category) return;
    
    if (initialData) {
      onSubmit({
        ...initialData,
        name,
        category,
        quantity,
        notes,
        weight: weight || undefined,
        packed: isPacked,
        assigned_to: assignedTo || undefined,
      });
    } else {
      onSubmit({
        name,
        category,
        quantity,
        notes,
        weight: weight || undefined,
        packed: isPacked,
        assigned_to: assignedTo || undefined,
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          placeholder="Enter item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  <div className="flex items-center">
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="weight">Weight (optional, in lbs)</Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step={0.1}
          value={weight || ''}
          onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : 0)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assigned To (optional)</Label>
        <Input
          id="assignedTo"
          placeholder="Who is responsible for this item?"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional information about this item"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>
      
      {initialData && (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="packed"
            checked={isPacked}
            onCheckedChange={(checked) => setIsPacked(checked === true)}
          />
          <Label htmlFor="packed">Item is packed</Label>
        </div>
      )}
      
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Add'} Item
        </Button>
      </DialogFooter>
    </form>
  );
};

export default GearPacking;
