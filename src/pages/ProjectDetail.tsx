import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useProjects, Project, ProjectComponent, ProjectTask } from '@/hooks/use-project';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, Github, Clock, ArrowLeft, Plus, Edit, MessageCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import ProjectChat from '@/components/projects/ProjectChat';
import { useProjectChat } from '@/hooks/use-project-chat';

const componentSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(2, { message: "Description is required." }),
  status: z.enum(["planned", "in-development", "ready", "needs-revision"]),
  type: z.enum(["ui", "feature", "integration", "page"]),
});

const taskSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(2, { message: "Description is required." }),
  status: z.enum(["pending", "in-progress", "completed", "blocked"]),
  priority: z.enum(["low", "medium", "high"]),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
});

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id || '';
  
  console.log("URL params:", params);
  const navigate = useNavigate();
  const location = useLocation();
  const { useGetProject, useCreateProjectComponent, useUpdateProjectComponent, useCreateProjectTask, useUpdateProjectTask } = useProjects();
  
  const searchParams = new URLSearchParams(window.location.search);
  const source = searchParams.get('source') || undefined;
  
  console.log("Project ID from URL:", id);
  console.log("Source from URL:", source);
  
  const { data: project, isLoading, error } = useGetProject(id, source);
  
  console.log("Project ID:", id);
  console.log("Source:", source);
  console.log("Project data:", project);
  console.log("Error:", error);
  
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromQuery || 'overview');
  const [selectedComponent, setSelectedComponent] = useState<ProjectComponent | null>(null);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [isComponentDialogOpen, setIsComponentDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  
  const createComponent = useCreateProjectComponent();
  const updateComponent = useUpdateProjectComponent();
  const createTask = useCreateProjectTask();
  const updateTask = useUpdateProjectTask();
  
  const componentForm = useForm<z.infer<typeof componentSchema>>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "planned",
      type: "feature",
    },
  });
  
  const taskForm = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      assignedTo: "",
      dueDate: "",
    },
  });
  
  const { sendProjectUpdate } = useProjectChat({
    projectId: project?.id || '',
    projectName: project?.name || 'Project'
  });

  useEffect(() => {
    if (tabFromQuery && ['overview', 'components', 'tasks', 'chat'].includes(tabFromQuery)) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = `${location.pathname}?tab=${value}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const onComponentSubmit = async (values: z.infer<typeof componentSchema>) => {
    setIsComponentDialogOpen(false);
    
    try {
      if (selectedComponent) {
        await updateComponent.mutateAsync({
          projectId: id,
          componentId: selectedComponent.id,
          updates: values
        });
        
        toast.success("Component updated successfully!");
        
        if (sendProjectUpdate) {
          await sendProjectUpdate(`Component "${values.name}" updated`);
        }
      } else {
        const newComponent: Omit<ProjectComponent, "id"> = {
          name: values.name,
          description: values.description,
          status: values.status,
          type: values.type,
          project_id: id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        await createComponent.mutateAsync({
          projectId: id,
          component: newComponent
        });
        
        toast.success("Component added successfully!");
        
        if (sendProjectUpdate) {
          await sendProjectUpdate(`New component "${values.name}" added`);
        }
      }
      
      setSelectedComponent(null);
      componentForm.reset();
    } catch (error) {
      console.error('Error saving component:', error);
      toast.error("Failed to save component. Please try again.");
    }
  };

  const onTaskSubmit = async (values: z.infer<typeof taskSchema>) => {
    setIsTaskDialogOpen(false);
    
    try {
      if (selectedTask) {
        await updateTask.mutateAsync({
          projectId: id,
          taskId: selectedTask.id,
          updates: values
        });
        
        toast.success("Task updated successfully!");
        
        if (sendProjectUpdate && selectedTask.status !== values.status) {
          await sendProjectUpdate(`Task "${values.title}" status changed to ${values.status}`);
        } else if (sendProjectUpdate) {
          await sendProjectUpdate(`Task "${values.title}" updated`);
        }
      } else {
        const newTask: Omit<ProjectTask, "id"> = {
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          assignedTo: values.assignedTo || null,
          due_date: values.dueDate || null,
          project_id: id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        await createTask.mutateAsync({
          projectId: id,
          task: newTask
        });
        
        toast.success("Task added successfully!");
        
        if (sendProjectUpdate) {
          await sendProjectUpdate(`New task "${values.title}" added`);
        }
      }
      
      setSelectedTask(null);
      taskForm.reset();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error("Failed to save task. Please try again.");
    }
  };

  const openComponentDialog = (component?: ProjectComponent) => {
    if (component) {
      setSelectedComponent(component);
      componentForm.reset({
        name: component.name,
        description: component.description,
        status: component.status,
        type: component.type,
      });
    } else {
      setSelectedComponent(null);
      componentForm.reset();
    }
    setIsComponentDialogOpen(true);
  };

  const openTaskDialog = (task?: ProjectTask) => {
    if (task) {
      setSelectedTask(task);
      taskForm.reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo || "",
        dueDate: task.dueDate || "",
      });
    } else {
      setSelectedTask(null);
      taskForm.reset();
    }
    setIsTaskDialogOpen(true);
  };

  const handleBack = () => {
    if (project?.source === 'discover') {
      navigate('/discover?tab=projects');
    } else {
      navigate('/projects');
    }
  };

  const projectChatRef = useRef<any>(null);

  const addComponentReference = (component: ProjectComponent) => {
    if (projectChatRef.current) {
      projectChatRef.current.addReference({
        id: component.id,
        type: 'component',
        name: component.name,
        status: component.status
      });
    }
  };

  const addTaskReference = (task: ProjectTask) => {
    if (projectChatRef.current) {
      projectChatRef.current.addReference({
        id: task.id,
        type: 'task',
        name: task.title,
        status: task.status
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Project</h1>
          <p className="mb-4">We couldn't load the project details. Please try again later.</p>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'planning': 'bg-blue-100 text-blue-800',
      'development': 'bg-yellow-100 text-yellow-800',
      'testing': 'bg-purple-100 text-purple-800',
      'released': 'bg-green-100 text-green-800',
      'maintenance': 'bg-gray-100 text-gray-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getComponentStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'planned': 'bg-blue-100 text-blue-800',
      'in-development': 'bg-yellow-100 text-yellow-800',
      'ready': 'bg-green-100 text-green-800',
      'needs-revision': 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getTaskStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'blocked': 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getTaskPriorityColor = (priority: string) => {
    const priorityMap: Record<string, string> = {
      'low': 'bg-blue-100 text-blue-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800',
    };
    return priorityMap[priority] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    if (isComponentDialogOpen && !selectedComponent) {
      const element = document.getElementById('component-name-input');
      if (element instanceof HTMLElement) {
        element.focus();
      }
    }
  }, [isComponentDialogOpen, selectedComponent]);

  useEffect(() => {
    if (isTaskDialogOpen && !selectedTask) {
      const element = document.getElementById('task-title-input');
      if (element instanceof HTMLElement) {
        element.focus();
      }
    }
  }, [isTaskDialogOpen, selectedTask]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`${getStatusColor(project.status)} px-3 py-1 text-sm font-medium rounded-full`}>
              {project.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={project.progress} className={getProgressColor(project.progress)} />
              <p className="text-sm text-muted-foreground">{project.progress}% Complete</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Version</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
              v{project.version}
            </Badge>
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-500 hover:text-gray-700">
                <Github size={18} />
              </a>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Description</h2>
        <p className="text-gray-700">{project.description}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {project.tags && project.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1 text-sm font-medium">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="chat">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
                <CardDescription>Key components in this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.components && project.components.length > 0 ? (
                    project.components.slice(0, 3).map((component) => (
                      <div key={component.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{component.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{component.description}</p>
                        </div>
                        <Badge className={`${getComponentStatusColor(component.status)}`}>
                          {component.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No components added yet</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('components')}>
                  View All Components
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Current tasks in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.tasks && project.tasks.length > 0 ? (
                    project.tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                        </div>
                        <Badge className={`${getTaskStatusColor(task.status)}`}>
                          {task.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No tasks added yet</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('tasks')}>
                  View All Tasks
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Components</h2>
            <Button onClick={() => openComponentDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add Component
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.components && project.components.length > 0 ? (
              project.components.map((component) => (
                <Card key={component.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{component.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openComponentDialog(component)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Badge className={getComponentStatusColor(component.status)}>
                      {component.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{component.description}</p>
                    <Badge variant="outline">{component.type}</Badge>
                  </CardContent>
                  <div className="flex justify-between items-center mt-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        handleTabChange('chat');
                        addComponentReference(component);
                        setTimeout(() => {
                          document.querySelector('.project-chat-input')?.focus();
                        }, 100);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground mb-4">No components added to this project yet</p>
                <Button onClick={() => openComponentDialog()}>Add First Component</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tasks</h2>
            <Button onClick={() => openTaskDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {project.tasks && project.tasks.length > 0 ? (
              project.tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{task.title}</CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openTaskDialog(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getTaskStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <Badge className={getTaskPriorityColor(task.priority)}>
                        {task.priority} priority
                      </Badge>
                      {task.dueDate && (
                        <Badge variant="outline">
                          <Clock className="mr-1 h-3 w-3" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Badge>
                      )}
                      {task.assignedTo && (
                        <Badge variant="outline">
                          <Avatar className="h-4 w-4 mr-1">
                            <AvatarFallback>{task.assignedTo.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {task.assignedTo}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <div className="flex justify-between items-center mt-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        handleTabChange('chat');
                        addTaskReference(task);
                        setTimeout(() => {
                          document.querySelector('.project-chat-input')?.focus();
                        }, 100);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tasks added to this project yet</p>
                <Button onClick={() => openTaskDialog()}>Add First Task</Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="chat">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ProjectChat 
                ref={projectChatRef}
                project={project} 
                onReferenceClick={{
                  component: (componentId) => {
                    const component = project.components?.find(c => c.id === componentId);
                    if (component) {
                      setSelectedComponent(component);
                      setIsComponentDialogOpen(true);
                    }
                  },
                  task: (taskId) => {
                    const task = project.tasks?.find(t => t.id === taskId);
                    if (task) {
                      setSelectedTask(task);
                      setIsTaskDialogOpen(true);
                    }
                  }
                }}
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Project Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.contributors ? (
                      project.contributors.map((contributor, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{contributor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{contributor.name}</p>
                            <p className="text-sm text-muted-foreground">{contributor.role}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>YO</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">You</p>
                          <p className="text-sm text-muted-foreground">Owner</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isComponentDialogOpen} onOpenChange={setIsComponentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedComponent ? 'Edit Component' : 'Add Component'}</DialogTitle>
            <DialogDescription>
              {selectedComponent ? 'Update the component details.' : 'Add a new component to your project.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...componentForm}>
            <form onSubmit={componentForm.handleSubmit(onComponentSubmit)} className="space-y-4">
              <FormField
                control={componentForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Component name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={componentForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the component..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={componentForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="in-development">In Development</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="needs-revision">Needs Revision</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={componentForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ui">UI</SelectItem>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="integration">Integration</SelectItem>
                          <SelectItem value="page">Page</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsComponentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedComponent ? 'Update Component' : 'Add Component'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
            <DialogDescription>
              {selectedTask ? 'Update the task details.' : 'Add a new task to your project.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...taskForm}>
            <form onSubmit={taskForm.handleSubmit(onTaskSubmit)} className="space-y-4">
              <FormField
                control={taskForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={taskForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the task..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={taskForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={taskForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={taskForm.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <FormControl>
                        <Input placeholder="Username or email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={taskForm.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsTaskDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedTask ? 'Update Task' : 'Add Task'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
