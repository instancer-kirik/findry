
import React from 'react';
import { Grip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger 
} from '@/components/ui/drawer';
import DiscoverSidebar from './DiscoverSidebar';
import { ContentItemProps } from '../marketplace/ContentCard';
import UnifiedFilters from './UnifiedFilters';

interface DiscoverMobileDrawerProps {
  items: ContentItemProps[];
  activeTab: string;
  isMobile: boolean;
  // Filter props
  selectedTags: string[];
  handleTagSelect: (tag: string) => void;
  clearTags: () => void;
  userType: string;
  setUserType: (type: string) => void;
  resourceType: string;
  onResourceTypeChange: (type: string) => void;
  artistStyle: string;
  onArtistStyleChange: (style: string) => void;
  disciplinaryType: string;
  onDisciplinaryTypeChange: (type: string) => void;
  selectedSubfilters: string[];
  onSubfilterSelect: (filter: string) => void;
  onSubfilterClear: () => void;
  availableSubfilters: { value: string; label: string }[];
  allTags: string[];
}

const DiscoverMobileDrawer: React.FC<DiscoverMobileDrawerProps> = ({ 
  items, 
  activeTab, 
  isMobile,
  selectedTags,
  handleTagSelect,
  clearTags,
  userType,
  setUserType,
  resourceType,
  onResourceTypeChange,
  artistStyle,
  onArtistStyleChange,
  disciplinaryType,
  onDisciplinaryTypeChange,
  selectedSubfilters,
  onSubfilterSelect,
  onSubfilterClear,
  availableSubfilters,
  allTags
}) => {
  const [activeDrawer, setActiveDrawer] = React.useState<'sidebar' | 'filters'>('sidebar');
  
  if (!isMobile) {
    return null;
  }

  return (
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
          <div className="flex justify-between items-center">
            <DrawerTitle>{activeDrawer === 'sidebar' ? 'Categories & Circles' : 'Filters & Tags'}</DrawerTitle>
            <div className="flex space-x-2">
              <Button 
                variant={activeDrawer === 'sidebar' ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveDrawer('sidebar')}
              >
                Circles
              </Button>
              <Button 
                variant={activeDrawer === 'filters' ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveDrawer('filters')}
              >
                Filters
              </Button>
            </div>
          </div>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          {activeDrawer === 'sidebar' ? (
            <DiscoverSidebar activeTabData={items} activeTab={activeTab} />
          ) : (
            <UnifiedFilters 
              allTags={allTags}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              onTagClear={clearTags}
              userType={userType}
              onUserTypeChange={setUserType}
              resourceType={resourceType}
              onResourceTypeChange={onResourceTypeChange}
              artistStyle={artistStyle}
              onArtistStyleChange={onArtistStyleChange}
              disciplinaryType={disciplinaryType}
              onDisciplinaryTypeChange={onDisciplinaryTypeChange}
              activeTab={activeTab}
              selectedSubfilters={selectedSubfilters}
              onSubfilterSelect={onSubfilterSelect}
              onSubfilterClear={onSubfilterClear}
              availableSubfilters={availableSubfilters}
              onClose={() => {}}
            />
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DiscoverMobileDrawer;
