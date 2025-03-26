
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AnimatedSection from '../ui-custom/AnimatedSection';
import { ContentItemProps } from '../marketplace/ContentCard';
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
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryTabsProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  activeSubTab: string;
  handleSubTabChange: (value: string) => void;
  availableTabs: string[];
  tabSubcategories: Record<string, string[]>;
  renderSubTabs: (tabKey: string) => React.ReactNode;
  getActiveItems: () => ContentItemProps[];
  getTabLabel: (tab: string) => string;
  renderTabContent: (items: ContentItemProps[]) => React.ReactNode;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  handleTabChange,
  activeSubTab,
  handleSubTabChange,
  availableTabs,
  tabSubcategories,
  renderSubTabs,
  getActiveItems,
  getTabLabel,
  renderTabContent
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  // For desktop, show first 4 tabs as buttons and the rest in a dropdown/dialog
  const visibleTabs = !isMobile ? availableTabs.slice(0, 4) : [];
  const dropdownTabs = !isMobile ? availableTabs.slice(4) : availableTabs;

  const onTabSelect = (tab: string) => {
    handleTabChange(tab);
    setDialogOpen(false);
    setDrawerOpen(false);
  };

  return (
    <AnimatedSection animation="fade-in-up" delay={200}>
      <div className="mb-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          {/* Desktop: Visible tab buttons + dropdown for extra tabs */}
          <div className="hidden md:flex items-center mb-6 overflow-x-auto">
            <TabsList className="inline-flex mr-2 space-x-1">
              {visibleTabs.map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={activeTab === tab ? "bg-primary text-primary-foreground" : ""}
                >
                  {getTabLabel(tab)}
                </TabsTrigger>
              ))}
            </TabsList>

            {!isMobile && dropdownTabs.length > 0 && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    More <ChevronDown className="ml-1 h-4 w-4" />
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

          {/* Mobile: Drawer for tabs */}
          <div className="flex md:hidden items-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => setDrawerOpen(true)}
              className="flex items-center"
            >
              <Menu className="mr-2 h-4 w-4" />
              {getTabLabel(activeTab)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>

            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
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

          {/* Tab content */}
          <TabsContent value={activeTab}>
            {renderSubTabs(activeTab)}
            {renderTabContent(getActiveItems())}
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedSection>
  );
};

export default CategoryTabs;
