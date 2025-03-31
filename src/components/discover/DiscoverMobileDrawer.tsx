
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

interface DiscoverMobileDrawerProps {
  items: ContentItemProps[];
  activeTab: string;
  isMobile: boolean;
}

const DiscoverMobileDrawer: React.FC<DiscoverMobileDrawerProps> = ({ 
  items, 
  activeTab, 
  isMobile 
}) => {
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
  );
};

export default DiscoverMobileDrawer;
