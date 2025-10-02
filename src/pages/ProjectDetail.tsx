import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, CheckCircle2, Wrench } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useProject } from "@/hooks/use-project";
import { useProjectInteractions } from "@/hooks/use-project-interactions";
import { Project, ProjectComponent, ProjectTask } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";
import ProjectChat, { ReferenceItem } from "@/components/projects/ProjectChat";
import ProjectInteractionProgress from "@/components/projects/ProjectInteractionProgress";
import ProjectHeader from "@/components/projects/detail/ProjectHeader";
import EnhancedProjectComponent from "@/components/projects/detail/EnhancedProjectComponent";
import EnhancedTaskCard from "@/components/projects/detail/EnhancedTaskCard";
import ComponentDialog from "@/components/projects/detail/ComponentDialog";
import TaskDialog from "@/components/projects/detail/TaskDialog";
import VehicleBuildProject from "@/components/projects/VehicleBuildProject";
import ProductLandingPage from "@/components/projects/ProductLandingPage";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useGetProject } = useProject();
  const { data: project, isLoading, error, refetch } = useGetProject(projectId);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState("components");
  const chatRef = useRef<{ addReference: (item: ReferenceItem) => void }>(null);

  const {
    updateProjectStatus,
    addProjectComponent,
    updateProjectComponent,
    addProjectTask,
    updateProjectTask,
    updateProjectProgress,
    isAddingComponent,
    isAddingTask,
    isEditingComponent,
    isEditingTask,
  } = useProjectInteractions({ projectId: projectId || "" });

  // Component dialog state
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] =
    useState<ProjectComponent | null>(null);
  const [newComponent, setNewComponent] = useState<Partial<ProjectComponent>>({
    name: "",
    description: "",
    type: "",
    status: "pending",
    assignedTo: "",
    dueDate: "",
  });

  // Task dialog state
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
  });

  // Progress dialog state
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [newProgress, setNewProgress] = useState<number>(0);

  useEffect(() => {
    if (!user || !projectId) return;

    const checkOwnership = async () => {
      try {
        const { data, error } = await supabase
          .from("content_ownership")
          .select("*")
          .eq("content_id", projectId)
          .eq("content_type", "project")
          .eq("owner_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking ownership:", error);
          setIsOwner(false);
          return;
        }

        setIsOwner(!!data);
      } catch (err) {
        console.error("Error in ownership check:", err);
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [user, projectId]);

  useEffect(() => {
    if (project) {
      setNewProgress(project.progress || 0);
    }
  }, [project]);

  const addReferenceToChat = (item: ReferenceItem) => {
    if (chatRef.current) {
      chatRef.current.addReference(item);
    }
  };

  const handleComponentClick = (componentId: string) => {
    const element = document.getElementById(`component-${componentId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      element.classList.add("ring-2", "ring-blue-500", "ring-opacity-50");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-blue-500", "ring-opacity-50");
      }, 2000);
    }
  };

  const handleTaskClick = (taskId: string) => {
    const element = document.getElementById(`task-${taskId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      element.classList.add("ring-2", "ring-green-500", "ring-opacity-50");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-green-500", "ring-opacity-50");
      }, 2000);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!project || !isOwner) {
      toast.error("Only the project owner can change the project status");
      return;
    }

    const success = await updateProjectStatus(project, newStatus as any);
    if (success) {
      toast.success("Project status updated successfully");
      refetch();
    } else {
      toast.error("Failed to update project status");
    }
  };

  const handleSaveProgress = async () => {
    if (!project) return;

    const success = await updateProjectProgress(project, newProgress);
    if (success) {
      toast.success("Project progress updated successfully");
      setProgressDialogOpen(false);
      refetch();
    } else {
      toast.error("Failed to update project progress");
    }
  };

  // Component handlers
  const handleOpenComponentDialog = (component?: ProjectComponent) => {
    if (component) {
      setEditingComponent(component);
      setNewComponent({
        name: component.name,
        description: component.description || "",
        type: component.type,
        status: component.status,
        assignedTo: component.assignedTo || "",
        dueDate: component.dueDate || "",
      });
    } else {
      setEditingComponent(null);
      setNewComponent({
        name: "",
        description: "",
        type: "",
        status: "pending",
        assignedTo: "",
        dueDate: "",
      });
    }
    setComponentDialogOpen(true);
  };

  const handleSaveComponent = async (
    componentData: Partial<ProjectComponent>,
  ) => {
    if (!componentData.name || !componentData.type) {
      toast.error("Component name and type are required");
      return;
    }

    let success = false;

    if (editingComponent) {
      success = await updateProjectComponent({
        ...editingComponent,
        ...componentData,
      } as ProjectComponent);
    } else {
      success = await addProjectComponent({
        name: componentData.name,
        description: componentData.description || "",
        type: componentData.type,
        status: componentData.status as "pending" | "in_progress" | "completed",
      });
    }

    if (success) {
      setComponentDialogOpen(false);
      setEditingComponent(null);
      toast.success(
        `Component ${editingComponent ? "updated" : "added"} successfully`,
      );
      refetch();
    }
  };

  const handleComponentStatusChange = async (
    component: ProjectComponent,
    newStatus: "pending" | "in_progress" | "completed",
  ) => {
    const success = await updateProjectComponent({
      ...component,
      status: newStatus,
    });

    if (success) {
      toast.success("Component status updated");
      refetch();
    } else {
      toast.error("Failed to update component status");
    }
  };

  const handleDeleteComponent = async (componentId: string) => {
    try {
      const { error } = await supabase
        .from("project_components")
        .delete()
        .eq("id", componentId);

      if (error) throw error;

      toast.success("Component deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting component:", error);
      toast.error("Failed to delete component");
    }
  };

  // Task handlers
  const handleOpenTaskDialog = (task?: ProjectTask) => {
    if (task) {
      setEditingTask(task);
      setNewTask({
        title: task.title || task.name,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo || "",
        dueDate: task.dueDate || "",
      });
    } else {
      setEditingTask(null);
      setNewTask({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        assignedTo: "",
        dueDate: "",
      });
    }
    setTaskDialogOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<ProjectTask>) => {
    if (!taskData.title) {
      toast.error("Task title is required");
      return;
    }

    let success = false;

    if (editingTask) {
      success = await updateProjectTask({
        ...editingTask,
        ...taskData,
      } as ProjectTask);
    } else {
      success = await addProjectTask({
        title: taskData.title,
        name: taskData.title,
        description: taskData.description || "",
        status: taskData.status as "pending" | "in_progress" | "completed",
        priority: taskData.priority as "low" | "medium" | "high",
        assignedTo: taskData.assignedTo || "",
        dueDate: taskData.dueDate || "",
      });
    }

    if (success) {
      setTaskDialogOpen(false);
      setEditingTask(null);
      setNewTask({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        assignedTo: "",
        dueDate: "",
      });
      toast.success(`Task ${editingTask ? "updated" : "added"} successfully`);
      refetch();
    }
  };

  const handleTaskStatusChange = async (
    task: ProjectTask,
    newStatus: "pending" | "in_progress" | "completed",
  ) => {
    const success = await updateProjectTask({
      ...task,
      status: newStatus,
    });

    if (success) {
      toast.success("Task status updated");
      refetch();
    } else {
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("project_tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Task deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  // Get related tasks for each component
  const getRelatedTasks = (component: ProjectComponent): ProjectTask[] => {
    if (!project?.tasks) return [];

    return project.tasks.filter(
      (task) =>
        task.name?.toLowerCase().includes(component.name.toLowerCase()) ||
        task.title?.toLowerCase().includes(component.name.toLowerCase()) ||
        task.description?.toLowerCase().includes(component.name.toLowerCase()),
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error
                ? "There was an error loading the project."
                : "This project doesn't exist or has been removed."}
            </p>
            <Button onClick={() => navigate("/projects")} className="mt-4">
              Back to Projects
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Check if this is a product landing page project
  if (
    project.type === "product_launch" ||
    project.name?.toLowerCase().includes("offwocken")
  ) {
    return <ProductLandingPage project={project} />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/projects")}>
            ← Back to Projects
          </Button>

          {isOwner && (
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Dialog
                open={progressDialogOpen}
                onOpenChange={setProgressDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">Update Progress</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Project Progress</DialogTitle>
                    <DialogDescription>
                      Set the overall completion percentage for this project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="mb-4">
                      <Label htmlFor="progress">Progress: {newProgress}%</Label>
                      <Slider
                        id="progress"
                        min={0}
                        max={100}
                        step={1}
                        value={[newProgress]}
                        onValueChange={(values) => setNewProgress(values[0])}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setProgressDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProgress}>Save Progress</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline">Edit Project</Button>
              <Button variant="destructive">Delete Project</Button>
            </div>
          )}
        </div>

        {/* Project Header */}
        <ProjectHeader project={project} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>

              <TabsContent value="components">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Components</h2>
                  {isOwner && (
                    <Button
                      size="sm"
                      onClick={() => handleOpenComponentDialog()}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Component
                    </Button>
                  )}
                </div>

                {project.components && project.components.length > 0 ? (
                  <div className="space-y-4">
                    {project.components.map((component, index) => (
                      <EnhancedProjectComponent
                        key={component.id}
                        component={component}
                        index={index}
                        relatedTasks={getRelatedTasks(component)}
                        isOwner={isOwner}
                        onEdit={handleOpenComponentDialog}
                        onDelete={handleDeleteComponent}
                        onStatusChange={handleComponentStatusChange}
                        onReference={(comp) =>
                          addReferenceToChat({
                            id: comp.id,
                            type: "component",
                            name: comp.name,
                            status: comp.status,
                          })
                        }
                        onTaskStatusChange={handleTaskStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg font-medium">
                      No components added yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Start by adding your first component or phase
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tasks">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Tasks</h2>
                  {isOwner && (
                    <Button size="sm" onClick={() => handleOpenTaskDialog()}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  )}
                </div>

                {project.tasks && project.tasks.length > 0 ? (
                  <div className="space-y-4">
                    {project.tasks.map((task) => (
                      <EnhancedTaskCard
                        key={task.id}
                        task={task}
                        isOwner={isOwner}
                        onEdit={handleOpenTaskDialog}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleTaskStatusChange}
                        onReference={(task) =>
                          addReferenceToChat({
                            id: task.id,
                            type: "task",
                            name: task.title || task.name,
                            status: task.status,
                          })
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg font-medium">
                      No tasks added yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Start by adding your first task to track progress
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">
                  Project Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Owner Type
                    </h3>
                    <div className="font-medium capitalize">
                      {project.ownerType}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Created
                    </h3>
                    <div className="font-medium">
                      {project.createdAt &&
                        new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Version
                    </h3>
                    <div className="font-medium">
                      {project.version || "1.0.0"}
                    </div>
                  </div>
                </div>

                {project && (
                  <div className="mt-6">
                    <ProjectInteractionProgress
                      project={project}
                      onMilestoneClick={
                        isOwner ? handleStatusChange : undefined
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {project && (
              <ProjectChat
                ref={chatRef}
                project={project}
                className="sticky top-20"
                onReferenceClick={{
                  component: handleComponentClick,
                  task: handleTaskClick,
                }}
                onStatusChange={isOwner ? handleStatusChange : undefined}
              />
            )}
          </div>
        </div>

        {/* Component Dialog */}
        <ComponentDialog
          open={componentDialogOpen}
          onOpenChange={setComponentDialogOpen}
          component={
            editingComponent
              ? { ...editingComponent, ...newComponent }
              : newComponent
          }
          isEditing={!!editingComponent}
          isLoading={isAddingComponent || isEditingComponent}
          onSave={handleSaveComponent}
        />

        {/* Task Dialog */}
        <TaskDialog
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          task={editingTask ? { ...editingTask, ...newTask } : newTask}
          isEditing={!!editingTask}
          isLoading={isAddingTask || isEditingTask}
          onSave={handleSaveTask}
        />
      </div>
    </Layout>
  );
};

export default ProjectDetail;
