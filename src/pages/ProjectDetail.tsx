import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  CheckCircle2,
  Wrench,
  Palette,
  Eye,
  Share2,
  Copy,
  Heart,
  ExternalLink,
  Star,
  LinkIcon,
  Twitter,
  Facebook,
  Linkedin,
  MessageSquare,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useProject } from "@/hooks/use-project";
import { useProjectInteractions } from "@/hooks/use-project-interactions";
import {
  Project,
  ProjectComponent,
  ProjectTask,
  ProjectStatus,
  ProjectLandingPage,
} from "@/types/project";
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
import CustomLandingPage from "@/components/projects/landing/CustomLandingPage";
import LandingPageEditor from "@/components/projects/landing/LandingPageEditor";

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
    status: "pending" as const,
    priority: "medium" as const,
    assignedTo: "",
    dueDate: "",
    componentId: "",
  });

  // Landing page states
  const [landingPageEditorOpen, setLandingPageEditorOpen] = useState(false);
  const [showCustomLanding, setShowCustomLanding] = useState(false);

  // Social interaction states
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(project?.like_count || 0);
  const [viewCount, setViewCount] = useState(project?.view_count || 0);

  // Share functionality
  const handleShareProject = async (platform?: string) => {
    const projectUrl = `${window.location.origin}/projects/${projectId}`;
    const landingUrl = `${window.location.origin}/projects/${projectId}/landing`;
    const shareUrl = project?.has_custom_landing ? landingUrl : projectUrl;
    const title =
      project?.landing_page?.hero_title || project?.name || "Amazing Project";
    const description =
      project?.landing_page?.hero_subtitle ||
      project?.description ||
      "Check out this project on Findry!";

    if (platform) {
      let url = "";
      switch (platform) {
        case "twitter":
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}&hashtags=findry,project`;
          break;
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          break;
        case "linkedin":
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          break;
        default:
          return;
      }
      window.open(url, "_blank", "width=600,height=400");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled sharing, copy to clipboard instead
        handleCopyProjectLink(shareUrl);
      }
    } else {
      handleCopyProjectLink(shareUrl);
    }
  };

  const handleCopyProjectLink = async (url?: string) => {
    const projectUrl = url || `${window.location.origin}/projects/${projectId}`;
    try {
      await navigator.clipboard.writeText(projectUrl);
      toast.success("Project link copied to clipboard!");
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = projectUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Project link copied to clipboard!");
    }
  };

  // Social interaction handlers
  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like projects");
      return;
    }

    try {
      const newLiked = !liked;
      const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;

      setLiked(newLiked);
      setLikeCount(newLikeCount);

      const { error } = await supabase
        .from("projects")
        .update({ like_count: newLikeCount })
        .eq("id", projectId);

      if (error) throw error;

      toast.success(newLiked ? "Project liked!" : "Like removed");
    } catch (error: any) {
      console.error("Error liking project:", error);
      toast.error("Failed to like project");
      // Revert optimistic update
      setLiked(!liked);
      setLikeCount(likeCount);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please log in to bookmark projects");
      return;
    }

    try {
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? "Bookmark removed" : "Project bookmarked!");
      // TODO: Implement bookmark functionality in database
    } catch (error: any) {
      console.error("Error bookmarking project:", error);
      toast.error("Failed to bookmark project");
      setBookmarked(bookmarked);
    }
  };

  // Progress dialog state
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [newProgress, setNewProgress] = useState<number>(0);

  useEffect(() => {
    if (!user || !projectId) return;

    const checkOwnership = async () => {
      try {
        // Check if user owns via project table directly
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("owner_id, created_by")
          .eq("id", projectId)
          .maybeSingle();

        if (projectError) {
          console.error("Error checking project ownership:", projectError);
          setIsOwner(false);
          return;
        }

        // User is owner if they match owner_id or created_by
        const isProjectOwner =
          projectData?.owner_id === user.id ||
          projectData?.created_by === user.id;

        if (isProjectOwner) {
          setIsOwner(true);
          return;
        }

        // Also check content_ownership table as fallback
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
      setLikeCount(project.like_count || 0);
      setViewCount(project.view_count || 0);

      // Update document title and meta tags for SEO
      const title = project.name || "Project";
      const description = project.description || "An amazing project on Findry";

      document.title = `${title} - Findry`;

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description.substring(0, 160));

      // Update Open Graph tags
      const updateOGTag = (property: string, content: string) => {
        let ogTag = document.querySelector(`meta[property="${property}"]`);
        if (!ogTag) {
          ogTag = document.createElement("meta");
          ogTag.setAttribute("property", property);
          document.head.appendChild(ogTag);
        }
        ogTag.setAttribute("content", content);
      };

      updateOGTag("og:title", title);
      updateOGTag("og:description", description);
      updateOGTag("og:type", "website");
      updateOGTag("og:url", `${window.location.origin}/projects/${projectId}`);

      if (project.image_url) {
        updateOGTag("og:image", project.image_url);
      }

      // Update Twitter Card tags
      const updateTwitterTag = (name: string, content: string) => {
        let twitterTag = document.querySelector(`meta[name="${name}"]`);
        if (!twitterTag) {
          twitterTag = document.createElement("meta");
          twitterTag.setAttribute("name", name);
          document.head.appendChild(twitterTag);
        }
        twitterTag.setAttribute("content", content);
      };

      updateTwitterTag("twitter:card", "summary_large_image");
      updateTwitterTag("twitter:title", title);
      updateTwitterTag("twitter:description", description);

      if (project.image_url) {
        updateTwitterTag("twitter:image", project.image_url);
      }

      // Increment view count
      const incrementView = async () => {
        try {
          const { error } = await supabase
            .from("projects")
            .update({ view_count: (project.view_count || 0) + 1 })
            .eq("id", projectId);

          if (!error) {
            setViewCount((project.view_count || 0) + 1);
          }
        } catch (err) {
          console.error("Error incrementing view count:", err);
        }
      };

      incrementView();
    }
  }, [project, projectId]);

  // Cleanup meta tags on unmount
  useEffect(() => {
    return () => {
      document.title = "Findry";
    };
  }, []);

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

    const success = await updateProjectStatus(
      project,
      newStatus as ProjectStatus,
    );
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
  const handleOpenTaskDialog = (task?: ProjectTask, componentId?: string) => {
    if (task) {
      setEditingTask(task);
      setNewTask({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo || "",
        dueDate: task.dueDate || "",
        componentId:
          (task as ProjectTask & { componentId?: string }).componentId || "",
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
        componentId: componentId || "",
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
        description: taskData.description || "",
        status: taskData.status as "pending" | "in_progress" | "completed",
        priority: taskData.priority as "low" | "medium" | "high",
        assignedTo: taskData.assignedTo || "",
        dueDate: taskData.dueDate || "",
        componentId:
          (taskData as ProjectTask & { componentId?: string }).componentId ||
          "",
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
        componentId: "",
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
        // First check if task is directly associated with component via componentId
        task.componentId === component.id ||
        // Fallback to name/description matching for legacy tasks
        (!task.componentId &&
          (task.title?.toLowerCase().includes(component.name.toLowerCase()) ||
            task.description
              ?.toLowerCase()
              .includes(component.name.toLowerCase()))),
    );
  };

  const handleSaveLandingPage = async (landingPageData: ProjectLandingPage) => {
    console.log("🔥 ProjectDetail: handleSaveLandingPage called");
    console.log("🔥 ProjectDetail: user:", user?.id);
    console.log("🔥 ProjectDetail: projectId:", projectId);
    console.log("🔥 ProjectDetail: isOwner:", isOwner);
    console.log(
      "🔥 ProjectDetail: landingPageData:",
      JSON.stringify(landingPageData, null, 2),
    );

    // Check user authentication
    if (!user) {
      console.error("❌ User not authenticated");
      toast.error("You must be logged in to save landing pages");
      return;
    }

    if (!projectId) {
      console.error("❌ No project ID available");
      toast.error("Project ID is missing");
      return;
    }

    if (!landingPageData) {
      console.error("❌ No landing page data provided");
      toast.error("Landing page data is missing");
      return;
    }

    // More lenient validation - just check if we have some content
    if (!landingPageData.hero_title && !landingPageData.hero_subtitle) {
      console.error("❌ Missing required fields");
      toast.error("Please fill in at least a hero title or subtitle");
      return;
    }

    try {
      console.log("🚀 ProjectDetail: Starting database update...");

      // First check if user has permission to update this project
      console.log("🔒 ProjectDetail: Checking project ownership...");
      const { data: projectCheck, error: checkError } = await supabase
        .from("projects")
        .select("id, owner_id, created_by, name")
        .eq("id", projectId)
        .single();

      console.log("🔍 ProjectDetail: Project check data:", projectCheck);
      console.log("🔍 ProjectDetail: Project check error:", checkError);

      if (checkError) {
        throw new Error(`Permission check failed: ${checkError.message}`);
      }

      if (!projectCheck) {
        throw new Error("Project not found");
      }

      const userOwnsProject =
        projectCheck.owner_id === user.id ||
        projectCheck.created_by === user.id;

      if (!userOwnsProject) {
        throw new Error("You don't have permission to edit this project");
      }

      console.log("✅ ProjectDetail: User has permission to edit project");

      // Ensure we have valid JSON structure
      const cleanLandingPageData = {
        hero_title: landingPageData.hero_title || "",
        hero_subtitle: landingPageData.hero_subtitle || "",
        call_to_action: landingPageData.call_to_action || "Learn More",
        cta_link: landingPageData.cta_link || "",
        theme: landingPageData.theme || "default",
        sections: landingPageData.sections || [],
        social_links: landingPageData.social_links || [],
        ...landingPageData, // Keep any additional fields
      };

      const updateData = {
        landing_page: cleanLandingPageData as any,
        has_custom_landing: true,
        is_public: true,
        updated_at: new Date().toISOString(),
      };

      console.log(
        "📦 ProjectDetail: Clean update data:",
        JSON.stringify(updateData, null, 2),
      );

      const { data, error } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", projectId)
        .eq("owner_id", user.id) // Double-check ownership in the query
        .select("id, name, landing_page, has_custom_landing, is_public");

      console.log("✅ ProjectDetail: Database response data:", data);
      console.log("❌ ProjectDetail: Database response error:", error);

      if (error) {
        console.error("💥 ProjectDetail: Database error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        // Provide more specific error messages
        if (error.code === "42501") {
          throw new Error("Permission denied - you don't own this project");
        } else if (error.code === "23503") {
          throw new Error("Database constraint violation");
        } else {
          throw new Error(`Database error: ${error.message} (${error.code})`);
        }
      }

      if (!data || data.length === 0) {
        console.error(
          "⚠️ ProjectDetail: No rows updated - this usually means permission denied",
        );
        throw new Error("No rows updated - check if you own this project");
      }

      console.log("🎉 ProjectDetail: Landing page saved successfully");
      toast.success("Landing page saved successfully! 🎉");

      setLandingPageEditorOpen(false);

      // Refetch project data to update UI
      console.log("🔄 ProjectDetail: Refetching project data...");
      try {
        await refetch();
        console.log("✅ ProjectDetail: Project data refetched");
      } catch (refetchError) {
        console.error("⚠️ ProjectDetail: Error refetching data:", refetchError);
        // Don't throw here, save was successful
      }

      console.log("🏁 ProjectDetail: All save operations completed");
    } catch (error: any) {
      console.error("💥 ProjectDetail: Caught error saving landing page:", {
        message: error.message,
        stack: error.stack,
        error: error,
      });

      toast.error(error.message || "Failed to save landing page");
    }
  };

  const handleToggleLandingView = () => {
    setShowCustomLanding(!showCustomLanding);
  };

  const handleShareLanding = async () => {
    const landingUrl = `${window.location.origin}/projects/${projectId}/landing`;

    if (navigator.share) {
      try {
        await navigator.share({
          title:
            project?.landing_page?.hero_title ||
            project?.name ||
            "Project Landing Page",
          text:
            project?.landing_page?.hero_subtitle ||
            project?.description ||
            "Check out this amazing project!",
          url: landingUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        handleCopyProjectLink(landingUrl);
      }
    } else {
      handleCopyProjectLink(landingUrl);
    }
  };

  const handleViewLanding = () => {
    if (project?.has_custom_landing || project?.landing_page) {
      window.open(`/projects/${projectId}/landing`, "_blank");
    } else {
      toast.error("No landing page available for this project");
    }
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

  // Show custom landing page if enabled and toggled
  if (showCustomLanding && project.has_custom_landing && project.landing_page) {
    return (
      <CustomLandingPage
        project={project}
        landingPage={project.landing_page}
        isOwner={isOwner}
        onEdit={() => setLandingPageEditorOpen(true)}
      />
    );
  }

  // Show landing page editor
  if (landingPageEditorOpen) {
    return (
      <LandingPageEditor
        project={project}
        landingPage={project.landing_page}
        onSave={handleSaveLandingPage}
        onCancel={() => setLandingPageEditorOpen(false)}
      />
    );
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
              <Button
                variant="outline"
                onClick={() => navigate(`/projects/${projectId}/edit`)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
              {(project.has_custom_landing || project.landing_page) && (
                <Button variant="outline" onClick={handleToggleLandingView}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showCustomLanding ? "Project View" : "Landing View"}
                </Button>
              )}
              {(project.has_custom_landing || project.landing_page) && (
                <Button variant="outline" onClick={handleViewLanding}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Landing Page
                </Button>
              )}
              {project.has_custom_landing && project.is_public && (
                <Button variant="outline" onClick={handleShareLanding}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Landing
                </Button>
              )}
              <Button
                variant={project.has_custom_landing ? "outline" : "default"}
                onClick={() => setLandingPageEditorOpen(true)}
              >
                <Palette className="h-4 w-4 mr-2" />
                {project.has_custom_landing ? "Edit Landing" : "Create Landing"}
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (
                    confirm(
                      "Are you sure you want to delete this project? This action cannot be undone.",
                    )
                  ) {
                    try {
                      const { error } = await supabase
                        .from("projects")
                        .delete()
                        .eq("id", projectId);

                      if (error) throw error;

                      toast.success("Project deleted successfully");
                      navigate("/projects");
                    } catch (error) {
                      console.error("Error deleting project:", error);
                      toast.error("Failed to delete project");
                    }
                  }
                }}
              >
                Delete Project
              </Button>
            </div>
          )}
        </div>

        {/* Project Header */}
        <ProjectHeader project={project} />

        {/* Social Interaction Bar */}
        <div className="bg-muted/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {viewCount} views
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {likeCount} likes
              </span>
              {project.createdAt && (
                <span>
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Like Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`${
                  liked
                    ? "text-red-500 hover:text-red-600"
                    : "hover:text-red-500"
                }`}
              >
                <Heart
                  className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`}
                />
                {liked ? "Liked" : "Like"}
              </Button>

              {/* Bookmark Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`${
                  bookmarked
                    ? "text-blue-500 hover:text-blue-600"
                    : "hover:text-blue-500"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 mr-1 ${bookmarked ? "fill-current" : ""}`}
                />
                {bookmarked ? "Saved" : "Save"}
              </Button>

              {/* Share Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleShareProject()}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleShareProject("twitter")}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleShareProject("facebook")}
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleShareProject("linkedin")}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    Share on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {project.has_custom_landing || project.landing_page ? (
                    <DropdownMenuItem onClick={handleViewLanding}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Landing Page
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => setLandingPageEditorOpen(true)}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Create Landing Page
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Featured Badge */}
              {project.featured && (
                <Badge variant="default" className="ml-2">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Landing Page Section */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {project.has_custom_landing || project.landing_page
                  ? "Landing Page"
                  : "Create a Landing Page"}
              </h3>
              <p className="text-muted-foreground">
                {project.has_custom_landing || project.landing_page
                  ? "This project has a custom landing page that can be shared publicly."
                  : "Make your project stand out with a custom landing page that showcases your work."}
              </p>
              {/* Debug info for development */}
              <div className="text-xs text-muted-foreground mt-1">
                Landing: {project.has_custom_landing ? "✓" : "✗"} | Data:{" "}
                {project.landing_page ? "✓" : "✗"} | Public:{" "}
                {project.is_public ? "✓" : "✗"}
              </div>
            </div>
            <div className="flex gap-2">
              {project.has_custom_landing || project.landing_page ? (
                <>
                  <Button variant="outline" onClick={handleViewLanding}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Landing
                  </Button>
                  {isOwner && (
                    <Button
                      variant="outline"
                      onClick={() => setLandingPageEditorOpen(true)}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Edit Landing
                    </Button>
                  )}
                  <Button onClick={handleShareLanding}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Landing
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setLandingPageEditorOpen(true)}>
                    <Palette className="h-4 w-4 mr-2" />
                    Create Landing Page
                  </Button>
                  {/* Test button for debugging */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const testData = {
                        hero_title: `${project.name} - Test Landing`,
                        hero_subtitle: `This is a test landing page for ${project.name}`,
                        call_to_action: "Learn More",
                        cta_link: `/projects/${projectId}`,
                        theme: "default" as const,
                        sections: [],
                        social_links: [],
                      };
                      console.log("🧪 Manual test save clicked");
                      handleSaveLandingPage(testData);
                    }}
                  >
                    🧪 Test Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

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
                        onAddReference={(comp) =>
                          addReferenceToChat({
                            id: comp.id,
                            type: "component",
                            name: comp.name,
                            status: comp.status,
                          })
                        }
                        onTaskStatusChange={handleTaskStatusChange}
                        onAddTask={(componentId) =>
                          handleOpenTaskDialog(undefined, componentId)
                        }
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
                            name: task.title,
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
          components={project?.components || []}
        />
      </div>
    </Layout>
  );
};

export default ProjectDetail;
