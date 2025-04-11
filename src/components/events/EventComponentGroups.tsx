
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ContentItemProps } from '@/components/marketplace/ContentCard';
import { Folder, Save, CheckCircle, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ComponentGroup {
  id: string;
  name: string;
  description?: string;
  components: {
    type: 'artists' | 'venues' | 'resources' | 'brands' | 'communities';
    items: ContentItemProps[];
  }[];
  createdAt: string;
}

interface EventComponentGroupsProps {
  selectedArtists: ContentItemProps[];
  selectedVenues: ContentItemProps[];
  selectedResources: ContentItemProps[];
  selectedBrands: ContentItemProps[];
  selectedCommunities: ContentItemProps[];
  onApplyGroup: (group: ComponentGroup) => void;
}

const EventComponentGroups: React.FC<EventComponentGroupsProps> = ({
  selectedArtists,
  selectedVenues,
  selectedResources,
  selectedBrands,
  selectedCommunities,
  onApplyGroup
}) => {
  const [savedGroups, setSavedGroups] = useState<ComponentGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  
  useEffect(() => {
    // Load saved groups from localStorage
    const storedGroups = localStorage.getItem('event-component-groups');
    if (storedGroups) {
      try {
        setSavedGroups(JSON.parse(storedGroups));
      } catch (e) {
        console.error('Failed to parse stored component groups:', e);
      }
    }
  }, []);
  
  const handleSaveGroup = () => {
    if (!newGroupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    
    const hasSelectedComponents = 
      selectedArtists.length > 0 || 
      selectedVenues.length > 0 || 
      selectedResources.length > 0 || 
      selectedBrands.length > 0 || 
      selectedCommunities.length > 0;
      
    if (!hasSelectedComponents) {
      toast.error('Please select at least one component to save');
      return;
    }
    
    const newGroup: ComponentGroup = {
      id: `group_${Date.now()}`,
      name: newGroupName,
      description: newGroupDescription || undefined,
      components: [],
      createdAt: new Date().toISOString()
    };
    
    if (selectedArtists.length > 0) {
      newGroup.components.push({
        type: 'artists',
        items: [...selectedArtists]
      });
    }
    
    if (selectedVenues.length > 0) {
      newGroup.components.push({
        type: 'venues',
        items: [...selectedVenues]
      });
    }
    
    if (selectedResources.length > 0) {
      newGroup.components.push({
        type: 'resources',
        items: [...selectedResources]
      });
    }
    
    if (selectedBrands.length > 0) {
      newGroup.components.push({
        type: 'brands',
        items: [...selectedBrands]
      });
    }
    
    if (selectedCommunities.length > 0) {
      newGroup.components.push({
        type: 'communities',
        items: [...selectedCommunities]
      });
    }
    
    const updatedGroups = [...savedGroups, newGroup];
    setSavedGroups(updatedGroups);
    localStorage.setItem('event-component-groups', JSON.stringify(updatedGroups));
    
    setNewGroupName('');
    setNewGroupDescription('');
    setSaveDialogOpen(false);
    
    toast.success('Component group saved successfully');
  };
  
  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = savedGroups.filter(group => group.id !== groupId);
    setSavedGroups(updatedGroups);
    localStorage.setItem('event-component-groups', JSON.stringify(updatedGroups));
    toast.success('Group deleted');
  };
  
  const handleApplyGroup = (group: ComponentGroup) => {
    onApplyGroup(group);
    setManageDialogOpen(false);
  };
  
  return (
    <div>
      <div className="flex gap-2">
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Components
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save Component Group</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
              </div>
              
              <div>
                <Label htmlFor="group-description">Description (Optional)</Label>
                <Input
                  id="group-description"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Brief description of this group"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Selected Components</Label>
                <div className="border rounded-md p-3 space-y-2">
                  <ComponentSummary 
                    title="Artists" 
                    count={selectedArtists.length} 
                    items={selectedArtists.map(a => a.name)}
                  />
                  
                  <ComponentSummary 
                    title="Venues" 
                    count={selectedVenues.length} 
                    items={selectedVenues.map(v => v.name)}
                  />
                  
                  <ComponentSummary 
                    title="Resources" 
                    count={selectedResources.length} 
                    items={selectedResources.map(r => r.name)}
                  />
                  
                  <ComponentSummary 
                    title="Brands" 
                    count={selectedBrands.length} 
                    items={selectedBrands.map(b => b.name)}
                  />
                  
                  <ComponentSummary 
                    title="Communities" 
                    count={selectedCommunities.length} 
                    items={selectedCommunities.map(c => c.name)}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveGroup}>
                Save Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Folder className="h-4 w-4 mr-2" />
              Saved Groups
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Component Groups</DialogTitle>
            </DialogHeader>
            
            <div className="max-h-[400px] overflow-y-auto py-4">
              {savedGroups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Folder className="mx-auto h-12 w-12 opacity-20 mb-2" />
                  <p>No saved groups yet</p>
                  <p className="text-sm">Save your first component group to see it here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedGroups.map(group => (
                    <div key={group.id} className="border rounded-md p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{group.name}</h4>
                          {group.description && (
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDeleteGroup(group.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {group.components.map((component, i) => (
                          <Badge key={i} variant="outline" className="capitalize">
                            {component.type}: {component.items.length}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        className="w-full mt-3" 
                        size="sm"
                        onClick={() => handleApplyGroup(group)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Apply to Event
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const ComponentSummary: React.FC<{
  title: string;
  count: number;
  items: string[];
}> = ({ title, count, items }) => {
  if (count === 0) return null;
  
  return (
    <div>
      <h4 className="text-sm font-medium">{title} ({count})</h4>
      <div className="flex flex-wrap gap-1 mt-1">
        {items.slice(0, 3).map((name, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {name}
          </Badge>
        ))}
        {count > 3 && (
          <Badge variant="outline" className="text-xs">
            +{count - 3} more
          </Badge>
        )}
      </div>
    </div>
  );
};

export default EventComponentGroups;
