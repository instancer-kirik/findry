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
}

export interface ProjectComponent {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  dueDate?: string;
}

export interface ProjectTask {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
} 