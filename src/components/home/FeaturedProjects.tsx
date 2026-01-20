import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Heart, ArrowRight, Star, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";

interface FeaturedProject {
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
}

const FeaturedProjects: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [trendingProjects, setTrendingProjects] = useState<FeaturedProject[]>([]);
  const [recentProjects, setRecentProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Fetch featured projects
      const { data: featured, error: featuredError } = await supabase
        .from('projects')
        .select('*')
        .eq('is_public', true)
        .eq('featured', true)
        .order('view_count', { ascending: false })
        .limit(3);

      if (featuredError) throw featuredError;

      // Fetch trending projects (high view count, recent activity)
      const { data: trending, error: trendingError } = await supabase
        .from('projects')
        .select('*')
        .eq('is_public', true)
        .gte('view_count', 10)
        .order('view_count', { ascending: false })
        .limit(3);

      if (trendingError) throw trendingError;

      // Fetch recent projects
      const { data: recent, error: recentError } = await supabase
        .from('projects')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentError) throw recentError;

      setFeaturedProjects(featured || []);
      setTrendingProjects(trending || []);
      setRecentProjects(recent || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      // Don't show error toast for empty results - just log it
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (projectId: string) => {
    try {
      const project = [...featuredProjects, ...trendingProjects, ...recentProjects]
        .find(p => p.id === projectId);

      if (!project) return;

      const { error } = await supabase
        .from('projects')
        .update({ view_count: (project.view_count || 0) + 1 })
        .eq('id', projectId);

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const ProjectCard: React.FC<{ project: FeaturedProject; showBadge?: string }> = ({
    project,
    showBadge
  }) => (
    <Link
      to={`/projects/${project.id}`}
      onClick={() => incrementViewCount(project.id)}
      className="group"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 group-hover:border-primary/20">
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

          {showBadge && (
            <div className="absolute top-3 right-3">
              <Badge variant="default" className="bg-primary/90 backdrop-blur-sm">
                {showBadge === 'featured' && <Star className="h-3 w-3 mr-1" />}
                {showBadge === 'trending' && <TrendingUp className="h-3 w-3 mr-1" />}
                {showBadge === 'recent' && <Clock className="h-3 w-3 mr-1" />}
                {showBadge === 'featured' && 'Featured'}
                {showBadge === 'trending' && 'Trending'}
                {showBadge === 'recent' && 'New'}
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {project.status}
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
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
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

          {/* Stats */}
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
      </Card>
    </Link>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
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
      </div>
    );
  }

  // If no projects available, don't show the section
  if (featuredProjects.length === 0 && trendingProjects.length === 0 && recentProjects.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-background via-muted/20 to-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Discover Amazing Projects</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Explore innovative projects from our creative community
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/discover/projects'}
            className="group"
          >
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-yellow-500" />
              <h3 className="text-2xl font-semibold">Featured Projects</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  showBadge="featured"
                />
              ))}
            </div>
          </div>
        )}

        {/* Trending Projects Section */}
        {trendingProjects.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="text-2xl font-semibold">Trending Projects</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  showBadge="trending"
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Projects Section */}
        {recentProjects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="text-2xl font-semibold">Recent Projects</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  showBadge="recent"
                />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Have a Project to Share?</h3>
          <p className="text-muted-foreground mb-4">
            Join our community and showcase your creative work to the world
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => window.location.href = '/create-project'}
              className="group"
            >
              Create Project
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/discover/projects'}
            >
              Explore More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;
