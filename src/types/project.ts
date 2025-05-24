
export type ProjectOwnershipType = 'personal' | 'brand' | 'artist' | 'community';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
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
}

export interface ProjectComponent {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  dueDate?: string;
  projectId?: string; // Add projectId field
}

export interface ProjectTask {
  id: string;
  name: string;
  title?: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  projectId?: string; // Add projectId field
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
    type: 'component' | 'task';
    id: string;
    name: string;
    status?: string; // Add status field
  };
}

export interface ProjectEvent {
  type: 'status_change' | 'task_update' | 'component_update' | 'comment' | 'member_joined';
  timestamp: string;
  userId: string;
  userName: string;
  details: Record<string, any>;
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

export type ProjectTaskStatus = 'pending' | 'in_progress' | 'completed';
export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled';
