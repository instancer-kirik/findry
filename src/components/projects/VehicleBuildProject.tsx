import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Home,
  Palette,
  FileText,
  MapPin,
  Calendar,
  Tag,
  ChevronRight,
  ChevronDown,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';

interface VehicleBuildProjectProps {
  project: Project;
}

const VehicleBuildProject = ({ project }: VehicleBuildProjectProps) => {
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);

  // Extract vehicle info from project data
  const vehicleInfo = {
    type: project.type || "Bread Truck Conversion",
    location: project.location || "Portland, OR",
    budget: project.budget || "$25,000",
  };

  // Map project components (phases) with their tasks
  const phases = project.components.map((component, index) => {
    // Distribute tasks across phases
    // In the future, you might want to add a phase_id or component_id field to tasks
    const tasksPerPhase = Math.ceil(
      project.tasks.length / project.components.length,
    );
    const startIdx = index * tasksPerPhase;
    const endIdx = startIdx + tasksPerPhase;
    const phaseTasks = project.tasks.slice(startIdx, endIdx);

    const completedTasks = phaseTasks.filter(
      (t) => t.status === "completed",
    ).length;
    const phaseProgress =
      phaseTasks.length > 0
        ? Math.round((completedTasks / phaseTasks.length) * 100)
        : 0;

    // Assign icons based on phase name
    let icon = Wrench;
    const phaseName = component.name.toLowerCase();
    if (phaseName.includes("electrical")) icon = Zap;
    else if (phaseName.includes("plumbing")) icon = Droplets;
    else if (phaseName.includes("insulation")) icon = Wind;
    else if (phaseName.includes("interior")) icon = Home;
    else if (phaseName.includes("finishing")) icon = Palette;
    else if (phaseName.includes("planning") || phaseName.includes("assessment"))
      icon = FileText;

    return {
      id: component.id,
      name: component.name,
      icon,
      status: component.status,
      progress: phaseProgress,
      tasks: phaseTasks.map((task) => ({
        id: task.id,
        name: task.title,
        status: task.status,
        priority: task.priority,
      })),
      notes: component.description || "",
    };
  });

  const stats = {
    totalPhases: phases.length,
    completedPhases: phases.filter((p) => p.status === "completed").length,
    totalTasks: project.tasks.length,
    completedTasks: project.tasks.filter((t) => t.status === "completed")
      .length,
    overallProgress: project.progress,
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </div>
            <Badge variant="outline" className={getStatusColor(project.status)}>
              {project.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {vehicleInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{vehicleInfo.location}</span>
              </div>
            )}
            {vehicleInfo.budget && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{vehicleInfo.budget}</span>
              </div>
            )}
            {project.tags && project.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {project.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Overall Progress</span>
              <span>{stats.overallProgress}%</span>
            </div>
            <Progress value={stats.overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Phases</p>
                <p className="text-2xl font-bold">{stats.totalPhases}</p>
              </div>
              <Wrench className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedPhases}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.totalTasks}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Done</p>
                <p className="text-2xl font-bold">{stats.completedTasks}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Build Phases */}
      <Card>
        <CardHeader>
          <CardTitle>Build Phases</CardTitle>
          <CardDescription>
            Track progress through each phase of the build
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isExpanded = expandedPhases.includes(phase.id);

              return (
                <Card key={phase.id} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => togglePhase(phase.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        <Icon className="h-6 w-6 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{phase.name}</h3>
                            <Badge
                              variant="outline"
                              className={getStatusColor(phase.status)}
                            >
                              {phase.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {phase.notes}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right min-w-[80px]">
                          <div className="text-sm font-medium">
                            {phase.progress}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {
                              phase.tasks.filter(
                                (t) => t.status === "completed",
                              ).length
                            }
                            /{phase.tasks.length} tasks
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Progress value={phase.progress} className="mt-3" />
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-4 border-t">
                      <div className="space-y-3">
                        <h4 className="font-medium mb-3">Tasks</h4>
                        {phase.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border",
                              task.status === "completed" && "bg-muted/50",
                            )}
                          >
                            <StatusIcon status={task.status} />
                            <div className="flex-1">
                              <div
                                className={cn(
                                  "font-medium",
                                  task.status === "completed" &&
                                    "line-through text-muted-foreground",
                                )}
                              >
                                {task.name}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(task.priority)}
                            >
                              {task.priority}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getStatusColor(task.status)}
                            >
                              {task.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleBuildProject;
