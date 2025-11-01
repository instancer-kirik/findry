import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { Search, ExternalLink, BookOpen, Plus, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
}

interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  category: string;
  examples?: string[];
}

// Sample data
const resources: Resource[] = [
  {
    id: "1",
    title: "Music Industry Directory",
    description: "A comprehensive directory of music industry professionals, venues, and services.",
    url: "https://example.com/music-directory",
    category: "Directories",
    tags: ["music", "industry", "directory"]
  },
  {
    id: "2",
    title: "Artist Resources Hub",
    description: "Collection of tools, templates, and guides for independent artists.",
    url: "https://example.com/artist-resources",
    category: "Tools",
    tags: ["artists", "tools", "templates"]
  },
  {
    id: "3",
    title: "Venue Database",
    description: "Searchable database of performance venues with booking information.",
    url: "https://example.com/venue-db",
    category: "Venues",
    tags: ["venues", "booking", "locations"]
  }
];

const glossaryEntries: GlossaryEntry[] = [
  {
    id: "1",
    term: "Gallery",
    definition: "A space dedicated to the exhibition of visual art, typically owned by an individual or group that displays and sells artwork.",
    category: "Art Spaces",
    examples: ["Contemporary art gallery", "Artist-run gallery space"]
  },
  {
    id: "2",
    term: "Exhibition",
    definition: "A public display of artworks or artistic projects in a gallery, museum, or other venue.",
    category: "Art Events",
    examples: ["Solo exhibition", "Group exhibition"]
  },
  {
    id: "3",
    term: "Curator",
    definition: "A person who selects, organizes, and cares for items in a collection or exhibition.",
    category: "Art Professions",
    examples: ["Museum curator", "Independent curator"]
  }
];

const KnowledgeHub = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const typeParam = searchParams.get("type") || "resources";
  const [activeTab, setActiveTab] = useState(typeParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("type", activeTab);
    setSearchParams(params);
  }, [activeTab]);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery 
      ? resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory ? resource.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const filteredGlossary = glossaryEntries.filter(entry => {
    const matchesSearch = searchQuery 
      ? entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.definition.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory ? entry.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const resourceCategories = Array.from(new Set(resources.map(r => r.category)));
  const glossaryCategories = Array.from(new Set(glossaryEntries.map(e => e.category)));

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Knowledge Hub</h1>
            <p className="text-muted-foreground">
              Explore resources, tools, and terminology for the creative industry
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search knowledge base..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant={selectedCategory ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {user && (
              <Button onClick={() => navigate(activeTab === "resources" ? "/create-resource" : "/glossary/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Add {activeTab === "resources" ? "Resource" : "Term"}
              </Button>
            )}
          </div>

          {/* Category Filter Pills */}
          {(activeTab === "resources" ? resourceCategories : glossaryCategories).length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {(activeTab === "resources" ? resourceCategories : glossaryCategories).map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="glossary">Glossary</TabsTrigger>
            </TabsList>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              {filteredResources.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Resources Found</h2>
                  <p className="text-muted-foreground">
                    {searchQuery ? `No resources matching "${searchQuery}"` : "No resources available"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-primary flex items-center gap-2"
                            >
                              {resource.title}
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </CardTitle>
                        </div>
                        <Badge variant="secondary">{resource.category}</Badge>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {resource.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Glossary Tab */}
            <TabsContent value="glossary" className="space-y-6">
              {filteredGlossary.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Terms Found</h2>
                  <p className="text-muted-foreground">
                    {searchQuery ? `No terms matching "${searchQuery}"` : "No glossary terms available"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGlossary.map((entry) => (
                    <Card key={entry.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{entry.term}</CardTitle>
                        <CardDescription>
                          <Badge variant="secondary" className="mt-1">{entry.category}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 mb-3">
                          {entry.definition}
                        </p>
                        {entry.examples && entry.examples.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Examples:</span> {entry.examples[0]}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-between"
                          onClick={() => navigate(`/glossary/${entry.id}`)}
                        >
                          View Details
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default KnowledgeHub;
