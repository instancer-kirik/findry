
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ContentItemProps } from '../components/marketplace/ContentCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Grip } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Components
import DiscoverHeader from '../components/discover/DiscoverHeader';
import CategoryTabs from '../components/discover/CategoryTabs';
import CategoryItemsGrid from '../components/discover/CategoryItemsGrid';
import DiscoverSidebar from '../components/discover/DiscoverSidebar';
import AnimatedSection from '../components/ui-custom/AnimatedSection';

// Import data - we'll use this as fallback
import {
  allTags,
  tabSubcategories,
  availableTabs,
  artistStyleFilters,
  disciplinaryFilters
} from '../components/discover/DiscoverData';

import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter, 
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger 
} from '@/components/ui/drawer';

const Discover: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Determine the initial active tab based on the current URL path
  const getInitialActiveTab = () => {
    const path = location.pathname.substring(1); // Remove leading slash
    if (availableTabs.includes(path)) {
      return path;
    }
    return "artists"; // Default tab
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialActiveTab());
  const [activeSubTab, setActiveSubTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("regular");
  const [resourceType, setResourceType] = useState<string>("all");
  const [artistStyle, setArtistStyle] = useState<string>("all");
  const [disciplinaryType, setDisciplinaryType] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedSubfilters, setSelectedSubfilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState<ContentItemProps[]>([]);
  
  // Create a form for multi-select filtering
  const form = useForm({
    defaultValues: {
      subfilters: [] as string[],
    },
  });
  
  // Update sidebar visibility when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Update available subfilters when active tab changes
  useEffect(() => {
    // Reset subfilters when tab changes
    setSelectedSubfilters([]);
    form.reset({ subfilters: [] });
    
    // Fetch data when the active tab changes
    fetchData();
  }, [activeTab, form]);

  // Fetch data when search or filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300); // Debounce for search input
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedTags, resourceType, artistStyle, disciplinaryType, activeSubTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('search_discover_content', {
        content_type: activeTab,
        search_query: searchQuery,
        tag_filters: selectedTags.length > 0 ? selectedTags : null
      });
      
      if (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading data",
          description: "There was a problem fetching the content",
          variant: "destructive"
        });
        setItems([]);
      } else {
        let filteredItems = data || [];
        
        // Apply additional filters that are not handled by the database function
        if (activeTab === 'resources' && resourceType !== 'all') {
          filteredItems = filteredItems.filter(item => item.type === resourceType);
        }
        
        if (activeTab === 'artists') {
          if (artistStyle !== 'all') {
            filteredItems = filteredItems.filter(item => 
              item.styles && item.styles.includes(artistStyle.charAt(0).toUpperCase() + artistStyle.slice(1))
            );
          }
          
          if (disciplinaryType !== 'all') {
            filteredItems = filteredItems.filter(item => 
              (disciplinaryType === 'multi' && item.multidisciplinary) || 
              (disciplinaryType === 'single' && !item.multidisciplinary)
            );
          }
        }
        
        // Apply subtab filtering
        if (activeSubTab !== 'all') {
          filteredItems = filteredItems.filter(item => 
            (item.subtype && item.subtype.toLowerCase() === activeSubTab) || 
            item.type.toLowerCase() === activeSubTab
          );
        }
        
        // Apply multi-select subfilters
        if (selectedSubfilters.length > 0) {
          filteredItems = filteredItems.filter(item => 
            selectedSubfilters.some(filter => {
              if (item.tags.includes(filter)) return true;
              if (item.type === filter) return true;
              if (item.subtype === filter) return true;
              if (item.styles && item.styles.includes(filter)) return true;
              return false;
            })
          );
        }
        
        setItems(filteredItems);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error loading data",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setActiveSubTab("all");
  };

  const handleSubTabChange = (value: string) => {
    setActiveSubTab(value);
  };

  const handleUserTypeChange = (type: string) => {
    setUserType(type);
  };

  const handleResourceTypeChange = (type: string) => {
    setResourceType(type);
  };

  const handleArtistStyleChange = (style: string) => {
    setArtistStyle(style);
  };

  const handleDisciplinaryTypeChange = (type: string) => {
    setDisciplinaryType(type);
  };

  const handleSubfilterSelect = (filter: string) => {
    if (selectedSubfilters.includes(filter)) {
      setSelectedSubfilters(selectedSubfilters.filter(f => f !== filter));
    } else {
      setSelectedSubfilters([...selectedSubfilters, filter]);
    }
  };

  const clearSubfilters = () => {
    setSelectedSubfilters([]);
    form.reset({ subfilters: [] });
  };

  // Get available subfilters based on active tab
  const getAvailableSubfilters = () => {
    const subfilters: { value: string; label: string }[] = [];
    
    // Add subcategories
    if (tabSubcategories[activeTab]) {
      tabSubcategories[activeTab].forEach(subcat => {
        subfilters.push({
          value: subcat,
          label: subcat.charAt(0).toUpperCase() + subcat.slice(1)
        });
      });
    }
    
    // Add relevant tags for this tab
    const relevantTags = allTags.filter(tag => {
      // Logic to filter tags based on active tab
      if (activeTab === "artists" && ['Vocalist', 'Guitar', 'Producer', 'Minimalist', 'Contemporary'].includes(tag)) return true;
      if (activeTab === "resources" && ['Studio', 'Gallery', 'Practice Room', 'Soundproofed'].includes(tag)) return true;
      if (activeTab === "venues" && ['Concert Hall', 'Club', 'Theater'].includes(tag)) return true;
      // Add more cases as needed
      return false;
    });
    
    relevantTags.forEach(tag => {
      subfilters.push({ value: tag, label: tag });
    });
    
    return subfilters;
  };

  const getTabLabel = (tab: string) => {
    const labels: Record<string, string> = {
      artists: "Artists",
      resources: "Resources",
      projects: "Projects",
      events: "Events",
      venues: "Venues",
      communities: "Communities",
      brands: "Brands"
    };
    return labels[tab] || tab.charAt(0).toUpperCase() + tab.slice(1);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className={`w-full ${sidebarOpen ? 'md:w-8/12' : 'md:w-11/12'} transition-all duration-300`}>
            <DiscoverHeader 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              userType={userType}
              setUserType={setUserType}
              handleTagSelect={handleTagSelect}
              allTags={allTags}
              resourceType={resourceType}
              onResourceTypeChange={handleResourceTypeChange}
              artistStyle={artistStyle}
              onArtistStyleChange={handleArtistStyleChange}
              disciplinaryType={disciplinaryType}
              onDisciplinaryTypeChange={handleDisciplinaryTypeChange}
              activeTab={activeTab}
              selectedSubfilters={selectedSubfilters}
              onSubfilterSelect={handleSubfilterSelect}
              onSubfilterClear={clearSubfilters}
              availableSubfilters={getAvailableSubfilters()}
            />

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-6">
              <TabsList className="w-full overflow-x-auto flex">
                {availableTabs.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    {getTabLabel(tab)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {activeTab && tabSubcategories[activeTab] && (
              <div className="mb-6">
                <Tabs value={activeSubTab} onValueChange={handleSubTabChange}>
                  <TabsList className="w-full overflow-x-auto flex">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {tabSubcategories[activeTab].map(subTab => (
                      <TabsTrigger key={subTab} value={subTab}>
                        {subTab.charAt(0).toUpperCase() + subTab.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            <CategoryItemsGrid items={items} isLoading={isLoading} />
          </div>
          
          {/* Desktop sidebar toggle button */}
          <div className={`fixed top-1/2 ${sidebarOpen ? 'right-[calc(33.333%-1rem)]' : 'right-4'} transform -translate-y-1/2 z-10 md:block hidden`}>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full border-border shadow-sm bg-background"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Desktop sidebar */}
          <div className={`w-full md:w-4/12 transition-all duration-300 ease-in-out ${sidebarOpen ? 'block' : 'hidden md:block md:w-1/12'}`}>
            {sidebarOpen && (
              <div className="h-[600px] overflow-y-auto">
                <DiscoverSidebar activeTabData={items} activeTab={activeTab} />
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile bottom drawer for sidebar */}
        {isMobile && (
          <Drawer>
            <DrawerTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50 flex md:hidden"
              >
                <Grip className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh] max-h-[85vh] overflow-y-auto">
              <DrawerHeader>
                <DrawerTitle>Categories & Circles</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4 overflow-y-auto">
                <DiscoverSidebar activeTabData={items} activeTab={activeTab} />
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </Layout>
  );
};

export default Discover;
