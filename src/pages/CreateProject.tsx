
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useProject } from '@/hooks/use-project';
import { ProjectOwnershipType } from '@/types/project';
import { toast } from 'sonner';

interface ProjectFormData {
  name: string;
  description: string;
  ownershipType: ProjectOwnershipType;
  ownerId?: string;
  tags: string[];
}

const CreateProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { useCreateProject } = useProject();
  const createProject = useCreateProject();

  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    ownershipType: 'personal',
    tags: []
  });
  
  // Parse and format tag inputs
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagString = e.target.value;
    const tagsArray = tagString.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData({ ...formData, tags: tagsArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast('You must be logged in to create a project');
      return;
    }

    try {
      await createProject.mutateAsync({
        name: formData.name,
        description: formData.description,
        status: 'planning',
        version: '0.1.0',
        progress: 0,
        tags: formData.tags,
        ownerType: formData.ownershipType,
        ownerId: formData.ownerId || user.id
      });

      navigate('/projects');
    } catch (error: any) {
      toast(`Failed to create project: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
                <Input 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                  required
                />
              </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownershipType">Project Ownership</Label>
              <Select 
                value={formData.ownershipType}
                onValueChange={(value: ProjectOwnershipType) => 
                  setFormData({ ...formData, ownershipType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ownership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal Project</SelectItem>
                  <SelectItem value="brand">Brand Project</SelectItem>
                  <SelectItem value="artist">Artist Project</SelectItem>
                  <SelectItem value="community">Community Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.ownershipType !== 'personal' && (
              <div className="space-y-2">
                <Label htmlFor="ownerId">Owner ID</Label>
                <Input
                  id="ownerId"
                  value={formData.ownerId || ''}
                  onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                  placeholder={`Enter ${formData.ownershipType} ID`}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input 
                id="tags"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="e.g. design, development, marketing"
                />
              </div>
              
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={createProject.isPending}
              >
                {createProject.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
          </div>
      </div>
    </Layout>
  );
};

export default CreateProject;
