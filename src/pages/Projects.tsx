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
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ToonImporter } from "@/components/projects/ToonImporter";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
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

interface PublicProject {
  id: string;
  name: string;
  description: string;
  tags: string[];
  image_url: string | null;
  view_count: number;
  like_count: number;
  featured: boolean;
  created_at: string;
  status: string;
  progress: number;
  owner_username?: string;
  has_custom_landing: boolean;
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { useGetProjects } = useProject();
  const { data: projects = [], isLoading, error, refetch } = useGetProjects();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectOwnership, setProjectOwnership] = useState<Record<string, boolean>>({});
  const [projectTasks, setProjectTasks] = useState<Record<string, any[]>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Catalog state
  const [catalogProjects, setCatalogProjects] = useState<PublicProject[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());

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

  // Fetch catalog projects
  useEffect(() => {
    fetchCatalogProjects();
  }, []);

  const fetchCatalogProjects = async () => {
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(`id, name, description, tags, image_url, view_count, like_count, featured, created_at, status, progress, has_custom_landing, owner_id, created_by`)
        .eq("is_public", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      const userIds = new Set<string>();
      (projectsData || []).forEach((p: any) => {
        if (p.owner_id) userIds.add(p.owner_id);
        if (p.created_by) userIds.add(p.created_by);
      });

      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", Array.from(userIds));

      const usernameMap = new Map(
        (profilesData || []).map((p: any) => [p.id, p.username])
      );

      const processed = (projectsData || []).map((project: any) => ({
        ...project,
        owner_username: usernameMap.get(project.owner_id || project.created_by),
      }));

      setCatalogProjects(processed);
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

  // Catalog filtering + sorting
  const allCatalogTags = Array.from(
    new Set(catalogProjects.flatMap((p) => p.tags || []))
  ).sort();

  const filteredCatalog = (() => {
    let filtered = [...catalogProjects];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    if (selectedTag) {
      filtered = filtered.filter((p) => p.tags?.includes(selectedTag));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.view_count || 0) - (a.view_count || 0);
        case "trending":
          return (b.view_count || 0) - (a.view_count || 0);
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "popular":
          return (b.like_count || 0) - (a.like_count || 0);
        case "progress":
          return (b.progress || 0) - (a.progress || 0);
        default:
          return 0;
      }
    });

    return filtered;
  })();

  const handleLikeProject = async (projectId: string, currentLikes: number) => {
    if (!user) {
      toast.error("Please log in to like projects");
      return;
    }
    try {
      const isLiked = likedProjects.has(projectId);
      const newLikeCount = isLiked ? currentLikes - 1 : currentLikes + 1;
      const { error } = await supabase
        .from("projects")
        .update({ like_count: newLikeCount })
        .eq("id", projectId);
      if (error) throw error;

      const newLiked = new Set(likedProjects);
      if (isLiked) newLiked.delete(projectId);
      else newLiked.add(projectId);
      setLikedProjects(newLiked);

      setCatalogProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, like_count: newLikeCount } : p))
      );
    } catch (error: any) {
      toast.error("Failed to like project");
    }
  };

  const incrementViewCount = async (projectId: string) => {
    try {
      const project = catalogProjects.find((p) => p.id === projectId);
      if (!project) return;
      await supabase
        .from("projects")
        .update({ view_count: (project.view_count || 0) + 1 })
        .eq("id", projectId);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
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
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setProjectToDelete(project.id); setDeleteDialogOpen(true); }} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
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
              <p className="text-sm font-medium text-muted-foreground">Recent Tasks ({completedTasks}/{tasks.length} completed)</p>
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

  const renderCatalogCard = (project: PublicProject) => (
    <Card key={project.id} className="group h-full hover:shadow-lg transition-all duration-200">
      <div className="relative">
        {project.image_url && (
          <div className="h-40 overflow-hidden rounded-t-lg">
            <img src={project.image_url} alt={project.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {project.featured && (
            <Badge variant="default" className="bg-yellow-500/90 backdrop-blur-sm">
              <Star className="h-3 w-3 mr-1" />Featured
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          {project.has_custom_landing && (
            <Button variant="ghost" size="sm" asChild className="bg-background/80 backdrop-blur-sm hover:bg-background">
              <Link to={`/projects/${project.id}/landing`} onClick={(e) => { e.stopPropagation(); incrementViewCount(project.id); }}>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLikeProject(project.id, project.like_count || 0); }}
            className={`bg-background/80 backdrop-blur-sm hover:bg-background ${likedProjects.has(project.id) ? "text-red-500" : ""}`}
          >
            <Heart className={`h-3 w-3 ${likedProjects.has(project.id) ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      <Link to={`/projects/${project.id}`} onClick={() => incrementViewCount(project.id)} className="block">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">{project.name}</CardTitle>
            <Badge variant="outline" className="text-xs capitalize shrink-0">{project.status.replace("_", " ")}</Badge>
          </div>
          {project.description && (
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{project.progress || 0}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${project.progress || 0}%` }} />
            </div>
          </div>
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tags.slice(0, 3).map((tag) => (
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
              {project.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">+{project.tags.length - 3}</Badge>
              )}
            </div>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{project.view_count || 0}</span>
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{project.like_count || 0}</span>
            </div>
            {project.owner_username && <span className="text-xs">by @{project.owner_username}</span>}
          </div>
        </CardContent>
      </Link>
    </Card>
  );

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
          {user && (
            <div className="flex gap-2">
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
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects by name, description, or tags..."
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

          {/* Catalog Tab - Full browsing with filters, tags, sorting */}
          <TabsContent value="catalog">
            {/* Filters bar */}
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured"><span className="flex items-center gap-2"><Star className="h-3 w-3" />Featured</span></SelectItem>
                    <SelectItem value="trending"><span className="flex items-center gap-2"><TrendingUp className="h-3 w-3" />Trending</span></SelectItem>
                    <SelectItem value="newest"><span className="flex items-center gap-2"><Clock className="h-3 w-3" />Newest</span></SelectItem>
                    <SelectItem value="popular"><span className="flex items-center gap-2"><Heart className="h-3 w-3" />Most Liked</span></SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedTag && (
                <Badge variant="default" className="flex items-center gap-1 cursor-pointer" onClick={() => setSelectedTag(null)}>
                  {selectedTag} <X className="h-3 w-3" />
                </Badge>
              )}
            </div>

            {/* Tag cloud */}
            {allCatalogTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {allCatalogTags.slice(0, 20).map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {allCatalogTags.length > 20 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">+{allCatalogTags.length - 20} more</Badge>
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
                <p className="text-lg text-muted-foreground">{searchQuery || selectedTag ? "No projects found matching your filters." : "No public projects yet."}</p>
                {(searchQuery || selectedTag || filterStatus !== "all") && (
                  <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedTag(null); setFilterStatus("all"); }}>
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to delete this project? This action cannot be undone. All project components and tasks will also be deleted.</AlertDialogDescription>
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
