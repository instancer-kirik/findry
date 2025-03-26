
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { 
  CollaborationProjectProps, 
  ProjectTaskProps,
  CollaboratorProfile 
} from '../components/collaboration/CollaborationPipeline';
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
  ArrowLeft 
} from 'lucide-react';
import AnimatedSection from '../components/ui-custom/AnimatedSection';
import { sampleProjects } from '../components/collaboration/sampleData';
import { toast } from 'sonner';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<CollaborationProjectProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchProject = () => {
      setLoading(true);
      setTimeout(() => {
        const foundProject = sampleProjects.find(p => p.id === projectId);
        if (foundProject) {
          setProject(foundProject);
        } else {
          toast.error("Project not found");
          navigate('/collaboration');
        }
        setLoading(false);
      }, 500);
    };

    fetchProject();
  }, [projectId, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Project Not Found</h1>
          <Button onClick={() => navigate('/collaboration')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collaboration
          </Button>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: ProjectTaskProps['status']) => {
    const colors = {
      'not-started': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'blocked': 'bg-red-100 text-red-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: ProjectTaskProps['priority']) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-amber-100 text-amber-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const getCollaboratorStatusColor = (status: CollaboratorProfile['status']) => {
    const colors = {
      'invited': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'declined': 'bg-red-100 text-red-800',
      'pending': 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/collaboration')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collaboration
        </Button>

        <AnimatedSection animation="fade-in-up" delay={100}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <Badge className="ml-2">{project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}</Badge>
              </div>
              <p className="text-muted-foreground">{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
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
            <Tabs defaultValue="tasks">
              <TabsList className="mb-4">
                <TabsTrigger value="tasks">
                  <CheckSquare className="mr-2 h-4 w-4" /> Tasks
                </TabsTrigger>
                <TabsTrigger value="collaborators">
                  <Users className="mr-2 h-4 w-4" /> Collaborators
                </TabsTrigger>
                <TabsTrigger value="details">
                  <FileText className="mr-2 h-4 w-4" /> Details
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageSquare className="mr-2 h-4 w-4" /> Messages
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="space-y-4">
                {project.tasks.map(task => (
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
                      {task.assignedTo && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Assigned to:</span>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                              <AvatarFallback>{task.assignedTo.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{task.assignedTo.name}</span>
                          </div>
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Due: {task.dueDate}</span>
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
                ))}
              </TabsContent>
              
              <TabsContent value="collaborators" className="space-y-4">
                {project.collaborators.map(collaborator => (
                  <Card key={collaborator.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                          <AvatarFallback>{collaborator.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{collaborator.name}</CardTitle>
                          <CardDescription>
                            {collaborator.role}
                          </CardDescription>
                        </div>
                        <Badge className={`ml-auto ${getCollaboratorStatusColor(collaborator.status)}`}>
                          {collaborator.status.charAt(0).toUpperCase() + collaborator.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        <span className="font-medium">Discipline:</span> {collaborator.discipline}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Message</Button>
                        <Button variant="outline" size="sm">Assign Task</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="details">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Timeline</h3>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>{project.startDate} - {project.endDate || 'Ongoing'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Budget</h3>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>${project.budget?.toLocaleString() || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
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
                        width: `${(project.tasks.filter(t => t.status === 'completed').length / project.tasks.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-right mt-1 text-muted-foreground">
                    {project.tasks.filter(t => t.status === 'completed').length} of {project.tasks.length} tasks completed
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Team</h3>
                  <p className="text-3xl font-bold">{project.collaborators.length}</p>
                  <p className="text-sm text-muted-foreground">Collaborators</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Timeline</h3>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-sm font-medium">Started</p>
                      <p className="text-sm text-muted-foreground">{project.startDate}</p>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200"></div>
                    <div>
                      <p className="text-sm font-medium">Ends</p>
                      <p className="text-sm text-muted-foreground">{project.endDate || 'TBD'}</p>
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
                  <Users className="mr-2 h-4 w-4" /> Manage Collaborators
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CheckSquare className="mr-2 h-4 w-4" /> Task Dashboard
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Project Documents
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" /> Team Chat
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
