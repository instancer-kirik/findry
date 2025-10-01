import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Heart, Search } from 'lucide-react';
import { toast } from 'sonner';

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
}

const ProjectsShowcase = () => {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PublicProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicProjects();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchQuery, projects]);

  const fetchPublicProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_public', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
      setFilteredProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (projectId: string) => {
    try {
      const project = projects.find(p => p.id === projectId);
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Discover Projects</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore innovative projects from our community
            </p>
            
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
                {searchQuery ? 'No projects found matching your search.' : 'No public projects yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  onClick={() => incrementViewCount(project.id)}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105">
                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="default">Featured</Badge>
                      </div>
                    )}
                    
                    {project.image_url && (
                      <div className="h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={project.image_url}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{project.name}</span>
                        <Badge variant="outline">{project.status}</Badge>
                      </CardTitle>
                      {project.description && (
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="secondary">+{project.tags.length - 3}</Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {project.view_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {project.like_count || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsShowcase;
