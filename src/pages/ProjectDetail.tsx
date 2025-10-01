import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useProject } from "@/hooks/use-project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project, ProjectComponent, ProjectTask } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";
import ProjectChat, { ReferenceItem } from "@/components/projects/ProjectChat";
import ProjectInteractionProgress from "@/components/projects/ProjectInteractionProgress";
import { useProjectInteractions } from "@/hooks/use-project-interactions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { PlusCircle, Edit } from "lucide-react";
import VehicleBuildProject from "@/components/projects/VehicleBuildProject";
import ProductLandingPage from "@/components/projects/ProductLandingPage";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useGetProject } = useProject();
  const { data: project, isLoading, error, refetch } = useGetProject(projectId);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
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
  });

  // Task dialog state
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
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
          .single();

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

  const handleStatusChange = async (
    newStatus: Project["status"],
  ): Promise<void> => {
    if (!project) return;

    if (isOwner) {
      await updateProjectStatus(project, newStatus);
    } else {
      toast.error("Only the project owner can change the project status");
    }
  };

  const handleComponentClick = (componentId: string) => {
    setActiveTab("components");
    setTimeout(() => {
      const element = document.getElementById(`component-${componentId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        element.classList.add("ring", "ring-primary", "ring-opacity-50");
        setTimeout(() => {
          element.classList.remove("ring", "ring-primary", "ring-opacity-50");
        }, 2000);
      }
    }, 100);
  };

  const handleTaskClick = (taskId: string) => {
    setActiveTab("tasks");
    setTimeout(() => {
      const element = document.getElementById(`task-${taskId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        element.classList.add("ring", "ring-primary", "ring-opacity-50");
        setTimeout(() => {
          element.classList.remove("ring", "ring-primary", "ring-opacity-50");
        }, 2000);
      }
    }, 100);
  };

  const addReferenceToChat = (item: ReferenceItem) => {
    chatRef.current?.addReference(item);
  };

  const handleOpenComponentDialog = (component?: ProjectComponent) => {
    if (component) {
      setEditingComponent(component);
      setNewComponent({
        name: component.name,
        description: component.description || "",
        type: component.type,
        status: component.status,
      });
    } else {
      setEditingComponent(null);
      setNewComponent({
        name: "",
        description: "",
        type: "",
        status: "pending",
      });
    }
    setComponentDialogOpen(true);
  };

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

  const handleSaveComponent = async () => {
    if (!newComponent.name || !newComponent.type) {
      toast.error("Component name and type are required");
      return;
    }

    let success = false;

    if (editingComponent) {
      success = await updateProjectComponent({
        ...editingComponent,
        name: newComponent.name || editingComponent.name,
        description: newComponent.description,
        type: newComponent.type || editingComponent.type,
        status:
          (newComponent.status as "pending" | "in_progress" | "completed") ||
          editingComponent.status,
      });
    } else {
      success = await addProjectComponent({
        name: newComponent.name!,
        description: newComponent.description,
        type: newComponent.type!,
        status: newComponent.status as "pending" | "in_progress" | "completed",
      });
    }

    if (success) {
      setComponentDialogOpen(false);
      refetch();
    }
  };

  const handleSaveTask = async () => {
    if (!newTask.title) {
      toast.error("Task title is required");
      return;
    }

    let success = false;

    if (editingTask) {
      success = await updateProjectTask({
        ...editingTask,
        title: newTask.title || editingTask.title || editingTask.name,
        name: newTask.title || editingTask.title || editingTask.name,
        description: newTask.description,
        status:
          (newTask.status as "pending" | "in_progress" | "completed") ||
          editingTask.status,
        priority:
          (newTask.priority as "low" | "medium" | "high") ||
          editingTask.priority,
        assignedTo: newTask.assignedTo,
        dueDate: newTask.dueDate,
      });
    } else {
      success = await addProjectTask({
        title: newTask.title,
        name: newTask.title,
        description: newTask.description,
        status: newTask.status as "pending" | "in_progress" | "completed",
        priority: newTask.priority as "low" | "medium" | "high",
        assignedTo: newTask.assignedTo,
        dueDate: newTask.dueDate,
      });
    }

    if (success) {
      setTaskDialogOpen(false);
      refetch();
    }
  };

  const handleSaveProgress = async () => {
    if (!project) return;

    const success = await updateProjectProgress(project, newProgress);

    if (success) {
      setProgressDialogOpen(false);
      refetch();
    }
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
              {error
                ? `Error: ${error}`
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

  // Check if this is a vehicle build project
  // const isVehicleBuild =
  //   project.tags?.some(
  //     (tag) =>
  //       tag.toLowerCase().includes("vehicle") ||
  //       tag.toLowerCase().includes("conversion"),
  //   ) || project.type === "vehicle_build";

  // if (isVehicleBuild) {
  //   return <VehicleBuildProject project={project} />;
  // }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-6 flex flex-wrap justify-between items-center">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h1 className="text-3xl font-bold mb-2">{project?.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project?.tags &&
                    project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-muted px-2.5 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <div className="text-muted-foreground mb-6">
                  {project?.description}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Status
                    </h3>
                    <div className="font-medium capitalize">
                      {project?.status.replace("_", " ")}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Version
                    </h3>
                    <div className="font-medium">
                      {project?.version || "N/A"}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Progress
                    </h3>
                    <div className="font-medium">
                      {project?.progress !== undefined
                        ? `${project.progress}%`
                        : "N/A"}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Last Updated
                    </h3>
                    <div className="font-medium">
                      {project?.updatedAt &&
                        new Date(project.updatedAt).toLocaleDateString()}
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
                    <Dialog
                      open={componentDialogOpen}
                      onOpenChange={setComponentDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => handleOpenComponentDialog()}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Component
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingComponent
                              ? "Edit Component"
                              : "Add Component"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingComponent
                              ? "Update the details of this component."
                              : "Add a new component to your project."}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div>
                            <Label htmlFor="name">Component Name</Label>
                            <Input
                              id="name"
                              value={newComponent.name || ""}
                              onChange={(e) =>
                                setNewComponent({
                                  ...newComponent,
                                  name: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={newComponent.description || ""}
                              onChange={(e) =>
                                setNewComponent({
                                  ...newComponent,
                                  description: e.target.value,
                                })
                              }
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor="type">Component Type</Label>
                            <Input
                              id="type"
                              value={newComponent.type || ""}
                              onChange={(e) =>
                                setNewComponent({
                                  ...newComponent,
                                  type: e.target.value,
                                })
                              }
                              className="mt-1"
                              placeholder="e.g., UI, Backend, Database"
                            />
                          </div>
                          <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                              value={newComponent.status}
                              onValueChange={(value) =>
                                setNewComponent({
                                  ...newComponent,
                                  status: value as
                                    | "pending"
                                    | "in_progress"
                                    | "completed",
                                })
                              }
                            >
                              <SelectTrigger id="status" className="mt-1">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setComponentDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveComponent}
                            disabled={isAddingComponent || isEditingComponent}
                          >
                            {isAddingComponent || isEditingComponent
                              ? "Saving..."
                              : "Save Component"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {project?.components && project.components.length > 0 ? (
                  <div className="space-y-4">
                    {project.components.map((component) => (
                      <Card key={component.id} id={`component-${component.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                {component.name}
                              </h3>
                              <div className="text-sm text-muted-foreground mt-1">
                                {component.description}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex gap-2 mb-1">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    component.status === "completed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : component.status === "in_progress"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                  }`}
                                >
                                  {component.status.replace("_", " ")}
                                </span>
                                <span className="text-xs px-2 py-1 bg-muted rounded-full">
                                  {component.type}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {isOwner && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleOpenComponentDialog(component)
                                    }
                                  >
                                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                                    Edit
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    addReferenceToChat({
                                      id: component.id,
                                      type: "component",
                                      name: component.name,
                                      status: component.status,
                                    })
                                  }
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
                    <p className="text-muted-foreground">
                      No components added yet.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tasks">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Tasks</h2>
                  {isOwner && (
                    <Dialog
                      open={taskDialogOpen}
                      onOpenChange={setTaskDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => handleOpenTaskDialog()}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingTask ? "Edit Task" : "Add Task"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingTask
                              ? "Update the details of this task."
                              : "Add a new task to your project."}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div>
                            <Label htmlFor="title">Task Title</Label>
                            <Input
                              id="title"
                              value={newTask.title || ""}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  title: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={newTask.description || ""}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  description: e.target.value,
                                })
                              }
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="status">Status</Label>
                              <Select
                                value={newTask.status}
                                onValueChange={(value) =>
                                  setNewTask({
                                    ...newTask,
                                    status: value as
                                      | "pending"
                                      | "in_progress"
                                      | "completed",
                                  })
                                }
                              >
                                <SelectTrigger id="status" className="mt-1">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="in_progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="priority">Priority</Label>
                              <Select
                                value={newTask.priority}
                                onValueChange={(value) =>
                                  setNewTask({
                                    ...newTask,
                                    priority: value as
                                      | "low"
                                      | "medium"
                                      | "high",
                                  })
                                }
                              >
                                <SelectTrigger id="priority" className="mt-1">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="assignedTo">Assigned To</Label>
                            <Input
                              id="assignedTo"
                              value={newTask.assignedTo || ""}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  assignedTo: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                              id="dueDate"
                              type="date"
                              value={newTask.dueDate || ""}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  dueDate: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setTaskDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveTask}
                            disabled={isAddingTask || isEditingTask}
                          >
                            {isAddingTask || isEditingTask
                              ? "Saving..."
                              : "Save Task"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {project?.tasks && project.tasks.length > 0 ? (
                  <div className="space-y-4">
                    {project.tasks.map((task) => (
                      <Card key={task.id} id={`task-${task.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                {task.title || task.name}
                              </h3>
                              <div className="text-sm text-muted-foreground mt-1">
                                {task.description}
                              </div>
                              {task.assignedTo && (
                                <div className="text-sm mt-2">
                                  <span className="text-muted-foreground">
                                    Assigned to:{" "}
                                  </span>
                                  <span>{task.assignedTo}</span>
                                </div>
                              )}
                              {task.dueDate && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    Due:{" "}
                                  </span>
                                  <span>{task.dueDate}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex gap-2 mb-1">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    task.status === "completed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : task.status === "in_progress"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                  }`}
                                >
                                  {task.status.replace("_", " ")}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    task.priority === "high"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                      : task.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  }`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {isOwner && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenTaskDialog(task)}
                                  >
                                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                                    Edit
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    addReferenceToChat({
                                      id: task.id,
                                      type: "task",
                                      name: task.title || task.name,
                                      status: task.status,
                                    })
                                  }
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
                <h2 className="text-xl font-semibold mb-4">
                  Project Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Owner Type
                    </h3>
                    <div className="font-medium capitalize">
                      {project?.ownerType}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Created
                    </h3>
                    <div className="font-medium">
                      {project?.createdAt &&
                        new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Components
                    </h3>
                    <div className="font-medium">
                      {project?.components?.length || 0} components
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Tasks
                    </h3>
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
                  task: handleTaskClick,
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
