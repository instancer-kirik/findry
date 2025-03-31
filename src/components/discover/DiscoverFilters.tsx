
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DiscoverFiltersProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  activeSubTab: string;
  handleSubTabChange: (value: string) => void;
  availableTabs: string[];
  tabSubcategories: Record<string, string[]>;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  getTabLabel: (tab: string) => string;
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({
  activeTab,
  handleTabChange,
  activeSubTab,
  handleSubTabChange,
  availableTabs,
  tabSubcategories,
  sidebarOpen,
  toggleSidebar,
  getTabLabel
}) => {
  const isMobile = useIsMobile();

  return (
    <>
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
    </>
  );
};

export default DiscoverFilters;
