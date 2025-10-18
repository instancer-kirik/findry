import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Flag, Package } from "lucide-react";
import { ProjectTask, ProjectComponent } from "@/types/project";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Partial<ProjectTask> | null;
  isEditing: boolean;
  isLoading: boolean;
  onSave: (task: Partial<ProjectTask>) => void;
  components?: ProjectComponent[];
  preselectedComponentId?: string;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  task,
  isEditing,
  isLoading,
  onSave,
  components = [],
  preselectedComponentId,
}) => {
  const [formData, setFormData] = React.useState<Partial<ProjectTask>>({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    assignedTo: "",
    dueDate: "",
    componentId: preselectedComponentId || "",
  });

  React.useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        componentId: task.componentId || preselectedComponentId || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
        assignedTo: "",
        dueDate: "",
        componentId: preselectedComponentId || "",
      });
    }
  }, [task, preselectedComponentId]);

  const handleSave = () => {
    if (!formData.title?.trim()) return;

    onSave(formData);
  };

  const handleInputChange = (field: keyof ProjectTask, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            {isEditing ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update task details and track progress."
              : "Add a new task to help organize your project work."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what needs to be done..."
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getPriorityColor("low")}
                      >
                        Low
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getPriorityColor("medium")}
                      >
                        Medium
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getPriorityColor("high")}
                      >
                        High
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getStatusColor("pending")}
                      >
                        Pending
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="in_progress">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getStatusColor("in_progress")}
                      >
                        In Progress
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getStatusColor("completed")}
                      >
                        Completed
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="assignedTo"
              className="text-sm font-medium flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Assigned To
            </Label>
            <Input
              id="assignedTo"
              placeholder="Enter assignee name or email..."
              value={formData.assignedTo || ""}
              onChange={(e) => handleInputChange("assignedTo", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="dueDate"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate || ""}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
            />
          </div>

          {components.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Related Component
              </Label>
              <Select
                value={formData.componentId || ""}
                onValueChange={(value) =>
                  handleInputChange("componentId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select component (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    <span className="text-muted-foreground">No component</span>
                  </SelectItem>
                  {components.map((component) => (
                    <SelectItem key={component.id} value={component.id}>
                      <div className="flex items-center gap-2">
                        <span>{component.name}</span>
                        {component.type && (
                          <Badge variant="secondary" className="text-xs">
                            {component.type}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.title?.trim() || isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEditing
                ? "Update Task"
                : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
