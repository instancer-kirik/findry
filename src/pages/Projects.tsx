import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects, Project, ProjectComponent, ProjectTask } from '@/hooks/use-project';
import {
  CheckIcon,
  CircleIcon,
  ClockIcon,
  CodeIcon,
  PlusIcon,
  ArrowRightIcon
} from 'lucide-react';

export default function Projects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { useGetProjects } = useProjects();
  const { data: projects, isLoading } = useGetProjects();

  // Get status color for project status badges
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'development':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'testing':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'released':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'maintenance':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Get status color for component status badges
  const getComponentStatusColor = (status: ProjectComponent['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'in-development':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'ready':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'needs-revision':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Get status color for task status badges
  const getTaskStatusColor = (status: ProjectTask['status']) => {
    switch (status) {
      case 'not-started':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'blocked':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Get icon for task status
  const getTaskStatusIcon = (status: ProjectTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckIcon className="h-4 w-4" />;
      case 'in-progress':
        return <ClockIcon className="h-4 w-4" />;
      case 'not-started':
        return <CircleIcon className="h-4 w-4" />;
      case 'blocked':
        return <CircleIcon className="h-4 w-4" />;
      default:
        return <CircleIcon className="h-4 w-4" />;
    }
  };

  // Get priority color
  const getTaskPriorityColor = (priority: ProjectTask['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Get all components across all projects
  const getAllComponents = (): ProjectComponent[] => {
    if (!projects) return [];
    return projects.flatMap(project => 
      (project.components || []).map(component => ({
        ...component,
        projectName: project.name,
        projectId: project.id
      }))
    );
  };

  // Get all tasks across all projects
  const getAllTasks = (): ProjectTask[] => {
    if (!projects) return [];
    return projects.flatMap(project => 
      (project.tasks || []).map(task => ({
        ...task,
        projectName: project.name,
        projectId: project.id
      }))
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Development Projects</h1>
            <p className="text-muted-foreground">
              Track the progress of our development projects and components
            </p>
          </div>
          <Button onClick={() => navigate('/projects/new')}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-6" />
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects && projects.map((project) => (
                  <Card key={project.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Version:</span>
                      <span className="text-sm">{project.version}</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {project.components?.length || 0} Components
                        </Badge>
                        <Badge variant="outline">
                          {project.tasks?.length || 0} Tasks
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        Details
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="components" className="pt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-5 w-1/3" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getAllComponents().map((component) => (
                  <Card key={component.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{component.name}</h3>
                      <Badge className={getComponentStatusColor(component.status)}>
                        {component.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {component.description}
                    </p>
                    <Badge variant="outline" className="mb-2">
                      {component.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      Project: {(component as any).projectName}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tasks" className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <div className="flex gap-2 mt-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {getAllTasks().map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-1 rounded-full ${
                        task.status === 'completed' 
                          ? 'text-green-500 bg-green-500/10' 
                          : task.status === 'blocked' 
                            ? 'text-red-500 bg-red-500/10'
                            : task.status === 'in-progress'
                              ? 'text-blue-500 bg-blue-500/10'
                              : task.status === 'not-started'
                                ? 'text-amber-500 bg-amber-500/10'
                                : 'text-gray-500 bg-gray-500/10'
                      }`}>
                        {getTaskStatusIcon(task.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getTaskStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <Badge className={getTaskPriorityColor(task.priority)}>
                            {task.priority} priority
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {(task as any).projectName}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
