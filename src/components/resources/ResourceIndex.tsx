import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Resource {
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
}

const resources: Resource[] = [
  {
    title: "Music Industry Directory",
    description: "A comprehensive directory of music industry professionals, venues, and services.",
    url: "https://example.com/music-directory",
    category: "Directories",
    tags: ["music", "industry", "directory"]
  },
  {
    title: "Artist Resources Hub",
    description: "Collection of tools, templates, and guides for independent artists.",
    url: "https://example.com/artist-resources",
    category: "Tools",
    tags: ["artists", "tools", "templates"]
  },
  {
    title: "Venue Database",
    description: "Searchable database of performance venues with booking information.",
    url: "https://example.com/venue-db",
    category: "Venues",
    tags: ["venues", "booking", "locations"]
  },
  {
    title: "Equipment Marketplace",
    description: "Platform for buying, selling, and renting music equipment.",
    url: "https://example.com/equipment-market",
    category: "Marketplace",
    tags: ["equipment", "marketplace", "rental"]
  },
  {
    title: "Event Calendar",
    description: "Aggregated calendar of music events, workshops, and networking opportunities.",
    url: "https://example.com/event-calendar",
    category: "Events",
    tags: ["events", "calendar", "workshops"]
  },
  {
    title: "Industry News",
    description: "Latest news and updates from the music industry.",
    url: "https://example.com/industry-news",
    category: "News",
    tags: ["news", "updates", "industry"]
  }
];

const categories = Array.from(new Set(resources.map(r => r.category)));

export const ResourceIndex = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Resource Index</h1>
        <p className="text-muted-foreground">
          A curated collection of useful resources, tools, and directories for the music industry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
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
                  <Badge variant="secondary" className="mt-2">
                    {resource.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {resource.description}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className={cn(
                      "text-xs",
                      tag === "music" && "bg-blue-100 text-blue-800 border-blue-200",
                      tag === "artists" && "bg-purple-100 text-purple-800 border-purple-200",
                      tag === "venues" && "bg-green-100 text-green-800 border-green-200",
                      tag === "events" && "bg-yellow-100 text-yellow-800 border-yellow-200"
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 