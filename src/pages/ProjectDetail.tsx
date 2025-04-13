import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/hooks/use-project';
import { useProject } from '@/hooks/use-project';
import ProjectChat from '@/components/projects/ProjectChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentViewer from '@/components/common/DocumentViewer';
import { roadmapContent } from '@/data/roadmap';
import { supabase } from '@/integrations/supabase/client';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useGetProject, useUpdateProject, useCreateProjectComponent, useUpdateProjectComponent, useCreateProjectTask, useUpdateProjectTask } = useProject();
  const projectChatRef = useRef<{ addReference: (item: any) => void }>(null);
  
  const { data: project, isLoading, error } = useGetProject(id);
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditProjectForm, setShowEditProjectForm] = useState(false);
  const [projectUpdates, setProjectUpdates] = useState({
    name: '',
    description: '',
    status: '',
    version: '',
    progress: 0,
    repoUrl: '',
    timeline: '',
    tags: [] as string[]
  });
  
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState<null | string>(null);
  const [newComponent, setNewComponent] = useState({
    name: '',
    description: '',
    status: 'planned',
    type: 'feature'
  });
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<null | string>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
    dueDate: ''
  });
  
  const updateProject = useUpdateProject();
  const createProjectComponent = useCreateProjectComponent();
  const updateProjectComponent = useUpdateProjectComponent();
  const createProjectTask = useCreateProjectTask();
  const updateProjectTask = useUpdateProjectTask();
  
  // Check if user is owner of the project
  useEffect(() => {
    if (!user || !id) return;
    
    const checkOwnership = async () => {
      try {
        const { data, error } = await supabase
          .from('content_ownership')
          .select('*')
          .eq('content_id', id)
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
  }, [user, id]);
  
  // Set initial values for project edit form when project data is loaded
  useEffect(() => {
    if (project) {
      setProjectUpdates({
        name: project.name,
        description: project.description || '',
        status: project.status || 'planning',
        version: project.version || '0.1.0',
        progress: project.progress || 0,
        repoUrl: project.repoUrl || '',
        timeline: project.timeline || '',
        tags: project.tags || []
      });
    }
  }, [project]);
  
  const handleDeleteProject = async () => {
    if (!isOwner || !id || !user) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to delete this project',
        variant: 'destructive'
      });
      return;
    }
    
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        // First delete all components and tasks
        const { error: componentsError } = await supabase
          .from('project_components')
          .delete()
          .eq('project_id', id);
          
        if (componentsError) throw componentsError;
        
        const { error: tasksError } = await supabase
          .from('project_tasks')
          .delete()
          .eq('project_id', id);
          
        if (tasksError) throw tasksError;
        
        // Then delete the project itself
        const { error: projectError } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
          
        if (projectError) throw projectError;
        
        // Finally delete the ownership record
        const { error: ownershipError } = await supabase
          .from('content_ownership')
          .delete()
          .eq('content_id', id)
          .eq('content_type', 'project');
          
        if (ownershipError) throw ownershipError;
        
        toast.success('Project deleted successfully');
        navigate('/projects');
      } catch (err: any) {
        console.error('Error deleting project:', err);
        toast.error(`Failed to delete project: ${err.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleEditProjectForm = () => {
    setShowEditProjectForm(!showEditProjectForm);
  };
  
  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'progress') {
      // Ensure progress is a number between 0 and 100
      const progress = Math.min(100, Math.max(0, parseInt(value) || 0));
      setProjectUpdates(prev => ({ ...prev, progress }));
    } else if (name === 'tags') {
      // Split comma-separated tags into an array
      const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
      setProjectUpdates(prev => ({ ...prev, tags }));
    } else {
      setProjectUpdates(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmitProjectUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !isOwner) {
      toast({
        title: "Permission Denied",
        description: 'You do not have permission to update this project',
        variant: "destructive"
      });
      return;
    }
    
    try {
      await updateProject.mutateAsync({
        projectId: id,
        updates: {
          name: projectUpdates.name,
          description: projectUpdates.description,
          status: projectUpdates.status as 'planning' | 'development' | 'testing' | 'released' | 'maintenance',
          version: projectUpdates.version,
          progress: projectUpdates.progress,
          repoUrl: projectUpdates.repoUrl,
          timeline: projectUpdates.timeline,
          tags: projectUpdates.tags
        }
      });
      
      setShowEditProjectForm(false);
      toast({
        title: "Success",
        description: "Project updated successfully"
      });
    } catch (err: any) {
      console.error('Error updating project:', err);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update project",
        variant: "destructive"
      });
    }
  };

  const handleComponentReference = (componentId: string) => {
    const component = project?.components.find(c => c.id === componentId);
    if (component) {
      document.getElementById(`component-${componentId}`)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      const element = document.getElementById(`component-${componentId}`);
      if (element) {
        element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }, 2000);
      }
    }
  }
  
  const handleTaskReference = (taskId: string) => {
    const task = project?.tasks.find(t => t.id === taskId);
    if (task) {
      document.getElementById(`task-${taskId}`)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center' 
      });
      
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }, 2000);
      }
    }
  }
  
  const handleToggleComponentForm = () => {
    setShowComponentForm(!showComponentForm);
    setEditingComponent(null);
    setNewComponent({
      name: '',
      description: '',
      status: 'planned',
      type: 'feature'
    });
  };
  
  const handleComponentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewComponent({
      ...newComponent,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmitComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !isOwner) {
      toast({
        title: "Permission Denied",
        description: 'You do not have permission to modify this project',
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editingComponent) {
        await updateProjectComponent.mutateAsync({
          projectId: id,
          componentId: editingComponent,
          updates: {
            name: newComponent.name,
            description: newComponent.description,
            status: newComponent.status as 'planned' | 'in-development' | 'ready' | 'needs-revision',
            type: newComponent.type as 'ui' | 'feature' | 'integration' | 'page'
          }
        });
      } else {
        await createProjectComponent.mutateAsync({
          projectId: id,
          component: {
            name: newComponent.name,
            description: newComponent.description,
            status: newComponent.status as 'planned' | 'in-development' | 'ready' | 'needs-revision',
            type: newComponent.type as 'ui' | 'feature' | 'integration' | 'page'
          }
        });
      }
      
      handleToggleComponentForm();
    } catch (err: any) {
      console.error('Error with component:', err);
      toast({
        title: "Action Failed",
        description: err.message || "Failed to save component",
        variant: "destructive"
      });
    }
  };
  
  const handleEditComponent = (componentId: string) => {
    if (!project) return;
    
    const component = project.components.find(c => c.id === componentId);
    if (!component) return;
    
    setEditingComponent(componentId);
    setNewComponent({
      name: component.name,
      description: component.description || '',
      status: component.status,
      type: component.type
    });
    setShowComponentForm(true);
  };
  
  const handleToggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      assignedTo: '',
      dueDate: ''
    });
  };
  
  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !isOwner) {
      toast({
        title: "Permission Denied",
        description: 'You do not have permission to modify this project',
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editingTask) {
        await updateProjectTask.mutateAsync({
          projectId: id,
          taskId: editingTask,
          updates: {
            title: newTask.title,
            description: newTask.description,
            status: newTask.status as 'pending' | 'in-progress' | 'completed' | 'blocked',
            priority: newTask.priority as 'low' | 'medium' | 'high',
            assignedTo: newTask.assignedTo,
            dueDate: newTask.dueDate
          }
        });
      } else {
        await createProjectTask.mutateAsync({
          projectId: id,
          task: {
            title: newTask.title,
            description: newTask.description,
            status: newTask.status as 'pending' | 'in-progress' | 'completed' | 'blocked',
            priority: newTask.priority as 'low' | 'medium' | 'high',
            assignedTo: newTask.assignedTo,
            dueDate: newTask.dueDate
          }
        });
      }
      
      handleToggleTaskForm();
    } catch (err: any) {
      console.error('Error with task:', err);
      toast({
        title: "Action Failed",
        description: err.message || "Failed to save task",
        variant: "destructive"
      });
    }
  };
  
  const handleEditTask = (taskId: string) => {
    if (!project) return;
    
    const task = project.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setEditingTask(taskId);
    setNewTask({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo || '',
      dueDate: task.dueDate || ''
    });
    setShowTaskForm(true);
  };
  
  useEffect(() => {
    if (showComponentForm) {
      const nameInput = document.getElementById('component-name');
      if (nameInput) {
        setTimeout(() => {
          (nameInput as HTMLElement).focus?.();
        }, 100);
      }
    }
    
    if (showTaskForm) {
      const titleInput = document.getElementById('task-title');
      if (titleInput) {
        setTimeout(() => {
          (titleInput as HTMLElement).focus?.();
        }, 100);
      }
    }
  }, [showComponentForm, showTaskForm]);
  
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
              <Button variant="outline" onClick={handleToggleEditProjectForm}>
                Edit Project
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteProject}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </Button>
            </div>
          )}
        </div>
        
        {showEditProjectForm && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
              <form onSubmit={handleSubmitProjectUpdate}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Project Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={projectUpdates.name}
                      onChange={handleProjectChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={projectUpdates.description}
                      onChange={handleProjectChange}
                      className="w-full p-2 border rounded-md h-24"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={projectUpdates.status}
                        onChange={handleProjectChange}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="planning">Planning</option>
                        <option value="development">Development</option>
                        <option value="testing">Testing</option>
                        <option value="released">Released</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="version" className="block text-sm font-medium mb-1">
                        Version
                      </label>
                      <input
                        id="version"
                        name="version"
                        value={projectUpdates.version}
                        onChange={handleProjectChange}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="progress" className="block text-sm font-medium mb-1">
                        Progress (%)
                      </label>
                      <input
                        id="progress"
                        name="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={projectUpdates.progress}
                        onChange={handleProjectChange}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium mb-1">
                        Timeline
                      </label>
                      <input
                        id="timeline"
                        name="timeline"
                        value={projectUpdates.timeline}
                        onChange={handleProjectChange}
                        placeholder="e.g., Q2 2023 - Q3 2023"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="repoUrl" className="block text-sm font-medium mb-1">
                      Repository URL
                    </label>
                    <input
                      id="repoUrl"
                      name="repoUrl"
                      type="url"
                      value={projectUpdates.repoUrl}
                      onChange={handleProjectChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      id="tags"
                      name="tags"
                      value={projectUpdates.tags.join(', ')}
                      onChange={handleProjectChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleToggleEditProjectForm}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateProject.isPending}
                    >
                      {updateProject.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags && project.tags.map(tag => (
                    <span key={tag} className="inline-block bg-muted px-2.5 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-muted-foreground mb-6">
                  {project.description}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Status</h3>
                    <div className="font-medium capitalize">
                      {project.status}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Version</h3>
                    <div className="font-medium">
                      {project.version || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Progress</h3>
                    <div className="font-medium">
                      {project.progress !== undefined ? `${project.progress}%` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Timeline</h3>
                    <div className="font-medium">
                      {project.timeline || 'N/A'}
                    </div>
                  </div>
                </div>
                
                {project.repoUrl && (
                  <div className="mb-6">
                    <h3 className="text-sm text-muted-foreground mb-1">Repository</h3>
                    <div className="font-medium truncate">
                      <a 
                        href={project.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                      >
                        {project.repoUrl}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Tabs defaultValue="components" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                {project.name === "Findry" && (
                  <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="components">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Components</h2>
                  {isOwner && (
                    <Button
                      size="sm"
                      onClick={handleToggleComponentForm}
                      disabled={showComponentForm}
                    >
                      Add Component
                    </Button>
                  )}
                </div>
                
                {showComponentForm && (
                  <Card className="mb-4">
                    <CardContent className="pt-6">
                      <form onSubmit={handleSubmitComponent}>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label htmlFor="component-name" className="block text-sm font-medium mb-1">
                              Name
                            </label>
                            <input
                              id="component-name"
                              name="name"
                              value={newComponent.name}
                              onChange={handleComponentChange}
                              className="w-full p-2 border rounded-md"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="component-description" className="block text-sm font-medium mb-1">
                              Description
                            </label>
                            <textarea
                              id="component-description"
                              name="description"
                              value={newComponent.description}
                              onChange={handleComponentChange}
                              className="w-full p-2 border rounded-md h-24"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="component-status" className="block text-sm font-medium mb-1">
                                Status
                              </label>
                              <select
                                id="component-status"
                                name="status"
                                value={newComponent.status}
                                onChange={handleComponentChange}
                                className="w-full p-2 border rounded-md"
                              >
                                <option value="planned">Planned</option>
                                <option value="in-development">In Development</option>
                                <option value="ready">Ready</option>
                                <option value="needs-revision">Needs Revision</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="component-type" className="block text-sm font-medium mb-1">
                                Type
                              </label>
                              <select
                                id="component-type"
                                name="type"
                                value={newComponent.type}
                                onChange={handleComponentChange}
                                className="w-full p-2 border rounded-md"
                              >
                                <option value="feature">Feature</option>
                                <option value="ui">UI Component</option>
                                <option value="integration">Integration</option>
                                <option value="page">Page</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleToggleComponentForm}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingComponent ? 'Update' : 'Create'} Component
                            </Button>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
                
                {project.components && project.components.length > 0 ? (
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
                                  component.status === 'ready' ? 'bg-green-100 text-green-800' :
                                  component.status === 'in-development' ? 'bg-blue-100 text-blue-800' :
                                  component.status === 'needs-revision' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {component.status.replace('-', ' ')}
                                </span>
                                <span className="text-xs px-2 py-1 bg-muted rounded-full">
                                  {component.type}
                                </span>
                              </div>
                              {isOwner && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditComponent(component.id)}
                                >
                                  Edit
                                </Button>
                              )}
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
                    <Button
                      size="sm"
                      onClick={handleToggleTaskForm}
                      disabled={showTaskForm}
                    >
                      Add Task
                    </Button>
                  )}
                </div>
                
                {showTaskForm && (
                  <Card className="mb-4">
                    <CardContent className="pt-6">
                      <form onSubmit={handleSubmitTask}>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label htmlFor="task-title" className="block text-sm font-medium mb-1">
                              Title
                            </label>
                            <input
                              id="task-title"
                              name="title"
                              value={newTask.title}
                              onChange={handleTaskChange}
                              className="w-full p-2 border rounded-md"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="task-description" className="block text-sm font-medium mb-1">
                              Description
                            </label>
                            <textarea
                              id="task-description"
                              name="description"
                              value={newTask.description}
                              onChange={handleTaskChange}
                              className="w-full p-2 border rounded-md h-24"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="task-status" className="block text-sm font-medium mb-1">
                                Status
                              </label>
                              <select
                                id="task-status"
                                name="status"
                                value={newTask.status}
                                onChange={handleTaskChange}
                                className="w-full p-2 border rounded-md"
                              >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="blocked">Blocked</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="task-priority" className="block text-sm font-medium mb-1">
                                Priority
                              </label>
                              <select
                                id="task-priority"
                                name="priority"
                                value={newTask.priority}
                                onChange={handleTaskChange}
                                className="w-full p-2 border rounded-md"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="task-assignedTo" className="block text-sm font-medium mb-1">
                                Assigned To
                              </label>
                              <input
                                id="task-assignedTo"
                                name="assignedTo"
                                value={newTask.assignedTo}
                                onChange={handleTaskChange}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="task-dueDate" className="block text-sm font-medium mb-1">
                                Due Date
                              </label>
                              <input
                                id="task-dueDate"
                                name="dueDate"
                                type="date"
                                value={newTask.dueDate}
                                onChange={handleTaskChange}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleToggleTaskForm}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingTask ? 'Update' : 'Create'} Task
                            </Button>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
                
                {project.tasks && project.tasks.length > 0 ? (
                  <div className="space-y-4">
                    {project.tasks.map(task => (
                      <Card key={task.id} id={`task-${task.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{task.title}</h3>
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
                                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                  task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {task.status.replace('-', ' ')}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                              {isOwner && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditTask(task.id)}
                                >
                                  Edit
                                </Button>
                              )}
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
              
              {project.name === "Findry" && (
                <TabsContent value="roadmap">
                  <DocumentViewer 
                    content={roadmapContent} 
                    title="Findry Project Roadmap" 
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>
          
          <div>
            <ProjectChat 
              project={project} 
              onReferenceClick={{
                component: handleComponentReference,
                task: handleTaskReference
              }}
              ref={projectChatRef}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
