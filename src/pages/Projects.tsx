import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Code, 
  GitPullRequest, 
  BarChart3, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Github, 
  Users,
  Layers,
  PackageOpen
} from 'lucide-react';
import AnimatedSection from '@/components/ui-custom/AnimatedSection';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define types for our development projects
interface DevelopmentTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
}

interface ProjectComponent {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-development' | 'ready' | 'needs-revision';
  type: 'ui' | 'feature' | 'integration' | 'page';
  dependencies?: string[];
}

interface DevelopmentProject {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'development' | 'testing' | 'released' | 'maintenance';
  version: string;
  components: ProjectComponent[];
  tasks: DevelopmentTask[];
  repoUrl?: string;
  progress: number;
  tags: string[];
}

// Sample development projects
const developmentProjects: DevelopmentProject[] = [
  {
    id: '1',
    name: 'Findry Platform Core',
    description: 'The main platform for creative ecosystem connections',
    status: 'development',
    version: '0.5.0',
    progress: 65,
    repoUrl: 'https://github.com/user/findry',
    components: [
      {
        id: 'c1',
        name: 'User Authentication',
        description: 'Login, signup and profile management',
        status: 'ready',
        type: 'feature'
      },
      {
        id: 'c2',
        name: 'Discovery Engine',
        description: 'AI-powered content and collaboration discovery',
        status: 'in-development',
        type: 'feature'
      },
      {
        id: 'c3',
        name: 'Event Management',
        description: 'Create and manage events with bookings',
        status: 'in-development',
        type: 'feature'
      },
      {
        id: 'c4',
        name: 'Venue Profiles',
        description: 'Venue management and bookings',
        status: 'in-development',
        type: 'page'
      }
    ],
    tasks: [
      {
        id: 't1',
        title: 'Fix time-picker component',
        description: 'Create missing time-picker component causing errors',
        status: 'completed',
        priority: 'high'
      },
      {
        id: 't2',
        title: 'Improve venue detail page',
        description: 'Add user-generated content section to venue pages',
        status: 'completed',
        priority: 'medium'
      },
      {
        id: 't3',
        title: 'Implement calendar integration',
        description: 'Connect event bookings with external calendar providers',
        status: 'in-progress',
        priority: 'medium'
      },
      {
        id: 't4',
        title: 'Fix payment gateway',
        description: 'Resolve issues with payment processing',
        status: 'pending',
        priority: 'high'
      }
    ],
    tags: ['core', 'platform', 'features']
  },
  {
    id: '2',
    name: 'Creator Marketplace',
    description: 'Buy and sell creative services and products',
    status: 'planning',
    version: '0.1.0',
    progress: 20,
    components: [
      {
        id: 'c5',
        name: 'Shop Creation',
        description: 'Interface for setting up creator shops',
        status: 'ready',
        type: 'page'
      },
      {
        id: 'c6',
        name: 'Product Listings',
        description: 'Product catalog and management',
        status: 'in-development',
        type: 'feature'
      },
      {
        id: 'c7',
        name: 'Shopping Cart',
        description: 'Cart and checkout functionality',
        status: 'planned',
        type: 'feature'
      }
    ],
    tasks: [
      {
        id: 't5',
        title: 'Design product detail page',
        description: 'Create UI for product details',
        status: 'completed',
        priority: 'medium'
      },
      {
        id: 't6',
        title: 'Implement shopping cart',
        description: 'Build cart functionality with state management',
        status: 'pending',
        priority: 'high'
      }
    ],
    tags: ['marketplace', 'e-commerce', 'creators']
  }
];

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const getStatusColor = (status: DevelopmentTask['status']) => {
    const colors = {
      'pending': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'blocked': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };
  
  const getComponentStatusColor = (status: ProjectComponent['status']) => {
    const colors = {
      'planned': 'bg-purple-100 text-purple-800',
      'in-development': 'bg-amber-100 text-amber-800',
      'ready': 'bg-green-100 text-green-800',
      'needs-revision': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };
  
  const getProjectStatusColor = (status: DevelopmentProject['status']) => {
    const colors = {
      'planning': 'bg-purple-100 text-purple-800',
      'development': 'bg-blue-100 text-blue-800',
      'testing': 'bg-amber-100 text-amber-800',
      'released': 'bg-green-100 text-green-800',
      'maintenance': 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };
  
  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Development Projects</h1>
            <p className="text-muted-foreground">
              Track the progress of platform development and component status
            </p>
          </div>
          <Button>
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="components">
              <Layers className="h-4 w-4 mr-2" />
              Components
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {developmentProjects.map(project => (
                <AnimatedSection key={project.id} animation="fade-in-up" className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <CardDescription>{project.description}</CardDescription>
                        </div>
                        <Badge className={getProjectStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-muted-foreground">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Version</span>
                            <p className="font-medium">{project.version}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Components</span>
                            <p className="font-medium">{project.components.length}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Tasks</span>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{project.tasks.length}</span>
                              <span className="text-xs text-green-600">
                                ({project.tasks.filter(t => t.status === 'completed').length} completed)
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Tags</span>
                            <div className="flex flex-wrap gap-1">
                              {project.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewProject(project.id)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="components">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {developmentProjects.flatMap(project => 
                project.components.map(component => (
                  <Card key={component.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{component.name}</CardTitle>
                          <CardDescription>{component.description}</CardDescription>
                        </div>
                        <Badge className={getComponentStatusColor(component.status)}>
                          {component.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <PackageOpen className="h-4 w-4" />
                        <span>Type: {component.type.charAt(0).toUpperCase() + component.type.slice(1)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Layers className="h-4 w-4" />
                        <span>Project: {project.name}</span>
                      </div>
                    </CardContent>
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${project.progress}%` }}></div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <div className="space-y-6">
              {developmentProjects.map(project => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle>{project.name} Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-3">
                        {project.tasks.map(task => (
                          <div 
                            key={task.id} 
                            className="p-3 border rounded-md flex items-start gap-3"
                          >
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center mt-0.5 ${
                              task.status === 'completed' ? 'bg-green-100' : 
                              task.status === 'in-progress' ? 'bg-blue-100' : 
                              task.status === 'blocked' ? 'bg-red-100' : 'bg-gray-100'
                            }`}>
                              {task.status === 'completed' ? 
                                <CheckCircle2 className="h-3 w-3 text-green-600" /> : 
                                task.status === 'in-progress' ? 
                                <Clock className="h-3 w-3 text-blue-600" /> : 
                                task.status === 'blocked' ? 
                                <AlertCircle className="h-3 w-3 text-red-600" /> : 
                                <Clock className="h-3 w-3 text-gray-600" />
                              }
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h3 className="font-medium">{task.title}</h3>
                                <Badge className={getStatusColor(task.status)}>
                                  {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {task.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                </Badge>
                                {task.assignedTo && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Users className="h-3 w-3" />
                                    <span>{task.assignedTo}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Projects; 