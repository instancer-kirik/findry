
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'development' | 'planning' | 'released' | 'maintenance' | 'testing';
  version: string;
  repo_url: string | null;
  progress: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectComponent {
  id: string;
  project_id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-development' | 'ready' | 'needs-revision';
  type: string;
  dependencies: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assigned_to: string | null;
  due_date: string;
  created_at: string;
  updated_at: string;
}

const mapComponentStatus = (status: string): 'planned' | 'in-development' | 'ready' | 'needs-revision' => {
  switch (status) {
    case 'planned': return 'planned';
    case 'in-development': return 'in-development';
    case 'ready': return 'ready';
    default: return 'needs-revision';
  }
};

const mapTaskStatus = (status: string): 'not-started' | 'in-progress' | 'completed' | 'blocked' => {
  switch (status) {
    case 'not-started': return 'not-started';
    case 'in-progress': return 'in-progress';
    case 'completed': return 'completed';
    default: return 'blocked';
  }
};

const mapTaskPriority = (priority: string): 'low' | 'medium' | 'high' => {
  switch (priority) {
    case 'low': return 'low';
    case 'high': return 'high';
    default: return 'medium';
  }
};

export const useDemoProject = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [components, setComponents] = useState<ProjectComponent[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemoProject = async () => {
      try {
        // This is demo data - in a real app, this would come from an API
        const now = new Date().toISOString();
        
        const demoProject: Project = {
          id: projectId,
          name: 'Findry Platform Core',
          description: 'The main platform for creative ecosystem connections',
          status: 'development',
          version: '0.5.0',
          repo_url: 'https://github.com/user/findry',
          progress: 65,
          tags: ['core', 'platform', 'features'],
          created_at: now,
          updated_at: now
        };

        const demoComponents: ProjectComponent[] = [
          {
            id: uuidv4(),
            project_id: projectId,
            name: 'User Authentication',
            description: 'Login, signup and profile management',
            status: mapComponentStatus('ready'),
            type: 'feature',
            dependencies: [],
            created_at: now,
            updated_at: now
          },
          {
            id: uuidv4(),
            project_id: projectId,
            name: 'Discovery Engine',
            description: 'AI-powered content and collaboration discovery',
            status: mapComponentStatus('in-development'),
            type: 'feature',
            dependencies: [],
            created_at: now,
            updated_at: now
          },
          {
            id: uuidv4(),
            project_id: projectId,
            name: 'Event Management',
            description: 'Create and manage events with bookings',
            status: mapComponentStatus('in-development'),
            type: 'feature',
            dependencies: [],
            created_at: now,
            updated_at: now
          }
        ];

        const demoTasks: ProjectTask[] = [
          {
            id: uuidv4(),
            project_id: projectId,
            title: 'Fix time-picker component',
            description: 'Create missing time-picker component causing errors',
            status: mapTaskStatus('completed'),
            priority: mapTaskPriority('high'),
            assigned_to: 'Sarah',
            due_date: now,
            created_at: now,
            updated_at: now
          },
          {
            id: uuidv4(),
            project_id: projectId,
            title: 'Improve venue detail page',
            description: 'Add user-generated content section to venue pages',
            status: mapTaskStatus('completed'),
            priority: mapTaskPriority('medium'),
            assigned_to: 'Mike',
            due_date: now,
            created_at: now,
            updated_at: now
          },
          {
            id: uuidv4(),
            project_id: projectId,
            title: 'Implement calendar integration',
            description: 'Connect event bookings with external calendar providers',
            status: mapTaskStatus('in-progress'),
            priority: mapTaskPriority('medium'),
            assigned_to: 'Alex',
            due_date: now,
            created_at: now,
            updated_at: now
          }
        ];

        setProject(demoProject);
        setComponents(demoComponents);
        setTasks(demoTasks);
      } catch (err) {
        setError('Failed to load project data');
        console.error('Error loading project data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemoProject();
  }, [projectId]);

  return { project, components, tasks, loading, error };
};
