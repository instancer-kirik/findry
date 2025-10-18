import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Wrench,
  Zap,
  Droplets,
  Wind,
  Home,
  Palette,
  FileText,
  CheckCircle2,
  Clock,
  Circle,
  ChevronRight,
  ChevronDown,
  Edit,
  MoreVertical,
  Trash2,
  Plus,
} from "lucide-react";
import { ProjectComponent, ProjectTask } from "@/types/project";
import { cn } from "@/lib/utils";

interface EnhancedProjectComponentProps {
  component: ProjectComponent;
  index: number;
  relatedTasks: ProjectTask[];
  isOwner: boolean;
  onEdit: (component: ProjectComponent) => void;
  onDelete: (componentId: string) => void;
  onStatusChange: (
    component: ProjectComponent,
    status: "pending" | "in_progress" | "completed",
  ) => void;
  onAddReference: (component: ProjectComponent) => void;
  onTaskStatusChange: (
    task: ProjectTask,
    status: "pending" | "in_progress" | "completed",
  ) => void;
  onAddTask: (componentId: string) => void;
}

const EnhancedProjectComponent: React.FC<EnhancedProjectComponentProps> = ({
  component,
  index,
  relatedTasks,
  isOwner,
  onEdit,
  onDelete,
  onStatusChange,
  onAddReference,
  onTaskStatusChange,
  onAddTask,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "planning":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getComponentIcon = (name: string, type: string) => {
    const nameLower = name.toLowerCase();
    const typeLower = type.toLowerCase();

    if (nameLower.includes("electrical") || typeLower.includes("electrical"))
      return Zap;
    if (nameLower.includes("plumbing") || typeLower.includes("plumbing"))
      return Droplets;
    if (nameLower.includes("insulation") || typeLower.includes("insulation"))
      return Wind;
    if (nameLower.includes("interior") || typeLower.includes("interior"))
      return Home;
    if (
      nameLower.includes("paint") ||
      nameLower.includes("finish") ||
      typeLower.includes("finish")
    )
      return Palette;
    if (
      nameLower.includes("plan") ||
      typeLower.includes("plan") ||
      typeLower.includes("design")
    )
      return FileText;
    return Wrench;
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const Icon = getComponentIcon(component.name, component.type);
  const completedTasks = relatedTasks.filter(
    (task) => task.status === "completed",
  );
  const taskProgress =
    relatedTasks.length > 0
      ? Math.round((completedTasks.length / relatedTasks.length) * 100)
      : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300 text-slate-700 font-bold text-sm shadow-sm">
              {index + 1}
            </div>
            <Icon className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{component.name}</h3>
                <Badge
                  variant="outline"
                  className={getStatusColor(component.status)}
                >
                  {component.status.replace("_", " ")}
                </Badge>
                {component.type && (
                  <Badge variant="secondary" className="text-xs">
                    {component.type}
                  </Badge>
                )}
              </div>
              {component.description && (
                <p className="text-sm text-muted-foreground">
                  {component.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {relatedTasks.length > 0 && (
              <div className="text-right">
                <div className="text-sm font-medium">{taskProgress}%</div>
                <div className="text-xs text-muted-foreground">
                  {completedTasks.length}/{relatedTasks.length} tasks
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {component.status !== "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(
                      component,
                      component.status === "pending"
                        ? "in_progress"
                        : "completed",
                    );
                  }}
                >
                  {component.status === "pending" ? "Start" : "Complete"}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddReference(component);
                }}
              >
                Reference
              </Button>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shadow-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-background z-50"
                  >
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddTask(component.id);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(component);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Component
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(component, "pending");
                      }}
                      disabled={component.status === "pending"}
                    >
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(component, "in_progress");
                      }}
                      disabled={component.status === "in_progress"}
                    >
                      Mark as In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(component, "completed");
                      }}
                      disabled={component.status === "completed"}
                    >
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(component.id);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
        {relatedTasks.length > 0 && (
          <Progress value={taskProgress} className="mt-3" />
        )}

        <div className="flex justify-end px-4 pb-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Hide Tasks
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-1" />
                Show Tasks ({relatedTasks.length})
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && relatedTasks.length > 0 && (
        <CardContent className="pt-0 border-t">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Related Tasks ({relatedTasks.length})
              </h4>
              <div className="flex items-center gap-2">
                {onAddTask && isOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTask(component.id);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Task
                  </Button>
                )}
                <div className="text-xs text-muted-foreground">
                  {relatedTasks.filter((t) => t.status === "completed").length}{" "}
                  completed
                </div>
              </div>
            </div>
            {relatedTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "group flex items-center gap-3 text-sm p-3 rounded-lg border transition-all hover:shadow-sm",
                  task.status === "completed" && "bg-muted/50 border-muted",
                  task.status === "in_progress" && "bg-blue-50 border-blue-200",
                  task.status === "pending" && "bg-amber-50 border-amber-200",
                )}
              >
                <StatusIcon status={task.status} />
                <span
                  className={`cursor-pointer flex-1 transition-colors hover:text-primary ${
                    task.status === "completed"
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                  onClick={() =>
                    onTaskStatusChange(
                      task,
                      task.status === "completed" ? "pending" : "completed",
                    )
                  }
                >
                  {task.title}
                </span>
                <div className="flex items-center gap-2">
                  {task.assignedTo && (
                    <Badge variant="secondary" className="text-xs">
                      {task.assignedTo}
                    </Badge>
                  )}
                  {task.priority === "high" && (
                    <Badge
                      variant="destructive"
                      className="text-xs px-1.5 py-0.5"
                    >
                      High
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getStatusColor(task.status))}
                  >
                    {task.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default EnhancedProjectComponent;
