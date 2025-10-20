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
      case "sleek":
        return {
          background: "bg-black",
          text: "text-white",
          accent: "text-blue-400",
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
          <div
            key={section.id}
            className={cn(
              "py-8",
              landingPage.theme === "sleek"
                ? "border-b border-gray-800/50"
                : "",
            )}
          >
            <div className="max-w-4xl mx-auto px-6">
              {section.title && (
                <h2
                  className={cn(
                    "text-3xl font-bold mb-6",
                    themeStyles.text,
                    landingPage.theme === "sleek"
                      ? "font-mono tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent border-l-4 border-blue-400 pl-6"
                      : "",
                  )}
                >
                  {section.title}
                </h2>
              )}
              {section.content && (
                <div
                  className={cn(
                    "prose prose-lg max-w-none",
                    themeStyles.text,
                    landingPage.theme === "sleek"
                      ? "prose-invert font-mono text-gray-300 prose-headings:text-white prose-headings:font-mono prose-code:text-cyan-400 prose-code:bg-gray-900 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700"
                      : "",
                  )}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
            </div>
          </div>
        );

      case "features":
        return (
          <div
            key={section.id}
            className={cn(
              "py-12",
              landingPage.theme === "sleek"
                ? "border-b border-gray-800/50"
                : "",
            )}
          >
            <div className="max-w-6xl mx-auto px-6">
              {section.title && (
                <h2
                  className={cn(
                    "text-3xl font-bold text-center mb-12",
                    themeStyles.text,
                    landingPage.theme === "sleek"
                      ? "font-mono tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                      : "",
                  )}
                >
                  {section.title}
                </h2>
              )}
              <div className="grid md:grid-cols-3 gap-8">
                {project.components?.slice(0, 6).map((component, index) => (
                  <Card
                    key={component.id}
                    className={cn(
                      "border-0 shadow-lg transition-all duration-300 hover:scale-105",
                      landingPage.theme === "sleek"
                        ? "bg-gray-900/50 border border-gray-700 backdrop-blur hover:border-gray-500 hover:shadow-2xl hover:shadow-blue-400/20"
                        : "",
                    )}
                  >
                    <CardHeader className="text-center pb-4">
                      <div
                        className={cn(
                          "w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300",
                          landingPage.theme === "sleek"
                            ? component.status === "completed"
                              ? "bg-green-400/20 border-2 border-green-400"
                              : component.status === "in_progress"
                                ? "bg-blue-400/20 border-2 border-blue-400"
                                : "bg-gray-400/20 border-2 border-gray-400"
                            : component.status === "completed"
                              ? "bg-green-100"
                              : component.status === "in_progress"
                                ? "bg-blue-100"
                                : "bg-gray-100",
                        )}
                      >
                        <Zap
                          className={cn(
                            "h-6 w-6",
                            landingPage.theme === "sleek"
                              ? component.status === "completed"
                                ? "text-green-400"
                                : component.status === "in_progress"
                                  ? "text-blue-400"
                                  : "text-gray-400"
                              : component.status === "completed"
                                ? "text-green-600"
                                : component.status === "in_progress"
                                  ? "text-blue-600"
                                  : "text-gray-600",
                          )}
                        />
                      </div>
                      <CardTitle
                        className={cn(
                          "text-lg",
                          landingPage.theme === "sleek"
                            ? "font-mono text-white"
                            : "",
                        )}
                      >
                        {component.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className={cn(
                          "text-sm mb-3",
                          landingPage.theme === "sleek"
                            ? "text-gray-300 font-mono text-xs"
                            : "text-muted-foreground",
                        )}
                      >
                        {component.description || "Component in development"}
                      </p>
                      <Badge
                        variant={
                          landingPage.theme === "sleek"
                            ? "outline"
                            : component.status === "completed"
                              ? "default"
                              : "secondary"
                        }
                        className={cn(
                          "w-full justify-center",
                          landingPage.theme === "sleek"
                            ? component.status === "completed"
                              ? "border-green-400 text-green-400 bg-green-400/10 font-mono text-xs"
                              : component.status === "in_progress"
                                ? "border-blue-400 text-blue-400 bg-blue-400/10 font-mono text-xs"
                                : "border-gray-400 text-gray-400 bg-gray-400/10 font-mono text-xs"
                            : "",
                        )}
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
          <div
            key={section.id}
            className={cn(
              "py-12",
              landingPage.theme === "sleek"
                ? "border-b border-gray-800/50"
                : "",
            )}
          >
            <div className="max-w-4xl mx-auto px-6">
              {section.title && (
                <h2
                  className={cn(
                    "text-3xl font-bold text-center mb-12",
                    themeStyles.text,
                    landingPage.theme === "sleek"
                      ? "font-mono tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                      : "",
                  )}
                >
                  {section.title}
                </h2>
              )}
              <div className="space-y-8">
                {project.components?.map((component, index) => (
                  <div
                    key={component.id}
                    className={cn(
                      "flex gap-6 transition-all duration-300 hover:scale-[1.02]",
                      landingPage.theme === "sleek"
                        ? "p-4 rounded-lg bg-gray-900/30 border border-gray-800 hover:border-gray-600 hover:bg-gray-900/50"
                        : "",
                    )}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                          landingPage.theme === "sleek"
                            ? component.status === "completed"
                              ? "bg-green-400 shadow-lg shadow-green-400/30"
                              : component.status === "in_progress"
                                ? "bg-blue-400 shadow-lg shadow-blue-400/30"
                                : "bg-gray-400"
                            : component.status === "completed"
                              ? "bg-green-500"
                              : component.status === "in_progress"
                                ? "bg-blue-500"
                                : "bg-gray-400",
                        )}
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      {index < project.components.length - 1 && (
                        <div
                          className={cn(
                            "w-0.5 h-16 ml-4 mt-2",
                            landingPage.theme === "sleek"
                              ? "bg-gray-600"
                              : "bg-gray-200",
                          )}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h3
                        className={cn(
                          "font-semibold text-lg",
                          themeStyles.text,
                          landingPage.theme === "sleek" ? "font-mono" : "",
                        )}
                      >
                        {component.name}
                      </h3>
                      <p
                        className={cn(
                          "mt-1",
                          landingPage.theme === "sleek"
                            ? "text-gray-300 font-mono text-sm"
                            : "text-muted-foreground",
                        )}
                      >
                        {component.description || "In development"}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-2",
                          landingPage.theme === "sleek"
                            ? component.status === "completed"
                              ? "border-green-400 text-green-400 bg-green-400/10 font-mono text-xs"
                              : component.status === "in_progress"
                                ? "border-blue-400 text-blue-400 bg-blue-400/10 font-mono text-xs"
                                : "border-gray-400 text-gray-400 bg-gray-400/10 font-mono text-xs"
                            : "",
                        )}
                      >
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
          <div
            key={section.id}
            className={cn(
              "py-12",
              landingPage.theme === "sleek"
                ? "border-b border-gray-800/50"
                : "",
            )}
          >
            <div className="max-w-6xl mx-auto px-6">
              {section.title && (
                <h2
                  className={cn(
                    "text-3xl font-bold text-center mb-12",
                    themeStyles.text,
                    landingPage.theme === "sleek"
                      ? "font-mono tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                      : "",
                  )}
                >
                  {section.title}
                </h2>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.image_url && (
                  <div
                    className={cn(
                      "aspect-video rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105",
                      landingPage.theme === "sleek"
                        ? "border border-gray-700 hover:border-gray-500 hover:shadow-2xl hover:shadow-blue-400/20"
                        : "",
                    )}
                  >
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
                    className={cn(
                      "aspect-video rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105",
                      landingPage.theme === "sleek"
                        ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-500"
                        : "bg-gradient-to-br from-gray-200 to-gray-300",
                    )}
                  >
                    <span
                      className={cn(
                        landingPage.theme === "sleek"
                          ? "text-gray-400 font-mono text-sm"
                          : "text-gray-500",
                      )}
                    >
                      Image {i + 2}
                    </span>
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
      className={cn(
        "min-h-screen",
        themeStyles.background,
        landingPage.theme === "sleek" ? "font-mono" : "",
      )}
      style={{
        backgroundColor:
          landingPage.background_color ||
          (landingPage.theme === "sleek" ? "#000000" : undefined),
        color:
          landingPage.text_color ||
          (landingPage.theme === "sleek" ? "#ffffff" : undefined),
        fontFamily:
          landingPage.theme === "sleek"
            ? "'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace"
            : undefined,
      }}
    >
      {/* Hero Section */}
      <div
        className={cn(
          "relative overflow-hidden",
          landingPage.theme === "sleek" ? "border-b border-gray-800" : "",
        )}
      >
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

        <div
          className={cn(
            "relative z-10 pt-20 pb-16 px-6",
            landingPage.theme === "sleek"
              ? "bg-gradient-to-b from-black/80 to-black/60"
              : "",
          )}
        >
          <div className="max-w-6xl mx-auto text-center">
            {isOwner && (
              <div className="absolute top-6 right-6">
                <Button variant="secondary" size="sm" onClick={onEdit}>
                  Edit Landing Page
                </Button>
              </div>
            )}

            <div className="mb-6">
              <Badge
                variant={
                  landingPage.theme === "sleek" ? "outline" : "secondary"
                }
                className={cn(
                  "mb-4",
                  landingPage.theme === "sleek"
                    ? "border-gray-600 bg-gray-900/50 text-gray-300 backdrop-blur"
                    : "",
                )}
              >
                <Rocket className="h-4 w-4 mr-2" />
                {project.status?.replace("_", " ").toUpperCase()}
              </Badge>
            </div>

            <h1
              className={cn(
                "text-5xl md:text-7xl font-bold mb-6",
                themeStyles.text,
                landingPage.theme === "sleek"
                  ? "tracking-tight font-black bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent"
                  : "",
              )}
              style={{
                fontFamily:
                  landingPage.theme === "sleek"
                    ? "'JetBrains Mono', monospace"
                    : undefined,
                textShadow:
                  landingPage.theme === "sleek"
                    ? "0 0 20px rgba(255,255,255,0.1)"
                    : undefined,
              }}
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
                <Button
                  size="lg"
                  className={cn(
                    "text-lg px-8 py-3 font-semibold transition-all duration-300",
                    landingPage.theme === "sleek"
                      ? "bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-white/20"
                      : "",
                  )}
                >
                  {landingPage.call_to_action}
                  <ExternalLink className="h-5 w-5 ml-2" />
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "text-lg px-8 py-3 font-semibold transition-all duration-300",
                  landingPage.theme === "sleek"
                    ? "border-gray-600 bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:border-gray-400 hover:text-white backdrop-blur hover:scale-105"
                    : "",
                )}
              >
                <Github className="h-5 w-5 mr-2" />
                View Project
              </Button>

              {landingPage.hero_video && (
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    "text-lg px-8 py-3 font-semibold transition-all duration-300",
                    landingPage.theme === "sleek"
                      ? "border-gray-600 bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:border-gray-400 hover:text-white backdrop-blur hover:scale-105"
                      : "",
                  )}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              )}
            </div>

            {/* Project Stats */}
            <div
              className={cn(
                "flex justify-center gap-8 text-sm",
                landingPage.theme === "sleek"
                  ? "bg-gray-900/30 backdrop-blur rounded-xl p-6 border border-gray-800"
                  : "",
              )}
            >
              <div className="text-center">
                <div
                  className={cn(
                    "text-2xl font-bold",
                    themeStyles.accent,
                    landingPage.theme === "sleek"
                      ? "font-mono tracking-wider"
                      : "",
                  )}
                >
                  {Math.round(completionRate)}%
                </div>
                <div
                  className={cn(
                    themeStyles.text,
                    "opacity-70",
                    landingPage.theme === "sleek"
                      ? "text-gray-400 font-mono text-xs uppercase tracking-widest"
                      : "",
                  )}
                >
                  Complete
                </div>
              </div>
              <div className="text-center">
                <div
                  className={cn(
                    "text-2xl font-bold",
                    themeStyles.accent,
                    landingPage.theme === "sleek"
                      ? "font-mono tracking-wider"
                      : "",
                  )}
                >
                  {totalComponents}
                </div>
                <div
                  className={cn(
                    themeStyles.text,
                    "opacity-70",
                    landingPage.theme === "sleek"
                      ? "text-gray-400 font-mono text-xs uppercase tracking-widest"
                      : "",
                  )}
                >
                  Components
                </div>
              </div>
              <div className="text-center">
                <div
                  className={cn(
                    "text-2xl font-bold",
                    themeStyles.accent,
                    landingPage.theme === "sleek"
                      ? "font-mono tracking-wider"
                      : "",
                  )}
                >
                  {project.view_count || 0}
                </div>
                <div
                  className={cn(
                    themeStyles.text,
                    "opacity-70",
                    landingPage.theme === "sleek"
                      ? "text-gray-400 font-mono text-xs uppercase tracking-widest"
                      : "",
                  )}
                >
                  Views
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span
                  className={cn(
                    themeStyles.text,
                    "opacity-70",
                    landingPage.theme === "sleek"
                      ? "font-mono text-xs uppercase tracking-widest"
                      : "",
                  )}
                >
                  Progress
                </span>
                <span
                  className={cn(
                    themeStyles.text,
                    "opacity-70",
                    landingPage.theme === "sleek" ? "font-mono text-xs" : "",
                  )}
                >
                  {Math.round(completionRate)}%
                </span>
              </div>
              <Progress
                value={completionRate}
                className={cn(
                  "h-2",
                  landingPage.theme === "sleek"
                    ? "bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-cyan-400 [&>div]:shadow-lg [&>div]:shadow-blue-400/30"
                    : "",
                )}
              />
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
      <footer
        className={cn(
          "py-12 border-t",
          landingPage.theme === "sleek"
            ? "border-gray-800 bg-gray-900/50"
            : "border-white/10",
        )}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p
            className={cn(
              "text-sm",
              themeStyles.text,
              "opacity-60",
              landingPage.theme === "sleek" ? "font-mono" : "",
            )}
          >
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
