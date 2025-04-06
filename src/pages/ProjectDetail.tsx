import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useProjects, Project, ProjectComponent, ProjectTask } from '@/hooks/use-project';
import { useDemoProject } from '@/hooks/use-demo-project';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import any other components needed for the project detail view

const ProjectDetail: React.FC = () => {
  const { projectId = '' } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Check if this is a demo project (meta-project-tracker, components-library, artist-platform)
  const isDemoProject = ['meta-project-tracker', 'components-library', 'artist-platform'].includes(projectId);
  
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
            <p className="text-red-600">{error || "Project not found"}</p>
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
  
  // Render your project detail UI here
  // This should include the project overview, components, tasks, etc.
  
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
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
          {/* Add project actions/buttons here */}
        </div>
        
        {/* Rest of the project detail UI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* This is a simplified UI. Implement the full UI based on your design. */}
          <div className="col-span-2">
            <h2 className="text-xl font-bold mb-4">Components</h2>
            {project.components && project.components.length > 0 ? (
              <div className="space-y-4">
                {project.components.map(component => (
                  <div key={component.id} className="border p-4 rounded-md">
                    <h3 className="font-semibold">{component.name}</h3>
                    <p className="text-sm text-muted-foreground">{component.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        component.status === 'ready' ? 'bg-green-100 text-green-800' :
                        component.status === 'in-development' ? 'bg-amber-100 text-amber-800' :
                        component.status === 'planned' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {component.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                      <span className="text-xs text-muted-foreground">{component.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No components yet</p>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Tasks</h2>
            {project.tasks && project.tasks.length > 0 ? (
              <div className="space-y-4">
                {project.tasks.map(task => (
                  <div key={task.id} className="border p-4 rounded-md">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                      <span className="text-xs text-muted-foreground">{task.priority} priority</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No tasks yet</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
