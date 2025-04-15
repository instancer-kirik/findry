import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { useProject } from '@/hooks/use-project';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import ProjectChat, { ReferenceItem } from '@/components/projects/ProjectChat';
import ProjectInteractionProgress from '@/components/projects/ProjectInteractionProgress';
import { useProjectInteractions } from '@/hooks/use-project-interactions';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useGetProject } = useProject();
  const { data: project, isLoading, error } = useGetProject(projectId);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const chatRef = useRef<{ addReference: (item: ReferenceItem) => void }>(null);
  const { updateProjectStatus } = useProjectInteractions({ projectId: projectId || '' });

  useEffect(() => {
    if (!user || !projectId) return;
    
    const checkOwnership = async () => {
      try {
        const { data, error } = await supabase
          .from('content_ownership')
          .select('*')
          .eq('content_id', projectId)
          .eq('content_type', 'project')
          .eq('owner_id', user.id)
          .single();
        
        if (error) {
          console.error('Error checking ownership:', error);
          setIsOwner(false);
          return;
        }
        
        setIsOwner(!!data);
      } catch (err) {
        console.error('Error in ownership check:', err);
        setIsOwner(false);
      }
    };
    
    checkOwnership();
  }, [user, projectId]);

  const handleStatusChange = async (newStatus: Project['status']): Promise<boolean> => {
    if (!project) return false;
    
    if (isOwner) {
      return await updateProjectStatus(project, newStatus);
    } else {
      toast.error('Only the project owner can change the project status');
      return false;
    }
  };

  const handleComponentClick = (componentId: string) => {
    setActiveTab('components');
    setTimeout(() => {
      const element = document.getElementById(`component-${componentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('ring', 'ring-primary', 'ring-opacity-50');
        setTimeout(() => {
          element.classList.remove('ring', 'ring-primary', 'ring-opacity-50');
        }, 2000);
      }
    }, 100);
  };

  const handleTaskClick = (taskId: string) => {
    setActiveTab('tasks');
    setTimeout(() => {
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('ring', 'ring-primary', 'ring-opacity-50');
        setTimeout(() => {
          element.classList.remove('ring', 'ring-primary', 'ring-opacity-50');
        }, 2000);
      }
    }, 100);
  };

  const addReferenceToChat = (item: ReferenceItem) => {
    chatRef.current?.addReference(item);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded-lg mb-6"></div>
            <div className="h-64 bg-muted rounded-lg mb-6"></div>
            <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-muted rounded mb-8"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !project) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <p className="text-muted-foreground">
              {error ? `Error: ${error}` : "This project doesn't exist or has been removed."}
            </p>
            <Button 
              onClick={() => navigate('/projects')} 
              className="mt-4"
            >
              Back to Projects
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-6 flex flex-wrap justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/projects')}
          >
            ← Back to Projects
          </Button>
          
          {isOwner && (
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline">
                Edit Project
              </Button>
              <Button variant="destructive">
                Delete Project
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h1 className="text-3xl font-bold mb-2">{project?.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project?.tags && project.tags.map(tag => (
                    <span key={tag} className="inline-block bg-muted px-2.5 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-muted-foreground mb-6">
                  {project?.description}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Status</h3>
                    <div className="font-medium capitalize">
                      {project?.status.replace('_', ' ')}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Version</h3>
                    <div className="font-medium">
                      {project?.version || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Progress</h3>
                    <div className="font-medium">
                      {project?.progress !== undefined ? `${project.progress}%` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Last Updated</h3>
                    <div className="font-medium">
                      {project?.updatedAt && new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {project && (
                  <ProjectInteractionProgress 
                    project={project} 
                    onMilestoneClick={isOwner ? handleStatusChange : undefined}
                  />
                )}
              </CardContent>
            </Card>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="components">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Components</h2>
                  {isOwner && (
                    <Button size="sm">
                      Add Component
                    </Button>
                  )}
                </div>
                
                {project?.components && project.components.length > 0 ? (
                  <div className="space-y-4">
                    {project.components.map(component => (
                      <Card key={component.id} id={`component-${component.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{component.name}</h3>
                              <div className="text-sm text-muted-foreground mt-1">
                                {component.description}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex gap-2 mb-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  component.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                  component.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                  {component.status.replace('_', ' ')}
                                </span>
                                <span className="text-xs px-2 py-1 bg-muted rounded-full">
                                  {component.type}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {isOwner && (
                                  <Button variant="ghost" size="sm">
                                    Edit
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => addReferenceToChat({
                                    id: component.id,
                                    type: 'component',
                                    name: component.name,
                                    status: component.status
                                  })}
                                >
                                  Reference
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">No components added yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="tasks">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Tasks</h2>
                  {isOwner && (
                    <Button size="sm">
                      Add Task
                    </Button>
                  )}
                </div>
                
                {project?.tasks && project.tasks.length > 0 ? (
                  <div className="space-y-4">
                    {project.tasks.map(task => (
                      <Card key={task.id} id={`task-${task.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{task.title || task.name}</h3>
                              <div className="text-sm text-muted-foreground mt-1">
                                {task.description}
                              </div>
                              {task.assignedTo && (
                                <div className="text-sm mt-2">
                                  <span className="text-muted-foreground">Assigned to: </span>
                                  <span>{task.assignedTo}</span>
                                </div>
                              )}
                              {task.dueDate && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Due: </span>
                                  <span>{task.dueDate}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex gap-2 mb-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                  {task.status.replace('_', ' ')}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {isOwner && (
                                  <Button variant="ghost" size="sm">
                                    Edit
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => addReferenceToChat({
                                    id: task.id,
                                    type: 'task',
                                    name: task.title || task.name,
                                    status: task.status
                                  })}
                                >
                                  Reference
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">No tasks added yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Project Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Owner Type</h3>
                    <div className="font-medium capitalize">
                      {project?.ownerType}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Created</h3>
                    <div className="font-medium">
                      {project?.createdAt && new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Components</h3>
                    <div className="font-medium">
                      {project?.components?.length || 0} components
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Tasks</h3>
                    <div className="font-medium">
                      {project?.tasks?.length || 0} tasks
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {project && (
              <ProjectChat
                ref={chatRef}
                project={project}
                className="sticky top-20"
                onReferenceClick={{
                  component: handleComponentClick,
                  task: handleTaskClick
                }}
                onStatusChange={isOwner ? handleStatusChange : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
