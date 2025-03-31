
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, Tag, Info, Users, CircleUserRound, Tags } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DiscoverSidebarProps {
  activeTabData?: ContentItemProps[];
  activeTab?: string;
}

const UserCircle: React.FC<{ name: string, users: string[], color: string }> = ({ name, users, color }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h3 className="text-sm font-medium">{name}</h3>
          <Badge variant="outline" className="text-xs">{users.length}</Badge>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-1 mb-2">
        <div className="ml-5 space-y-1 bg-muted/30 rounded-md p-2">
          {users.map((user, index) => (
            <div key={index} className="flex items-center justify-between text-sm py-1 px-2 hover:bg-muted/70 rounded-sm transition-colors">
              <span className="truncate">{user}</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-70 hover:opacity-100">
                <CircleUserRound className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const DiscoverSidebar: React.FC<DiscoverSidebarProps> = ({ 
  activeTabData = [],
  activeTab = 'events'
}) => {
  const [selectedItem, setSelectedItem] = useState<ContentItemProps | null>(null);
  const [activeCircleTab, setActiveCircleTab] = useState("circles");
  const isMobile = useIsMobile();

  // Sample user circles
  const userCircles = [
    { name: "Collaborators", users: ["Alex Kim", "Taylor Swift", "John Doe"], color: "bg-blue-500" },
    { name: "Favorites", users: ["Elena Rivera", "Studio 54", "James Bond"], color: "bg-yellow-500" },
    { name: "Potential Venues", users: ["The Acoustic Lounge", "Electric Factory", "Summit Theater"], color: "bg-green-500" },
    { name: "Session Musicians", users: ["Mike Drums", "Bass Betty", "Guitar George"], color: "bg-purple-500" }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <ResizablePanelGroup direction="vertical" className="min-h-[600px]">
        <ResizablePanel defaultSize={15} minSize={10}>
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

        <ResizablePanel defaultSize={15} minSize={10}>
          <AnimatedSection animation="slide-in-left" delay={200}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <Link 
                      key={item} 
                      to={`/events/${item}`} 
                      className="flex items-start gap-3 hover:bg-muted p-2 rounded-md transition-colors"
                    >
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

        <ResizablePanel defaultSize={20} minSize={15}>
          <AnimatedSection animation="slide-in-left" delay={300}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">User Categories</CardTitle>
                <CardDescription>Organize people for easier collaboration</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs value={activeCircleTab} onValueChange={setActiveCircleTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="circles" className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Circles</span>
                    </TabsTrigger>
                    <TabsTrigger value="tags" className="flex items-center gap-1">
                      <Tags className="h-4 w-4" />
                      <span>Tags</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="circles" className="pt-1 border rounded-md border-muted p-1">
                    <ScrollArea className="h-[180px] pr-3">
                      <div className="space-y-1">
                        {userCircles.map((circle, idx) => (
                          <UserCircle 
                            key={idx} 
                            name={circle.name} 
                            users={circle.users} 
                            color={circle.color} 
                          />
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="pt-3 mt-2 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create New Circle
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tags" className="pt-2 border rounded-md border-muted p-3">
                    <ScrollArea className="h-[180px] pr-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Producer</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Vocalist</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Instrumental</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Jazz</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Hip-hop</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Mixing</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Mastering</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Studio</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Composition</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Arrangement</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Audio Engineer</Badge>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">Live Performance</Badge>
                      </div>
                    </ScrollArea>
                    
                    <div className="pt-3 mt-2 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add New Tag
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </AnimatedSection>
        </ResizablePanel>

        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={20} minSize={15}>
          <AnimatedSection animation="slide-in-left" delay={400}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Selected {activeTab.slice(0, -1)}</CardTitle>
                <CardDescription>
                  Reference data for your event creation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTabData.length > 0 ? (
                  <div className="space-y-2">
                    {activeTabData.slice(0, 3).map((item) => (
                      <Dialog key={item.id}>
                        <DialogTrigger asChild>
                          <button 
                            onClick={() => setSelectedItem(item)}
                            className="flex items-start gap-3 hover:bg-muted p-2 rounded-md transition-colors w-full text-left"
                          >
                            <Tag className="h-5 w-5 text-primary mt-0.5" />
                            <div className="overflow-hidden">
                              <h3 className="font-medium line-clamp-1">{item.name}</h3>
                              <p className="text-xs text-muted-foreground truncate">{item.location}</p>
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
                                {item.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary">{tag}</Badge>
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

        {!isMobile && (
          <>
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={15} minSize={10}>
              <AnimatedSection animation="slide-in-left" delay={500}>
                <SavedItemsTracker />
              </AnimatedSection>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={15} minSize={10}>
              <AnimatedSection animation="slide-in-left" delay={600}>
                <MarketplaceChat />
              </AnimatedSection>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default DiscoverSidebar;
