import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Flag } from 'lucide-react';
import { ProjectTask } from '@/types/project';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Partial<ProjectTask> | null;
  isEditing: boolean;
  isLoading: boolean;
  onSave: (task: Partial<ProjectTask>) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  task,
  isEditing,
  isLoading,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<Partial<ProjectTask>>({
    title: '',
    name: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
    dueDate: '',
  });

  React.useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        title: task.title || task.name || '',
        name: task.name || task.title || '',
      });
    } else {
      setFormData({
        title: '',
        name: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
      });
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      return;
    }
    onSave({
      ...formData,
      name: formData.title, // Ensure name matches title
    });
  };

  const handleChange = (field: keyof ProjectTask, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Keep name and title in sync
      ...(field === 'title' ? { name: value } : {}),
    }));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Flag className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Flag className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Flag className="h-4 w-4 text-green-500" />;
      default:
        return <Flag className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getPriorityIcon(formData.priority || 'medium')}
            {isEditing ? "Edit Task" : "Add Task"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this task and track its progress."
              : "Add a new task to your project and assign it to team members."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            {/* Task Title */}
            <div>
              <Label htmlFor="title" className="flex items-center gap-2">
                Task Title *
                <Badge variant="secondary" className="text-xs">Required</Badge>
              </Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleChange('title', e.target.value)}
                className="mt-1"
                placeholder="e.g., Install electrical system, Complete wireframe design"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange('description', e.target.value)}
                className="mt-1"
                rows={3}
                placeholder="Provide detailed information about what needs to be done..."
              />
            </div>

            {/* Status and Priority Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "pending"}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Completed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority || "medium"}
                  onValueChange={(value) => handleChange('priority', value)}
                >
                  <SelectTrigger id="priority" className="mt-1">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <Flag className="h-3 w-3 text-green-500" />
                        Low Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <Flag className="h-3 w-3 text-yellow-500" />
                        Medium Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <Flag className="h-3 w-3 text-red-500" />
                        High Priority
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignment and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignedTo" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assigned To
                </Label>
                <Input
                  id="assignedTo"
                  value={formData.assignedTo || ""}
                  onChange={(e) => handleChange('assignedTo', e.target.value)}
                  className="mt-1"
                  placeholder="Name or email"
                />
              </div>

              <div>
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate || ""}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Task Preview */}
            {formData.title && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
                <div className="text-sm text-muted-foreground mb-1">Preview:</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.status === 'completed' ? 'bg-green-500' :
                    formData.status === 'in_progress' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="font-medium">{formData.title}</span>
                  {formData.priority && (
                    <Badge
                      variant={
                        formData.priority === 'high' ? 'destructive' :
                        formData.priority === 'medium' ? 'default' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {formData.priority.toUpperCase()}
                    </Badge>
                  )}
                  {formData.assignedTo && (
                    <Badge variant="outline" className="text-xs">
                      {formData.assignedTo}
                    </Badge>
                  )}
                </div>
                {formData.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {formData.description}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title}
              className="min-w-[100px]"
            >
              {isLoading ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
