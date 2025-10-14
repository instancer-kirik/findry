import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProject } from "@/hooks/use-project";
import { Project } from "@/types/project";
import { useAuth } from "@/hooks/use-auth";
import { Car, Wrench, ExternalLink, Calendar, MoreVertical, Edit, Trash2, CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { useGetProjects } = useProject();
  const { data: projects = [], isLoading, error, refetch } = useGetProjects();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectOwnership, setProjectOwnership] = useState<Record<string, boolean>>({});
  const [projectTasks, setProjectTasks] = useState<Record<string, any[]>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

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
          console.error(`Error checking ownership for ${project.id}:`, err);
          ownershipMap[project.id] = false;
        }
      }
      
      setProjectOwnership(ownershipMap);
    };

    checkAllOwnership();
  }, [user, projects]);

  // Fetch tasks for all projects
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
          console.error(`Error fetching tasks for ${project.id}:`, err);
          tasksMap[project.id] = [];
        }
      }
      
      setProjectTasks(tasksMap);
    };

    fetchAllTasks();
  }, [projects]);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.tags &&
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        )),
  );

  const handleCreateProject = () => {
    navigate("/create-project");
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      // Delete related records first
      await supabase.from("project_tasks").delete().eq("project_id", projectToDelete);
      await supabase.from("project_components").delete().eq("project_id", projectToDelete);
      await supabase.from("content_ownership").delete().eq("content_id", projectToDelete);
      
      // Delete the project
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectToDelete);

      if (error) throw error;

      toast.success("Project deleted successfully");
      refetch();
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error(`Failed to delete project: ${error.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const openDeleteDialog = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Projects</h1>
            <div className="animate-pulse w-32 h-10 bg-muted rounded"></div>
          </div>
          <div className="animate-pulse mb-8 h-12 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
          {user && (
            <Button onClick={handleCreateProject} className="mt-4 sm:mt-0">
              Create Project
            </Button>
          )}
        </div>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search projects by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xl"
          />
        </div>

        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500">
              Error loading projects: {error.toString()}
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No projects found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? `No projects matching "${searchQuery}"`
                : "There are no projects available yet"}
            </p>
            {user && (
              <Button onClick={handleCreateProject}>
                Create Your First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Vehicle Build Project */}
            <Card className="flex flex-col h-full border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="pt-6 flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                    <Car className="h-6 w-6" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                  >
                    Featured
                  </Badge>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Van Life Build Project
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    Hardware
                  </span>
                  <span className="inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                    Electrical Systems
                  </span>
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                    Solar Power
                  </span>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  Complete conversion of a Ford Transit van into a fully
                  self-sufficient mobile home and office. Features 800W solar
                  system, lithium batteries, full kitchen, and remote work
                  setup.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium flex items-center">
                      <Wrench className="h-3 w-3 mr-1" />
                      In Progress
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Progress</p>
                    <p className="font-medium">25%</p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-3">
                  <Calendar className="h-3 w-3 mr-1" />
                  Started Jan 2024
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={() => navigate("/vehicle-build")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Build Details
                </Button>
              </CardFooter>
            </Card>

            {filteredProjects.map((project: Project) => {
              const tasks = projectTasks[project.id] || [];
              const isOwner = projectOwnership[project.id] || false;
              const completedTasks = tasks.filter(t => t.status === 'completed').length;
              
              return (
                <Card key={project.id} className="flex flex-col h-full">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                        {project.name}
                      </h2>
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
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(project.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags &&
                        project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-muted px-2 py-0.5 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {project.description || "No description provided"}
                    </p>
                    
                    {/* Tasks Preview */}
                    {tasks.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Recent Tasks ({completedTasks}/{tasks.length} completed)
                        </p>
                        <div className="space-y-1">
                          {tasks.slice(0, 3).map((task) => (
                            <div key={task.id} className="flex items-center text-sm">
                              {task.status === 'completed' ? (
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
                        <p className="font-medium capitalize">
                          {project.status.replace("_", " ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">{project.progress}%</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleViewProject(project.id)}
                    >
                      View Project
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this project? This action cannot be undone.
                All project components and tasks will also be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Projects;
