
import React, { useState, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GearList, GearItem, GearCategory } from '@/types/forms';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Package, CheckCircle2, Circle, Trash2, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GearPacking = () => {
  const [gearLists, setGearLists] = useState<GearList[]>([
    {
      id: '1',
      name: 'Summer Tour 2024',
      description: 'Essential gear for our summer tour',
      type: 'band_tour',
      owner_id: 'user1',
      items: [
        {
          id: '1',
          name: 'Main Guitar',
          category: 'Instruments',
          quantity: 1,
          essential: true,
          packed: true,
          notes: 'Fender Stratocaster - handle with care',
          weight: 8
        },
        {
          id: '2',
          name: 'Backup Guitar',
          category: 'Instruments',
          quantity: 1,
          essential: false,
          packed: false,
          notes: 'Gibson Les Paul',
          weight: 9
        },
        {
          id: '3',
          name: 'Guitar Cables',
          category: 'Cables',
          quantity: 5,
          essential: true,
          packed: false,
          weight: 2
        }
      ],
      categories: [
        { id: '1', name: 'Instruments', description: 'Musical instruments' },
        { id: '2', name: 'Cables', description: 'Audio cables and connections' },
        { id: '3', name: 'Effects', description: 'Effect pedals and processors' }
      ]
    }
  ]);

  const [selectedList, setSelectedList] = useState<GearList | null>(gearLists[0] || null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);

  const [newItem, setNewItem] = useState<Partial<GearItem>>({
    name: '',
    category: '',
    quantity: 1,
    essential: false,
    packed: false,
    notes: '',
    weight: 0,
    assigned_to: ''
  });

  const [newList, setNewList] = useState<Partial<GearList>>({
    name: '',
    description: '',
    type: 'band_tour',
    items: [],
    categories: []
  });

  const categories = [
    'Instruments',
    'Amplifiers',
    'Effects',
    'Cables',
    'Microphones',
    'Lighting',
    'Stage Setup',
    'Personal Items',
    'Merchandise',
    'Transportation'
  ];

  const handleTogglePacked = useCallback((itemId: string) => {
    if (!selectedList) return;

    const updatedItems = selectedList.items.map(item =>
      item.id === itemId ? { ...item, packed: !item.packed } : item
    );

    const updatedList = { ...selectedList, items: updatedItems };
    setSelectedList(updatedList);
    setGearLists(lists => lists.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));

    const item = selectedList.items.find(i => i.id === itemId);
    if (item) {
      toast.success(`${item.name} marked as ${!item.packed ? 'packed' : 'unpacked'}`);
    }
  }, [selectedList]);

  const handleAddItem = () => {
    if (!selectedList || !newItem.name || !newItem.category) {
      toast.error('Please fill in required fields');
      return;
    }

    const item: GearItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category,
      quantity: newItem.quantity || 1,
      essential: newItem.essential || false,
      packed: false,
      notes: newItem.notes || '',
      weight: newItem.weight || 0,
      assigned_to: newItem.assigned_to || ''
    };

    const updatedList = {
      ...selectedList,
      items: [...selectedList.items, item]
    };

    setSelectedList(updatedList);
    setGearLists(lists => lists.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));

    setNewItem({
      name: '',
      category: '',
      quantity: 1,
      essential: false,
      packed: false,
      notes: '',
      weight: 0,
      assigned_to: ''
    });
    setIsAddingItem(false);
    toast.success('Item added successfully');
  };

  const handleEditItem = (item: GearItem) => {
    setEditingItem(item);
    setNewItem(item);
    setIsAddingItem(true);
  };

  const handleUpdateItem = () => {
    if (!selectedList || !editingItem || !newItem.name || !newItem.category) {
      toast.error('Please fill in required fields');
      return;
    }

    const updatedItems = selectedList.items.map(item =>
      item.id === editingItem.id ? { ...newItem, id: editingItem.id } as GearItem : item
    );

    const updatedList = { ...selectedList, items: updatedItems };
    setSelectedList(updatedList);
    setGearLists(lists => lists.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));

    setNewItem({
      name: '',
      category: '',
      quantity: 1,
      essential: false,
      packed: false,
      notes: '',
      weight: 0,
      assigned_to: ''
    });
    setEditingItem(null);
    setIsAddingItem(false);
    toast.success('Item updated successfully');
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedList) return;

    const updatedItems = selectedList.items.filter(item => item.id !== itemId);
    const updatedList = { ...selectedList, items: updatedItems };
    
    setSelectedList(updatedList);
    setGearLists(lists => lists.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));
    
    toast.success('Item deleted');
  };

  const handleCreateList = () => {
    if (!newList.name) {
      toast.error('Please enter a list name');
      return;
    }

    const list: GearList = {
      id: Date.now().toString(),
      name: newList.name,
      description: newList.description || '',
      type: newList.type || 'band_tour',
      owner_id: 'user1',
      items: [],
      categories: []
    };

    setGearLists([...gearLists, list]);
    setSelectedList(list);
    setNewList({
      name: '',
      description: '',
      type: 'band_tour',
      items: [],
      categories: []
    });
    setIsAddingList(false);
    toast.success('Gear list created successfully');
  };

  const getProgressStats = () => {
    if (!selectedList) return { packed: 0, total: 0, essential: 0, essentialPacked: 0 };

    const total = selectedList.items.length;
    const packed = selectedList.items.filter(item => item.packed).length;
    const essential = selectedList.items.filter(item => item.essential).length;
    const essentialPacked = selectedList.items.filter(item => item.essential && item.packed).length;

    return { packed, total, essential, essentialPacked };
  };

  const stats = getProgressStats();
  const packingProgress = stats.total > 0 ? (stats.packed / stats.total) * 100 : 0;
  const essentialProgress = stats.essential > 0 ? (stats.essentialPacked / stats.essential) * 100 : 100;

  const getItemsByCategory = () => {
    if (!selectedList) return {};
    
    return selectedList.items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, GearItem[]>);
  };

  const itemsByCategory = getItemsByCategory();

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gear Packing</h1>
          <Dialog open={isAddingList} onOpenChange={setIsAddingList}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Gear List</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="listName">List Name</Label>
                  <Input
                    id="listName"
                    value={newList.name || ''}
                    onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                    placeholder="Enter list name"
                  />
                </div>
                <div>
                  <Label htmlFor="listDescription">Description</Label>
                  <Textarea
                    id="listDescription"
                    value={newList.description || ''}
                    onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <Label htmlFor="listType">Type</Label>
                  <Select
                    value={newList.type || 'band_tour'}
                    onValueChange={(value) => setNewList({ ...newList, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="band_tour">Band Tour</SelectItem>
                      <SelectItem value="recording">Recording Session</SelectItem>
                      <SelectItem value="festival">Festival</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingList(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateList}>
                    Create List
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lists Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Gear Lists
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {gearLists.map(list => (
                  <button
                    key={list.id}
                    onClick={() => setSelectedList(list)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedList?.id === list.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium">{list.name}</div>
                    <div className="text-sm opacity-70">{list.items.length} items</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedList ? (
              <div className="space-y-6">
                {/* Progress Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                          <p className="text-2xl font-bold">{Math.round(packingProgress)}%</p>
                        </div>
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {stats.packed} of {stats.total} items packed
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Essential Items</p>
                          <p className="text-2xl font-bold">{Math.round(essentialProgress)}%</p>
                        </div>
                        <Circle className="h-8 w-8 text-red-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {stats.essentialPacked} of {stats.essential} essential items
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Weight</p>
                          <p className="text-2xl font-bold">
                            {selectedList.items.reduce((total, item) => total + (item.weight || 0), 0)} lbs
                          </p>
                        </div>
                        <Package className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Add Item Dialog */}
                <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? 'Edit Item' : 'Add New Item'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="itemName">Item Name</Label>
                        <Input
                          id="itemName"
                          value={newItem.name || ''}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder="Enter item name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newItem.category || ''}
                          onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={newItem.quantity || 1}
                            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                            min="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight">Weight (lbs)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            value={newItem.weight || 0}
                            onChange={(e) => setNewItem({ ...newItem, weight: parseFloat(e.target.value) || 0 })}
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="assignedTo">Assigned To</Label>
                        <Input
                          id="assignedTo"
                          value={newItem.assigned_to || ''}
                          onChange={(e) => setNewItem({ ...newItem, assigned_to: e.target.value })}
                          placeholder="Person responsible"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={newItem.notes || ''}
                          onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                          placeholder="Additional notes"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="essential"
                          checked={newItem.essential || false}
                          onCheckedChange={(checked) => 
                            setNewItem({ ...newItem, essential: checked as boolean })
                          }
                        />
                        <Label htmlFor="essential">Essential item</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => {
                          setIsAddingItem(false);
                          setEditingItem(null);
                          setNewItem({
                            name: '',
                            category: '',
                            quantity: 1,
                            essential: false,
                            packed: false,
                            notes: '',
                            weight: 0,
                            assigned_to: ''
                          });
                        }}>
                          Cancel
                        </Button>
                        <Button onClick={editingItem ? handleUpdateItem : handleAddItem}>
                          {editingItem ? 'Update' : 'Add'} Item
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Items by Category */}
                <div className="space-y-6">
                  {Object.entries(itemsByCategory).map(([category, items]) => (
                    <Card key={category}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{category}</span>
                          <Badge variant="secondary">
                            {items.filter(item => item.packed).length} / {items.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {items.map(item => (
                            <div
                              key={item.id}
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                item.packed ? 'bg-green-50 border-green-200' : 'bg-background'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleTogglePacked(item.id)}
                                  className="flex-shrink-0"
                                >
                                  {item.packed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-400" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className={`font-medium ${item.packed ? 'line-through text-muted-foreground' : ''}`}>
                                      {item.name}
                                    </span>
                                    {item.essential && (
                                      <Badge variant="destructive" className="text-xs">Essential</Badge>
                                    )}
                                    {item.quantity > 1 && (
                                      <Badge variant="outline" className="text-xs">
                                        {item.quantity}x
                                      </Badge>
                                    )}
                                  </div>
                                  {item.notes && (
                                    <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                                  )}
                                  {item.assigned_to && (
                                    <p className="text-xs text-muted-foreground">
                                      Assigned to: {item.assigned_to}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  {item.weight && item.weight > 0 && (
                                    <span className="text-sm text-muted-foreground">
                                      {item.weight} lbs
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleEditItem(item)}
                                    className="p-1 hover:bg-muted rounded"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="p-1 hover:bg-destructive/10 rounded text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No gear list selected</h3>
                    <p className="text-muted-foreground">
                      Select a gear list from the sidebar or create a new one to get started.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GearPacking;
