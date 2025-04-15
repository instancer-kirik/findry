import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from '@/hooks/use-projects';
import { Badge } from "@/components/ui/badge";
import { FileCode, Star, Calendar, Users, ArrowRight, PlusCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const projects = useProjects();
  const { data: projectsData = [], isLoading } = projects.useGetProjects();
  
  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  // Featured project IDs
  const FEATURED_PROJECT_IDS = [
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Findry Core
    '9d0e1f23-4567-8901-2345-67890123456a', // Artist Platform
    '7b8c9d0e-1f23-4567-8901-234567890123'  // DivvyQueue
  ];

  // Filter featured projects based on specific IDs
  const featuredProjects = projectsData.filter(project => 
    FEATURED_PROJECT_IDS.includes(project.id)
  );
  
  // For now, in this view we'll show all projects as the user's own projects
  // In a real implementation, we would filter based on ownership
  const myProjects = projectsData;
  
  // For now, we don't have a starring mechanism
  const starredProjects: typeof projectsData = [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Discover featured projects and manage your own</p>
          </div>
          <Button onClick={handleCreateProject}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Featured Projects Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">Featured Projects</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="min-h-[200px] animate-pulse">
                  <CardHeader className="bg-muted h-24"></CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map(project => (
                <Card key={project.id} className="hover:shadow-md transition-shadow border-t-4 border-t-primary">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{project.status || 'Planning'}</Badge>
                      <Badge variant="outline">v{project.version || '0.1'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FileCode className="h-4 w-4" />
                        <span>{project.components?.length || 0} components</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{project.tasks?.length || 0} tasks</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between"
                      onClick={() => handleViewProject(project.id)}
                    >
                      View Details <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No featured projects available at this time.</p>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="my" className="w-full mb-8">
          <TabsList>
            <TabsTrigger value="my">My Projects</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="min-h-[200px] animate-pulse">
                    <CardHeader className="bg-muted h-24"></CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.map(project => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{project.status || 'Planning'}</Badge>
                        <Badge variant="outline">v{project.version || '0.1'}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">{project.description}</p>
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FileCode className="h-4 w-4" />
                          <span>{project.components?.length || 0} components</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{project.tasks?.length || 0} tasks</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="ghost" 
                        className="w-full justify-between"
                        onClick={() => handleViewProject(project.id)}
                      >
                        View Details <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first project
                </p>
                <Button onClick={handleCreateProject}>
                  Create Project
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="starred">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="min-h-[200px] animate-pulse">
                    <CardHeader className="bg-muted h-24"></CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : starredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {starredProjects.map(project => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{project.status || 'Planning'}</Badge>
                        <Badge variant="outline">v{project.version || '0.1'}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">{project.description}</p>
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FileCode className="h-4 w-4" />
                          <span>{project.components?.length || 0} components</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{project.tasks?.length || 0} tasks</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between"
                        onClick={() => handleViewProject(project.id)}
                      >
                        View Details <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No starred projects</h3>
                <p className="text-muted-foreground mb-4">
                  Star projects to keep track of them here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Projects;
