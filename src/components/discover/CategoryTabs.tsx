
import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

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
  const isDesktop = window.innerWidth >= 1024; // Simple check for desktop

  // For mobile devices, show tabs in a scrollable row
  // For desktop, show first 4 tabs as buttons and the rest in a dropdown/dialog
  const visibleTabs = isDesktop ? availableTabs.slice(0, 4) : availableTabs;
  const dropdownTabs = isDesktop ? availableTabs.slice(4) : [];

  return (
    <AnimatedSection animation="fade-in-up" delay={200}>
      <div className="mb-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          {/* Visible tab buttons + dropdown for extra tabs on desktop */}
          <div className="flex items-center mb-6 overflow-x-auto">
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

            {dropdownTabs.length > 0 && (
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
                        onClick={() => {
                          handleTabChange(tab);
                          setDialogOpen(false);
                        }}
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
