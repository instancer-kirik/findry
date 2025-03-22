
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from 'lucide-react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import MarketplaceFilters from '../marketplace/MarketplaceFilters';

interface DiscoverHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  userType: string;
  handleTagSelect: (tag: string) => void;
}

const DiscoverHeader: React.FC<DiscoverHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTags,
  setSelectedTags,
  showFilters,
  setShowFilters,
  userType,
  handleTagSelect
}) => {
  return (
    <>
      <AnimatedSection animation="fade-in-up">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Discover</h1>
      </AnimatedSection>
      
      <AnimatedSection animation="fade-in-up" delay={100}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by name, location, or tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </AnimatedSection>

      {selectedTags.length > 0 && (
        <AnimatedSection animation="fade-in-up" delay={150}>
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedTags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1 cursor-pointer"
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
                <X className="h-3 w-3" />
              </Badge>
            ))}
            <button
              onClick={() => setSelectedTags([])}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        </AnimatedSection>
      )}

      <AnimatedSection animation="fade-in-up" delay={150}>
        <div className="mb-6">
          <Badge className="px-3 py-1.5">
            Viewing as: {userType.charAt(0).toUpperCase() + userType.slice(1)} User
          </Badge>
        </div>
      </AnimatedSection>
    </>
  );
};

export default DiscoverHeader;
