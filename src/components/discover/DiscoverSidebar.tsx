
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, Tag, Info } from 'lucide-react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import SavedItemsTracker from '../marketplace/SavedItemsTracker';
import MarketplaceChat from '../marketplace/MarketplaceChat';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle 
} from '@/components/ui/resizable';
import { ContentItemProps } from '../marketplace/ContentCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

interface DiscoverSidebarProps {
  activeTabData?: ContentItemProps[];
  activeTab?: string;
}

const DiscoverSidebar: React.FC<DiscoverSidebarProps> = ({ 
  activeTabData = [],
  activeTab = 'events'
}) => {
  const [selectedItem, setSelectedItem] = useState<ContentItemProps | null>(null);

  return (
    <ResizablePanelGroup direction="vertical" className="w-full">
      <ResizablePanel defaultSize={25}>
        <AnimatedSection animation="slide-in-left" delay={100}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Create New</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start" asChild>
                  <Link to="/events/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Event
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground pt-2">
                  Organize your own event and connect with the community.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={35}>
        <AnimatedSection animation="slide-in-left" delay={200}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <Link key={item} to={`/events/${item}`} className="flex items-start gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium line-clamp-1">Music Festival {item}</h3>
                      <p className="text-xs text-muted-foreground">July {10 + item}, 2023</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </ResizablePanel>

      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={40}>
        <AnimatedSection animation="slide-in-left" delay={300}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Selected {activeTab.slice(0, -1)}</CardTitle>
              <CardDescription>
                Reference data for your event creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTabData.length > 0 ? (
                <div className="space-y-4">
                  {activeTabData.slice(0, 3).map((item) => (
                    <Dialog key={item.id}>
                      <DialogTrigger asChild>
                        <button 
                          onClick={() => setSelectedItem(item)}
                          className="flex items-start gap-3 hover:bg-muted p-2 rounded-md transition-colors w-full text-left"
                        >
                          <Tag className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-muted-foreground">{item.location}</p>
                          </div>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{item.name}</DialogTitle>
                          <DialogDescription>{item.type} - {item.location}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Tags</h4>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <h4 className="text-sm font-medium">Create Event With This {item.type}</h4>
                            <Button asChild className="w-full">
                              <Link to={`/events/create?${item.type}=${item.id}`}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Create Event 
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <Info className="h-10 w-10 text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">Select items from the main view to see details here</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Click on an item to see more details and use it in event creation
              </p>
            </CardFooter>
          </Card>
        </AnimatedSection>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={20}>
        <AnimatedSection animation="slide-in-left" delay={400}>
          <SavedItemsTracker />
        </AnimatedSection>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DiscoverSidebar;
