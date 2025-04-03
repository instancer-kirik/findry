import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Plus, Calendar, CalendarPlus, PlusCircle, Bookmark, Tag, UserPlus, Clock } from 'lucide-react';
import { ContentItemProps } from './ContentCard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SelectionPanelProps {
  selectedItems?: ContentItemProps[];
  onAddItem?: (item: ContentItemProps) => void;
  onRemoveItem?: (itemId: string) => void;
  selectionContext?: 'event' | 'collection' | 'circle';
  selectionType?: 'artists' | 'venues' | 'resources' | 'all';
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onCreateEventWithSelection?: () => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedItems = [],
  onAddItem,
  onRemoveItem,
  selectionContext = 'event',
  selectionType = 'all',
  isMinimized = false,
  onToggleMinimize,
  onCreateEventWithSelection,
}) => {
  const toast = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Context-specific titles and descriptions
  const getContextTitle = () => {
    switch (selectionContext) {
      case 'event':
        return 'Event Selection';
      case 'collection':
        return 'Collection Items';
      case 'circle':
        return 'Circle Members';
      default:
        return 'Selected Items';
    }
  };

  const getContextDescription = () => {
    switch (selectionContext) {
      case 'event':
        return 'Items selected for your event';
      case 'collection':
        return 'Items in your collection';
      case 'circle':
        return 'Members in your circle';
      default:
        return 'Your selected items';
    }
  };

  const getItemTypeLabel = () => {
    switch (selectionType) {
      case 'artists':
        return 'Artists';
      case 'venues':
        return 'Venues';
      case 'resources':
        return 'Resources';
      case 'all':
      default:
        return 'Items';
    }
  };

  const getCreateActionLabel = () => {
    switch (selectionContext) {
      case 'event':
        return 'Create Event';
      case 'collection':
        return 'Save Collection';
      case 'circle':
        return 'Create Circle';
      default:
        return 'Create';
    }
  };

  const getCreateActionIcon = () => {
    switch (selectionContext) {
      case 'event':
        return <Calendar className="h-4 w-4 mr-2" />;
      case 'collection':
        return <Bookmark className="h-4 w-4 mr-2" />;
      case 'circle':
        return <UserPlus className="h-4 w-4 mr-2" />;
      default:
        return <Plus className="h-4 w-4 mr-2" />;
    }
  };

  const handleCreateAction = () => {
    if (selectedItems.length === 0) {
      toast({
        title: 'No items selected',
        description: `Please select at least one item for your ${selectionContext}.`,
        variant: 'destructive',
      });
      return;
    }

    if (selectionContext === 'event') {
      const artistIds = selectedItems
        .filter(item => item.type === 'artist')
        .map(item => item.id)
        .join(',');
      
      const venueIds = selectedItems
        .filter(item => item.type === 'venue')
        .map(item => item.id)
        .join(',');
      
      const resourceIds = selectedItems
        .filter(item => item.type === 'resource' || item.type === 'space' || item.type === 'tool')
        .map(item => item.id)
        .join(',');
      
      let queryParams = new URLSearchParams();
      if (artistIds) queryParams.append('artists', artistIds);
      if (venueIds) queryParams.append('venue', venueIds);
      if (resourceIds) queryParams.append('resources', resourceIds);
      
      navigate(`/events/create?${queryParams.toString()}`);
    } else {
      toast({
        title: `${getContextTitle()} Created`,
        description: `Your ${selectionContext} has been created with ${selectedItems.length} items.`,
      });
    }
  };

  // Mobile drawer vs desktop dialog
  const SelectionDialog = isMobile ? Drawer : Dialog;
  const DialogHeader = isMobile ? DrawerHeader : DialogHeader;
  const DialogTitle = isMobile ? DrawerTitle : DialogTitle;
  const DialogDescription = isMobile ? DrawerDescription : DialogDescription;
  const DialogContent = isMobile ? DrawerContent : DialogContent;
  const DialogFooter = isMobile ? DrawerFooter : DialogFooter;
  const DialogClose = isMobile ? DrawerClose : DialogClose;
  const DialogTrigger = isMobile ? DrawerTrigger : DialogTrigger;

  // Mock sample data for search results
  const mockSearchResults = [
    {
      id: 'mock-1',
      name: 'Elena Rivera',
      type: 'artist',
      location: 'Los Angeles, CA',
      tags: ['Vocalist', 'R&B', 'Soul'],
      image_url: 'https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: 'mock-2',
      name: 'Downtown Recording Studio',
      type: 'space',
      location: 'New York, NY',
      tags: ['Studio', 'Soundproofed', '200 sq ft'],
      image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: 'mock-3',
      name: 'The Electric Room',
      type: 'venue',
      location: 'Brooklyn, NY',
      tags: ['Live Music', '200 Capacity', 'Sound System'],
      image_url: 'https://images.unsplash.com/photo-1566981731417-d0e1ea7f0b88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    }
  ] as ContentItemProps[];

  const filteredResults = mockSearchResults.filter(item => 
    (selectionType === 'all' || item.type === selectionType) &&
    (!searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // For the selection panel preview
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="default" 
          className="flex items-center gap-2 shadow-md"
          onClick={onToggleMinimize}
        >
          <span className="relative">
            <Check className="h-4 w-4" />
            {selectedItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-foreground text-primary h-4 w-4 rounded-full flex items-center justify-center text-xs font-bold">
                {selectedItems.length}
              </span>
            )}
          </span>
          <span>Selection</span>
        </Button>
      </div>
    );
  }

  return (
    <Card className="selection-panel border shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{getContextTitle()}</CardTitle>
            <CardDescription>{getContextDescription()}</CardDescription>
          </div>
          {onToggleMinimize && (
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0" 
              onClick={onToggleMinimize}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {selectedItems.length > 0 ? (
          <ScrollArea className="h-[200px] pr-2">
            <div className="space-y-2">
              {selectedItems.map(item => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/40 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <Tag className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.type}</p>
                    </div>
                  </div>
                  {onRemoveItem && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive" 
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-2">No {getItemTypeLabel().toLowerCase()} selected</p>
            <SelectionDialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add {getItemTypeLabel()}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add {getItemTypeLabel()}</DialogTitle>
                  <DialogDescription>
                    Select {getItemTypeLabel().toLowerCase()} to add to your {selectionContext}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="search" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                    <TabsTrigger value="search">Search</TabsTrigger>
                  </TabsList>

                  <TabsContent value="recent">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground py-2">Recently viewed {getItemTypeLabel().toLowerCase()}</p>
                      {mockSearchResults.slice(0, 2).map(item => (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-md bg-muted/40 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                  <Tag className="h-4 w-4 text-primary" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{item.type}</p>
                            </div>
                          </div>
                          {onAddItem && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0" 
                              onClick={() => {
                                onAddItem(item);
                                setIsOpen(false);
                                toast({
                                  title: 'Item added',
                                  description: `${item.name} added to your ${selectionContext}`,
                                });
                              }}
                            >
                              <PlusCircle className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="saved">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground py-2">Your saved collections</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-start h-auto py-3 px-4">
                          <div>
                            <p className="font-medium text-left">Favorite Artists</p>
                            <p className="text-xs text-muted-foreground text-left">12 items</p>
                          </div>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto py-3 px-4">
                          <div>
                            <p className="font-medium text-left">Potential Venues</p>
                            <p className="text-xs text-muted-foreground text-left">8 items</p>
                          </div>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto py-3 px-4">
                          <div>
                            <p className="font-medium text-left">Session Musicians</p>
                            <p className="text-xs text-muted-foreground text-left">5 items</p>
                          </div>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto py-3 px-4">
                          <div>
                            <p className="font-medium text-left">Studio Equipment</p>
                            <p className="text-xs text-muted-foreground text-left">15 items</p>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="search">
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={`Search for ${getItemTypeLabel().toLowerCase()}...`}
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <ScrollArea className="h-[220px]">
                        <div className="space-y-2">
                          {filteredResults.length > 0 ? (
                            filteredResults.map(item => (
                              <div 
                                key={item.id}
                                className="flex items-center justify-between p-2 rounded-md bg-muted/40 hover:bg-muted transition-colors"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                    {item.image_url ? (
                                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                        <Tag className="h-4 w-4 text-primary" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{item.name}</p>
                                    <div className="flex items-center gap-1">
                                      <p className="text-xs text-muted-foreground truncate">{item.location}</p>
                                      {item.tags && item.tags.length > 0 && (
                                        <Badge variant="outline" className="text-xs px-1 h-4">{item.tags[0]}</Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {onAddItem && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => {
                                      onAddItem(item);
                                      setIsOpen(false);
                                      toast({
                                        title: 'Item added',
                                        description: `${item.name} added to your ${selectionContext}`,
                                      });
                                    }}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">
                              No matching {getItemTypeLabel().toLowerCase()} found
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="flex gap-2 pt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/discover');
                    }}
                  >
                    Browse All {getItemTypeLabel()}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </SelectionDialog>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="w-full flex gap-2">
          <SelectionDialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add {getItemTypeLabel()}
              </Button>
            </DialogTrigger>
            {/* Dialog content is the same as above, not duplicated for brevity */}
          </SelectionDialog>
          
          <Button 
            className="flex-1" 
            onClick={handleCreateAction}
            disabled={selectedItems.length === 0}
          >
            {getCreateActionIcon()}
            {getCreateActionLabel()}
          </Button>
        </div>
        
        {selectionContext === 'event' && selectedItems.length > 0 && (
          <div className="text-xs text-muted-foreground text-center w-full">
            <p>
              {selectedItems.filter(item => item.type === 'artist').length} artists, {' '}
              {selectedItems.filter(item => item.type === 'venue').length} venues, {' '}
              {selectedItems.filter(item => ['resource', 'space', 'tool'].includes(item.type || '')).length} resources
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SelectionPanel; 