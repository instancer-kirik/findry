
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
  const [showChat, setShowChat] = useState<boolean>(false);
  
  // Sample data for different tabs
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

  const spaces = [
    {
      id: "1",
      name: "Downtown Recording Studio",
      type: "space" as const,
      location: "New York, NY",
      tags: ["Studio", "Soundproofed", "200 sq ft"]
    },
    {
      id: "2",
      name: "Artist Collective Gallery",
      type: "space" as const,
      location: "Portland, OR",
      tags: ["Gallery", "Exhibition Space", "1500 sq ft"]
    },
    {
      id: "3",
      name: "Musician's Practice Space",
      type: "space" as const,
      location: "Austin, TX",
      tags: ["Practice Room", "24/7 Access", "150 sq ft"]
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

  // Combined tags for filtering
  const allTags = [
    // Artist tags
    "Vocalist", "R&B", "Soul", "Guitar", "Blues", "Jazz", 
    "Producer", "Electronic", "Hip-Hop", "Rapper",
    
    // Space tags
    "Studio", "Gallery", "Practice Room", "Soundproofed",
    "24/7 Access", "Exhibition Space", "200 sq ft", "1500 sq ft", "150 sq ft",
    
    // Project tags
    "Music Production", "Photography", "Film", "2-Month Timeline",
    "1-Week Timeline", "3-Month Timeline", "Budget: $5-10K",
    "Budget: $2-5K", "Remote Possible"
  ];

  // Filter function based on search query and tags
  const filterItems = (items: any[]) => {
    return items.filter(item => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Tags filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => item.tags.includes(tag));
      
      return matchesSearch && matchesTags;
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

  const getActiveItems = () => {
    switch (activeTab) {
      case "artists":
        return filterItems(artists);
      case "spaces":
        return filterItems(spaces);
      case "projects":
        return filterItems(projects);
      default:
        return [];
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Main Content */}
          <div className="w-full md:w-8/12">
            <AnimatedSection animation="fade-in-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Discover</h1>
            </AnimatedSection>
            
            {/* Search and Filter Bar */}
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

            {/* Selected Tags */}
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

            {/* Filter Panel */}
            {showFilters && (
              <AnimatedSection animation="fade-in-down" delay={200}>
                <MarketplaceFilters 
                  allTags={allTags} 
                  selectedTags={selectedTags} 
                  onTagSelect={handleTagSelect}
                  onClose={() => setShowFilters(false)}
                />
              </AnimatedSection>
            )}

            {/* Tabs */}
            <AnimatedSection animation="fade-in-up" delay={200}>
              <Tabs 
                defaultValue="artists" 
                value={activeTab} 
                onValueChange={handleTabChange}
                className="mb-8"
              >
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="artists">Artists</TabsTrigger>
                  <TabsTrigger value="spaces">Spaces</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>

                <TabsContent value="artists" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterItems(artists).map((artist, index) => (
                      <AnimatedSection 
                        key={artist.id} 
                        animation="fade-in-up" 
                        delay={100 * index}
                      >
                        <ProfileCard 
                          name={artist.name}
                          type={artist.type}
                          location={artist.location}
                          tags={artist.tags}
                        />
                      </AnimatedSection>
                    ))}
                    {filterItems(artists).length === 0 && (
                      <div className="col-span-full text-center py-10">
                        <p className="text-muted-foreground">No artists found matching your filters.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="spaces" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterItems(spaces).map((space, index) => (
                      <AnimatedSection 
                        key={space.id} 
                        animation="fade-in-up" 
                        delay={100 * index}
                      >
                        <ProfileCard 
                          name={space.name}
                          type={space.type}
                          location={space.location}
                          tags={space.tags}
                        />
                      </AnimatedSection>
                    ))}
                    {filterItems(spaces).length === 0 && (
                      <div className="col-span-full text-center py-10">
                        <p className="text-muted-foreground">No spaces found matching your filters.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterItems(projects).map((project, index) => (
                      <AnimatedSection 
                        key={project.id} 
                        animation="fade-in-up" 
                        delay={100 * index}
                      >
                        <ProfileCard 
                          name={project.name}
                          type={project.type}
                          location={project.location}
                          tags={project.tags}
                        />
                      </AnimatedSection>
                    ))}
                    {filterItems(projects).length === 0 && (
                      <div className="col-span-full text-center py-10">
                        <p className="text-muted-foreground">No projects found matching your filters.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </AnimatedSection>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-4/12 space-y-6">
            {/* Saved Items Tracker */}
            <AnimatedSection animation="slide-in-left" delay={200}>
              <SavedItemsTracker />
            </AnimatedSection>

            {/* Chat Component */}
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
