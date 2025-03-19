import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProfileCard from '../components/home/ProfileCard';
import AnimatedSection from '../components/ui-custom/AnimatedSection';
import { Search, Filter, X } from 'lucide-react';
import MarketplaceFilters from '../components/marketplace/MarketplaceFilters';
import MarketplaceChat from '../components/marketplace/MarketplaceChat';
import SavedItemsTracker from '../components/marketplace/SavedItemsTracker';

const Discover: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("artists");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("regular");
  const [resourceType, setResourceType] = useState<string>("all");
  
  const availableTabs = ["artists", "resources", "projects", "events", "brands", "venues"];

  const artists = [
    {
      id: "1",
      name: "Elena Rivera",
      type: "artist" as const,
      location: "Los Angeles, CA",
      tags: ["Vocalist", "R&B", "Soul"]
    },
    {
      id: "2",
      name: "James Wilson",
      type: "artist" as const,
      location: "Chicago, IL",
      tags: ["Guitar", "Blues", "Jazz"]
    },
    {
      id: "3",
      name: "Mia Chen",
      type: "artist" as const,
      location: "New York, NY",
      tags: ["Producer", "Electronic", "Hip-Hop"]
    },
    {
      id: "4",
      name: "Marcus Johnson",
      type: "artist" as const,
      location: "Atlanta, GA",
      tags: ["Rapper", "Hip-Hop", "Producer"]
    }
  ];

  const resources = [
    {
      id: "s1",
      name: "Downtown Recording Studio",
      type: "space" as const,
      location: "New York, NY",
      tags: ["Studio", "Soundproofed", "200 sq ft"]
    },
    {
      id: "s2",
      name: "Artist Collective Gallery",
      type: "space" as const,
      location: "Portland, OR",
      tags: ["Gallery", "Exhibition Space", "1500 sq ft"]
    },
    {
      id: "s3",
      name: "Musician's Practice Space",
      type: "space" as const,
      location: "Austin, TX",
      tags: ["Practice Room", "24/7 Access", "150 sq ft"]
    },
    {
      id: "t1",
      name: "Professional Lighting Kit",
      type: "tool" as const,
      location: "Chicago, IL",
      tags: ["Equipment Available", "Photography"]
    },
    {
      id: "t2",
      name: "Mobile Recording Equipment",
      type: "tool" as const,
      location: "Nashville, TN",
      tags: ["Equipment Available", "Music Production"]
    },
    {
      id: "o1",
      name: "Sound Engineer Services",
      type: "offerer" as const,
      location: "Los Angeles, CA",
      tags: ["Music Production", "Studio"]
    },
    {
      id: "o2",
      name: "Session Musicians Network",
      type: "offerer" as const,
      location: "Nashville, TN",
      tags: ["Music Production", "Jazz", "Blues"]
    }
  ];

  const projects = [
    {
      id: "1",
      name: "Indie Album Recording",
      type: "project" as const,
      location: "Nashville, TN",
      tags: ["Music Production", "2-Month Timeline", "Budget: $5-10K"]
    },
    {
      id: "2",
      name: "Fashion Photography Series",
      type: "project" as const,
      location: "Los Angeles, CA",
      tags: ["Photography", "1-Week Timeline", "Budget: $2-5K"]
    },
    {
      id: "3",
      name: "Documentary Film Editing",
      type: "project" as const,
      location: "Chicago, IL",
      tags: ["Film", "3-Month Timeline", "Remote Possible"]
    }
  ];

  const events = [
    {
      id: "1",
      name: "Summer Music Festival",
      type: "venue" as const,
      location: "Austin, TX",
      tags: ["Concert", "Outdoor", "Multiple Days"]
    },
    {
      id: "2",
      name: "Art Gallery Opening",
      type: "venue" as const,
      location: "New York, NY",
      tags: ["Exhibition", "Networking", "One-Day Event"]
    },
    {
      id: "3",
      name: "Music Industry Workshop",
      type: "venue" as const,
      location: "Los Angeles, CA",
      tags: ["Workshop", "Educational", "Weekend Event"]
    }
  ];

  const brands = [
    {
      id: "1",
      name: "Harmony Records",
      type: "brand" as const,
      location: "Los Angeles, CA",
      tags: ["Record Label", "R&B", "Hip-Hop"]
    },
    {
      id: "2",
      name: "Urban Streetwear",
      type: "brand" as const,
      location: "New York, NY",
      tags: ["Fashion", "Streetwear", "Collaborations"]
    },
    {
      id: "3",
      name: "SoundTech Audio",
      type: "brand" as const,
      location: "Nashville, TN",
      tags: ["Technology", "Audio Equipment", "Sponsorships"]
    }
  ];

  const venues = [
    {
      id: "1",
      name: "The Echo Lounge",
      type: "venue" as const,
      location: "Seattle, WA",
      tags: ["Club", "Live Music", "200 Capacity"]
    },
    {
      id: "2",
      name: "Grand Theater",
      type: "venue" as const,
      location: "Chicago, IL",
      tags: ["Theater", "All Ages", "1000 Capacity"]
    },
    {
      id: "3",
      name: "Sunset Amphitheater",
      type: "venue" as const,
      location: "San Diego, CA",
      tags: ["Outdoor", "Concert", "5000 Capacity"]
    }
  ];

  const allTags = [
    "Vocalist", "R&B", "Soul", "Guitar", "Blues", "Jazz", 
    "Producer", "Electronic", "Hip-Hop", "Rapper",
    
    "Studio", "Gallery", "Practice Room", "Soundproofed",
    "24/7 Access", "Exhibition Space", "200 sq ft", "1500 sq ft", "150 sq ft",
    "Workshop", "Treehouse", "Equipment Available", "Storage",
    
    "Music Production", "Photography", "Film", "2-Month Timeline",
    "1-Week Timeline", "3-Month Timeline", "Budget: $5-10K",
    "Budget: $2-5K", "Remote Possible",
    
    "Concert", "Exhibition", "Workshop", "Networking",
    "Outdoor", "Multiple Days", "One-Day Event", "Weekend Event", "Educational",
    
    "Record Label", "Fashion", "Technology", "Food & Beverage",
    "Streetwear", "Collaborations", "Audio Equipment", "Sponsorships",
    
    "Club", "Theater", "Outdoor", "Live Music", "All Ages",
    "200 Capacity", "1000 Capacity", "5000 Capacity"
  ];

  const filterItems = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = searchQuery === "" || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => item.tags.includes(tag));
      
      const matchesResourceType = activeTab !== "resources" || 
        resourceType === "all" || 
        item.type === resourceType;
      
      return matchesSearch && matchesTags && matchesResourceType;
    });
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleUserTypeChange = (type: string) => {
    setUserType(type);
  };

  const handleResourceTypeChange = (type: string) => {
    setResourceType(type);
  };

  const getActiveItems = () => {
    switch (activeTab) {
      case "artists":
        return filterItems(artists);
      case "resources":
        return filterItems(resources);
      case "projects":
        return filterItems(projects);
      case "events":
        return filterItems(events);
      case "brands":
        return filterItems(brands);
      case "venues":
        return filterItems(venues);
      default:
        return [];
    }
  };

  const getTabLabel = (tab: string) => {
    const labels: Record<string, string> = {
      artists: "Artists",
      resources: "Resources",
      projects: "Projects",
      events: "Events",
      brands: "Brands",
      venues: "Venues"
    };
    return labels[tab] || tab.charAt(0).toUpperCase() + tab.slice(1);
  };

  const getResourceTypeLabel = (item: any) => {
    if (activeTab !== "resources") return null;
    
    const typeLabels: Record<string, string> = {
      space: "Space",
      tool: "Tool/Equipment",
      offerer: "Service Provider",
      other: "Other Resource"
    };
    
    return typeLabels[item.type] || "";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="w-full md:w-8/12">
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

            {showFilters && (
              <AnimatedSection animation="fade-in-down" delay={200}>
                <MarketplaceFilters 
                  allTags={allTags} 
                  selectedTags={selectedTags} 
                  onTagSelect={handleTagSelect}
                  userType={userType}
                  onUserTypeChange={handleUserTypeChange}
                  resourceType={resourceType}
                  onResourceTypeChange={handleResourceTypeChange}
                  onClose={() => setShowFilters(false)}
                />
              </AnimatedSection>
            )}

            <AnimatedSection animation="fade-in-up" delay={150}>
              <div className="mb-6">
                <Badge className="px-3 py-1.5">
                  Viewing as: {userType.charAt(0).toUpperCase() + userType.slice(1)} User
                </Badge>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-in-up" delay={200}>
              <Tabs 
                value={activeTab} 
                onValueChange={handleTabChange}
                className="mb-8"
              >
                <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-6">
                  {availableTabs.map(tab => (
                    <TabsTrigger key={tab} value={tab}>
                      {getTabLabel(tab)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {availableTabs.map(tab => (
                  <TabsContent key={tab} value={tab} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getActiveItems().map((item, index) => (
                        <AnimatedSection 
                          key={item.id} 
                          animation="fade-in-up" 
                          delay={100 * index}
                        >
                          <ProfileCard 
                            name={item.name}
                            type={item.type}
                            location={item.location}
                            tags={item.tags}
                            subtag={getResourceTypeLabel(item)}
                          />
                        </AnimatedSection>
                      ))}
                      {getActiveItems().length === 0 && (
                        <div className="col-span-full text-center py-10">
                          <p className="text-muted-foreground">No {activeTab} found matching your filters.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </AnimatedSection>
          </div>
          
          <div className="w-full md:w-4/12 space-y-6">
            <AnimatedSection animation="slide-in-left" delay={200}>
              <SavedItemsTracker />
            </AnimatedSection>

            <AnimatedSection animation="slide-in-left" delay={300}>
              <MarketplaceChat />
            </AnimatedSection>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Discover;
