
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Filters</CardTitle>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* User Type Selection */}
          <div>
            <h4 className="text-sm font-medium mb-3">I am a...</h4>
            <RadioGroup 
              value={userType} 
              onValueChange={onUserTypeChange}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular">Regular User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="artist" id="artist" />
                <Label htmlFor="artist">Artist</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="brand" id="brand" />
                <Label htmlFor="brand">Brand</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="venue" id="venue" />
                <Label htmlFor="venue">Venue</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resource" id="resource" />
                <Label htmlFor="resource">Resource Provider</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Artist Style Selector - only show when on Artists tab */}
          {activeTab === "artists" && (
            <div>
              <h4 className="text-sm font-medium mb-3">Artist Style</h4>
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
              <h4 className="text-sm font-medium mb-3">Disciplinary Type</h4>
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
              <h4 className="text-sm font-medium mb-3">Resource Type</h4>
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

          {/* Tags by Category */}
          <div className="space-y-4">
            {relevantCategories.map((category) => (
              <div key={category}>
                <h4 className="text-sm font-medium mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {tagCategories[category].filter(tag => allTags.includes(tag)).map(tag => (
                    <Badge 
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => onTagSelect(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceFilters;
