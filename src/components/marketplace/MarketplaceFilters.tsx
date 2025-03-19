
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface MarketplaceFiltersProps {
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onClose: () => void;
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  allTags,
  selectedTags,
  onTagSelect,
  onClose
}) => {
  // Group tags by categories for better organization
  const tagCategories = {
    'Artist Types': ['Vocalist', 'Guitar', 'Producer', 'Rapper'],
    'Genres': ['R&B', 'Soul', 'Blues', 'Jazz', 'Electronic', 'Hip-Hop'],
    'Space Types': ['Studio', 'Gallery', 'Practice Room', 'Exhibition Space'],
    'Space Features': ['Soundproofed', '24/7 Access'],
    'Space Size': ['200 sq ft', '1500 sq ft', '150 sq ft'],
    'Project Types': ['Music Production', 'Photography', 'Film'],
    'Timeline': ['2-Month Timeline', '1-Week Timeline', '3-Month Timeline'],
    'Budget': ['Budget: $5-10K', 'Budget: $2-5K', 'Remote Possible']
  };

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
        <div className="space-y-4">
          {Object.entries(tagCategories).map(([category, tags]) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {tags.filter(tag => allTags.includes(tag)).map(tag => (
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
      </CardContent>
    </Card>
  );
};

export default MarketplaceFilters;
