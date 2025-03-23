import { ContentItemProps } from '../marketplace/ContentCard';

export interface StyleType {
  id: string;
  name: string;
  description: string;
}

export const artistStyles: StyleType[] = [
  { id: "s1", name: "Minimalist", description: "Simple, uncluttered aesthetics with a focus on essential elements" },
  { id: "s2", name: "Abstract", description: "Non-representational approach focusing on shapes, colors, and textures" },
  { id: "s3", name: "Contemporary", description: "Current, innovative approaches that push boundaries" },
  { id: "s4", name: "Traditional", description: "Time-honored techniques and aesthetic principles" },
  { id: "s5", name: "Experimental", description: "Innovative approaches that challenge conventional methods" },
  { id: "s6", name: "Surrealist", description: "Dreamlike imagery and unexpected juxtapositions" },
  { id: "s7", name: "Urban", description: "Street-influenced aesthetics with cultural commentary" },
  { id: "s8", name: "Folk", description: "Cultural traditions and community-based practices" }
];

export const multidisciplinaryTypes: StyleType[] = [
  { id: "m1", name: "Sound & Visual", description: "Combining auditory and visual elements" },
  { id: "m2", name: "Performance & Media", description: "Live performance integrated with digital media" },
  { id: "m3", name: "Installation & Sculpture", description: "Three-dimensional works in relationship to space" },
  { id: "m4", name: "Digital & Physical", description: "Bridging digital technologies with physical materials" },
  { id: "m5", name: "Text & Image", description: "Integration of written language with visual elements" },
  { id: "m6", name: "Movement & Sound", description: "Choreography and sonic elements in harmony" }
];

export const artists: ContentItemProps[] = [
  {
    id: "1",
    name: "Elena Rivera",
    type: "artist",
    location: "Los Angeles, CA",
    tags: ["Vocalist", "R&B", "Soul", "Contemporary", "Sound & Visual"],
    subtype: "Vocalist",
    multidisciplinary: true,
    styles: ["Contemporary", "Urban"],
    disciplines: ["Music", "Video Production"]
  },
  {
    id: "2",
    name: "James Wilson",
    type: "artist",
    location: "Chicago, IL",
    tags: ["Guitar", "Blues", "Jazz", "Traditional"],
    subtype: "Instrumentalist",
    multidisciplinary: false,
    styles: ["Traditional", "Folk"],
    disciplines: ["Music"]
  },
  {
    id: "3",
    name: "Mia Chen",
    type: "artist",
    location: "New York, NY",
    tags: ["Producer", "Electronic", "Hip-Hop", "Experimental", "Digital & Physical"],
    subtype: "Producer",
    multidisciplinary: true,
    styles: ["Experimental", "Contemporary"],
    disciplines: ["Music Production", "Digital Art"]
  },
  {
    id: "4",
    name: "Marcus Johnson",
    type: "artist",
    location: "Atlanta, GA",
    tags: ["Rapper", "Hip-Hop", "Producer", "Urban"],
    subtype: "Vocalist",
    multidisciplinary: false,
    styles: ["Urban", "Contemporary"],
    disciplines: ["Music"]
  },
  {
    id: "5",
    name: "Sophia Rodriguez",
    type: "artist",
    location: "Miami, FL",
    tags: ["Multimedia", "Performance", "Movement & Sound"],
    subtype: "Performance Artist",
    multidisciplinary: true,
    styles: ["Experimental", "Surrealist"],
    disciplines: ["Dance", "Visual Art", "Music"]
  },
  {
    id: "6",
    name: "David Kim",
    type: "artist",
    location: "Seattle, WA",
    tags: ["Installation", "Sculpture", "Sound", "Installation & Sculpture"],
    subtype: "Visual Artist",
    multidisciplinary: true,
    styles: ["Minimalist", "Abstract"],
    disciplines: ["Sculpture", "Sound Design"]
  }
];

export const resources: ContentItemProps[] = [
  {
    id: "s1",
    name: "Downtown Recording Studio",
    type: "space",
    location: "New York, NY",
    tags: ["Studio", "Soundproofed", "200 sq ft"],
    subtype: "Space"
  },
  {
    id: "s2",
    name: "Artist Collective Gallery",
    type: "space",
    location: "Portland, OR",
    tags: ["Gallery", "Exhibition Space", "1500 sq ft"],
    subtype: "Space"
  },
  {
    id: "s3",
    name: "Musician's Practice Space",
    type: "space",
    location: "Austin, TX",
    tags: ["Practice Room", "24/7 Access", "150 sq ft"],
    subtype: "Space"
  },
  {
    id: "t1",
    name: "Professional Lighting Kit",
    type: "tool",
    location: "Chicago, IL",
    tags: ["Equipment Available", "Photography"],
    subtype: "Tool/Equipment"
  },
  {
    id: "t2",
    name: "Mobile Recording Equipment",
    type: "tool",
    location: "Nashville, TN",
    tags: ["Equipment Available", "Music Production"],
    subtype: "Tool/Equipment"
  },
  {
    id: "o1",
    name: "Sound Engineer Services",
    type: "offerer",
    location: "Los Angeles, CA",
    tags: ["Music Production", "Studio"],
    subtype: "Service Provider"
  },
  {
    id: "o2",
    name: "Session Musicians Network",
    type: "offerer",
    location: "Nashville, TN",
    tags: ["Music Production", "Jazz", "Blues"],
    subtype: "Service Provider"
  }
];

