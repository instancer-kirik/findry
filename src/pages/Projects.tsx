import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from '@/hooks/use-project';
import { Badge } from "@/components/ui/badge";
import { FileCode, Star, Calendar, Users, ArrowRight, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useGetProjects } = useProject();
  const { data: projects = [], isLoading } = useGetProjects();
  
  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  // For now, in this view we'll show all projects as the user's own projects
  // In a real implementation, we would filter based on ownership
  const myProjects = projects;
  
  // For now, we don't have a starring mechanism
  const starredProjects: typeof projects = [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-muted-foreground">Manage your personal and collaborative projects</p>
          </div>
          <Button onClick={handleCreateProject}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
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
                  Star projects you want to access quickly
                </p>
                <Button variant="outline" onClick={() => navigate('/discover?type=projects')}>
                  Browse Projects
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Projects;
