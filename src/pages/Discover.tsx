
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useForm } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';

// Components
import DiscoverHeader from '../components/discover/DiscoverHeader';
import CategoryItemsGrid from '../components/discover/CategoryItemsGrid';
import DiscoverSidebar from '../components/discover/DiscoverSidebar';
import DiscoverFilters from '../components/discover/DiscoverFilters';
import DiscoverMobileDrawer from '../components/discover/DiscoverMobileDrawer';

// Data and hooks
import {
  allTags,
  tabSubcategories,
  availableTabs,
  artistStyleFilters,
  disciplinaryFilters
} from '../components/discover/DiscoverData';
import { useDiscoverData } from '@/hooks/use-discover-data';

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
  
  // Use our custom hook to fetch and filter data
  const { items, isLoading } = useDiscoverData(
    activeTab,
    searchQuery,
    selectedTags,
    resourceType,
    artistStyle,
    disciplinaryType,
    activeSubTab,
    selectedSubfilters
  );
  
  // Update sidebar visibility when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Reset subfilters when tab changes
  useEffect(() => {
    setSelectedSubfilters([]);
    form.reset({ subfilters: [] });
  }, [activeTab, form]);

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearTags = () => {
    setSelectedTags([]);
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

  const availableSubfilters = getAvailableSubfilters();

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
              availableSubfilters={availableSubfilters}
            />

            <DiscoverFilters
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              activeSubTab={activeSubTab}
              handleSubTabChange={handleSubTabChange}
              availableTabs={availableTabs}
              tabSubcategories={tabSubcategories}
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              getTabLabel={getTabLabel}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />

            {showFilters && !isMobile && (
              <UnifiedFilters 
                allTags={allTags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onTagClear={clearTags}
                userType={userType}
                onUserTypeChange={handleUserTypeChange}
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
                availableSubfilters={availableSubfilters}
                onClose={() => setShowFilters(false)}
              />
            )}

            <CategoryItemsGrid items={items} isLoading={isLoading} />
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
        
        {/* Mobile bottom drawer for sidebar and filters */}
        <DiscoverMobileDrawer 
          items={items} 
          activeTab={activeTab} 
          isMobile={isMobile}
          selectedTags={selectedTags}
          handleTagSelect={handleTagSelect}
          clearTags={clearTags}
          userType={userType}
          setUserType={handleUserTypeChange}
          resourceType={resourceType}
          onResourceTypeChange={handleResourceTypeChange}
          artistStyle={artistStyle}
          onArtistStyleChange={handleArtistStyleChange}
          disciplinaryType={disciplinaryType}
          onDisciplinaryTypeChange={handleDisciplinaryTypeChange}
          selectedSubfilters={selectedSubfilters}
          onSubfilterSelect={handleSubfilterSelect}
          onSubfilterClear={clearSubfilters}
          availableSubfilters={availableSubfilters}
          allTags={allTags}
        />
      </div>
    </Layout>
  );
};

export default Discover;
