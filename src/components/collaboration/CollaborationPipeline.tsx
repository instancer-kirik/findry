
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, UserPlus, ArrowRight, Calendar, DollarSign, Clock } from 'lucide-react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import { Link } from 'react-router-dom';

export type CollaborationStage = 'ideation' | 'planning' | 'production' | 'review' | 'complete';

export interface CollaboratorProfile {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  discipline: string;
  status: 'invited' | 'confirmed' | 'declined' | 'pending';
}

export interface ProjectTaskProps {
  id: string;
  title: string;
  description: string;
  assignedTo?: CollaboratorProfile;
  dueDate?: string;
  status: 'not-started' | 'in-progress' | 'blocked' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface CollaborationProjectProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  stage: CollaborationStage;
  budget?: number;
  collaborators: CollaboratorProfile[];
  tasks: ProjectTaskProps[];
  tags: string[];
}

interface CollaborationPipelineProps {
  projects: CollaborationProjectProps[];
  onCreateProject?: () => void;
  onInviteCollaborator?: (projectId: string) => void;
  onViewProject?: (projectId: string) => void;
}

const CollaborationPipeline: React.FC<CollaborationPipelineProps> = ({
  projects,
  onCreateProject,
  onInviteCollaborator,
  onViewProject,
}) => {
  const isMobile = useIsMobile();
  
  const getStageLabel = (stage: CollaborationStage): string => {
    const labels: Record<CollaborationStage, string> = {
      'ideation': 'Ideation',
      'planning': 'Planning',
      'production': 'Production',
      'review': 'Review',
      'complete': 'Complete'
    };
    return labels[stage];
  };
  
  const getStageColor = (stage: CollaborationStage): string => {
    const colors: Record<CollaborationStage, string> = {
      'ideation': 'bg-blue-100 text-blue-800',
      'planning': 'bg-purple-100 text-purple-800',
      'production': 'bg-amber-100 text-amber-800',
      'review': 'bg-green-100 text-green-800',
      'complete': 'bg-gray-100 text-gray-800'
    };
    return colors[stage];
  };

  const renderProjectCard = (project: CollaborationProjectProps) => {
    return (
      <Card key={project.id} className="h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
            <Badge className={getStageColor(project.stage)}>
              {getStageLabel(project.stage)}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{project.startDate} {project.endDate ? `- ${project.endDate}` : ''}</span>
          </div>
          
          {project.budget && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="mr-2 h-4 w-4" />
              <span>${project.budget.toLocaleString()}</span>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium mb-2">Collaborators ({project.collaborators.length})</h4>
            <div className="flex -space-x-2 overflow-hidden">
              {project.collaborators.slice(0, 5).map((collaborator) => (
                <Avatar key={collaborator.id} className="border-2 border-background">
                  <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                  <AvatarFallback>{collaborator.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              ))}
              {project.collaborators.length > 5 && (
                <Avatar className="border-2 border-background bg-muted">
                  <AvatarFallback>+{project.collaborators.length - 5}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Tasks ({project.tasks.length})</h4>
            <div className="flex items-center text-sm">
              <span className="text-green-600">{project.tasks.filter(t => t.status === 'completed').length} completed</span>
              <span className="mx-2">•</span>
              <span className="text-amber-600">{project.tasks.filter(t => t.status === 'in-progress').length} in progress</span>
              <span className="mx-2">•</span>
              <span>{project.tasks.filter(t => t.status === 'not-started').length} not started</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onInviteCollaborator?.(project.id)}
          >
            <UserPlus className="mr-1 h-4 w-4" /> Invite
          </Button>
          <Button 
            size="sm"
            onClick={() => onViewProject?.(project.id)}
            asChild
          >
            <Link to={`/projects/${project.id}`}>
              View <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Group projects by stage
  const projectsByStage = projects.reduce((acc, project) => {
    if (!acc[project.stage]) {
      acc[project.stage] = [];
    }
    acc[project.stage].push(project);
    return acc;
  }, {} as Record<CollaborationStage, CollaborationProjectProps[]>);

  // Define the stages in the order we want to display them
  const stageOrder: CollaborationStage[] = ['ideation', 'planning', 'production', 'review', 'complete'];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Collaboration Pipeline</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={onCreateProject}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Start a new collaboration project and invite artists to join.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>Project creation form would go here.</p>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isMobile ? (
        // Mobile view: projects grouped by stage in vertical sections
        <div className="space-y-6">
          {stageOrder.map((stage) => (
            projectsByStage[stage] && projectsByStage[stage].length > 0 ? (
              <AnimatedSection key={stage} animation="fade-in-up" delay={200}>
                <h3 className="text-lg font-semibold mb-4">{getStageLabel(stage)}</h3>
                <div className="space-y-4">
                  {projectsByStage[stage].map(renderProjectCard)}
                </div>
              </AnimatedSection>
            ) : null
          ))}
        </div>
      ) : (
        // Desktop view: Kanban-style board
        <div className="grid grid-cols-5 gap-4 overflow-x-auto min-h-[500px]">
          {stageOrder.map((stage) => (
            <div key={stage} className="flex flex-col">
              <div className="bg-muted rounded-t-md p-2 sticky top-0">
                <h3 className="font-medium">{getStageLabel(stage)}</h3>
                <div className="text-xs text-muted-foreground">
                  {projectsByStage[stage]?.length || 0} projects
                </div>
              </div>
              <div className="flex-1 space-y-3 p-2 bg-muted/50 rounded-b-md min-h-[600px]">
                {projectsByStage[stage]?.map(renderProjectCard) || (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No projects
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborationPipeline;
