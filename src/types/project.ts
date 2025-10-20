export type ProjectOwnershipType =
  | "personal"
  | "brand"
  | "artist"
  | "community";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in_progress" | "completed" | "cancelled";
  version: string;
  progress: number;
  tags: string[];
  components: ProjectComponent[];
  tasks: ProjectTask[];
  ownerType: ProjectOwnershipType;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from the database schema
  budget?: string;
  location?: string;
  timeline?: string;
  type?: string;
  image_url?: string;
  repo_url?: string;
  // New fields for ownership and discovery
  owner_type?: string;
  owner_id?: string;
  created_by?: string;
  is_public?: boolean;
  featured?: boolean;
  view_count?: number;
  like_count?: number;
  // Landing page customization
  landing_page?: ProjectLandingPage;
  has_custom_landing?: boolean;
}

export interface ProjectLandingPage {
  theme: "default" | "minimal" | "showcase" | "hype" | "technical" | "sleek";
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: string;
  hero_video?: string;
  call_to_action?: string;
  cta_link?: string;
  sections: LandingPageSection[];
  social_links?: SocialLink[];
  custom_css?: string;
  background_color?: string;
  text_color?: string;
  accent_color?: string;
}

export interface LandingPageSection {
  id: string;
  type:
    | "text"
    | "gallery"
    | "features"
    | "timeline"
    | "team"
    | "updates"
    | "custom";
  title?: string;
  content?: string;
  order: number;
  visible: boolean;
  config?: Record<string, unknown>;
}

export interface SocialLink {
  platform:
    | "github"
    | "twitter"
    | "discord"
    | "youtube"
    | "instagram"
    | "website"
    | "custom";
  url: string;
  label?: string;
}

export interface ProjectComponent {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  assignedTo?: string;
  dueDate?: string;
  projectId?: string; // Add projectId field
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  assignedTo?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  projectId?: string;
  componentId?: string;
}

export interface ProjectMessage {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  isNotification: boolean;
  reference?: {
    type: "component" | "task";
    id: string;
    name: string;
    status?: string; // Add status field
  };
}

export interface ProjectEvent {
  type:
    | "status_change"
    | "task_update"
    | "component_update"
    | "comment"
    | "member_joined";
  timestamp: string;
  userId: string;
  userName: string;
  details: Record<string, unknown>;
}

export interface ReferenceItem {
  id: string;
  name: string;
  type: string;
  url?: string;
  description?: string;
  version?: string;
  status?: string; // Added status property
}

export type ProjectTaskStatus = "pending" | "in_progress" | "completed";
export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "completed"
  | "cancelled";
