import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectComponent } from '@/types/project';

interface ComponentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  component: Partial<ProjectComponent> | null;
  isEditing: boolean;
  isLoading: boolean;
  onSave: (component: Partial<ProjectComponent>) => void;
}

const ComponentDialog: React.FC<ComponentDialogProps> = ({
  open,
  onOpenChange,
  component,
  isEditing,
  isLoading,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<Partial<ProjectComponent>>({
    name: '',
    description: '',
    type: '',
    status: 'pending',
    assignedTo: '',
    dueDate: '',
  });

  React.useEffect(() => {
    if (component) {
      setFormData(component);
    } else {
      setFormData({
        name: '',
        description: '',
        type: '',
        status: 'pending',
        assignedTo: '',
        dueDate: '',
      });
    }
  }, [component, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type) {
      return;
    }
    onSave(formData);
  };

  const handleChange = (field: keyof ProjectComponent, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Component" : "Add Component"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this component."
              : "Add a new component to your project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="name">Component Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-1"
                placeholder="e.g., Electrical System, Interior Design"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange('description', e.target.value)}
                className="mt-1"
                rows={3}
                placeholder="Describe what this component involves..."
              />
            </div>

            <div>
              <Label htmlFor="type">Component Type *</Label>
              <Select
                value={formData.type || ""}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger id="type" className="mt-1">
                  <SelectValue placeholder="Select component type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="insulation">Insulation</SelectItem>
                  <SelectItem value="interior">Interior</SelectItem>
                  <SelectItem value="exterior">Exterior</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="finishing">Finishing</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={formData.assignedTo || ""}
                  onChange={(e) => handleChange('assignedTo', e.target.value)}
                  className="mt-1"
                  placeholder="Name or email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name || !formData.type}>
              {isLoading ? "Saving..." : "Save Component"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentDialog;
