
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MarketplaceFilters from '../components/marketplace/MarketplaceFilters';
import { ContentItemProps } from '../components/marketplace/ContentCard';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Grip, Check, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// New refactored components
import DiscoverHeader from '../components/discover/DiscoverHeader';
import CategoryTabs from '../components/discover/CategoryTabs';
import CategoryItemsGrid from '../components/discover/CategoryItemsGrid';
import DiscoverSidebar from '../components/discover/DiscoverSidebar';

// Import data
import {
  artists,
  resources,
  projects,
  events,
  venues,
  communities,
  brands,
  allTags,
  tabSubcategories,
  availableTabs
} from '../components/discover/DiscoverData';

import AnimatedSection from '../components/ui-custom/AnimatedSection';
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
  }, [activeTab, form]);

  const filterItems = (items: ContentItemProps[]) => {
    return items.filter(item => {
      const matchesSearch = searchQuery === "" || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => item.tags.includes(tag));
      
      const matchesResourceType = activeTab !== "resources" || 
        resourceType === "all" || 
        item.type === resourceType;
      
      const matchesSubTab = activeSubTab === "all" || 
        (item.subtype && item.subtype.toLowerCase() === activeSubTab) ||
        item.type.toLowerCase() === activeSubTab;
      
      // Artist style filtering
      const matchesArtistStyle = artistStyle === "all" || 
        (item.styles && item.styles.includes(artistStyle.charAt(0).toUpperCase() + artistStyle.slice(1)));
      
      // Disciplinary type filtering
      const matchesDisciplinaryType = disciplinaryType === "all" || 
        (disciplinaryType === "multi" && item.multidisciplinary) ||
        (disciplinaryType === "single" && !item.multidisciplinary);
      
      // Multi-select subfilters
      const matchesSubfilters = selectedSubfilters.length === 0 || 
        selectedSubfilters.some(filter => {
          if (item.tags.includes(filter)) return true;
          if (item.type === filter) return true;
          if (item.subtype === filter) return true;
          if (item.styles && item.styles.includes(filter)) return true;
          return false;
        });
      
      return matchesSearch && matchesTags && matchesResourceType && 
             matchesSubTab && matchesArtistStyle && matchesDisciplinaryType && 
             matchesSubfilters;
    });
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

  const handleSubfilterSelect = (values: string[]) => {
    setSelectedSubfilters(values);
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

  const getActiveItems = () => {
    switch (activeTab) {
      case "artists":
        return filterItems(artists);
      case "resources":
        return filterItems(resources);
      case "projects":
        return filterItems(projects);
      case "events":
        return filterItems(events);
      case "venues":
        return filterItems(venues);
      case "communities":
        return filterItems(communities);
      case "brands":
        return filterItems(brands);
      default:
        return [];
    }
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

  const getSubTabLabel = (tab: string) => {
    return tab.charAt(0).toUpperCase() + tab.slice(1);
  };

  const renderSubTabs = (tabKey: string) => {
    const subcategories = tabSubcategories[tabKey] || [];
    
    return (
      <div className="mb-4">
        <div className="flex flex-col space-y-4">
          <Tabs value={activeSubTab} onValueChange={handleSubTabChange}>
            <TabsList className="w-full overflow-x-auto flex">
              <TabsTrigger value="all">All</TabsTrigger>
              {subcategories.map(subTab => (
                <TabsTrigger key={subTab} value={subTab}>
                  {getSubTabLabel(subTab)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* Multi-select filter */}
          <div className="flex flex-col md:flex-row gap-3 items-start">
            <Form {...form}>
              <FormField
                control={form.control}
                name="subfilters"
                render={({ field }) => (
                  <FormItem className="w-full md:w-80">
                    <Select
                      onValueChange={(value) => {
                        const values = [...field.value];
                        if (!values.includes(value)) {
                          values.push(value);
                          field.onChange(values);
                          handleSubfilterSelect(values);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Add ${getTabLabel(activeTab)} filters...`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Available Filters</SelectLabel>
                          {getAvailableSubfilters().map((subfilter) => (
                            <SelectItem 
                              key={subfilter.value} 
                              value={subfilter.value}
                              disabled={selectedSubfilters.includes(subfilter.value)}
                            >
                              {subfilter.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </Form>
            
            {selectedSubfilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSubfilters.map(filter => (
                  <Badge 
                    key={filter} 
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer hover:bg-destructive/10 transition-colors"
                    onClick={() => {
                      const updatedFilters = selectedSubfilters.filter(f => f !== filter);
                      setSelectedSubfilters(updatedFilters);
                      form.setValue('subfilters', updatedFilters);
                    }}
                  >
                    {filter}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedSubfilters([]);
                    form.setValue('subfilters', []);
                  }}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
            />

            {showFilters && (
              <AnimatedSection animation="fade-in-down" delay={200}>
                <MarketplaceFilters 
                  allTags={allTags} 
                  selectedTags={selectedTags} 
                  onTagSelect={handleTagSelect}
                  userType={userType}
                  onUserTypeChange={handleUserTypeChange}
                  resourceType={resourceType}
                  onResourceTypeChange={handleResourceTypeChange}
                  artistStyle={artistStyle}
                  onArtistStyleChange={handleArtistStyleChange}
                  disciplinaryType={disciplinaryType}
                  onDisciplinaryTypeChange={handleDisciplinaryTypeChange}
                  activeTab={activeTab}
                  onClose={() => setShowFilters(false)}
                />
              </AnimatedSection>
            )}

            <CategoryTabs 
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              activeSubTab={activeSubTab}
              handleSubTabChange={handleSubTabChange}
              availableTabs={availableTabs}
              tabSubcategories={tabSubcategories}
              renderSubTabs={renderSubTabs}
              getActiveItems={getActiveItems}
              getTabLabel={getTabLabel}
              renderTabContent={(items) => (
                <CategoryItemsGrid items={items} />
              )}
            />
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
                <DiscoverSidebar activeTabData={getActiveItems()} activeTab={activeTab} />
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
                <DiscoverSidebar activeTabData={getActiveItems()} activeTab={activeTab} />
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
