
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import MarketplaceFilters from '../components/marketplace/MarketplaceFilters';
import { ContentItemProps } from '../components/marketplace/ContentCard';

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
  allTags,
  tabSubcategories,
  availableTabs
} from '../components/discover/DiscoverData';

import AnimatedSection from '../components/ui-custom/AnimatedSection';

const Discover: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("artists");
  const [activeSubTab, setActiveSubTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("regular");
  const [resourceType, setResourceType] = useState<string>("all");
  
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
      
      return matchesSearch && matchesTags && matchesResourceType && matchesSubTab;
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
      communities: "Communities"
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
        <div className="w-full overflow-x-auto flex space-x-4">
          {subcategories.map(subTab => (
            <button 
              key={subTab} 
              onClick={() => handleSubTabChange(subTab)}
              className={`px-3 py-1 text-sm font-medium rounded-sm transition-all
                ${activeSubTab === subTab ? 
                  'text-foreground border-b-2 border-primary' : 
                  'text-muted-foreground hover:text-foreground'}`}
            >
              {getSubTabLabel(subTab)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="w-full md:w-8/12">
            <DiscoverHeader 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              userType={userType}
              handleTagSelect={handleTagSelect}
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
          
          <DiscoverSidebar />
        </div>
      </div>
    </Layout>
  );
};

export default Discover;
