import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProject } from "@/hooks/use-project";
import { Project } from "@/types/project";
import { useAuth } from "@/hooks/use-auth";
import { useShareViews } from "@/hooks/use-share-views";
import {
  Car,
  Wrench,
  ExternalLink,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  Eye,
  PlusCircle,
  Upload,
  FolderKanban,
  Globe,
  User,
  Sparkles,
  Search,
  Heart,
  Star,
  TrendingUp,
  Clock,
  Filter,
  ArrowUpDown,
  X,
  Share2,
  Link2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ToonImporter } from "@/components/projects/ToonImporter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CatalogProject {
  id: string;
  name: string;
  description: string;
  path: string | null;
  domain: string | null;
  status: string;
  tech_stack: string[] | null;
  features: string[] | null;
  source_url: string | null;
  emoji: string | null;
  featured: boolean;
  project_type: string | null;
  source_table: string | null;
  created_at: string;
  dev_project_id: string | null;
  dev_progress: number | null;
  dev_repo_url: string | null;
  category_name: string | null;
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { useGetProjects } = useProject();
  const { data: projects = [], isLoading, error, refetch } = useGetProjects();
  const { user } = useAuth();
  const { myViews, createView } = useShareViews();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectOwnership, setProjectOwnership] = useState<Record<string, boolean>>({});
  const [projectTasks, setProjectTasks] = useState<Record<string, any[]>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Catalog state
  const [catalogProjects, setCatalogProjects] = useState<CatalogProject[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [filterDomain, setFilterDomain] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Share view creation state
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [newShareName, setNewShareName] = useState("");
  const [newShareDesc, setNewShareDesc] = useState("");
  const [newShareTags, setNewShareTags] = useState<string[]>([]);
  const [selectedShareViewId, setSelectedShareViewId] = useState("");

  // Tab state from URL or default
  const activeTab = searchParams.get("tab") || (user ? "my-projects" : "catalog");

  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    setSearchParams(params);
  };

  // Check ownership for all projects
  useEffect(() => {
    if (!user || projects.length === 0) return;

    const checkAllOwnership = async () => {
      const ownershipMap: Record<string, boolean> = {};
      for (const project of projects) {
        try {
          const { data: projectData } = await supabase
            .from("projects")
            .select("owner_id, created_by")
            .eq("id", project.id)
            .maybeSingle();
          ownershipMap[project.id] =
            projectData?.owner_id === user.id ||
            projectData?.created_by === user.id;
        } catch (err) {
          ownershipMap[project.id] = false;
        }
      }
      setProjectOwnership(ownershipMap);
    };
    checkAllOwnership();
  }, [user, projects]);

  // Fetch tasks for user projects
  useEffect(() => {
    if (projects.length === 0) return;
    const fetchAllTasks = async () => {
      const tasksMap: Record<string, any[]> = {};
      for (const project of projects) {
        try {
          const { data: tasks } = await supabase
            .from("project_tasks")
            .select("*")
            .eq("project_id", project.id)
            .order("created_at", { ascending: false })
            .limit(3);
          tasksMap[project.id] = tasks || [];
        } catch (err) {
          tasksMap[project.id] = [];
        }
      }
      setProjectTasks(tasksMap);
    };
    fetchAllTasks();
  }, [projects]);

  // Fetch catalog from unified_projects view
  useEffect(() => {
    fetchCatalogProjects();
  }, []);

  const fetchCatalogProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("unified_projects" as any)
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCatalogProjects((data || []) as unknown as CatalogProject[]);
    } catch (error: any) {
      console.error("Error fetching catalog:", error);
    } finally {
      setCatalogLoading(false);
    }
  };

  // Derived data
  const myProjects = projects.filter((p) => projectOwnership[p.id]);

  const filteredMyProjects = myProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
  );

  // Catalog: collect all tech_stack tags and domains
  const allCatalogTags = Array.from(
    new Set(catalogProjects.flatMap((p) => p.tech_stack || []))
  ).sort();

  const allDomains = Array.from(
    new Set(catalogProjects.map((p) => p.domain).filter(Boolean))
  ).sort() as string[];

  const filteredCatalog = (() => {
    let filtered = [...catalogProjects];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tech_stack?.some((t) => t.toLowerCase().includes(q)) ||
          p.domain?.toLowerCase().includes(q),
      );
    }

    if (filterDomain !== "all") {
      filtered = filtered.filter((p) => p.domain === filterDomain);
    }

    if (selectedTag) {
      filtered = filtered.filter((p) => p.tech_stack?.includes(selectedTag));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "progress":
          return (b.dev_progress || 0) - (a.dev_progress || 0);
        default:
          return 0;
      }
    });

    return filtered;
  })();

  const shareViews = myViews.data || [];
  const selectedShareView =
    shareViews.find((view) => view.id === selectedShareViewId) ||
    shareViews[0] ||
    null;

  useEffect(() => {
    if (shareViews.length === 0) {
      if (selectedShareViewId) {
        setSelectedShareViewId("");
      }
      return;
    }

    if (!shareViews.some((view) => view.id === selectedShareViewId)) {
      setSelectedShareViewId(shareViews[0].id);
    }
  }, [selectedShareViewId, shareViews]);

  // Share view helpers
  const handleCreateShareView = async () => {
    if (!newShareName.trim()) {
      toast.error("Please enter a name for the share view");
      return;
    }
    if (!user) {
      toast.error("Please sign in to create share views");
      return;
    }
    try {
      const result = await createView.mutateAsync({
        name: newShareName.trim(),
        description: newShareDesc.trim() || null,
        tags: newShareTags,
        labels: [],
        pinned_project_ids: [],
        excluded_project_ids: [],
        theme: "default",
        is_active: true,
      });
      toast.success("Share view created!");
      setShareDialogOpen(false);
      setNewShareName("");
      setNewShareDesc("");
      setNewShareTags([]);
      setSelectedShareViewId(result.id);
      navigate(`/share-views?edit=${result.id}`);
    } catch (err: any) {
      console.error("Share view creation error:", err);
      toast.error(`Failed to create share view: ${err.message || "Unknown error"}`);
    }
  };

  const toggleShareTag = (tag: string) => {
    setNewShareTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const openShareViewEditor = (viewId: string) => {
    navigate(`/share-views?edit=${viewId}`);
  };

  const openShareViewPreview = (shareKey: string) => {
    window.open(`/share/${shareKey}`, "_blank");
  };

  const handleCreateProject = () => navigate("/create-project");
  const handleViewProject = (projectId: string) => navigate(`/projects/${projectId}`);
  const handleEditProject = (projectId: string) => navigate(`/projects/${projectId}`);

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await supabase.from("project_tasks").delete().eq("project_id", projectToDelete);
      await supabase.from("project_components").delete().eq("project_id", projectToDelete);
      await supabase.from("content_ownership").delete().eq("content_id", projectToDelete);
      const { error } = await supabase.from("projects").delete().eq("id", projectToDelete);
      if (error) throw error;
      toast.success("Project deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete project: ${error.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const renderMyProjectCard = (project: Project) => {
    const tasks = projectTasks[project.id] || [];
    const isOwner = projectOwnership[project.id] || false;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;

    return (
      <Card key={project.id} className="flex flex-col h-full">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2 line-clamp-2">{project.name}</h2>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                  <Edit className="h-4 w-4 mr-2" />Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setProjectToDelete(project.id); setDeleteDialogOpen(true); }} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.featured && (
              <Badge variant="default" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                <Sparkles className="h-3 w-3 mr-1" />Featured
              </Badge>
            )}
            {project.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-block bg-muted px-2 py-0.5 rounded-full text-xs">{tag}</span>
            ))}
          </div>
          <p className="text-muted-foreground mb-4 line-clamp-3">{project.description || "No description provided"}</p>
          {tasks.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Recent Tasks ({completedTasks}/{tasks.length})</p>
              <div className="space-y-1">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center text-sm">
                    {task.status === "completed" ? (
                      <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                    ) : (
                      <Circle className="h-3 w-3 mr-2 text-muted-foreground" />
                    )}
                    <span className="line-clamp-1">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{project.status.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Progress</p>
              <p className="font-medium">{project.progress}%</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          {project.has_custom_landing || project.landing_page ? (
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" onClick={() => handleViewProject(project.id)}>View Project</Button>
              <Button variant="default" onClick={() => window.open(`/projects/${project.id}/landing`, "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />Landing
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => handleViewProject(project.id)}>View Project</Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const getCatalogProjectLink = (project: CatalogProject) => {
    const normalizedSourceUrl = project.source_url?.trim() || "";
    const hasExternalSourceUrl = /^https?:\/\//i.test(normalizedSourceUrl);

    if (project.path?.startsWith("/")) {
      return { href: project.path, external: false };
    }

    switch (project.source_table) {
      case "projects":
      case "video_projects":
      case "loreum_creative_works":
        return { href: `/projects/${project.id}`, external: false };
      case "development_projects":
        return {
          href: project.dev_project_id
            ? `/projects/${project.dev_project_id}`
            : `/projects/${project.id}`,
          external: false,
        };
      case "vehicle_configurations":
        return { href: "/vehicle-build", external: false };
      default:
        if (hasExternalSourceUrl) {
          return { href: normalizedSourceUrl, external: true };
        }

        return {
          href: `/projects/${project.dev_project_id || project.id}`,
          external: false,
        };
    }
  };

  const renderCatalogCard = (project: CatalogProject) => {
    const catalogLink = getCatalogProjectLink(project);
    const cardContent = (
      <>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {project.emoji && <span className="text-lg">{project.emoji}</span>}
              <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">{project.name}</CardTitle>
            </div>
            <div className="flex gap-1.5 shrink-0">
              {project.featured && (
                <Badge variant="default" className="text-xs bg-yellow-500/90">
                  <Star className="h-3 w-3 mr-0.5" />
                </Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">{project.status?.replace("_", " ") || "active"}</Badge>
            </div>
          </div>
          {project.description && (
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {/* Domain + Source */}
          <div className="flex items-center gap-2 mb-3">
            {project.domain && (
              <Badge variant="secondary" className="text-xs">{project.domain}</Badge>
            )}
            {project.source_table && (
              <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                {project.source_table.replace("_", " ")}
                {catalogLink.external && <ExternalLink className="h-3 w-3" />}
              </span>
            )}
          </div>

          {/* Progress bar (if dev project) */}
          {project.dev_progress != null && project.dev_progress > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{project.dev_progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${project.dev_progress}%` }} />
              </div>
            </div>
          )}

          {/* Tech stack tags */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tech_stack.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedTag(selectedTag === tag ? null : tag);
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {project.tech_stack.length > 4 && (
                <Badge variant="secondary" className="text-xs">+{project.tech_stack.length - 4}</Badge>
              )}
            </div>
          )}

          {/* Category */}
          {project.category_name && (
            <span className="text-xs text-muted-foreground">{project.category_name}</span>
          )}
        </CardContent>
      </>
    );

    return (
      <Card key={project.id} className="group h-full hover:shadow-lg transition-all duration-200">
        {catalogLink.external ? (
          <a
            href={catalogLink.href}
            target="_blank"
            rel="noreferrer"
            className="block h-full"
          >
            {cardContent}
          </a>
        ) : (
          <Link to={catalogLink.href} className="block h-full">
            {cardContent}
          </Link>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Projects</h1>
            <div className="animate-pulse w-32 h-10 bg-muted rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse"><div className="h-64 bg-muted rounded-lg"></div></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Projects</h1>
          <div className="flex gap-2">
            {user && (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate("/share-views")}>
                  <Share2 className="h-4 w-4 mr-2" />Share Views
                </Button>
                <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />Import .toon
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <ToonImporter onComplete={() => { setImportDialogOpen(false); refetch(); }} />
                  </DialogContent>
                </Dialog>
                <Button onClick={handleCreateProject} size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />Create Project
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects by name, description, or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="my-projects" className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">My Projects</span>
              <span className="sm:hidden">Mine</span>
              {user && myProjects.length > 0 && <Badge variant="secondary" className="ml-1 h-5 text-xs">{myProjects.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" />
              Catalog
              {catalogProjects.length > 0 && <Badge variant="secondary" className="ml-1 h-5 text-xs">{catalogProjects.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="showcase" className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Featured
            </TabsTrigger>
          </TabsList>

          {/* My Projects Tab */}
          <TabsContent value="my-projects">
            {!user ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Sign in to view your projects</h2>
                  <p className="text-muted-foreground mb-6">Create and manage your own projects with tasks, components, and landing pages.</p>
                  <Button onClick={() => navigate("/login")}>Sign In</Button>
                </CardContent>
              </Card>
            ) : filteredMyProjects.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">{searchQuery ? `No projects matching "${searchQuery}"` : "No projects yet"}</h2>
                  <p className="text-muted-foreground mb-6">Create your first project to start tracking components, tasks, and progress.</p>
                  <Button onClick={handleCreateProject}><PlusCircle className="h-4 w-4 mr-2" />Create Your First Project</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Featured Vehicle Build */}
                <Card className="flex flex-col h-full border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                  <CardContent className="pt-6 flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"><Car className="h-6 w-6" /></div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Featured</Badge>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Van Life Build Project</h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">Hardware</span>
                      <span className="inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">Electrical Systems</span>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-3">Complete conversion of a Ford Transit van into a fully self-sufficient mobile home and office.</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium flex items-center"><Wrench className="h-3 w-3 mr-1" />In Progress</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">25%</p>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-3">
                      <Calendar className="h-3 w-3 mr-1" />Started Jan 2024
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button variant="default" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" onClick={() => navigate("/vehicle-build")}>
                        <ExternalLink className="h-4 w-4 mr-2" />View Details
                      </Button>
                      <Button variant="outline" onClick={() => window.open("/projects/vehicle-build/landing", "_blank")}>
                        <Eye className="h-4 w-4 mr-2" />Landing
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
                {filteredMyProjects.map((project) => renderMyProjectCard(project))}
              </div>
            )}
          </TabsContent>

          {/* Catalog Tab - Unified Projects with filters, tags, sorting */}
          <TabsContent value="catalog">
            {/* Filters bar */}
            <div className="flex flex-wrap gap-3 mb-4 items-center">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured"><span className="flex items-center gap-2"><Star className="h-3 w-3" />Featured</span></SelectItem>
                    <SelectItem value="newest"><span className="flex items-center gap-2"><Clock className="h-3 w-3" />Newest</span></SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {allDomains.length > 0 && (
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterDomain} onValueChange={setFilterDomain}>
                    <SelectTrigger className="w-[160px] h-9">
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Domains</SelectItem>
                      {allDomains.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedTag && (
                <Badge variant="default" className="flex items-center gap-1 cursor-pointer" onClick={() => setSelectedTag(null)}>
                  {selectedTag} <X className="h-3 w-3" />
                </Badge>
              )}

              {/* Create Share View button */}
              {user && (
                <div className="ml-auto">
                  <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)}>
                    <Link2 className="h-4 w-4 mr-1" />
                    Create Share View
                  </Button>
                </div>
              )}
            </div>

            {/* Tag cloud */}
            {allCatalogTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {allCatalogTags.slice(0, 24).map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {allCatalogTags.length > 24 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">+{allCatalogTags.length - 24} more</Badge>
                )}
              </div>
            )}

            {/* Existing share views quick access */}
            {user && shareViews.length > 0 && (
              <div className="mb-4 rounded-lg border border-border bg-card/50 p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">Share page group</p>
                    <p className="text-xs text-muted-foreground">Select an existing group to edit or preview it.</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Select value={selectedShareView?.id} onValueChange={setSelectedShareViewId}>
                      <SelectTrigger className="w-full sm:w-[220px] h-9">
                        <SelectValue placeholder="Select share view" />
                      </SelectTrigger>
                      <SelectContent>
                        {shareViews.map((view) => (
                          <SelectItem key={view.id} value={view.id}>{view.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedShareView}
                      onClick={() => selectedShareView && openShareViewEditor(selectedShareView.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />Edit Selected
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={!selectedShareView}
                      onClick={() => selectedShareView && openShareViewPreview(selectedShareView.share_key)}
                    >
                      <Eye className="h-4 w-4 mr-2" />Preview
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {shareViews.slice(0, 5).map((view) => (
                  <Badge
                    key={view.id}
                    variant={selectedShareView?.id === view.id ? "default" : "outline"}
                    className="text-xs cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setSelectedShareViewId(view.id)}
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    {view.name}
                  </Badge>
                ))}
                {shareViews.length > 5 && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => navigate("/share-views")}>
                    View all ({shareViews.length})
                  </Button>
                )}
              </div>
            )}

            {/* Results */}
            {catalogLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader><div className="h-6 bg-muted rounded w-3/4 mb-2"></div><div className="h-4 bg-muted rounded w-full"></div></CardHeader>
                    <CardContent><div className="h-20 bg-muted rounded"></div></CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCatalog.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">{searchQuery || selectedTag || filterDomain !== "all" ? "No projects found matching your filters." : "No projects in the catalog yet."}</p>
                {(searchQuery || selectedTag || filterDomain !== "all") && (
                  <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedTag(null); setFilterDomain("all"); }}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">{filteredCatalog.length} project{filteredCatalog.length !== 1 ? "s" : ""}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCatalog.map((project) => renderCatalogCard(project))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Featured / Showcase Tab */}
          <TabsContent value="showcase">
            {(() => {
              const featuredProjects = catalogProjects.filter((p) => p.featured);
              return featuredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No featured projects yet</h2>
                  <p className="text-muted-foreground">Check back soon for curated, standout projects!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProjects.map((project) => renderCatalogCard(project))}
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>

        {/* Create Share View Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Share View</DialogTitle>
              <DialogDescription>
                Create a curated page of projects to share with a specific audience. Pick tags to auto-populate, then fine-tune on the Share Views page.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="share-name">View Name</Label>
                <Input id="share-name" placeholder="e.g. Hardware & Technical" value={newShareName} onChange={(e) => setNewShareName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="share-desc">Description (optional)</Label>
                <Textarea id="share-desc" placeholder="What this collection is about..." value={newShareDesc} onChange={(e) => setNewShareDesc(e.target.value)} rows={2} />
              </div>
              <div>
                <Label>Auto-populate by tags</Label>
                <p className="text-xs text-muted-foreground mb-2">Projects matching these tags will appear in this view.</p>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {allCatalogTags.slice(0, 30).map((tag) => (
                    <Badge
                      key={tag}
                      variant={newShareTags.includes(tag) ? "default" : "outline"}
                      className="text-xs cursor-pointer transition-colors"
                      onClick={() => toggleShareTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {newShareTags.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">{newShareTags.length} tag{newShareTags.length !== 1 ? "s" : ""} selected</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateShareView} disabled={!newShareName.trim() || createView.isPending}>
                {createView.isPending ? "Creating..." : "Create View"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to delete this project? This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Project</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Projects;
