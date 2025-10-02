import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, DollarSign, Calendar, Clock } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-3xl mb-2">{project.name}</CardTitle>
            <CardDescription className="text-base mb-4">
              {project.description}
            </CardDescription>
            <div className="flex flex-wrap gap-2">
              {project.tags &&
                project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${getStatusColor(project.status)} text-sm px-3 py-1`}
          >
            {project.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Project Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {project.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{project.location}</p>
              </div>
            </div>
          )}
          {project.budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium">{project.budget}</p>
              </div>
            </div>
          )}
          {project.timeline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="font-medium">{project.timeline}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {project.updatedAt &&
                  new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Overall Progress</h3>
            <span className="text-2xl font-bold">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-3" />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {project.components?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Components
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {project.components?.filter(
                  (c) => c.status === "completed",
                ).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {project.tasks?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {project.tasks?.filter((t) => t.status === "completed")
                  .length || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Tasks Done
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectHeader;
