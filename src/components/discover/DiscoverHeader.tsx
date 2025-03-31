
import React from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Sparkles } from 'lucide-react';
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
  allTags = []
}) => {
  const [commandOpen, setCommandOpen] = React.useState(false);

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

  // Group tags by first letter for command menu
  const groupedTags = React.useMemo(() => {
    const groups: Record<string, string[]> = {};
    
    allTags.forEach(tag => {
      const firstLetter = tag.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(tag);
    });
    
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [allTags]);

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
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "default" : "outline"}
            className="flex items-center justify-center gap-2 px-4 py-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
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
          
          {groupedTags.map(([letter, tags]) => (
            <CommandGroup key={letter} heading={`Tags - ${letter}`}>
              {tags.map((tag) => (
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
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default DiscoverHeader;
