import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  Eye,
  Heart,
  Search,
  Star,
  TrendingUp,
  Clock,
  Filter,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

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

const ProjectsShowcase = () => {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PublicProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [filterStatus, setFilterStatus] = useState("all");
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchPublicProjects();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchQuery, projects, sortBy, filterStatus]);

  const applyFiltersAndSort = () => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((project) => project.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.view_count || 0) - (a.view_count || 0);
        case "trending":
          return (b.view_count || 0) - (a.view_count || 0);
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "popular":
          return (b.like_count || 0) - (a.like_count || 0);
        case "progress":
          return (b.progress || 0) - (a.progress || 0);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  };

  const fetchPublicProjects = async () => {
    try {
      // First get all public projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(
          `
          id,
          name,
          description,
          tags,
          image_url,
          view_count,
          like_count,
          featured,
          created_at,
          status,
          progress,
          has_custom_landing,
          landing_page,
          owner_id,
          created_by
        `,
        )
        .eq("is_public", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      // Get all user IDs we need to fetch
      const userIds = new Set<string>();
      (projectsData || []).forEach((project: any) => {
        if (project.owner_id) userIds.add(project.owner_id);
        if (project.created_by) userIds.add(project.created_by);
      });

      // Also get owners from content_ownership table
      const { data: ownershipData } = await supabase
        .from("content_ownership")
        .select("content_id, owner_id")
        .eq("content_type", "project")
        .in("content_id", (projectsData || []).map((p: any) => p.id));

      // Add owners from content_ownership
      (ownershipData || []).forEach((ownership: any) => {
        if (ownership.owner_id) userIds.add(ownership.owner_id);
      });

      // Fetch all profiles at once
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", Array.from(userIds));

      // Create a map of user IDs to usernames
      const usernameMap = new Map(
        (profilesData || []).map((profile: any) => [profile.id, profile.username])
      );

      // Create a map of project IDs to owner IDs from content_ownership
      const ownershipMap = new Map(
        (ownershipData || []).map((ownership: any) => [ownership.content_id, ownership.owner_id])
      );

      // Process data to include owner_username
      const processedData = (projectsData || []).map((project: any) => {
        // Determine the owner ID: prefer owner_id, then created_by, then content_ownership
        const ownerId = project.owner_id || project.created_by || ownershipMap.get(project.id);
        
        return {
          ...project,
          owner_username: ownerId ? usernameMap.get(ownerId) : undefined,
        };
      });

      setProjects(processedData);
      setFilteredProjects(processedData);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

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

      // Update local state
      const newLikedProjects = new Set(likedProjects);
      if (isLiked) {
        newLikedProjects.delete(projectId);
      } else {
        newLikedProjects.add(projectId);
      }
      setLikedProjects(newLikedProjects);

      // Update projects state
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? { ...project, like_count: newLikeCount }
            : project,
        ),
      );
    } catch (error: any) {
      console.error("Error liking project:", error);
      toast.error("Failed to like project");
    }
  };

  const incrementViewCount = async (projectId: string) => {
    try {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      const { error } = await supabase
        .from("projects")
        .update({ view_count: (project.view_count || 0) + 1 })
        .eq("id", projectId);

      if (error) throw error;
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Discover Projects</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore innovative projects from our community
            </p>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-4 justify-center items-center">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          Featured
                        </div>
                      </SelectItem>
                      <SelectItem value="trending">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Trending
                        </div>
                      </SelectItem>
                      <SelectItem value="newest">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Newest
                        </div>
                      </SelectItem>
                      <SelectItem value="popular">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-2" />
                          Most Liked
                        </div>
                      </SelectItem>
                      <SelectItem value="progress">Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {searchQuery
                  ? "No projects found matching your search."
                  : "No public projects yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group h-full hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="relative">
                    {project.image_url && (
                      <div className="h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={project.image_url}
                          alt={project.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-2">
                      {project.featured && (
                        <Badge
                          variant="default"
                          className="bg-yellow-500/90 backdrop-blur-sm"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 flex gap-2">
                      {project.has_custom_landing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="bg-white/90 backdrop-blur-sm hover:bg-white"
                        >
                          <Link
                            to={`/projects/${project.id}/landing`}
                            onClick={(e) => {
                              e.stopPropagation();
                              incrementViewCount(project.id);
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLikeProject(
                            project.id,
                            project.like_count || 0,
                          );
                        }}
                        className={`bg-white/90 backdrop-blur-sm hover:bg-white ${
                          likedProjects.has(project.id) ? "text-red-500" : ""
                        }`}
                      >
                        <Heart
                          className={`h-3 w-3 ${likedProjects.has(project.id) ? "fill-current" : ""}`}
                        />
                      </Button>
                    </div>
                  </div>

                  <Link
                    to={`/projects/${project.id}`}
                    onClick={() => incrementViewCount(project.id)}
                    className="block"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {project.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs capitalize">
                          {project.status.replace("_", " ")}
                        </Badge>
                      </div>
                      {project.description && (
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{project.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Stats and Owner */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {project.view_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {project.like_count || 0}
                          </span>
                        </div>
                        {project.owner_username && (
                          <span className="text-xs">
                            by @{project.owner_username}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {/* Load More / Pagination could be added here */}
          {filteredProjects.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/create-project")}
                className="mr-4"
              >
                Share Your Project
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Back to Top
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsShowcase;
