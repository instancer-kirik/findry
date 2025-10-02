import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  Clock,
  Circle,
  Calendar,
  Edit,
  MoreVertical,
  Trash2,
  User,
} from "lucide-react";
import { ProjectTask } from "@/types/project";

interface EnhancedTaskCardProps {
  task: ProjectTask;
  isOwner: boolean;
  onEdit: (task: ProjectTask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (
    task: ProjectTask,
    status: "pending" | "in_progress" | "completed",
  ) => void;
  onReference: (task: ProjectTask) => void;
}

const EnhancedTaskCard: React.FC<EnhancedTaskCardProps> = ({
  task,
  isOwner,
  onEdit,
  onDelete,
  onStatusChange,
  onReference,
}) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
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

  return (
    <Card
      id={`task-${task.id}`}
      className={`group transition-all hover:shadow-md border-l-4 ${
        task.status === "completed"
          ? "bg-muted/30 border-l-green-500"
          : task.status === "in_progress"
            ? "bg-blue-50/50 border-l-blue-500"
            : "bg-amber-50/30 border-l-amber-500"
      }`}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1 pt-1">
            <StatusIcon status={task.status} />
            {task.priority === "high" && (
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-lg leading-tight cursor-pointer hover:text-primary transition-colors ${
                    task.status === "completed"
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                  onClick={() =>
                    onStatusChange(
                      task,
                      task.status === "completed" ? "pending" : "completed",
                    )
                  }
                >
                  {task.title || task.name}
                </h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(task.status)}`}
                >
                  {task.status.replace("_", " ")}
                </Badge>
                {task.priority && (
                  <Badge
                    variant={getPriorityColor(task.priority)}
                    className="text-xs"
                  >
                    {task.priority.charAt(0).toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {task.assignedTo && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <Badge
                      variant="secondary"
                      className="text-xs px-1.5 py-0.5"
                    >
                      {task.assignedTo}
                    </Badge>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span
                      className={`${
                        new Date(task.dueDate) < new Date() &&
                        task.status !== "completed"
                          ? "text-red-600 font-medium"
                          : ""
                      }`}
                    >
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {task.status !== "completed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs shadow-sm"
                    onClick={() =>
                      onStatusChange(
                        task,
                        task.status === "pending" ? "in_progress" : "completed",
                      )
                    }
                  >
                    {task.status === "pending" ? "Start" : "Complete"}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onReference(task)}
                >
                  Ref
                </Button>
                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onEdit(task)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onStatusChange(task, "pending")}
                        disabled={task.status === "pending"}
                      >
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(task, "in_progress")}
                        disabled={task.status === "in_progress"}
                      >
                        Mark as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(task, "completed")}
                        disabled={task.status === "completed"}
                      >
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(task.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTaskCard;
