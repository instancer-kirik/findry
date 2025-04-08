
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from '@/hooks/use-project';
import { Badge } from "@/components/ui/badge";
import { FileCode, Star, Calendar, Users, ArrowRight } from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  const { useGetProjects } = useProject();
  const { data: projects, isLoading } = useGetProjects();
  
  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Projects</h1>
        
        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="my">My Projects</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
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
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
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
                <Button onClick={() => navigate('/create-project')}>
                  Create Project
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">My Projects Coming Soon</h3>
              <p className="text-muted-foreground">
                This feature is currently under development
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="starred">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Starred Projects Coming Soon</h3>
              <p className="text-muted-foreground">
                This feature is currently under development
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Projects;
