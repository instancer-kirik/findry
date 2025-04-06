
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
  PackageOpen,
  Loader2
} from 'lucide-react';
import AnimatedSection from '@/components/ui-custom/AnimatedSection';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProjects, Project, ProjectComponent, ProjectTask } from '@/hooks/use-project';
import { useAuth } from '@/hooks/use-auth';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { useGetProjects } = useProjects();
  const { data: projects, isLoading, error } = useGetProjects();
  const { user } = useAuth();
  
  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-gray-100 text-gray-800',
      'not-started': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'blocked': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  
  const getComponentStatusColor = (status: string) => {
    const colors = {
      'planned': 'bg-purple-100 text-purple-800',
      'in-development': 'bg-amber-100 text-amber-800',
      'ready': 'bg-green-100 text-green-800',
      'needs-revision': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  
  const getProjectStatusColor = (status: string) => {
    const colors = {
      'planning': 'bg-purple-100 text-purple-800',
      'development': 'bg-blue-100 text-blue-800',
      'testing': 'bg-amber-100 text-amber-800',
      'released': 'bg-green-100 text-green-800',
      'maintenance': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-purple-100 text-purple-800';
  };
  
  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  // Helper to get all components from all projects
  const getAllComponents = (): (ProjectComponent & { project: Project })[] => {
    if (!projects) return [];
    
    return projects.flatMap(project => 
      (project.components || []).map(component => ({
        ...component,
        project
      }))
    );
  };

  // Helper to get all tasks from all projects
  const getAllTasks = (): (ProjectTask & { project: Project })[] => {
    if (!projects) return [];
    
    return projects.flatMap(project => 
      (project.tasks || []).map(task => ({
        ...task,
        project
      }))
    );
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Projects</h2>
            <p className="text-red-600">{(error as Error).message}</p>
          </div>
        </div>
      </Layout>
    );
  }
  
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
          <div className="flex gap-2">
            {user && (
              <Button onClick={handleCreateProject}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            )}
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Button>
          </div>
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
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <AnimatedSection key={project.id} animation="fade-in-up" className="h-full">
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{project.name}</CardTitle>
                            <CardDescription>{project.description}</CardDescription>
                          </div>
                          {project.status && (
                            <Badge className={getProjectStatusColor(project.status)}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm text-muted-foreground">{project.progress || 0}%</span>
                            </div>
                            <Progress value={project.progress || 0} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-sm text-muted-foreground">Version</span>
                              <p className="font-medium">{project.version || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-sm text-muted-foreground">Components</span>
                              <p className="font-medium">{project.components?.length || 0}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-sm text-muted-foreground">Tasks</span>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{project.tasks?.length || 0}</span>
                                <span className="text-xs text-green-600">
                                  ({project.tasks?.filter(t => t.status === 'completed').length || 0} completed)
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-sm text-muted-foreground">Tags</span>
                              <div className="flex flex-wrap gap-1">
                                {project.tags && project.tags.map(tag => (
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
            ) : (
              <div className="text-center p-10 border rounded-lg">
                <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first development project to track components and tasks.</p>
                {user && (
                  <Button onClick={handleCreateProject}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="components">
            {getAllComponents().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getAllComponents().map(component => (
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
                        <span className="cursor-pointer hover:underline" onClick={() => handleViewProject(component.project_id)}>
                          Project: {component.project.name}
                        </span>
                      </div>
                    </CardContent>
                    <div 
                      className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/60" 
                      style={{ width: `${component.project.progress || 0}%` }}
                    ></div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-10 border rounded-lg">
                <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Components Yet</h3>
                <p className="text-muted-foreground">Components will appear here when you add them to projects.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tasks">
            {getAllTasks().length > 0 ? (
              <div className="space-y-6">
                {projects?.map(project => (
                  project.tasks && project.tasks.length > 0 && (
                    <Card key={project.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle>{project.name} Tasks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                          <div className="space-y-3">
                            {project.tasks?.map(task => (
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
                                    {task.assigned_to && (
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Users className="h-3 w-3" />
                                        <span>{task.assigned_to}</span>
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
                  )
                ))}
              </div>
            ) : (
              <div className="text-center p-10 border rounded-lg">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Tasks Yet</h3>
                <p className="text-muted-foreground">Tasks will appear here when you add them to projects.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Projects;
