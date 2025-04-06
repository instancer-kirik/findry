
import { useEffect, useState } from 'react';
import { Project, ProjectComponent, ProjectTask } from '@/hooks/use-project';

export function useDemoProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemoProject = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Demo data for specific projects
        if (projectId === 'meta-project-tracker') {
          const demoComponents: ProjectComponent[] = [
            {
              id: 'comp-1',
              project_id: 'meta-project-tracker',
              name: 'Project Dashboard',
              description: 'Main dashboard showing project overview and stats',
              status: 'ready',
              type: 'ui',
              dependencies: ['React', 'Recharts']
            },
            {
              id: 'comp-2',
              project_id: 'meta-project-tracker',
              name: 'Component Manager',
              description: 'Interface for managing project components',
              status: 'in-development',
              type: 'feature',
              dependencies: ['React', 'React Hook Form']
            },
            {
              id: 'comp-3',
              project_id: 'meta-project-tracker',
              name: 'Task Tracker',
              description: 'System for tracking tasks and assignments',
              status: 'planned',
              type: 'feature',
              dependencies: ['React', 'Zustand']
            }
          ];

          const demoTasks: ProjectTask[] = [
            {
              id: 'task-1',
              project_id: 'meta-project-tracker',
              title: 'Design project dashboard UI',
              description: 'Create wireframes and mockups for the main dashboard',
              status: 'completed',
              priority: 'high',
              assigned_to: 'Sarah Chen',
              due_date: '2025-04-15'
            },
            {
              id: 'task-2',
              project_id: 'meta-project-tracker',
              title: 'Implement component manager',
              description: 'Build the interface for managing project components',
              status: 'in-progress',
              priority: 'medium',
              assigned_to: 'Alex Johnson',
              due_date: '2025-04-20'
            },
            {
              id: 'task-3',
              project_id: 'meta-project-tracker',
              title: 'Deploy beta version',
              description: 'Release beta version for testing',
              status: 'not-started',
              priority: 'high',
              assigned_to: 'Dev Team',
              due_date: '2025-05-01'
            },
            {
              id: 'task-4',
              project_id: 'meta-project-tracker',
              title: 'Fix database connection issue',
              description: 'Resolve intermittent connection drops',
              status: 'blocked',
              priority: 'high',
              assigned_to: 'Maya Rodriguez',
              due_date: '2025-04-10'
            }
          ];

          setProject({
            id: 'meta-project-tracker',
            name: 'Meta Project Tracker',
            description: 'A comprehensive system for tracking project components, tasks, and progress across development initiatives.',
            status: 'development',
            version: '0.8.0',
            progress: 65,
            repo_url: 'https://github.com/org/meta-project-tracker',
            image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            location: 'Global',
            budget: '$75,000',
            tags: ['react', 'typescript', 'project-management'],
            type: 'Development Tool',
            timeline: '6 months',
            components: demoComponents,
            tasks: demoTasks
          });
        } else if (projectId === 'components-library') {
          // Demo data for Components Library
          setProject({
            id: 'components-library',
            name: 'Components Library',
            description: 'A collection of reusable UI components built with React and Tailwind CSS.',
            status: 'testing',
            version: '1.2.0',
            progress: 85,
            repo_url: 'https://github.com/org/components-library',
            image_url: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            location: 'Frontend',
            tags: ['ui', 'components', 'shadcn'],
            type: 'UI Library',
            timeline: '3 months',
            components: [
              {
                id: 'ui-1',
                project_id: 'components-library',
                name: 'Button System',
                description: 'Comprehensive button system with variants',
                status: 'ready',
                type: 'ui'
              },
              {
                id: 'ui-2',
                project_id: 'components-library',
                name: 'Form Components',
                description: 'Input, select, checkbox components',
                status: 'ready',
                type: 'ui'
              },
              {
                id: 'ui-3',
                project_id: 'components-library',
                name: 'Data Table',
                description: 'Advanced table with sorting and filtering',
                status: 'in-development',
                type: 'ui'
              }
            ],
            tasks: [
              {
                id: 'lib-task-1',
                project_id: 'components-library',
                title: 'Document all components',
                description: 'Create comprehensive documentation',
                status: 'in-progress',
                priority: 'high',
                assigned_to: 'Jordan Taylor'
              },
              {
                id: 'lib-task-2',
                project_id: 'components-library',
                title: 'Accessibility review',
                description: 'Ensure all components meet WCAG guidelines',
                status: 'not-started',
                priority: 'medium',
                assigned_to: 'Pat Lee',
                due_date: '2025-05-15'
              },
              {
                id: 'lib-task-3',
                project_id: 'components-library',
                title: 'Add theme support',
                description: 'Implement dark mode and custom themes',
                status: 'completed',
                priority: 'high',
                assigned_to: 'Morgan Williams',
                due_date: '2025-03-30'
              }
            ]
          });
        } else if (projectId === 'artist-platform') {
          // Demo data for Artist Platform
          setProject({
            id: 'artist-platform',
            name: 'Artist Platform',
            description: 'A platform for artists to showcase their work and connect with potential buyers and collaborators.',
            status: 'planning',
            version: '0.3.0',
            progress: 30,
            image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            location: 'Online',
            budget: '$120,000',
            tags: ['artists', 'portfolio', 'marketplace'],
            type: 'Web Application',
            timeline: '9 months',
            components: [
              {
                id: 'platform-1',
                project_id: 'artist-platform',
                name: 'Artist Profiles',
                description: 'Profile pages for artists',
                status: 'in-development',
                type: 'feature'
              },
              {
                id: 'platform-2',
                project_id: 'artist-platform',
                name: 'Artwork Gallery',
                description: 'Gallery display for artwork',
                status: 'planned',
                type: 'feature'
              },
              {
                id: 'platform-3',
                project_id: 'artist-platform',
                name: 'Payment Processing',
                description: 'Secure payment system for artwork purchases',
                status: 'planned',
                type: 'integration'
              }
            ],
            tasks: [
              {
                id: 'platform-task-1',
                project_id: 'artist-platform',
                title: 'Market research',
                description: 'Research competitor platforms',
                status: 'completed',
                priority: 'high',
                assigned_to: 'Research Team',
                due_date: '2025-03-01'
              },
              {
                id: 'platform-task-2',
                project_id: 'artist-platform',
                title: 'Design artist profile page',
                description: 'Create wireframes and mockups',
                status: 'in-progress',
                priority: 'medium',
                assigned_to: 'Design Team',
                due_date: '2025-04-15'
              },
              {
                id: 'platform-task-3',
                project_id: 'artist-platform',
                title: 'User testing',
                description: 'Conduct user testing sessions',
                status: 'not-started',
                priority: 'medium',
                assigned_to: 'UX Team',
                due_date: '2025-06-01'
              }
            ]
          });
        } else if (projectId === '1') {
          // Mock data for Findry Platform Core
          setProject({
            id: '1',
            name: 'Findry Platform Core',
            description: 'The core platform for Findry, including user authentication, profiles, and basic functionality.',
            status: 'development',
            version: '0.8.5',
            progress: 65,
            repo_url: 'https://github.com/findry/platform',
            location: 'Global',
            budget: '$150,000',
            type: 'Web Platform',
            timeline: '12 months',
            tags: ['core', 'platform', 'authentication'],
            components: [
              {
                id: 'comp-1',
                project_id: '1',
                name: 'Authentication System',
                description: 'User registration, login, and session management',
                status: 'ready',
                type: 'feature'
              },
              {
                id: 'comp-2',
                project_id: '1',
                name: 'User Profiles',
                description: 'User profile creation and management',
                status: 'in-development',
                type: 'feature'
              }
            ],
            tasks: [
              {
                id: 'task-1',
                project_id: '1',
                title: 'Implement password reset',
                description: 'Add functionality for users to reset their password',
                status: 'completed',
                priority: 'high',
                assigned_to: 'Security Team',
                due_date: '2025-03-15'
              },
              {
                id: 'task-2',
                project_id: '1',
                title: 'Optimize profile image upload',
                description: 'Improve the performance and user experience of profile image uploads',
                status: 'in-progress',
                priority: 'medium',
                assigned_to: 'Frontend Team',
                due_date: '2025-04-10'
              },
              {
                id: 'task-3',
                project_id: '1',
                title: 'Implement social login',
                description: 'Add Google and Facebook login options',
                status: 'not-started',
                priority: 'medium',
                assigned_to: 'Auth Team',
                due_date: '2025-05-20'
              }
            ]
          });
        } else if (projectId === '2') {
          // Mock data for Creator Marketplace
          setProject({
            id: '2',
            name: 'Creator Marketplace',
            description: 'A marketplace for creators to showcase and sell their work',
            status: 'planning',
            version: '0.2.0',
            progress: 25,
            location: 'Global',
            budget: '$100,000',
            type: 'Marketplace',
            timeline: '9 months',
            tags: ['marketplace', 'creators', 'e-commerce'],
            components: [
              {
                id: 'comp-3',
                project_id: '2',
                name: 'Product Listings',
                description: 'Create and manage product listings',
                status: 'planned',
                type: 'feature'
              },
              {
                id: 'comp-4',
                project_id: '2',
                name: 'Payment Processing',
                description: 'Integration with payment gateways',
                status: 'planned',
                type: 'integration'
              }
            ],
            tasks: [
              {
                id: 'task-3',
                project_id: '2',
                title: 'Design product listing UI',
                description: 'Create wireframes and mockups for product listings',
                status: 'in-progress',
                priority: 'high',
                assigned_to: 'Design Team',
                due_date: '2025-04-30'
              },
              {
                id: 'task-4',
                project_id: '2',
                title: 'Research payment processors',
                description: 'Evaluate different payment processors for integration',
                status: 'not-started',
                priority: 'medium',
                assigned_to: 'Finance Team',
                due_date: '2025-05-15'
              },
              {
                id: 'task-5',
                project_id: '2',
                title: 'Draft marketplace terms',
                description: 'Create terms of service for marketplace users',
                status: 'completed',
                priority: 'high',
                assigned_to: 'Legal Team',
                due_date: '2025-03-10'
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching demo project:', error);
        setError('Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemoProject();
  }, [projectId]);

  return { project, isLoading, error };
}
