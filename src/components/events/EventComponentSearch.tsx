import React, { useState, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContentItemProps } from '@/components/marketplace/ContentCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EventComponentSearchProps {
  onSelectItem: (item: ContentItemProps) => void;
  selectedItems?: ContentItemProps[];
  onRemoveItem?: (itemId: string) => void;
  componentType?: 'artists' | 'venues' | 'resources' | 'all';
}

interface EventComponent {
  id: string;
  event_id: string;
  component_id: string;
  component_type: string;
  created_at: string;
}

const EventComponentSearch: React.FC<EventComponentSearchProps> = ({
  onSelectItem,
  selectedItems = [],
  onRemoveItem,
  componentType = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ContentItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'artists' | 'venues' | 'resources'>('artists');
  const { toast } = useToast();

  const fetchResults = async (type: string, query: string) => {
    setIsLoading(true);
    try {
      // Call Supabase function to search for content
      const { data, error } = await supabase.rpc('search_discover_content', {
        content_type: type,
        search_query: query,
        tag_filters: []
      });

      if (error) {
        console.error('Search error:', error);
        return [];
      }

      // Convert to ContentItemProps format - ensure data is an array
      const formattedData = Array.isArray(data) 
        ? data.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: type,
            subtype: item.subtype,
            image_url: item.image_url,
            location: item.location,
            tags: item.tags,
            description: item.description
          }))
        : [];

      return formattedData as ContentItemProps[];
    } catch (error) {
      console.error('Error searching for components:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (componentType !== 'all') {
      const results = await fetchResults(componentType, searchQuery);
      setSearchResults(results);
    } else {
      const results = await fetchResults(activeTab, searchQuery);
      setSearchResults(results);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delaySearch = setTimeout(() => {
        handleSearch();
      }, 500);

      return () => clearTimeout(delaySearch);
    } else if (searchQuery === '') {
      handleSearch();
    }
  }, [searchQuery, activeTab, componentType]);

  useEffect(() => {
    // Load initial results
    handleSearch();
  }, [activeTab, componentType]);

  const handleSelectItem = (item: ContentItemProps) => {
    if (selectedItems.some(selected => selected.id === item.id)) {
      toast({
        title: 'Already selected',
        description: `${item.name} is already selected`,
      });
      return;
    }
    
    onSelectItem(item);
    toast({
      title: 'Item added',
      description: `${item.name} added to your event`,
    });
  };

  // Fetch related components
  const fetchSelectedComponents = async (eventId: string) => {
    try {
      // Since event_components table isn't in the types yet, 
      // we'll use a more generic approach with explicit type casting
      const { data, error } = await supabase
        .from('event_components')
        .select('*')
        .eq('event_id', eventId);

      if (error) {
        console.error('Error fetching event components:', error);
        return;
      }

      if (!data || data.length === 0) {
        // No components found
        return;
      }

      // Process the components based on their types
      const venues: string[] = [];
      const artists: string[] = [];
      const brands: string[] = [];
      const communities: string[] = [];

      // Cast data to our interface to ensure typing
      (data as EventComponent[]).forEach(item => {
        switch (item.component_type) {
          case 'venue':
            venues.push(item.component_id);
            break;
          case 'artist':
            artists.push(item.component_id);
            break;
          case 'brand':
            brands.push(item.component_id);
            break;
          case 'community':
            communities.push(item.component_id);
            break;
        }
      });

      // Fetch the full component data for each type
      await Promise.all([
        venues.length > 0 ? fetchVenueDetails(venues) : null,
        artists.length > 0 ? fetchArtistDetails(artists) : null,
        brands.length > 0 ? fetchBrandDetails(brands) : null,
        communities.length > 0 ? fetchCommunityDetails(communities) : null,
      ]);
    } catch (err) {
      console.error('Error in fetchSelectedComponents:', err);
    }
  };

  // Functions to fetch details for different component types
  const fetchVenueDetails = async (ids: string[]) => {
    if (!ids.length) return;
    
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .in('id', ids);
        
      if (error) {
        console.error('Error fetching venue details:', error);
        return;
      }
      
      // Process venue data
      return data.map(venue => ({
        id: venue.id,
        name: venue.name,
        type: 'venue',
        subtype: venue.type,
        image_url: venue.image_url,
        location: venue.location,
        tags: venue.tags,
      }));
    } catch (err) {
      console.error('Error in fetchVenueDetails:', err);
      return [];
    }
  };

  const fetchArtistDetails = async (ids: string[]) => {
    if (!ids.length) return;
    
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .in('id', ids);
        
      if (error) {
        console.error('Error fetching artist details:', error);
        return;
      }
      
      return data.map(artist => ({
        id: artist.id,
        name: artist.name,
        type: 'artist',
        subtype: artist.subtype,
        image_url: artist.image_url,
        location: artist.location,
        tags: artist.tags,
      }));
    } catch (err) {
      console.error('Error in fetchArtistDetails:', err);
      return [];
    }
  };

  const fetchBrandDetails = async (ids: string[]) => {
    if (!ids.length) return;
    
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .in('id', ids);
        
      if (error) {
        console.error('Error fetching brand details:', error);
        return;
      }
      
      return data.map(brand => ({
        id: brand.id,
        name: brand.name,
        type: 'brand',
        subtype: brand.subtype,
        image_url: brand.image_url,
        location: brand.location,
        tags: brand.tags,
      }));
    } catch (err) {
      console.error('Error in fetchBrandDetails:', err);
      return [];
    }
  };

  const fetchCommunityDetails = async (ids: string[]) => {
    if (!ids.length) return;
    
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .in('id', ids);
        
      if (error) {
        console.error('Error fetching community details:', error);
        return;
      }
      
      return data.map(community => ({
        id: community.id,
        name: community.name,
        type: 'community',
        subtype: community.type,
        image_url: community.image_url,
        location: community.location,
        tags: community.tags,
      }));
    } catch (err) {
      console.error('Error in fetchCommunityDetails:', err);
      return [];
    }
  };

  return (
    <div className="event-component-search space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search for ${componentType !== 'all' ? componentType : activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {componentType === 'all' && (
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'artists' | 'venues' | 'resources')}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {selectedItems.length > 0 && (
        <div className="selected-items">
          <h3 className="text-sm font-medium mb-2">Selected Items</h3>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map(item => (
              <Badge key={item.id} variant="secondary" className="flex items-center gap-1 p-1 pl-2">
                {item.name}
                {onRemoveItem && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full" 
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="h-[300px] border rounded-md p-2">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-2">
            {searchResults.map(item => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.type}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0" 
                  onClick={() => handleSelectItem(item)}
                  disabled={selectedItems.some(selected => selected.id === item.id)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No results found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default EventComponentSearch;
