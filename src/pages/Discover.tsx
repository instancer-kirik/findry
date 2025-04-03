import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/layout/Layout';
import DiscoverHeader from '@/components/discover/DiscoverHeader';
import DiscoverSidebar from '@/components/discover/DiscoverSidebar';
import DiscoverFilters from '@/components/discover/DiscoverFilters';
import CategoryItemsGrid from '@/components/discover/CategoryItemsGrid';
import { cn } from '@/lib/utils';
import { artistStyleFilters, disciplinaryFilters, resourceTypes, allTags } from '@/components/discover/DiscoverData';
import { useDiscoverData } from '@/hooks/use-discover-data';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || '';

  // State for DiscoverHeader
  const [headerSearchQuery, setHeaderSearchQuery] = useState(query);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [userType, setUserType] = useState('artist');
  const [artistStyle, setArtistStyle] = useState('all');
  const [disciplinaryType, setDisciplinaryType] = useState('all');
  const [resourceType, setResourceType] = useState('all');
  const [selectedSubfilters, setSelectedSubfilters] = useState<string[]>([]);

  // State for DiscoverFilters
  const [activeTab, setActiveTab] = useState(typeParam || 'artists');
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    setSearchParams({ type: activeTab, q: headerSearchQuery });
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
          allTags={allTags}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Left side */}
            <div className={cn(
              "lg:w-64 flex-shrink-0",
              !sidebarOpen && "hidden"
            )}>
              <DiscoverSidebar activeTabData={items.slice(0, 3)} activeTab={activeTab} />
            </div>

            {/* Main Content */}
            <div className="flex-1">
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
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {headerSearchQuery ? 'No results found' : 'No items found for the selected filters'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Discover;
