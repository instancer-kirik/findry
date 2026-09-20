
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
import AuthGateDialog from '@/components/auth/AuthGateDialog';
import { supabase } from '@/integrations/supabase/client';
import { Hammer, Volume2 } from 'lucide-react';

interface ProjectFormData {
  name: string;
  description: string;
  ownershipType: ProjectOwnershipType;
  ownerId?: string;
  tags: string[];
  isPublic: boolean;
  projectType: string;
}

const ROLLING_WALL_DESCRIPTION = `Build one freestanding, rolling acoustic partition for flexible sound control in the community event space.

Target size: 48 in wide × 84 in tall × about 6 in deep. Build a rigid wood frame, fill it with 4 in mineral wool, fully contain the fibers behind breathable fire-rated acoustic fabric, and mount the base on four locking casters. Add wide feet or outriggers so the wall cannot tip when moved.

This is an absorber and movable room divider, not a soundproof wall. Confirm the final base width, caster rating, fabric fire rating, exits, and required local fire-code clearances before use in a public venue.`;

const ROLLING_WALL_COMPONENTS = [
  { name: 'Rolling frame and anti-tip base', type: 'structure', description: '48 × 84 in timber frame with cross-bracing, wide feet or outriggers, and four locking casters.', status: 'pending' },
  { name: 'Absorber core', type: 'material', description: 'Nominal 4 in semi-rigid mineral wool sized to fit without gaps or compression.', status: 'pending' },
  { name: 'Fabric enclosure', type: 'finish', description: 'Breathable, fire-rated acoustic fabric fully enclosing the absorber so fibers cannot escape.', status: 'pending' },
  { name: 'Edge and impact protection', type: 'safety', description: 'Rounded exposed edges, protected lower corners, covered fasteners, and durable caster mounting plates.', status: 'pending' },
];

const ROLLING_WALL_TASKS = [
  { title: 'Measure the space and travel path', description: 'Check door widths, storage clearance, floor transitions, exits, sprinkler clearance, and likely wall positions.', status: 'pending', priority: 'high' },
  { title: 'Confirm public-space safety requirements', description: 'Verify fabric fire rating, required clearances, anti-tip geometry, and caster load rating before buying materials.', status: 'pending', priority: 'high' },
  { title: 'Cut and assemble the frame', description: 'Build the 48 × 84 in frame square, add bracing, and round exposed corners.', status: 'pending', priority: 'medium' },
  { title: 'Fit and fully enclose mineral wool', description: 'Wear appropriate protection while cutting. Wrap the core so no fibers remain exposed.', status: 'pending', priority: 'high' },
  { title: 'Build the rolling anti-tip base', description: 'Install wide feet or outriggers, caster plates, and four locking casters rated above the finished wall weight.', status: 'pending', priority: 'high' },
  { title: 'Roll, brake, and push-test', description: 'Test thresholds, locked-wheel movement, controlled lateral force, and storage before event use.', status: 'pending', priority: 'high' },
];

const CreateProject = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { useCreateProject } = useProject();
  const createProject = useCreateProject();

  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    ownershipType: 'personal',
    tags: [],
    isPublic: false,
    projectType: 'general',
  });
  const [loadedTemplate, setLoadedTemplate] = useState<'rolling-acoustic-wall' | null>(null);

  const loadRollingWallPlan = () => {
    setLoadedTemplate('rolling-acoustic-wall');
    setFormData({
      name: 'Rolling Acoustic Wall',
      description: ROLLING_WALL_DESCRIPTION,
      ownershipType: 'personal',
      tags: ['fabrication', 'acoustics', 'community-space', 'rolling-wall'],
      isPublic: false,
      projectType: 'general',
    });
  };

  // Show auth gate if not logged in after loading
  React.useEffect(() => {
    if (!loading && !user) {
      setAuthGateOpen(true);
    }
  }, [loading, user]);
  
  // Parse and format tag inputs
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagString = e.target.value;
    const tagsArray = tagString.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData({ ...formData, tags: tagsArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setAuthGateOpen(true);
      return;
    }

    try {
      const projectId = await createProject.mutateAsync({
        name: formData.name,
        description: formData.description,
        status: 'planning',
        version: '0.1.0',
        progress: 0,
        tags: formData.tags,
        ownerType: formData.ownershipType,
        ownerId: formData.ownerId || user.id,
        owner_type: formData.ownershipType,
        owner_id: formData.ownerId || user.id,
        created_by: user.id,
        is_public: formData.isPublic,
        type: formData.projectType,
      });

      if (loadedTemplate === 'rolling-acoustic-wall') {
        const [componentsResult, tasksResult] = await Promise.all([
          supabase.from('project_components').insert(
            ROLLING_WALL_COMPONENTS.map((component) => ({ ...component, project_id: projectId })),
          ),
          supabase.from('project_tasks').insert(
            ROLLING_WALL_TASKS.map((task) => ({ ...task, project_id: projectId })),
          ),
        ]);

        const setupError = componentsResult.error || tasksResult.error;
        if (setupError) {
          toast.error('The project was created, but part of the build checklist could not be added.');
        }
      }

      navigate(loadedTemplate ? `/projects/${projectId}` : '/projects');
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

          <div className="mb-8 border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary/15 text-primary">
                <Volume2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">Rolling acoustic wall</h2>
                <p className="mt-1 text-sm text-muted-foreground">Loads a practical 4 × 7 ft absorber plan with materials, safety checks, and build tasks.</p>
                <Button type="button" variant={loadedTemplate ? 'secondary' : 'outline'} size="sm" className="mt-3" onClick={loadRollingWallPlan}>
                  <Hammer className="mr-2 h-4 w-4" />
                  {loadedTemplate ? 'Build plan loaded' : 'Use build plan'}
                </Button>
              </div>
            </div>
          </div>
          
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
              <Label htmlFor="projectType">Project Type</Label>
              <Select 
                value={formData.projectType}
                onValueChange={(value) => setFormData({ ...formData, projectType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Project</SelectItem>
                  <SelectItem value="film">Film / Movie</SelectItem>
                  <SelectItem value="vehicle_build">Vehicle Build</SelectItem>
                  <SelectItem value="product_launch">Product Launch</SelectItem>
                </SelectContent>
              </Select>
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
              />
              <Label htmlFor="isPublic" className="cursor-pointer">
                Make this project public
              </Label>
            </div>
              
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={createProject.isPending || !user}
              >
                {createProject.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>

          {/* Auth Gate Dialog */}
          <AuthGateDialog
            open={authGateOpen}
            onOpenChange={setAuthGateOpen}
            actionType="create a project"
            emailSubject="Request to Create a Project"
            emailMessage={`I'd like to create a project${formData.name ? `: ${formData.name}` : ''}.\n\nDescription: ${formData.description || '(not provided yet)'}\n\nHere are more details:\n`}
          />
          </div>
      </div>
    </Layout>
  );
};

export default CreateProject;
