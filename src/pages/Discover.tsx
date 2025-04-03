import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearch } from '@/hooks/use-search';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Search, Filter } from 'lucide-react';
import DiscoverHeader from '@/components/discover/DiscoverHeader';
import DiscoverSidebar from '@/components/discover/DiscoverSidebar';
import DiscoverFilters from '@/components/discover/DiscoverFilters';
import CategoryItemsGrid from '@/components/discover/CategoryItemsGrid';
import { cn } from '@/lib/utils';
import { artistStyleFilters, disciplinaryFilters, resourceTypes } from '@/components/discover/DiscoverData';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

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
  const [activeTab, setActiveTab] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { 
    query: searchQuery, 
    setQuery, 
    type: searchType, 
    setType, 
    results, 
    loading, 
    search 
  } = useSearch({ 
    initialQuery: query, 
    initialType: type 
  });

  useEffect(() => {
    if (query || type !== 'all') {
      search();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery, type: searchType });
    search();
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    setSearchParams({ q: searchQuery, type: value });
    search();
  };

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

  const availableTabs = ['all', 'artists', 'brands', 'events', 'content', 'resources', 'venues', 'communities'];
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
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={cn(
            "lg:w-64 flex-shrink-0",
            !sidebarOpen && "hidden"
          )}>
            <DiscoverSidebar />
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

            <Tabs value={searchType} onValueChange={handleTypeChange}>
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="artist">Artists</TabsTrigger>
                <TabsTrigger value="brand">Brands</TabsTrigger>
                <TabsTrigger value="event">Events</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
              </TabsList>

              <TabsContent value={searchType}>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-64 rounded-lg" />
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <CategoryItemsGrid
                    items={results}
                    title={searchQuery ? `Results for "${searchQuery}"` : 'Discover'}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No results found' : 'Start searching to discover'}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
