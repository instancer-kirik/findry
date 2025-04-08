import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/layout/Layout';
import DiscoverHeader from '@/components/discover/DiscoverHeader';
import DiscoverSidebar from '@/components/discover/DiscoverSidebar';
import DiscoverFilters from '@/components/discover/DiscoverFilters';
import CategoryItemsGrid from '@/components/discover/CategoryItemsGrid';
import SelectionPanel from '@/components/marketplace/SelectionPanel';
import { cn } from '@/lib/utils';
import { artistStyleFilters, disciplinaryFilters, resourceTypes, allTags } from '@/components/discover/DiscoverData';
import { useDiscoverData } from '@/hooks/use-discover-data';
import { ContentItemProps } from '@/types/content';
import { Check, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DiscoverMobileDrawer from '@/components/discover/DiscoverMobileDrawer';
import { useIsMobile } from '@/hooks/use-mobile';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || '';
  const selectionMode = searchParams.get('select') === 'true';
  const selectionTarget = searchParams.get('target') || 'event';
  const selectionType = searchParams.get('select_type') || 'all';

  const isMobile = useIsMobile();

  // State for DiscoverHeader
  const [headerSearchQuery, setHeaderSearchQuery] = useState(query);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [userType, setUserType] = useState('artist');
  const [artistStyle, setArtistStyle] = useState('all');
  const [disciplinaryType, setDisciplinaryType] = useState('all');
  const [resourceType, setResourceType] = useState('all');
  const [selectedSubfilters, setSelectedSubfilters] = useState<string[]>([]);
  
  // Define availableSubfilters here - this was missing and causing the error
  const [availableSubfilters, setAvailableSubfilters] = useState<{ value: string; label: string }[]>([
    { value: 'music', label: 'Music' },
    { value: 'visual', label: 'Visual Arts' },
    { value: 'performance', label: 'Performance' },
    { value: 'digital', label: 'Digital' },
    { value: 'traditional', label: 'Traditional' },
    { value: 'contemporary', label: 'Contemporary' }
  ]);

  // State for DiscoverFilters
  const [activeTab, setActiveTab] = useState(typeParam || 'artists');
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // State for selection panel
  const [selectedItems, setSelectedItems] = useState<ContentItemProps[]>([]);
  const [isSelectionMinimized, setIsSelectionMinimized] = useState(!selectionMode);

  // Use the custom hook for data fetching
  const { items, isLoading } = useDiscoverData(
    activeTab,
    headerSearchQuery,
    selectedTags,
    resourceType,
    artistStyle,
    disciplinaryType,
    activeSubTab,
    selectedSubfilters
  );

  useEffect(() => {
    // Update search params when activeTab changes
    const params = new URLSearchParams(searchParams);
    params.set('type', activeTab);
    params.set('q', headerSearchQuery);
    setSearchParams(params);
  }, [activeTab, headerSearchQuery]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubfilterSelect = (filter: string) => {
    setSelectedSubfilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSubfilterClear = () => {
    setSelectedSubfilters([]);
  };

  const handleSelectItem = (item: ContentItemProps) => {
    // Check if the item is already selected
    if (selectedItems.some(selectedItem => selectedItem.id === item.id)) {
      return;
    }
    
    // Add the item to the selected items
    setSelectedItems(prev => [...prev, item]);
    
    // If the selection panel is minimized, show it
    if (isSelectionMinimized) {
      setIsSelectionMinimized(false);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleSelectionPanel = () => {
    setIsSelectionMinimized(prev => !prev);
  };

  const handleItemClick = (item: ContentItemProps) => {
    if (selectionMode) {
      handleSelectItem(item);
      return;
    }
    
    // Navigate to the appropriate detail page based on the item type
    switch (item.type) {
      case 'artist':
        navigate(`/artist/${item.id}`);
        break;
      case 'resource':
        navigate(`/resource/${item.id}`);
        break;
      case 'project':
        navigate(`/project/${item.id}`);
        break;
      case 'venue':
        navigate(`/venue/${item.id}`);
        break;
      case 'community':
        navigate(`/community/${item.id}`);
        break;
      case 'brand':
        navigate(`/brand/${item.id}`);
        break;
      case 'shop':
        navigate(`/shop/${item.id}`);
        break;
      default:
        console.log('No navigation defined for', item.type);
    }
  };

  const availableTabs = ['artists', 'resources', 'projects', 'events', 'venues', 'communities', 'brands'];
  const tabSubcategories = {
    artists: ['music', 'visual', 'performance', 'digital'],
    brands: ['record-label', 'fashion', 'tech', 'food-beverage'],
    events: ['concert', 'exhibition', 'workshop', 'networking'],
    content: ['music', 'video', 'article', 'podcast'],
    resources: ['space', 'equipment', 'service', 'other'],
    venues: ['concert-hall', 'club', 'theater', 'outdoor'],
    communities: ['educational', 'professional', 'neighborhood', 'interest-based']
  };

  const getTabLabel = (tab: string) => {
    return tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1);
  };

  // Get appropriate selection type based on active tab
  const getSelectionType = () => {
    switch (activeTab) {
      case 'artists':
        return 'artists';
      case 'venues':
        return 'venues';
      case 'resources':
        return 'resources';
      default:
        return 'all';
    }
  };
  
  // Update available subfilters based on the active tab
  useEffect(() => {
    // Set available subfilters based on the active tab
    if (activeTab === 'artists') {
      setAvailableSubfilters([
        { value: 'vocalist', label: 'Vocalist' },
        { value: 'instrumentalist', label: 'Instrumentalist' },
        { value: 'producer', label: 'Producer' },
        { value: 'rapper', label: 'Rapper' },
        { value: 'dj', label: 'DJ' },
        { value: 'visual-artist', label: 'Visual Artist' },
        { value: 'performance-artist', label: 'Performance Artist' }
      ]);
    } else if (activeTab === 'resources') {
      setAvailableSubfilters([
        { value: 'studio', label: 'Studio' },
        { value: 'gallery', label: 'Gallery' },
        { value: 'practice-room', label: 'Practice Room' },
        { value: 'equipment', label: 'Equipment' },
        { value: 'service', label: 'Service' }
      ]);
    } else if (activeTab === 'venues') {
      setAvailableSubfilters([
        { value: 'concert-hall', label: 'Concert Hall' },
        { value: 'club', label: 'Club' },
        { value: 'theater', label: 'Theater' },
        { value: 'outdoor', label: 'Outdoor' },
        { value: 'gallery', label: 'Gallery' }
      ]);
    } else {
      // Default subfilters for other tabs
      setAvailableSubfilters([
        { value: 'trending', label: 'Trending' },
        { value: 'new', label: 'New' },
        { value: 'popular', label: 'Popular' }
      ]);
    }
  }, [activeTab]);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <DiscoverHeader
          searchQuery={headerSearchQuery}
          setSearchQuery={setHeaderSearchQuery}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          userType={userType}
          setUserType={setUserType}
          handleTagSelect={handleTagSelect}
          resourceType={resourceType}
          onResourceTypeChange={setResourceType}
          artistStyle={artistStyle}
          onArtistStyleChange={setArtistStyle}
          disciplinaryType={disciplinaryType}
          onDisciplinaryTypeChange={setDisciplinaryType}
          activeTab={activeTab}
          selectedSubfilters={selectedSubfilters}
          onSubfilterSelect={handleSubfilterSelect}
          onSubfilterClear={handleSubfilterClear}
          availableSubfilters={availableSubfilters}
          allTags={allTags}
        />
        
        <div className="container mx-auto px-4 py-8">
          <DiscoverFilters
            activeTab={activeTab}
            handleTabChange={setActiveTab}
            activeSubTab={activeSubTab}
            handleSubTabChange={setActiveSubTab}
            availableTabs={availableTabs}
            tabSubcategories={tabSubcategories}
            sidebarOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            getTabLabel={getTabLabel}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          
          <div className="flex flex-col lg:flex-row gap-8 mt-4">
            {/* Sidebar - Left side */}
            {sidebarOpen && !isMobile && (
              <div className="lg:w-64 flex-shrink-0 sticky top-24 self-start">
                <DiscoverSidebar activeTabData={items.slice(0, 3)} activeTab={activeTab} />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {/* Selection Mode Indicator (when in selection mode) */}
              {selectionMode && (
                <div className="flex items-center justify-between bg-muted/40 p-3 mb-4 rounded-md">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm font-medium">
                      Selection Mode: {selectionTarget === 'event' ? 'Creating Event' : 'Building Collection'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={toggleSelectionPanel}
                    >
                      {isSelectionMinimized ? 'Show Selection' : 'Hide Selection'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => {
                        // Remove selection mode from URL
                        const params = new URLSearchParams(searchParams);
                        params.delete('select');
                        params.delete('target');
                        params.delete('select_type');
                        setSearchParams(params);
                        // Clear selected items
                        setSelectedItems([]);
                      }}
                    >
                      Exit Selection Mode
                    </Button>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-lg" />
                  ))}
                </div>
              ) : items.length > 0 ? (
                <CategoryItemsGrid
                  items={items}
                  title={headerSearchQuery ? `Results for "${headerSearchQuery}"` : `Discover ${getTabLabel(activeTab)}`}
                  onSelectItem={selectionMode ? handleSelectItem : handleItemClick}
                  selectedItems={selectionMode ? selectedItems : undefined}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {headerSearchQuery ? 'No results found' : 'No items found for the selected filters'}
                  </p>
                </div>
              )}
            </div>

            {/* Selection Panel - Right side (when in selection mode) */}
            {selectionMode && !isSelectionMinimized && (
              <div className="lg:w-80 flex-shrink-0">
                <SelectionPanel 
                  selectedItems={selectedItems}
                  onAddItem={handleSelectItem}
                  onRemoveItem={handleRemoveItem}
                  selectionContext={selectionTarget as 'event' | 'collection' | 'circle'}
                  selectionType={getSelectionType() as 'artists' | 'venues' | 'resources' | 'all'}
                  isMinimized={false}
                  onToggleMinimize={toggleSelectionPanel}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Drawer */}
        <DiscoverMobileDrawer
          items={items.slice(0, 3)}
          activeTab={activeTab}
          isMobile={isMobile}
          selectedTags={selectedTags}
          handleTagSelect={handleTagSelect}
          clearTags={() => setSelectedTags([])}
          userType={userType}
          setUserType={setUserType}
          resourceType={resourceType}
          onResourceTypeChange={setResourceType}
          artistStyle={artistStyle}
          onArtistStyleChange={setArtistStyle}
          disciplinaryType={disciplinaryType}
          onDisciplinaryTypeChange={setDisciplinaryType}
          selectedSubfilters={selectedSubfilters}
          onSubfilterSelect={handleSubfilterSelect}
          onSubfilterClear={handleSubfilterClear}
          availableSubfilters={availableSubfilters}
          allTags={allTags}
        />
      </div>

      {/* Minimized Selection Panel */}
      {selectionMode && isSelectionMinimized && (
        <SelectionPanel 
          selectedItems={selectedItems}
          onRemoveItem={handleRemoveItem}
          selectionContext={selectionTarget as 'event' | 'collection' | 'circle'} 
          selectionType={getSelectionType() as 'artists' | 'venues' | 'resources' | 'all'}
          isMinimized={true}
          onToggleMinimize={toggleSelectionPanel}
        />
      )}
    </Layout>
  );
};

export default Discover;
