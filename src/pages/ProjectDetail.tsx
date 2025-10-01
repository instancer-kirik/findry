import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useProject } from "@/hooks/use-project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  Edit,
  MapPin,
  DollarSign,
  Calendar,
  Truck,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Home,
  Palette,
  FileText,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  MoreVertical,
  Trash2,
} from "lucide-react";
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
      setEditingComponent(null);
      setNewComponent({
        name: "",
        description: "",
        type: "",
        status: "pending",
        assignedTo: "",
        dueDate: "",
      });
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
      setEditingTask(null);
      setNewTask({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
      });
      refetch();
    }
  };

  const handleQuickStatusChange = async (
    item: ProjectComponent | ProjectTask,
    newStatus: "pending" | "in_progress" | "completed",
    type: "component" | "task",
  ) => {
    let success = false;

    if (type === "component") {
      success = await updateProjectComponent({
        ...(item as ProjectComponent),
        status: newStatus,
      });
    } else {
      success = await updateProjectTask({
        ...(item as ProjectTask),
        status: newStatus,
      });
    }

    if (success) {
      toast.success(
        `${type === "component" ? "Component" : "Task"} status updated`,
      );
      refetch();
    } else {
      toast.error(`Failed to update ${type} status`);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getComponentIcon = (name: string, type: string) => {
    const nameLower = name.toLowerCase();
    const typeLower = type.toLowerCase();

    if (nameLower.includes("electrical") || typeLower.includes("electrical"))
      return Zap;
    if (nameLower.includes("plumbing") || typeLower.includes("plumbing"))
      return Droplets;
    if (nameLower.includes("insulation") || typeLower.includes("insulation"))
      return Wind;
    if (nameLower.includes("interior") || typeLower.includes("interior"))
      return Home;
    if (
      nameLower.includes("paint") ||
      nameLower.includes("finish") ||
      typeLower.includes("finish")
    )
      return Palette;
    if (
      nameLower.includes("plan") ||
      typeLower.includes("plan") ||
      typeLower.includes("design")
    )
      return FileText;
    return Wrench;
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

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

        {/* Project Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{project?.name}</CardTitle>
                <CardDescription className="text-base mb-4">
                  {project?.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  {project?.tags &&
                    project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
              <Badge
                variant="outline"
                className={`${getStatusColor(project?.status || "")} text-sm px-3 py-1`}
              >
                {project?.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Project Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {project?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{project.location}</p>
                  </div>
                </div>
              )}
              {project?.budget && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">{project.budget}</p>
                  </div>
                </div>
              )}
              {project?.timeline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Timeline</p>
                    <p className="font-medium">{project.timeline}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {project?.updatedAt &&
                      new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Overall Progress</h3>
                <span className="text-2xl font-bold">{project?.progress}%</span>
              </div>
              <Progress value={project?.progress} className="h-3" />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {project?.components?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Components
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {project?.components?.filter(
                      (c) => c.status === "completed",
                    ).length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {project?.tasks?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {project?.tasks?.filter((t) => t.status === "completed")
                      .length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tasks Done
                  </div>
                </div>
              </div>
            </div>

            {project && (
              <div className="mt-6">
                <ProjectInteractionProgress
                  project={project}
                  onMilestoneClick={isOwner ? handleStatusChange : undefined}
                />
              </div>
            )}
          </CardContent>
        </Card>

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
                            <Select
                              value={newComponent.type || ""}
                              onValueChange={(value) =>
                                setNewComponent({
                                  ...newComponent,
                                  type: value,
                                })
                              }
                            >
                              <SelectTrigger id="type" className="mt-1">
                                <SelectValue placeholder="Select component type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="electrical">
                                  Electrical
                                </SelectItem>
                                <SelectItem value="plumbing">
                                  Plumbing
                                </SelectItem>
                                <SelectItem value="insulation">
                                  Insulation
                                </SelectItem>
                                <SelectItem value="interior">
                                  Interior
                                </SelectItem>
                                <SelectItem value="exterior">
                                  Exterior
                                </SelectItem>
                                <SelectItem value="mechanical">
                                  Mechanical
                                </SelectItem>
                                <SelectItem value="safety">Safety</SelectItem>
                                <SelectItem value="storage">Storage</SelectItem>
                                <SelectItem value="finishing">
                                  Finishing
                                </SelectItem>
                                <SelectItem value="planning">
                                  Planning
                                </SelectItem>
                                <SelectItem value="feature">Feature</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
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
                              <Label htmlFor="assignedTo">Assigned To</Label>
                              <Input
                                id="assignedTo"
                                value={newComponent.assignedTo || ""}
                                onChange={(e) =>
                                  setNewComponent({
                                    ...newComponent,
                                    assignedTo: e.target.value,
                                  })
                                }
                                className="mt-1"
                                placeholder="Enter name or email"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                              id="dueDate"
                              type="date"
                              value={newComponent.dueDate || ""}
                              onChange={(e) =>
                                setNewComponent({
                                  ...newComponent,
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
                    {project.components.map((component, index) => {
                      const Icon = getComponentIcon(
                        component.name,
                        component.type,
                      );
                      const relatedTasks =
                        project.tasks?.filter(
                          (task) =>
                            task.name
                              .toLowerCase()
                              .includes(component.name.toLowerCase()) ||
                            task.title
                              ?.toLowerCase()
                              .includes(component.name.toLowerCase()),
                        ) || [];
                      const completedTasks = relatedTasks.filter(
                        (task) => task.status === "completed",
                      );
                      const taskProgress =
                        relatedTasks.length > 0
                          ? Math.round(
                              (completedTasks.length / relatedTasks.length) *
                                100,
                            )
                          : 0;

                      return (
                        <Card
                          key={component.id}
                          id={`component-${component.id}`}
                          className="overflow-hidden"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                                  {index + 1}
                                </div>
                                <Icon className="h-6 w-6 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg">
                                      {component.name}
                                    </h3>
                                    <Badge
                                      variant="outline"
                                      className={getStatusColor(
                                        component.status,
                                      )}
                                    >
                                      {component.status.replace("_", " ")}
                                    </Badge>
                                    {component.type && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {component.type}
                                      </Badge>
                                    )}
                                  </div>
                                  {component.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {component.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {relatedTasks.length > 0 && (
                                  <div className="text-right">
                                    <div className="text-sm font-medium">
                                      {taskProgress}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {completedTasks.length}/
                                      {relatedTasks.length} tasks
                                    </div>
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  {component.status !== "completed" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleQuickStatusChange(
                                          component,
                                          component.status === "pending"
                                            ? "in_progress"
                                            : "completed",
                                          "component",
                                        )
                                      }
                                    >
                                      {component.status === "pending"
                                        ? "Start"
                                        : "Complete"}
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
                                  {isOwner && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleOpenComponentDialog(component)
                                          }
                                        >
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleQuickStatusChange(
                                              component,
                                              "pending",
                                              "component",
                                            )
                                          }
                                          disabled={
                                            component.status === "pending"
                                          }
                                        >
                                          Mark as Pending
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleQuickStatusChange(
                                              component,
                                              "in_progress",
                                              "component",
                                            )
                                          }
                                          disabled={
                                            component.status === "in_progress"
                                          }
                                        >
                                          Mark as In Progress
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleQuickStatusChange(
                                              component,
                                              "completed",
                                              "component",
                                            )
                                          }
                                          disabled={
                                            component.status === "completed"
                                          }
                                        >
                                          Mark as Completed
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleDeleteComponent(component.id)
                                          }
                                          className="text-red-600"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </div>
                            </div>
                            {relatedTasks.length > 0 && (
                              <Progress value={taskProgress} className="mt-3" />
                            )}
                          </CardHeader>

                          {relatedTasks.length > 0 && (
                            <CardContent className="pt-0">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                                  Related Tasks
                                </h4>
                                {relatedTasks.slice(0, 3).map((task) => (
                                  <div
                                    key={task.id}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <StatusIcon status={task.status} />
                                    <span
                                      className={`cursor-pointer ${
                                        task.status === "completed"
                                          ? "line-through text-muted-foreground"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleQuickStatusChange(
                                          task,
                                          task.status === "completed"
                                            ? "pending"
                                            : "completed",
                                          "task",
                                        )
                                      }
                                    >
                                      {task.title || task.name}
                                    </span>
                                    {task.priority === "high" && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs px-1.5 py-0.5"
                                      >
                                        High
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                                {relatedTasks.length > 3 && (
                                  <p className="text-xs text-muted-foreground">
                                    +{relatedTasks.length - 3} more tasks
                                  </p>
                                )}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
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
                      <Card
                        key={task.id}
                        id={`task-${task.id}`}
                        className={`${
                          task.status === "completed" ? "bg-muted/50" : ""
                        }`}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <StatusIcon status={task.status} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3
                                  className={`font-semibold ${
                                    task.status === "completed"
                                      ? "line-through text-muted-foreground"
                                      : ""
                                  }`}
                                >
                                  {task.title || task.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={getStatusColor(task.status)}
                                >
                                  {task.status.replace("_", " ")}
                                </Badge>
                                {task.priority && (
                                  <Badge
                                    variant={
                                      task.priority === "high"
                                        ? "destructive"
                                        : task.priority === "medium"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {task.priority.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {task.assignedTo && (
                                  <div className="flex items-center gap-1">
                                    <span>Assigned to:</span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {task.assignedTo}
                                    </Badge>
                                  </div>
                                )}
                                {task.dueDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      Due:{" "}
                                      {new Date(
                                        task.dueDate,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {task.status !== "completed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuickStatusChange(
                                      task,
                                      task.status === "pending"
                                        ? "in_progress"
                                        : "completed",
                                      "task",
                                    )
                                  }
                                >
                                  {task.status === "pending"
                                    ? "Start"
                                    : "Complete"}
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
                              {isOwner && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleOpenTaskDialog(task)}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleQuickStatusChange(
                                          task,
                                          "pending",
                                          "task",
                                        )
                                      }
                                      disabled={task.status === "pending"}
                                    >
                                      Mark as Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleQuickStatusChange(
                                          task,
                                          "in_progress",
                                          "task",
                                        )
                                      }
                                      disabled={task.status === "in_progress"}
                                    >
                                      Mark as In Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleQuickStatusChange(
                                          task,
                                          "completed",
                                          "task",
                                        )
                                      }
                                      disabled={task.status === "completed"}
                                    >
                                      Mark as Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
