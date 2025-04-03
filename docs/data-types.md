# Discover Page Data Types

## Core Data Types

### ContentItemProps
```typescript
interface ContentItemProps {
  id: string;
  name: string;
  type: string;          // 'artist', 'space', 'tool', 'offerer', 'project', 'event', 'venue', 'community', 'brand'
  subtype: string;       // More specific categorization
  location: string;
  tags: string[];
  image_url?: string;
  multidisciplinary?: boolean;
  styles?: string[];
  disciplines?: string[];
  author?: string;
}
```

### StyleType
```typescript
interface StyleType {
  id: string;
  name: string;
  description: string;
}
```

## Data Collections

### Artist Styles
```typescript
const artistStyles: StyleType[] = [
  { id: "...", name: "Minimalist", description: "..." },
  { id: "...", name: "Abstract", description: "..." },
  // ... other styles
];
```

### Multidisciplinary Types
```typescript
const multidisciplinaryTypes: StyleType[] = [
  { id: "...", name: "Sound & Visual", description: "..." },
  { id: "...", name: "Performance & Media", description: "..." },
  // ... other types
];
```

## Filter Types

### Resource Types
```typescript
interface ResourceType {
  value: string;
  label: string;
}

const resourceTypes: ResourceType[] = [
  { value: "all", label: "All Resources" },
  { value: "space", label: "Spaces" },
  { value: "tool", label: "Tools & Equipment" },
  { value: "offerer", label: "Service Providers" },
  { value: "other", label: "Other Resources" }
];
```

### Artist Style Filters
```typescript
const artistStyleFilters: ResourceType[] = [
  { value: "all", label: "All Styles" },
  { value: "minimalist", label: "Minimalist" },
  // ... other style filters
];
```

### Disciplinary Filters
```typescript
const disciplinaryFilters: ResourceType[] = [
  { value: "all", label: "All Types" },
  { value: "single", label: "Single Discipline" },
  { value: "multi", label: "Multidisciplinary" }
];
```

## Tab Structure

### Available Tabs
```typescript
const availableTabs = [
  "artists",
  "resources",
  "projects",
  "events",
  "venues",
  "communities",
  "brands"
];
```

### Tab Subcategories
```typescript
const tabSubcategories: Record<string, string[]> = {
  artists: ["all", "vocalists", "producers", "instrumentalists", "djs", "composers", "multidisciplinary", "visual artists", "performance artists"],
  resources: ["all", "spaces", "tools", "services", "materials"],
  projects: ["all", "music", "art", "film", "fashion", "tech"],
  events: ["all", "concerts", "exhibitions", "workshops", "festivals", "networking"],
  venues: ["all", "clubs", "concert halls", "theaters", "outdoor", "cafes", "galleries"],
  communities: ["all", "music", "art", "tech", "social", "professional", "interest"],
  brands: ["all", "labels", "equipment", "fashion", "food", "tech", "media"]
};
```

## Component Props

### DiscoverHeader Props
```typescript
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
  resourceType: string;
  onResourceTypeChange: (type: string) => void;
  artistStyle: string;
  onArtistStyleChange: (style: string) => void;
  disciplinaryType: string;
  onDisciplinaryTypeChange: (type: string) => void;
  activeTab: string;
  selectedSubfilters: string[];
  onSubfilterSelect: (filter: string) => void;
  onSubfilterClear: () => void;
}
```

### DiscoverFilters Props
```typescript
interface DiscoverFiltersProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  activeSubTab: string;
  handleSubTabChange: (value: string) => void;
  availableTabs: string[];
  tabSubcategories: Record<string, string[]>;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  getTabLabel: (tab: string) => string;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}
```

## Data Flow

1. **Initial Data Loading**
   - Content items are loaded based on the active tab
   - Filters are initialized with default values

2. **Filter Application**
   - Filters are applied in the following order:
     1. Resource Type (for resources tab)
     2. Artist Style (for artists tab)
     3. Disciplinary Type (for artists tab)
     4. Subtab filtering
     5. Multi-select subfilters

3. **Search Integration**
   - Search query is applied across all content items
   - Results are filtered based on active filters
   - Tags can be used to further refine results

## Best Practices

1. **Data Consistency**
   - Always use the predefined types for content items
   - Ensure all required fields are populated
   - Use consistent naming conventions for types and subtypes

2. **Filter Implementation**
   - Apply filters in a consistent order
   - Handle edge cases for missing data
   - Provide fallback values where appropriate

3. **Performance Considerations**
   - Implement debouncing for search operations
   - Cache filter results when possible
   - Use pagination for large datasets 