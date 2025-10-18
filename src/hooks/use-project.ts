import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Project,
  ProjectComponent,
  ProjectTask,
  ProjectOwnershipType,
} from "@/types/project";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

export type ProjectStatus =
  | "pending"
  | "planning"
  | "in_progress"
  | "completed"
  | "cancelled";

export const useGetProject = (projectId?: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async (): Promise<Project | null> => {
      if (!projectId) return null;

      try {
        // Get the project data
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();

        if (error) throw error;
        if (!data) return null;

        // Get components
        const { data: componentsData, error: componentsError } = await supabase
          .from("project_components")
          .select("*")
          .eq("project_id", projectId);

        if (componentsError) throw componentsError;

        // Get tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from("project_tasks")
          .select("*")
          .eq("project_id", projectId);

        if (tasksError) throw tasksError;

        // Get ownership data - use project fields first, then fallback to content_ownership table
        let ownerType: ProjectOwnershipType =
          (data.owner_type as ProjectOwnershipType) || "personal";
        let ownerId: string = data.owner_id || data.created_by || "";

        // If no owner data in project table, try content_ownership table
        if (!ownerId) {
          try {
            const { data: ownershipData, error: ownershipError } =
              await supabase
                .from("content_ownership")
                .select("*")
                .eq("content_id", projectId)
                .eq("content_type", "project")
                .maybeSingle();

            if (!ownershipError && ownershipData) {
              ownerId = ownershipData.owner_id;
              ownerType = "personal"; // Default for content_ownership entries
            }
          } catch (ownershipError) {
            console.warn("Could not fetch ownership data:", ownershipError);
            // Continue without ownership data
          }
        }

        const project: Project = {
          id: data.id,
          name: data.name,
          description: data.description || "",
          status: (data.status as any) || "planning",
          version: data.version || "0.1.0",
          progress: data.progress || 0,
          tags: data.tags || [],
          components: componentsData
            ? componentsData.map((c: any) => ({
                id: c.id,
                name: c.name,
                type: c.type || "feature",
                description: c.description || "",
                status: c.status || "pending",
                assignedTo: c.assigned_to,
                dueDate: c.due_date,
                projectId: c.project_id,
              }))
            : [],
          tasks: tasksData
            ? tasksData.map((t: any) => ({
                id: t.id,
                title: t.title,
                description: t.description || "",
                status: t.status || "pending",
                assignedTo: t.assigned_to,
                dueDate: t.due_date,
                priority: t.priority || "medium",
                projectId: t.project_id,
                componentId: t.component_id,
              }))
            : [],
          ownerType: ownerType,
          ownerId: ownerId,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          // Additional fields from the database schema
          budget: data.budget || "",
          location: data.location || "",
          timeline: data.timeline || "",
          type: data.type || "",
          image_url: data.image_url || "",
          repo_url: data.repo_url || "",
          // New ownership and discovery fields
          owner_type: data.owner_type,
          owner_id: data.owner_id,
          created_by: data.created_by,
          is_public: data.is_public || false,
          featured: data.featured || false,
          view_count: data.view_count || 0,
          like_count: data.like_count || 0,
        };

        return project;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(`Error fetching project ${projectId}:`, error);
        toast(`Error fetching project: ${errorMessage}`);
        return null;
      }
    },
    enabled: !!projectId,
  });
};

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // For each project, we might want to fetch ownership data
        // but for performance reasons, we'll set defaults here
        return (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description || "",
          status: p.status || "planning",
          version: p.version || "0.1.0",
          progress: p.progress || 0,
          tags: p.tags || [],
          components: [],
          tasks: [],
          ownerType: (p.owner_type as ProjectOwnershipType) || "personal",
          ownerId: p.owner_id || p.created_by || "",
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          // Additional fields
          budget: p.budget || "",
          location: p.location || "",
          timeline: p.timeline || "",
          type: p.type || "",
          image_url: p.image_url || "",
          repo_url: p.repo_url || "",
          // New ownership and discovery fields
          owner_type: p.owner_type,
          owner_id: p.owner_id,
          created_by: p.created_by,
          is_public: p.is_public || false,
          featured: p.featured || false,
          view_count: p.view_count || 0,
          like_count: p.like_count || 0,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching projects:", error);
        toast(`Error fetching projects: ${errorMessage}`);
        return [];
      }
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (
      projectData: Omit<
        Project,
        "id" | "createdAt" | "updatedAt" | "components" | "tasks"
      >,
    ) => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .insert({
            name: projectData.name,
            description: projectData.description,
            status: projectData.status,
            version: projectData.version,
            progress: projectData.progress,
            tags: projectData.tags,
            owner_type: projectData.ownerType,
            owner_id: projectData.ownerId || user?.id,
            created_by: user?.id,
            is_public: false,
            featured: false,
          })
          .select("id")
          .single();

        if (error) throw error;
        if (!data) throw new Error("Failed to create project");

        // Create content ownership record
        if (user?.id) {
          try {
            await supabase.from("content_ownership").insert({
              content_id: data.id,
              content_type: "project",
              owner_id: user.id,
            });
          } catch (ownershipError) {
            console.warn(
              "Failed to create content ownership record:",
              ownershipError,
            );
            // Continue even if ownership record creation fails
          }
        }

        return data.id;
      } catch (error) {
        console.error("Error creating project:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast("Project created successfully");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast(`Error creating project: ${errorMessage}`);
    },
  });
};

export const useProject = () => {
  return {
    useGetProjects,
    useGetProject,
    useCreateProject,
  };
};
