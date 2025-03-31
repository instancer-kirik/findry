
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronDown, Filter, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
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
  getTabLabel,
  showFilters,
  setShowFilters
}) => {
  const isMobile = useIsMobile();
  
  // For desktop, show first 4 tabs directly, and the rest in a dropdown/dialog
  const visibleTabs = !isMobile ? availableTabs.slice(0, 4) : [];
  const dropdownTabs = !isMobile ? availableTabs.slice(4) : availableTabs;
  
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  
  const onTabSelect = (tab: string) => {
    handleTabChange(tab);
    setCategoryDialogOpen(false);
    setCategoryDrawerOpen(false);
  };

  return (
    <>
      {/* Desktop view with main tabs and overflow in dialog */}
      <div className="hidden md:block mb-6">
        <div className="flex items-center mb-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-grow">
            <TabsList className="inline-flex mr-2 space-x-1 overflow-x-auto">
              {visibleTabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {getTabLabel(tab)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {dropdownTabs.length > 0 && (
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  More Categories <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Category</DialogTitle>
                  <DialogDescription>
                    Choose a category to explore content
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  {dropdownTabs.map(tab => (
                    <Button
                      key={tab}
                      variant={activeTab === tab ? "default" : "outline"}
                      onClick={() => onTabSelect(tab)}
                      className="justify-start"
                    >
                      {getTabLabel(tab)}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
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
      </div>
      
      {/* Mobile view with category drawer */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            onClick={() => setCategoryDrawerOpen(true)}
            className="flex-grow flex items-center justify-between mr-2"
          >
            <span className="flex items-center">
              <Menu className="mr-2 h-4 w-4" />
              {getTabLabel(activeTab)}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="h-9 w-9"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {activeTab && tabSubcategories[activeTab] && (
          <div className="mb-4 overflow-x-auto">
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
        
        <Drawer open={categoryDrawerOpen} onOpenChange={setCategoryDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Select Category</DrawerTitle>
              <DrawerDescription>
                Choose a category to explore content
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid grid-cols-2 gap-4 p-4">
              {availableTabs.map(tab => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => onTabSelect(tab)}
                  className="justify-start"
                >
                  {getTabLabel(tab)}
                </Button>
              ))}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
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
    </>
  );
};

export default DiscoverFilters;
