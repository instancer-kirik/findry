import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for our projects system
export interface ProjectComponent {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-development' | 'ready' | 'needs-revision';
  type: 'ui' | 'feature' | 'integration' | 'page';
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'development' | 'testing' | 'released' | 'maintenance';
  version: string;
  components: ProjectComponent[];
  tasks: ProjectTask[];
  repoUrl?: string;
  progress: number;
  tags: string[];
}

// Mock data until database tables are created
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Findry Platform Core",
    description: "The core platform for Findry, including user authentication, profiles, and basic functionality.",
    status: "development",
    version: "0.8.5",
    repoUrl: "https://github.com/findry/platform",
    progress: 65,
    tags: ["core", "platform", "authentication"],
    components: [
      {
        id: "comp-1",
        name: "Authentication System",
        description: "User registration, login, and session management",
        status: "ready",
        type: "feature"
      },
      {
        id: "comp-2",
        name: "User Profiles",
        description: "User profile creation and management",
        status: "in-development",
        type: "feature"
      }
    ],
    tasks: [
      {
        id: "task-1",
        title: "Implement password reset",
        description: "Add functionality for users to reset their password",
        status: "completed",
        priority: "high"
      },
      {
        id: "task-2",
        title: "Optimize profile image upload",
        description: "Improve the performance and user experience of profile image uploads",
        status: "in-progress",
        priority: "medium"
      }
    ]
  },
  {
    id: "2",
    name: "Creator Marketplace",
    description: "A marketplace for creators to showcase and sell their work",
    status: "planning",
    version: "0.2.0",
    progress: 25,
    tags: ["marketplace", "creators", "e-commerce"],
    components: [
      {
        id: "comp-3",
        name: "Product Listings",
        description: "Create and manage product listings",
        status: "planned",
        type: "feature"
      },
      {
        id: "comp-4",
        name: "Payment Processing",
        description: "Integration with payment gateways",
        status: "planned",
        type: "integration"
      }
    ],
    tasks: [
      {
        id: "task-3",
        title: "Design product listing UI",
        description: "Create wireframes and mockups for product listings",
        status: "in-progress",
        priority: "high"
      },
      {
        id: "task-4",
        title: "Research payment processors",
        description: "Evaluate different payment processors for integration",
        status: "pending",
        priority: "medium"
      }
    ]
  }
];

export const useProjects = () => {
  const queryClient = useQueryClient();

  // Get all projects
  const useGetProjects = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: async (): Promise<Project[]> => {
        // For now, return mock data
        // This would be replaced with actual API calls once the tables are created
        return MOCK_PROJECTS;
      }
    });
  };
  
  // Get a single project by ID
  const useGetProject = (projectId?: string) => {
    return useQuery({
      queryKey: ['project', projectId],
      queryFn: async (): Promise<Project | null> => {
        if (!projectId) return null;
        
        // For now, return mock data
        const project = MOCK_PROJECTS.find(p => p.id === projectId) || null;
        return project;
      },
      enabled: !!projectId
    });
  };
  
  // Create a new project (mock implementation)
  const useCreateProject = () => {
    return useMutation({
      mutationFn: async (newProject: Omit<Project, 'id'>) => {
        // Mock implementation - in real implementation we would make API calls
        // to create the project in the database
        const projectId = `new-${Date.now()}`;
        
        toast.success('Project created successfully');
        
        // Return the created project ID
        return projectId;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      },
      onError: (error) => {
        toast.error(`Failed to create project: ${error.message}`);
      }
    });
  };
  
  // Update task status (mock implementation)
  const useUpdateTaskStatus = () => {
    return useMutation({
      mutationFn: async ({ taskId, status }: { taskId: string; status: ProjectTask['status'] }) => {
        // Mock implementation - in real implementation we would make API calls
        // to update the task status in the database
        
        toast.success(`Task status updated to ${status}`);
        
        return taskId;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      },
      onError: (error) => {
        toast.error(`Failed to update task: ${error.message}`);
      }
    });
  };
  
  return {
    useGetProjects,
    useGetProject,
    useCreateProject,
    useUpdateTaskStatus
  };
}; 