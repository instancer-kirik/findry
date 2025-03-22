
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SubTabs, SubTabsList, SubTabsTrigger } from "@/components/ui/tabs";
import AnimatedSection from '../ui-custom/AnimatedSection';
import { ContentItemProps } from '../marketplace/ContentCard';

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
  return (
    <AnimatedSection animation="fade-in-up" delay={200}>
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="mb-8"
      >
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-6">
          {availableTabs.map(tab => (
            <TabsTrigger key={tab} value={tab}>
              {getTabLabel(tab)}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {renderSubTabs(tab)}
            {renderTabContent(getActiveItems())}
          </TabsContent>
        ))}
      </Tabs>
    </AnimatedSection>
  );
};

export default CategoryTabs;
