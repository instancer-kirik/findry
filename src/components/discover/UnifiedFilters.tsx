
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Tag, Sliders, Filter, CircleUserRound, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { artistStyleFilters, disciplinaryFilters } from './DiscoverData';

interface UnifiedFiltersProps {
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagClear: () => void;
  userType: string;
  onUserTypeChange: (userType: string) => void;
  resourceType?: string;
  onResourceTypeChange?: (resourceType: string) => void;
  artistStyle?: string;
  onArtistStyleChange?: (style: string) => void;
  disciplinaryType?: string;
  onDisciplinaryTypeChange?: (type: string) => void;
  activeTab: string;
  selectedSubfilters: string[];
  onSubfilterSelect: (filter: string) => void;
  onSubfilterClear: () => void;
  availableSubfilters: { value: string; label: string }[];
  onClose: () => void;
}

const UnifiedFilters: React.FC<UnifiedFiltersProps> = ({
  allTags,
  selectedTags,
  onTagSelect,
  onTagClear,
  userType,
  onUserTypeChange,
  resourceType = "all",
  onResourceTypeChange = () => {},
  artistStyle = "all",
  onArtistStyleChange = () => {},
  disciplinaryType = "all",
  onDisciplinaryTypeChange = () => {},
  activeTab,
  selectedSubfilters,
  onSubfilterSelect,
  onSubfilterClear,
  availableSubfilters,
  onClose
}) => {
  const [filterTab, setFilterTab] = useState<string>("main");
  
  // Resource type options
  const resourceTypes = [
    { value: "all", label: "All Resources" },
    { value: "space", label: "Spaces" },
    { value: "tool", label: "Tools & Equipment" },
    { value: "offerer", label: "Service Providers" },
    { value: "other", label: "Other Resources" }
  ];

  // Filter tags based on current context
  const getContextTags = () => {
    const contextMap = {
      'artists': ['Vocalist', 'Guitar', 'Producer', 'Rapper', 'Performance Artist', 'Visual Artist', 'R&B', 'Soul', 'Blues', 'Jazz'],
      'resources': ['Studio', 'Gallery', 'Practice Room', 'Exhibition Space', 'Workshop', 'Soundproofed'],
      'projects': ['Music Production', 'Photography', 'Film', 'Budget: $5-10K', 'Budget: $2-5K'],
      'events': ['Concert', 'Exhibition', 'Workshop', 'Networking'],
      'venues': ['Concert Hall', 'Club', 'Theater', 'Outdoor'],
      'brands': ['Record Label', 'Fashion', 'Technology', 'Food & Beverage'],
      'communities': ['Educational', 'Professional', 'Neighborhood', 'Interest-based']
    };
    
    return (contextMap[activeTab as keyof typeof contextMap] || []).filter(tag => allTags.includes(tag));
  };

  const contextTags = getContextTags();

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl flex items-center">
          <Filter className="mr-2 h-5 w-5 text-primary" />
          Filters
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground rounded-full h-8 w-8"
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <Tabs value={filterTab} onValueChange={setFilterTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="main">Main Filters</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="user">User Type</TabsTrigger>
          </TabsList>
          
          {/* Main Filters Tab */}
          <TabsContent value="main" className="space-y-4">
            {/* Category-specific filters */}
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
            
            {/* Multi-select subfilters */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Category Filters</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-2">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Available Filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-80">
                      {availableSubfilters.map((filter) => (
                        <DropdownMenuCheckboxItem
                          key={filter.value}
                          checked={selectedSubfilters.includes(filter.value)}
                          onCheckedChange={() => onSubfilterSelect(filter.value)}
                        >
                          {filter.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {selectedSubfilters.length > 0 ? (
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSubfilterClear}
                    className="text-xs h-7"
                  >
                    Clear all
                  </Button>
                </div>
              ) : (
                <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
                  <p>No filters selected</p>
                  <p className="text-xs mt-1">Use the "Add Filter" button to select filters</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Tags Tab */}
          <TabsContent value="tags" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Popular Tags for {activeTab}</label>
              <div className="flex flex-wrap gap-2 p-3 bg-muted/10 rounded-md">
                {contextTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => onTagSelect(tag)}
                  >
                    {selectedTags.includes(tag) && <Check className="h-3 w-3 mr-1" />}
                    {tag}
                  </Badge>
                ))}
                {contextTags.length === 0 && (
                  <p className="text-sm text-muted-foreground p-2">No context-specific tags available</p>
                )}
              </div>
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
                      onClick={() => onTagSelect(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onTagClear}
                    className="text-xs h-7"
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* User Type Tab */}
          <TabsContent value="user" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">View Content As</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['regular', 'artist', 'venue', 'brand', 'resource'].map((type) => (
                  <Button 
                    key={type}
                    variant={userType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUserTypeChange(type)}
                    className="justify-start h-9"
                  >
                    {userType === type && <Check className="mr-2 h-3 w-3" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="p-3 bg-primary/10 rounded-md">
              <div className="flex items-start gap-2">
                <CircleUserRound className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">
                    Current View: {userType.charAt(0).toUpperCase() + userType.slice(1)}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    This determines how content is recommended to you and what actions are available.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UnifiedFilters;
