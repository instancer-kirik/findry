
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProject } from '@/hooks/use-project';
import { Project } from '@/types/project';
import { useAuth } from '@/hooks/use-auth';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { useGetProjects } = useProject();
  const { data: projects = [], isLoading, error } = useGetProjects();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.tags && project.tags.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  const handleCreateProject = () => {
    navigate('/create-project');
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
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
            {[1, 2, 3, 4, 5, 6].map(i => (
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
            <Button
              onClick={handleCreateProject}
              className="mt-4 sm:mt-0"
            >
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
            <p className="text-red-500">Error loading projects: {error.toString()}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No projects found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? `No projects matching "${searchQuery}"`
                : 'There are no projects available yet'}
            </p>
            {user && (
              <Button onClick={handleCreateProject}>
                Create Your First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project) => (
              <Card key={project.id} className="flex flex-col h-full">
                <CardContent className="pt-6 flex-grow">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">{project.name}</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags && project.tags.map(tag => (
                      <span key={tag} className="inline-block bg-muted px-2 py-0.5 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{project.status.replace('_', ' ')}</p>
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
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
