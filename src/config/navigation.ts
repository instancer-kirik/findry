import {
  Compass,
  Calendar,
  Users,
  Plus,
  Route,
  BookOpen,
  MapPin,
  ShoppingCart,
  Wrench,
  Car,
  FolderKanban,
  Briefcase,
  Play,
  Store,
  Scale,
  CircleHelp,
  Mail,
  MessageSquare,
  Layers,
  FileText,
  Users2,
  Sparkles,
  Heart,
  Handshake,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export interface NavCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  featured?: {
    title: string;
    description: string;
    href: string;
    cta: string;
    gradient: string;
  };
  sections: NavSection[];
}

export const navigation: NavCategory[] = [
  {
    id: "explore",
    label: "Explore",
    icon: Compass,
    featured: {
      title: "Discover Creatives",
      description: "Find artists, venues, and brands in your area. Connect with the creative community.",
      href: "/discover",
      cta: "Start Exploring",
      gradient: "from-primary/20 via-primary/10 to-transparent",
    },
    sections: [
      {
        title: "Browse",
        links: [
          { href: "/feed", title: "Feed", description: "Community content & updates", icon: Play },
          { href: "/discover", title: "Browse All", description: "Explore the full directory", icon: Compass },
          { href: "/discover?type=artists", title: "Artists", description: "Creators & collaborators", icon: Sparkles },
          { href: "/discover?type=venues", title: "Venues", description: "Studios & event spaces", icon: MapPin },
        ],
      },
      {
        title: "Marketplace",
        links: [
          { href: "/discover?type=brands", title: "Brands", description: "Companies & orgs", icon: Briefcase },
          { href: "/shops", title: "Shops", description: "Products & gear", icon: Store },
        ],
      },
    ],
  },
  {
    id: "create",
    label: "Create",
    icon: FolderKanban,
    href: "/create",
    featured: {
      title: "Build Together",
      description: "Launch projects, host events, and collaborate with the creative community.",
      href: "/create",
      cta: "Open Create Hub",
      gradient: "from-accent/30 via-accent/15 to-transparent",
    },
    sections: [
      {
        title: "Events",
        links: [
          { href: "/events/upcoming", title: "Upcoming Events", description: "Browse shows & gatherings", icon: Calendar },
          { href: "/events/interested", title: "My Events", description: "Events you're tracking", icon: Heart },
          { href: "/events/create", title: "Create Event", description: "Host your own event", icon: Plus },
        ],
      },
      {
        title: "Projects",
        links: [
          { href: "/projects", title: "All Projects", description: "Community projects", icon: FolderKanban },
          { href: "/communities", title: "Communities", description: "Join groups & circles", icon: Users2 },
          { href: "/collaboration", title: "Collaboration", description: "Manage partnerships", icon: Handshake },
          { href: "/request-service", title: "Request Service", description: "Post service requests", icon: Briefcase },
          { href: "/chats", title: "Messages", description: "Chat with collaborators", icon: MessageSquare },
        ],
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    icon: Wrench,
    featured: {
      title: "Creative Utilities",
      description: "Plan tours, track gear, manage vehicle builds, and organize your creative life.",
      href: "/tour-planner",
      cta: "Plan a Trip",
      gradient: "from-secondary/40 via-secondary/20 to-transparent",
    },
    sections: [
      {
        title: "Planning",
        links: [
          { href: "/travel-locations", title: "Travel Locations", description: "Road resources & POIs", icon: MapPin },
          { href: "/tour-planner", title: "Tour Planner", description: "Plan trips & routes", icon: Route },
          { href: "/shopping-list", title: "Shopping List", description: "Track purchases", icon: ShoppingCart },
        ],
      },
      {
        title: "Organization",
        links: [
          { href: "/gear-packing", title: "Gear Packing", description: "Organize equipment", icon: Briefcase },
          { href: "/vehicle-build", title: "Vehicle Build", description: "Track conversions", icon: Car },
          { href: "/grouper", title: "Grouper", description: "Organize groups", icon: Layers },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    icon: BookOpen,
    sections: [
      {
        title: "Learn",
        links: [
          { href: "/about", title: "About Us", description: "Our mission & story", icon: CircleHelp },
          { href: "/compare", title: "Compare Platforms", description: "See how we're different", icon: Scale },
          { href: "/roadmap", title: "Roadmap", description: "What we're building", icon: Route },
        ],
      },
      {
        title: "Resources",
        links: [
          { href: "/glossary", title: "Glossary", description: "Terms & definitions", icon: BookOpen },
          { href: "/resources", title: "Guides", description: "Help & references", icon: FileText },
          { href: "/contact", title: "Contact", description: "Get in touch", icon: Mail },
        ],
      },
    ],
  },
];

export const mobileNavSections = [
  {
    title: "Discover",
    links: [
      { href: "/feed", title: "Feed", icon: Play },
      { href: "/discover", title: "Browse All", icon: Compass },
      { href: "/discover?type=artists", title: "Artists", icon: Sparkles },
      { href: "/discover?type=venues", title: "Venues", icon: MapPin },
      { href: "/shops", title: "Shops", icon: Store },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "/events/upcoming", title: "Events", icon: Calendar },
      { href: "/projects", title: "Projects", icon: FolderKanban },
      { href: "/communities", title: "Communities", icon: Users2 },
      { href: "/collaboration", title: "Collaboration", icon: Handshake },
      { href: "/chats", title: "Messages", icon: MessageSquare },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/travel-locations", title: "Travel Locations", icon: MapPin },
      { href: "/tour-planner", title: "Tour Planner", icon: Route },
      { href: "/shopping-list", title: "Shopping List", icon: ShoppingCart },
      { href: "/gear-packing", title: "Gear Packing", icon: Briefcase },
      { href: "/vehicle-build", title: "Vehicle Build", icon: Car },
      { href: "/grouper", title: "Grouper", icon: Layers },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", title: "About Us", icon: CircleHelp },
      { href: "/compare", title: "Compare Platforms", icon: Scale },
      { href: "/roadmap", title: "Roadmap", icon: Route },
      { href: "/glossary", title: "Glossary", icon: BookOpen },
      { href: "/resources", title: "Resources", icon: FileText },
      { href: "/contact", title: "Contact", icon: Mail },
    ],
  },
];

export const createActions = [
  { href: "/events/create", title: "Create Event", icon: Plus },
  { href: "/projects/create", title: "Start Project", icon: Plus },
  { href: "/request-service", title: "Request Service", icon: Briefcase },
];
