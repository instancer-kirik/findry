import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Github,
  Twitter,
  Globe,
  Youtube,
  Instagram,
  ExternalLink,
  Star,
  Eye,
  Calendar,
  Users,
  Zap,
  Target,
  Rocket,
  Play,
} from "lucide-react";
import {
  Project,
  ProjectLandingPage,
  SocialLink,
  LandingPageSection,
} from "@/types/project";
import { cn } from "@/lib/utils";

interface CustomLandingPageProps {
  project: Project;
  landingPage: ProjectLandingPage;
  isOwner?: boolean;
  onEdit?: () => void;
}

const CustomLandingPage: React.FC<CustomLandingPageProps> = ({
  project,
  landingPage,
  isOwner = false,
  onEdit,
}) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "github":
        return Github;
      case "twitter":
        return Twitter;
      case "youtube":
        return Youtube;
      case "instagram":
        return Instagram;
      case "website":
        return Globe;
      default:
        return ExternalLink;
    }
  };

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case "minimal":
        return {
          background: "bg-white",
          text: "text-gray-900",
          accent: "text-blue-600",
        };
      case "showcase":
        return {
          background:
            "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900",
          text: "text-white",
          accent: "text-yellow-400",
        };
      case "hype":
        return {
          background:
            "bg-gradient-to-br from-red-500 via-pink-500 to-purple-600",
          text: "text-white",
          accent: "text-yellow-300",
        };
      case "technical":
        return {
          background: "bg-gray-900",
          text: "text-green-400",
          accent: "text-cyan-400",
        };
      default:
        return {
          background: "bg-gradient-to-br from-slate-50 to-slate-100",
          text: "text-slate-900",
          accent: "text-blue-600",
        };
    }
  };

  const themeStyles = getThemeStyles(landingPage.theme);
  const completedComponents =
    project.components?.filter((c) => c.status === "completed").length || 0;
  const totalComponents = project.components?.length || 0;
  const completionRate =
    totalComponents > 0 ? (completedComponents / totalComponents) * 100 : 0;

  const renderSection = (section: LandingPageSection) => {
    if (!section.visible) return null;

    switch (section.type) {
      case "text":
        return (
          <div key={section.id} className="py-8">
            <div className="max-w-4xl mx-auto px-6">
              {section.title && (
                <h2 className={cn("text-3xl font-bold mb-6", themeStyles.text)}>
                  {section.title}
                </h2>
              )}
              {section.content && (
                <div
                  className={cn("prose prose-lg max-w-none", themeStyles.text)}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
            </div>
          </div>
        );

      case "features":
        return (
          <div key={section.id} className="py-12">
            <div className="max-w-6xl mx-auto px-6">
              {section.title && (
                <h2
                  className={cn(
                    "text-3xl font-bold text-center mb-12",
                    themeStyles.text,
                  )}
                >
                  {section.title}
                </h2>
              )}
              <div className="grid md:grid-cols-3 gap-8">
                {project.components?.slice(0, 6).map((component, index) => (
                  <Card key={component.id} className="border-0 shadow-lg">
                    <CardHeader className="text-center pb-4">
                      <div
                        className={cn(
                          "w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4",
                          component.status === "completed"
                            ? "bg-green-100"
                            : component.status === "in_progress"
                              ? "bg-blue-100"
                              : "bg-gray-100",
                        )}
                      >
                        <Zap
                          className={cn(
                            "h-6 w-6",
                            component.status === "completed"
                              ? "text-green-600"
                              : component.status === "in_progress"
                                ? "text-blue-600"
                                : "text-gray-600",
                          )}
                        />
                      </div>
                      <CardTitle className="text-lg">
                        {component.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {component.description || "Component in development"}
                      </p>
                      <Badge
                        variant={
                          component.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="w-full justify-center"
                      >
                        {component.status.replace("_", " ")}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div key={section.id} className="py-12">
            <div className="max-w-4xl mx-auto px-6">
              {section.title && (
                <h2
                  className={cn(
                    "text-3xl font-bold text-center mb-12",
                    themeStyles.text,
                  )}
                >
                  {section.title}
                </h2>
              )}
              <div className="space-y-8">
                {project.components?.map((component, index) => (
                  <div key={component.id} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          component.status === "completed"
                            ? "bg-green-500"
                            : component.status === "in_progress"
                              ? "bg-blue-500"
                              : "bg-gray-400",
                        )}
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      {index < project.components.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-200 ml-4 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h3
                        className={cn(
                          "font-semibold text-lg",
                          themeStyles.text,
                        )}
                      >
                        {component.name}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        {component.description || "In development"}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {component.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "gallery":
        return (
          <div key={section.id} className="py-12">
            <div className="max-w-6xl mx-auto px-6">
              {section.title && (
                <h2
                  className={cn(
                    "text-3xl font-bold text-center mb-12",
                    themeStyles.text,
                  )}
                >
                  {section.title}
                </h2>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.image_url && (
                  <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={project.image_url}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {/* Placeholder for additional images */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg"
                  >
                    <span className="text-gray-500">Image {i + 2}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn("min-h-screen", themeStyles.background)}
      style={{
        backgroundColor: landingPage.background_color,
        color: landingPage.text_color,
      }}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {landingPage.hero_video && (
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              className="w-full h-full object-cover opacity-20"
            >
              <source src={landingPage.hero_video} type="video/mp4" />
            </video>
          </div>
        )}

        {landingPage.hero_image && !landingPage.hero_video && (
          <div className="absolute inset-0 z-0">
            <img
              src={landingPage.hero_image}
              alt="Hero background"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
        )}

        <div className="relative z-10 pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            {isOwner && (
              <div className="absolute top-6 right-6">
                <Button variant="secondary" size="sm" onClick={onEdit}>
                  Edit Landing Page
                </Button>
              </div>
            )}

            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">
                <Rocket className="h-4 w-4 mr-2" />
                {project.status?.replace("_", " ").toUpperCase()}
              </Badge>
            </div>

            <h1
              className={cn(
                "text-5xl md:text-7xl font-bold mb-6",
                themeStyles.text,
              )}
            >
              {landingPage.hero_title || project.name}
            </h1>

            <p
              className={cn(
                "text-xl md:text-2xl mb-8 max-w-4xl mx-auto",
                themeStyles.text,
                "opacity-90",
              )}
            >
              {landingPage.hero_subtitle || project.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {landingPage.call_to_action && landingPage.cta_link && (
                <Button size="lg" className="text-lg px-8 py-3">
                  {landingPage.call_to_action}
                  <ExternalLink className="h-5 w-5 ml-2" />
                </Button>
              )}

              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <Github className="h-5 w-5 mr-2" />
                View Project
              </Button>

              {landingPage.hero_video && (
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              )}
            </div>

            {/* Project Stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className={cn("text-2xl font-bold", themeStyles.accent)}>
                  {Math.round(completionRate)}%
                </div>
                <div className={cn(themeStyles.text, "opacity-70")}>
                  Complete
                </div>
              </div>
              <div className="text-center">
                <div className={cn("text-2xl font-bold", themeStyles.accent)}>
                  {totalComponents}
                </div>
                <div className={cn(themeStyles.text, "opacity-70")}>
                  Components
                </div>
              </div>
              <div className="text-center">
                <div className={cn("text-2xl font-bold", themeStyles.accent)}>
                  {project.view_count || 0}
                </div>
                <div className={cn(themeStyles.text, "opacity-70")}>Views</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span className={cn(themeStyles.text, "opacity-70")}>
                  Progress
                </span>
                <span className={cn(themeStyles.text, "opacity-70")}>
                  {Math.round(completionRate)}%
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            {/* Social Links */}
            {landingPage.social_links &&
              landingPage.social_links.length > 0 && (
                <div className="flex justify-center gap-4 mt-8">
                  {landingPage.social_links.map((link, index) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "p-3 rounded-full transition-colors",
                          "hover:bg-white/10 border border-white/20",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Dynamic Sections */}
      {landingPage.sections
        .sort((a, b) => a.order - b.order)
        .map(renderSection)}

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className={cn("text-sm", themeStyles.text, "opacity-60")}>
            © {new Date().getFullYear()} {project.name}. Built with passion.
          </p>
        </div>
      </footer>

      {/* Custom CSS */}
      {landingPage.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: landingPage.custom_css }} />
      )}
    </div>
  );
};

export default CustomLandingPage;
