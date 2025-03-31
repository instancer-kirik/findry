
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Tag, Sliders, ListFilter, Check, Music, Palette, Briefcase, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { artistStyleFilters, disciplinaryFilters } from '../discover/DiscoverData';

interface MarketplaceFiltersProps {
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  userType: string;
  onUserTypeChange: (userType: string) => void;
  resourceType: string;
  onResourceTypeChange: (resourceType: string) => void;
  artistStyle?: string;
  onArtistStyleChange?: (style: string) => void;
  disciplinaryType?: string;
  onDisciplinaryTypeChange?: (type: string) => void;
  activeTab?: string;
  onClose: () => void;
}

// Define tag categories with icons for better visual organization
const tagCategoryIcons = {
  'Artist Types': <Music className="h-4 w-4 text-blue-500" />,
  'Genres': <Music className="h-4 w-4 text-indigo-500" />,
  'Styles': <Palette className="h-4 w-4 text-purple-500" />,
  'Multidisciplinary': <Palette className="h-4 w-4 text-pink-500" />,
  'Disciplines': <Briefcase className="h-4 w-4 text-amber-500" />,
  'Resource Types': <Tag className="h-4 w-4 text-emerald-500" />,
  'Resource Features': <Sliders className="h-4 w-4 text-green-500" />,
  'Space Size': <MapPin className="h-4 w-4 text-lime-500" />,
  'Project Types': <Briefcase className="h-4 w-4 text-cyan-500" />,
  'Timeline': <Tag className="h-4 w-4 text-sky-500" />,
  'Budget': <Tag className="h-4 w-4 text-teal-500" />,
  'Events': <Tag className="h-4 w-4 text-rose-500" />,
  'Brand Types': <Tag className="h-4 w-4 text-red-500" />,
  'Venue Types': <Tag className="h-4 w-4 text-orange-500" />
};

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  allTags,
  selectedTags,
  onTagSelect,
  userType,
  onUserTypeChange,
  resourceType,
  onResourceTypeChange,
  artistStyle = "all",
  onArtistStyleChange = () => {},
  disciplinaryType = "all",
  onDisciplinaryTypeChange = () => {},
  activeTab = "",
  onClose
}) => {
  const [filterTab, setFilterTab] = useState<string>("types");
  
  // Group tags by categories for better organization
  const tagCategories = {
    'Artist Types': ['Vocalist', 'Guitar', 'Producer', 'Rapper', 'Performance Artist', 'Visual Artist'],
    'Genres': ['R&B', 'Soul', 'Blues', 'Jazz', 'Electronic', 'Hip-Hop'],
    'Styles': ['Minimalist', 'Abstract', 'Contemporary', 'Traditional', 'Experimental', 'Surrealist', 'Urban', 'Folk'],
    'Multidisciplinary': ['Sound & Visual', 'Performance & Media', 'Installation & Sculpture', 'Digital & Physical', 'Text & Image', 'Movement & Sound'],
    'Disciplines': ['Dance', 'Sculpture', 'Sound Design', 'Video Production', 'Digital Art', 'Music', 'Visual Art'],
    'Resource Types': ['Studio', 'Gallery', 'Practice Room', 'Exhibition Space', 'Workshop', 'Treehouse'],
    'Resource Features': ['Soundproofed', '24/7 Access', 'Equipment Available', 'Storage'],
    'Space Size': ['200 sq ft', '1500 sq ft', '150 sq ft'],
    'Project Types': ['Music Production', 'Photography', 'Film'],
    'Timeline': ['2-Month Timeline', '1-Week Timeline', '3-Month Timeline'],
    'Budget': ['Budget: $5-10K', 'Budget: $2-5K', 'Remote Possible'],
    'Events': ['Concert', 'Exhibition', 'Workshop', 'Networking'],
    'Brand Types': ['Record Label', 'Fashion', 'Technology', 'Food & Beverage'],
    'Venue Types': ['Concert Hall', 'Club', 'Theater', 'Outdoor']
  };

  // Resource type options
  const resourceTypes = [
    { value: "all", label: "All Resources" },
    { value: "space", label: "Spaces" },
    { value: "tool", label: "Tools & Equipment" },
    { value: "offerer", label: "Service Providers" },
    { value: "other", label: "Other Resources" }
  ];

  // Determine which categories to show based on the active tab
  const getRelevantCategories = () => {
    if (activeTab === "artists") {
      return ['Artist Types', 'Genres', 'Styles', 'Multidisciplinary', 'Disciplines'];
    }
    if (activeTab === "resources") {
      return ['Resource Types', 'Resource Features', 'Space Size'];
    }
    if (activeTab === "projects") {
      return ['Project Types', 'Timeline', 'Budget'];
    }
    if (activeTab === "events") {
      return ['Events'];
    }
    if (activeTab === "brands") {
      return ['Brand Types'];
    }
    if (activeTab === "venues") {
      return ['Venue Types'];
    }
    // Default to showing all categories
    return Object.keys(tagCategories);
  };

  const relevantCategories = getRelevantCategories();

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-0 space-y-0">
        <CardTitle className="text-xl flex items-center">
          <ListFilter className="mr-2 h-5 w-5 text-primary" />
          Filters & Tags
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
      
      <Tabs value={filterTab} onValueChange={setFilterTab} className="w-full">
        <div className="px-6 pt-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="types" className="text-xs sm:text-sm">User Types</TabsTrigger>
            <TabsTrigger value="filters" className="text-xs sm:text-sm">Filters</TabsTrigger>
            <TabsTrigger value="tags" className="text-xs sm:text-sm">Tags</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-0">
          <TabsContent value="types" className="m-0 p-6 border-0">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-primary" />
                  I am a...
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['regular', 'artist', 'brand', 'venue', 'resource'].map((type) => (
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
            </div>
          </TabsContent>
          
          <TabsContent value="filters" className="m-0 p-6 border-0">
            <div className="space-y-6">
              {/* Artist Style Selector - only show when on Artists tab */}
              {activeTab === "artists" && (
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Palette className="mr-2 h-4 w-4 text-primary" />
                    Artist Style
                  </h4>
                  <Select value={artistStyle} onValueChange={onArtistStyleChange}>
                    <SelectTrigger className="w-full">
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
              )}

              {/* Disciplinary Type Selector - only show when on Artists tab */}
              {activeTab === "artists" && (
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Briefcase className="mr-2 h-4 w-4 text-primary" />
                    Disciplinary Type
                  </h4>
                  <Select value={disciplinaryType} onValueChange={onDisciplinaryTypeChange}>
                    <SelectTrigger className="w-full">
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
              )}

              {/* Resource Type Selector - only show when on Resources tab */}
              {activeTab === "resources" && (
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-primary" />
                    Resource Type
                  </h4>
                  <Select value={resourceType} onValueChange={onResourceTypeChange}>
                    <SelectTrigger className="w-full">
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
              
              {selectedTags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-primary" />
                    Active Tags
                  </h4>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-md">
                    {selectedTags.map(tag => (
                      <Badge 
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/10 transition-colors"
                        onClick={() => onTagSelect(tag)}
                      >
                        {tag}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTagSelect("")}
                      className="text-xs h-7"
                    >
                      Clear all
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tags" className="m-0 border-0 max-h-[500px]">
            <ScrollArea className="h-[500px]">
              <div className="p-6 space-y-4">
                <Accordion type="multiple" className="w-full">
                  {relevantCategories.map((category) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center text-sm font-medium">
                          {tagCategoryIcons[category]}
                          <span className="ml-2">{category}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {tagCategories[category].filter(tag => allTags.includes(tag)).length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-wrap gap-2 pt-2 pb-4">
                          {tagCategories[category].filter(tag => allTags.includes(tag)).map(tag => (
                            <Badge 
                              key={tag}
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => onTagSelect(tag)}
                            >
                              {tag}
                              {selectedTags.includes(tag) && <X className="ml-1 h-3 w-3" />}
                            </Badge>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </ScrollArea>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default MarketplaceFilters;
