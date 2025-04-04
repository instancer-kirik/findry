import React from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Sparkles, Tag, ListFilter, Check } from 'lucide-react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { artistStyleFilters, disciplinaryFilters, allTags as defaultTags, resourceTypes } from './DiscoverData';

interface DiscoverHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  userType: string;
  setUserType: (type: string) => void;
  handleTagSelect: (tag: string) => void;
  allTags?: string[];
  resourceType?: string;
  onResourceTypeChange?: (type: string) => void;
  artistStyle?: string;
  onArtistStyleChange?: (style: string) => void;
  disciplinaryType?: string;
  onDisciplinaryTypeChange?: (type: string) => void;
  activeTab?: string;
  selectedSubfilters?: string[];
  onSubfilterSelect?: (filter: string) => void;
  onSubfilterClear?: () => void;
  availableSubfilters?: { value: string; label: string }[];
}

const DiscoverHeader: React.FC<DiscoverHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTags,
  setSelectedTags,
  showFilters,
  setShowFilters,
  userType,
  setUserType,
  handleTagSelect,
  allTags = defaultTags,
  resourceType = "all",
  onResourceTypeChange = () => {},
  artistStyle = "all",
  onArtistStyleChange = () => {},
  disciplinaryType = "all",
  onDisciplinaryTypeChange = () => {},
  activeTab = "",
  selectedSubfilters = [],
  onSubfilterSelect = () => {},
  onSubfilterClear = () => {},
  availableSubfilters = []
}) => {
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [filterTab, setFilterTab] = React.useState("main");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const getContextTags = () => {
    const contextMap: Record<string, string[]> = {
      'artists': ['Vocalist', 'Guitar', 'Producer', 'Rapper', 'Performance Artist', 'Visual Artist', 'R&B', 'Soul', 'Blues', 'Jazz'],
      'resources': ['Studio', 'Gallery', 'Practice Room', 'Exhibition Space', 'Workshop', 'Soundproofed'],
      'projects': ['Music Production', 'Photography', 'Film', 'Budget: $5-10K', 'Budget: $2-5K'],
      'events': ['Concert', 'Exhibition', 'Workshop', 'Networking'],
      'venues': ['Concert Hall', 'Club', 'Theater', 'Outdoor'],
      'brands': ['Record Label', 'Fashion', 'Technology', 'Food & Beverage'],
      'communities': ['Educational', 'Professional', 'Neighborhood', 'Interest-based']
    };
    
    return ((contextMap[activeTab] || []) as string[]).filter(tag => allTags.includes(tag));
  };

  const resourceTypes = [
    { value: "all", label: "All Resources" },
    { value: "space", label: "Spaces" },
    { value: "tool", label: "Tools & Equipment" },
    { value: "offerer", label: "Service Providers" },
    { value: "other", label: "Other Resources" }
  ];

  return (
    <>
      <AnimatedSection animation="fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Discover</h1>
          
          <div className="flex items-center">
            <Badge className="px-3 py-1.5 bg-primary/10 text-primary border-0">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Viewing as: {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </Badge>
          </div>
        </div>
      </AnimatedSection>
      
      <AnimatedSection animation="fade-in-up" delay={100}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by name, location, or tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-24"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs">
              Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
          
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setFilterDialogOpen(true)}
                variant={showFilters ? "default" : "outline"}
                className="flex items-center justify-center gap-2 px-4 py-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <ListFilter className="mr-2 h-5 w-5 text-primary" />
                  Filters & Tags
                </DialogTitle>
                <DialogDescription>
                  Customize your discovery experience with these filters
                </DialogDescription>
              </DialogHeader>
              
              <Tabs value={filterTab} onValueChange={setFilterTab} className="w-full mt-4">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="main">Main Filters</TabsTrigger>
                  <TabsTrigger value="tags">Tags</TabsTrigger>
                  <TabsTrigger value="user">User Type</TabsTrigger>
                </TabsList>
                
                <TabsContent value="main" className="space-y-4">
                  {activeTab === "artists" && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Artist Style</label>
                        <Select value={artistStyle} onValueChange={onArtistStyleChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select artist style" />
                          </SelectTrigger>
                          <SelectContent>
                            {artistStyleFilters.map((style) => (
                              <SelectItem key={style.value} value={style.value}>
                                {style.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Disciplinary Type</label>
                        <Select value={disciplinaryType} onValueChange={onDisciplinaryTypeChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select disciplinary type" />
                          </SelectTrigger>
                          <SelectContent>
                            {disciplinaryFilters.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  {activeTab === "resources" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Resource Type</label>
                      <Select value={resourceType} onValueChange={onResourceTypeChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select resource type" />
                        </SelectTrigger>
                        <SelectContent>
                          {resourceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {selectedSubfilters.length > 0 && (
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Selected Filters</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onSubfilterClear}
                          className="text-xs h-7"
                        >
                          Clear all
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-md">
                        {selectedSubfilters.map(filter => (
                          <Badge 
                            key={filter} 
                            variant="secondary"
                            className="flex items-center gap-1 cursor-pointer hover:bg-destructive/10 transition-colors"
                            onClick={() => onSubfilterSelect(filter)}
                          >
                            {filter}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Available Filters</label>
                    <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                      <div className="flex flex-wrap gap-2">
                        {availableSubfilters.map((filter) => (
                          <Badge 
                            key={filter.value}
                            variant={selectedSubfilters.includes(filter.value) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => onSubfilterSelect(filter.value)}
                          >
                            {selectedSubfilters.includes(filter.value) && <Check className="h-3 w-3 mr-1" />}
                            {filter.label}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
                
                <TabsContent value="tags" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Popular Tags for {activeTab}</label>
                    <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                      <div className="flex flex-wrap gap-2">
                        {getContextTags().map(tag => (
                          <Badge 
                            key={tag} 
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleTagSelect(tag)}
                          >
                            {selectedTags.includes(tag) && <Check className="h-3 w-3 mr-1" />}
                            {tag}
                          </Badge>
                        ))}
                        {getContextTags().length === 0 && (
                          <p className="text-sm text-muted-foreground p-2">No context-specific tags available</p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  {selectedTags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Active Tags</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-md">
                        {selectedTags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive/10 transition-colors"
                            onClick={() => handleTagSelect(tag)}
                          >
                            {tag}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTags([])}
                          className="text-xs h-7"
                        >
                          Clear all
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="user" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">View Content As</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['regular', 'artist', 'venue', 'brand', 'resource'].map((type) => (
                        <Button 
                          key={type}
                          variant={userType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUserType(type)}
                          className="justify-start h-9"
                        >
                          {userType === type && <Check className="mr-2 h-3 w-3" />}
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button onClick={() => {
                  setShowFilters(true);
                  setFilterDialogOpen(false);
                }}>
                  Apply Filters
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedSection>

      {selectedTags.length > 0 && (
        <AnimatedSection animation="fade-in-up" delay={150}>
          <div className="flex flex-wrap gap-2 mb-6 p-3 bg-muted/20 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground mr-1 my-1">Active filters:</span>
            {selectedTags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1.5 cursor-pointer hover:bg-destructive/10 transition-colors"
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            <Button
              variant="ghost"
              onClick={() => setSelectedTags([])}
              size="sm"
              className="text-sm text-muted-foreground h-7"
            >
              Clear all
            </Button>
          </div>
        </AnimatedSection>
      )}

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search for tags, categories, or content..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Filters">
            <CommandItem onSelect={() => setUserType('artist')} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${userType === 'artist' ? 'bg-primary' : 'bg-muted'}`}></div>
              <span>Artist View</span>
            </CommandItem>
            <CommandItem onSelect={() => setUserType('venue')} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${userType === 'venue' ? 'bg-primary' : 'bg-muted'}`}></div>
              <span>Venue View</span>
            </CommandItem>
            <CommandItem onSelect={() => setUserType('brand')} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${userType === 'brand' ? 'bg-primary' : 'bg-muted'}`}></div>
              <span>Brand View</span>
            </CommandItem>
            <CommandItem onSelect={() => setUserType('resource')} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${userType === 'resource' ? 'bg-primary' : 'bg-muted'}`}></div>
              <span>Resource View</span>
            </CommandItem>
          </CommandGroup>
          
          {allTags.length > 0 && (
            <CommandGroup heading="Popular Tags">
              {allTags.slice(0, 10).map((tag) => (
                <CommandItem
                  key={tag}
                  onSelect={() => {
                    handleTagSelect(tag);
                    setCommandOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <div className={`w-2 h-2 rounded-full ${selectedTags.includes(tag) ? 'bg-primary' : 'bg-muted'}`}></div>
                  <span>{tag}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default DiscoverHeader;
