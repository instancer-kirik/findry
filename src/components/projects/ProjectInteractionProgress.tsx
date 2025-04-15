
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Project } from '@/types/project';
import { Milestone } from 'lucide-react';

interface ProjectInteractionProgressProps {
  project: Project;
  onMilestoneClick?: (status: string) => void;
}

const ProjectInteractionProgress: React.FC<ProjectInteractionProgressProps> = ({
  project,
  onMilestoneClick
}) => {
  const statusSteps = ['planning', 'in_progress', 'completed', 'cancelled'];
  const currentStatusIndex = statusSteps.indexOf(project.status);
  
  const calculatePercentage = () => {
    if (project.progress !== undefined) return project.progress;
    if (project.status === 'planning') return 25;
    if (project.status === 'in_progress') return 50;
    if (project.status === 'completed') return 100;
    if (project.status === 'cancelled') return 0;
    return 0;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Milestone className="h-5 w-5" />
          Project Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={calculatePercentage()} className="h-2" />
        </div>
        
        <div className="flex justify-between mt-4">
          {statusSteps.map((status, index) => (
            <div 
              key={status}
              className={`flex flex-col items-center cursor-pointer ${onMilestoneClick ? 'hover:text-primary' : ''}`}
              onClick={() => onMilestoneClick?.(status)}
            >
              <div 
                className={`w-4 h-4 rounded-full mb-1.5 ${
                  index <= currentStatusIndex && project.status !== 'cancelled' 
                    ? 'bg-primary' 
                    : project.status === 'cancelled' && status === 'cancelled'
                      ? 'bg-destructive'
                      : 'bg-muted-foreground/30'
                }`}
              />
              <span className="text-xs capitalize whitespace-nowrap">{status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInteractionProgress;