export const projects: ContentItemProps[] = [
  {
    id: "1",
    name: "Indie Album Recording",
    type: "project",
    location: "Nashville, TN",
    tags: ["Music Production", "2-Month Timeline", "Budget: $5-10K"],
    subtype: "Music"
  },
  {
    id: "2",
    name: "Fashion Photography Series",
    type: "project",
    location: "Los Angeles, CA",
    tags: ["Photography", "1-Week Timeline", "Budget: $2-5K"],
    subtype: "Fashion"
  },
  {
    id: "3",
    name: "Documentary Film Editing",
    type: "project",
    location: "Chicago, IL",
    tags: ["Film", "3-Month Timeline", "Remote Possible"],
    subtype: "Film"
  }
];

export const events: ContentItemProps[] = [
  {
    id: "1",
    name: "Summer Music Festival",
    type: "event",
    location: "Austin, TX",
    tags: ["Concert", "Outdoor", "Multiple Days"],
    subtype: "Festival"
  },
  {
    id: "2",
    name: "Art Gallery Opening",
    type: "event",
    location: "New York, NY",
    tags: ["Exhibition", "Networking", "One-Day Event"],
    subtype: "Exhibition"
  },
  {
    id: "3",
    name: "Music Industry Workshop",
    type: "event",
    location: "Los Angeles, CA",
    tags: ["Workshop", "Educational", "Weekend Event"],
    subtype: "Workshop"
  }
];

export const venues: ContentItemProps[] = [
  {
    id: "1",
    name: "The Electric Room",
    type: "venue",
    location: "Brooklyn, NY",
    tags: ["Live Music", "200 Capacity", "Sound System"],
    subtype: "Club"
  },
  {
    id: "2",
    name: "Harmony Concert Hall",
    type: "venue",
    location: "Chicago, IL",
    tags: ["Classical", "400 Capacity", "Grand Piano"],
    subtype: "Concert Hall"
  },
  {
    id: "3",
    name: "Outdoor Amphitheater",
    type: "venue",
    location: "Denver, CO",
    tags: ["Outdoor", "1000 Capacity", "Summer Events"],
    subtype: "Outdoor"
  }
];

export const communities: ContentItemProps[] = [
  {
    id: "1",
    name: "Beat Makers Alliance",
    type: "community",
    location: "Worldwide (Online)",
    tags: ["Music Production", "Collaboration", "200+ Members"],
    subtype: "Music"
  },
  {
    id: "2",
    name: "Art Collective NYC",
    type: "community",
    location: "New York, NY",
    tags: ["Visual Arts", "Exhibitions", "50+ Members"],
    subtype: "Art"
  },
  {
    id: "3",
    name: "Tech Musicians Network",
    type: "community",
    location: "San Francisco, CA",
    tags: ["Music Tech", "Networking", "100+ Members"],
    subtype: "Tech"
  }
];

export const brands: ContentItemProps[] = [
  {
    id: "1",
    name: "Melody Records",
    type: "brand",
    location: "Los Angeles, CA",
    tags: ["Record Label", "Indie", "Distribution"],
    subtype: "Label"
  },
  {
    id: "2",
    name: "Soundwave Audio",
    type: "brand",
    location: "Nashville, TN",
    tags: ["Audio Equipment", "Professional", "Industry"],
    subtype: "Equipment"
  },
  {
    id: "3",
    name: "UrbanWear",
    type: "brand",
    location: "New York, NY",
    tags: ["Fashion", "Streetwear", "Collaborations"],
    subtype: "Fashion"
  }
];

export const allTags: string[] = [
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
  "200 Capacity", "1000 Capacity", "5000 Capacity",
  
  "Visual Arts", "Collaboration", "200+ Members", "50+ Members", "100+ Members",
  "Music Tech", "Classical", "400 Capacity", "Grand Piano", "Sound System",
  
  "Minimalist", "Abstract", "Contemporary", "Traditional", 
  "Experimental", "Surrealist", "Urban", "Folk",
  
  "Sound & Visual", "Performance & Media", "Installation & Sculpture",
  "Digital & Physical", "Text & Image", "Movement & Sound",
  
  "Dance", "Sculpture", "Sound Design", "Video Production", "Digital Art",
  "Multimedia", "Performance Artist", "Visual Artist"
];

export const tabSubcategories: Record<string, string[]> = {
  artists: ["all", "vocalists", "producers", "instrumentalists", "djs", "composers", "multidisciplinary", "visual artists", "performance artists"],
  resources: ["all", "spaces", "tools", "services", "materials"],
  projects: ["all", "music", "art", "film", "fashion", "tech"],
  events: ["all", "concerts", "exhibitions", "workshops", "festivals", "networking"],
  venues: ["all", "clubs", "concert halls", "theaters", "outdoor", "cafes", "galleries"],
  communities: ["all", "music", "art", "tech", "social", "professional", "interest"],
  brands: ["all", "labels", "equipment", "fashion", "food", "tech", "media"]
};

export const availableTabs = ["artists", "resources", "projects", "events", "venues", "communities", "brands"];

export const resourceTypes = [
  { value: "all", label: "All Resources" },
  { value: "space", label: "Spaces" },
  { value: "tool", label: "Tools & Equipment" },
  { value: "offerer", label: "Service Providers" },
  { value: "other", label: "Other Resources" }
];

export const artistStyleFilters = [
  { value: "all", label: "All Styles" },
  { value: "minimalist", label: "Minimalist" },
  { value: "abstract", label: "Abstract" },
  { value: "contemporary", label: "Contemporary" },
  { value: "traditional", label: "Traditional" },
  { value: "experimental", label: "Experimental" },
  { value: "surrealist", label: "Surrealist" },
  { value: "urban", label: "Urban" },
  { value: "folk", label: "Folk" }
];

export const disciplinaryFilters = [
  { value: "all", label: "All Types" },
  { value: "single", label: "Single Discipline" },
  { value: "multi", label: "Multidisciplinary" }
];
