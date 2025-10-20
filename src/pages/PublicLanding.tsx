import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CustomLandingPage from "@/components/projects/landing/CustomLandingPage";
import { Project, ProjectLandingPage } from "@/types/project";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PublicLanding: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError("Project ID is required");
        setLoading(false);
        return;
      }

      try {
        // Fetch the project with landing page data
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select(`
            *,
            components:project_components(*),
            tasks:project_tasks(*)
          `)
          .eq("id", projectId)
          .eq("is_public", true)
          .eq("has_custom_landing", true)
          .single();

        if (projectError) {
          if (projectError.code === "PGRST116") {
            setError("Landing page not found or not public");
          } else {
            setError("Failed to load landing page");
          }
          setLoading(false);
          return;
        }

        if (!projectData) {
          setError("Project not found");
          setLoading(false);
          return;
        }

        // Increment view count
        await supabase
          .from("projects")
          .update({ view_count: (projectData.view_count || 0) + 1 })
          .eq("id", projectId);

        setProject(projectData as Project);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading landing page...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Landing Page Not Available</h1>
            <p className="text-muted-foreground mb-4">
              {error || "This project's landing page is not publicly accessible."}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
            >
              Go to Findry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project.landing_page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">No Landing Page</h1>
            <p className="text-muted-foreground mb-4">
              This project doesn't have a custom landing page configured yet.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = `/projects/${projectId}`}
            >
              View Project
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* SEO Meta Tags */}
      <head>
        <title>{project.landing_page.hero_title || project.name} - Findry</title>
        <meta
          name="description"
          content={project.landing_page.hero_subtitle || project.description}
        />
        <meta property="og:title" content={project.landing_page.hero_title || project.name} />
        <meta
          property="og:description"
          content={project.landing_page.hero_subtitle || project.description}
        />
        {project.landing_page.hero_image && (
          <meta property="og:image" content={project.landing_page.hero_image} />
        )}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={project.landing_page.hero_title || project.name} />
        <meta
          name="twitter:description"
          content={project.landing_page.hero_subtitle || project.description}
        />
        {project.landing_page.hero_image && (
          <meta name="twitter:image" content={project.landing_page.hero_image} />
        )}
      </head>

      <CustomLandingPage
        project={project}
        landingPage={project.landing_page as ProjectLandingPage}
        isOwner={false}
      />

      {/* Analytics tracking could be added here */}
      {project.landing_page.custom_css && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Custom analytics or tracking code could go here
              // For example, Google Analytics, Mixpanel, etc.
            `,
          }}
        />
      )}
    </div>
  );
};

export default PublicLanding;
