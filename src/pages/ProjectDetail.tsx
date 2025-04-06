
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useProjects, Project, ProjectComponent, ProjectTask } from '@/hooks/use-project';
import { useDemoProject } from '@/hooks/use-demo-project';
import { Loader2, ArrowLeft, Check, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProjectDetail: React.FC = () => {
  const { projectId = '' } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Check if this is a demo project (meta-project-tracker, components-library, artist-platform)
  const isDemoProject = ['5a7b8c9d-0e1f-2345-6789-012345678901', '7b8c9d0e-1f23-4567-8901-234567890123', '9d0e1f23-4567-8901-2345-67890123456a'].includes(projectId);
  
  // Use the appropriate hook based on whether it's a demo project or not
  const { useGetProject } = useProjects();
  const realProjectQuery = useGetProject(projectId);
  const demoProjectQuery = useDemoProject(projectId);
  
  // Use either the real project data or demo project data
  const {
    data: realProject,
    isLoading: isRealProjectLoading,
    error: realProjectError
  } = realProjectQuery;
  
  const {
    project: demoProject,
    isLoading: isDemoProjectLoading,
    error: demoProjectError
  } = demoProjectQuery;
  
  // Combine the results
  const project = isDemoProject ? demoProject : realProject;
  const isLoading = isDemoProject ? isDemoProjectLoading : isRealProjectLoading;
  const error = isDemoProject ? demoProjectError : realProjectError;
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // Count tasks by status
  const getTaskStatusCounts = (tasks?: ProjectTask[]) => {
    if (!tasks || tasks.length === 0) return { completed: 0, inProgress: 0, notStarted: 0, blocked: 0 };
    
    return tasks.reduce((counts, task) => {
      if (task.status === 'completed') counts.completed++;
      else if (task.status === 'in-progress') counts.inProgress++;
      else if (task.status === 'not-started') counts.notStarted++;
      else if (task.status === 'blocked') counts.blocked++;
      return counts;
    }, { completed: 0, inProgress: 0, notStarted: 0, blocked: 0 });
  };
  
  const taskStatusCounts = getTaskStatusCounts(project?.tasks);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Project</h2>
            <p className="text-red-600">{error ? (error instanceof Error ? error.message : String(error)) : "Project not found"}</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/projects')}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/projects')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground mt-1">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {project.tags && project.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-end mt-4 md:mt-0">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={
                project.status === 'released' ? 'secondary' : 
                project.status === 'maintenance' ? 'default' :
                project.status === 'development' ? 'secondary' : 
                project.status === 'testing' ? 'outline' : 'outline'
              }>
                {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Planning'}
              </Badge>
              {project.version && <span className="text-sm text-muted-foreground">v{project.version}</span>}
            </div>
            
            {project.progress !== undefined && (
              <div className="w-full md:w-40 bg-secondary rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Project Stats */}
              <div className="col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                    <CardDescription>Key project details and statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Timeline</h3>
                        <p>{project.timeline || 'Not specified'}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Budget</h3>
                        <p>{project.budget || 'Not specified'}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Location</h3>
                        <p>{project.location || 'Not specified'}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Type</h3>
                        <p>{project.type || 'Not specified'}</p>
                      </div>
                      {project.repo_url && (
                        <div className="col-span-2">
                          <h3 className="font-medium text-sm text-muted-foreground mb-1">Repository</h3>
                          <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{project.repo_url}</a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Task Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Status</CardTitle>
                  <CardDescription>Summary of task progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Completed</span>
                    </div>
                    <Badge variant="outline">{taskStatusCounts.completed}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-amber-500 mr-2" />
                      <span>In Progress</span>
                    </div>
                    <Badge variant="outline">{taskStatusCounts.inProgress}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Not Started</span>
                    </div>
                    <Badge variant="outline">{taskStatusCounts.notStarted}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      <span>Blocked</span>
                    </div>
                    <Badge variant="outline">{taskStatusCounts.blocked}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="components" className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Components</h2>
            {project.components && project.components.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.components.map(component => (
                  <Card key={component.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{component.name}</CardTitle>
                        <Badge className={`${
                          component.status === 'ready' ? 'bg-green-100 text-green-800' :
                          component.status === 'in-development' ? 'bg-amber-100 text-amber-800' :
                          component.status === 'planned' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {component.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Badge>
                      </div>
                      <CardDescription>
                        <span className="text-xs capitalize">{component.type} Component</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{component.description}</p>
                      {component.dependencies && component.dependencies.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs text-muted-foreground mb-1">Dependencies:</h4>
                          <div className="flex flex-wrap gap-1">
                            {component.dependencies.map((dep, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{dep}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No components have been added to this project yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Tasks</h2>
            {project.tasks && project.tasks.length > 0 ? (
              <div className="space-y-4">
                {project.tasks.map(task => (
                  <Card key={task.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={`${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Badge>
                          <Badge variant="outline" className="capitalize">{task.priority} priority</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex justify-between mt-4 text-sm">
                        {task.assigned_to && (
                          <div>
                            <span className="text-muted-foreground mr-1">Assigned to:</span>
                            <span>{task.assigned_to}</span>
                          </div>
                        )}
                        {task.due_date && (
                          <div>
                            <span className="text-muted-foreground mr-1">Due:</span>
                            <span>{task.due_date}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No tasks have been added to this project yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
