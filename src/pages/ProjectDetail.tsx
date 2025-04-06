import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarDays, 
  Clock, 
  Users, 
  CheckSquare, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Pencil,
  Plus,
  MapPin,
  Layers
} from 'lucide-react';
import AnimatedSection from '../components/ui-custom/AnimatedSection';
import { toast } from 'sonner';
import { useProjects, ProjectTask, ProjectComponent } from '@/hooks/use-project';
import { useAuth } from '@/hooks/use-auth';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tasks');
  const { useGetProject } = useProjects();
  const { data: project, isLoading, error } = useGetProject(projectId || '');
  const { user } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Button onClick={() => navigate('/projects')} variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
          
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Project Not Found</h2>
            <p className="text-red-600">{error ? (error as Error).message : 'The requested project could not be found.'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'not-started': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'blocked': 'bg-red-100 text-red-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-amber-100 text-amber-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-amber-100 text-amber-800';
  };

  const getComponentStatusColor = (status: string) => {
    const colors = {
      'planned': 'bg-purple-100 text-purple-800',
      'in-development': 'bg-blue-100 text-blue-800',
      'ready': 'bg-green-100 text-green-800',
      'needs-revision': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-purple-100 text-purple-800';
  };

  const calculateProgress = () => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const handleEditProject = () => {
    navigate(`/projects/${project.id}/edit`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/projects')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>

        <AnimatedSection animation="fade-in-up" delay={100}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                {project.status && (
                  <Badge className="ml-2">{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</Badge>
                )}
                {project.version && (
                  <Badge variant="outline">v{project.version}</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {user && (
                <Button variant="outline" onClick={handleEditProject}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit Project
                </Button>
              )}
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" /> Invite Collaborator
              </Button>
              <Button>
                <CheckSquare className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedSection animation="fade-in-up" delay={200} className="md:col-span-2">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="tasks">
                  <CheckSquare className="mr-2 h-4 w-4" /> Tasks
                </TabsTrigger>
                <TabsTrigger value="components">
                  <Layers className="mr-2 h-4 w-4" /> Components
                </TabsTrigger>
                <TabsTrigger value="details">
                  <FileText className="mr-2 h-4 w-4" /> Details
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageSquare className="mr-2 h-4 w-4" /> Messages
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="space-y-4">
                {project.tasks && project.tasks.length > 0 ? (
                  project.tasks.map(task => (
                    <Card key={task.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>
                          {task.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {task.assigned_to && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Assigned to:</span>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{task.assigned_to.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{task.assigned_to}</span>
                            </div>
                          </div>
                        )}
                        {task.due_date && (
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Due: {task.due_date}</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          {task.status !== 'completed' && (
                            <Button size="sm">Mark Complete</Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="mb-4">
                        <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Tasks Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start tracking work by adding tasks to this project.
                      </p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add First Task
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="components" className="space-y-4">
                {project.components && project.components.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.components.map(component => (
                      <Card key={component.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{component.name}</CardTitle>
                            <Badge className={getComponentStatusColor(component.status)}>
                              {component.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Badge>
                          </div>
                          <CardDescription>
                            {component.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">Type:</span>
                            <span className="text-sm">{component.type.charAt(0).toUpperCase() + component.type.slice(1)}</span>
                          </div>
                          
                          {component.dependencies && component.dependencies.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm font-medium block mb-1">Dependencies:</span>
                              <div className="flex flex-wrap gap-1">
                                {component.dependencies.map(dep => (
                                  <Badge key={dep} variant="outline" className="text-xs">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm">Edit Component</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="mb-4">
                        <Layers className="h-12 w-12 mx-auto text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Components Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Define the building blocks of your project by adding components.
                      </p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add First Component
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="details">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Timeline</h3>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>{project.timeline || 'Not specified'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Budget</h3>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{project.budget || 'Not specified'}</span>
                        </div>
                      </div>

                      {project.repo_url && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Repository</h3>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={project.repo_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {project.repo_url}
                            </a>
                          </div>
                        </div>
                      )}

                      {project.location && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Location</h3>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{project.location}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags && project.tags.length > 0 ? (
                          project.tags.map(tag => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No tags</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="messages">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Messages functionality would be implemented here
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-in-up" delay={300} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ 
                        width: `${project.progress || calculateProgress()}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-right mt-1 text-muted-foreground">
                    {project.tasks?.filter(t => t.status === 'completed').length || 0} of {project.tasks?.length || 0} tasks completed
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Components</h3>
                  <p className="text-3xl font-bold">{project.components?.length || 0}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(project.components || []).reduce((counts: Record<string, number>, comp) => {
                      counts[comp.type] = (counts[comp.type] || 0) + 1;
                      return counts;
                    }, {})
                    && Object.entries((project.components || []).reduce((counts: Record<string, number>, comp) => {
                      counts[comp.type] = (counts[comp.type] || 0) + 1;
                      return counts;
                    }, {})).map(([type, count]) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Timeline</h3>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200"></div>
                    <div>
                      <p className="text-sm font-medium">Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.updated_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <CheckSquare className="mr-2 h-4 w-4" /> Add New Task
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Layers className="mr-2 h-4 w-4" /> Add New Component
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={handleEditProject}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit Project Details
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
