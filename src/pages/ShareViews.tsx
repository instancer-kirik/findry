import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useShareViews, ShareView } from '@/hooks/use-share-views';
import { useAuth } from '@/hooks/use-auth';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Copy, Trash2, Eye, Tag, Pin, X, Link2, Edit2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const ShareViews: React.FC = () => {
  const { user } = useAuth();
  const { myViews, createView, updateView, deleteView } = useShareViews();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingView, setEditingView] = useState<ShareView | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    tags: '',
  });

  // Fetch ALL unified projects (catalog + dev + ideas + projects, etc.)
  // Source tables like catalog/product_ideas don't have owner columns,
  // so we surface everything for pinning. Tags come from the projects table when present.
  const { data: myProjects } = useQuery({
    queryKey: ['unified-projects-for-share'],
    queryFn: async () => {
      const [{ data: unified }, { data: tagged }] = await Promise.all([
        supabase
          .from('unified_projects' as any)
          .select('id, name, project_type, source_table, domain')
          .order('name', { ascending: true })
          .limit(500) as any,
        supabase.from('projects' as any).select('id, tags') as any,
      ]);
      const tagMap = new Map<string, string[]>(
        ((tagged as any[]) || []).map((p: any) => [p.id, p.tags || []])
      );
      return ((unified as any[]) || []).map((p: any) => ({
        ...p,
        tags: tagMap.get(p.id) || [],
      }));
    },
    enabled: !!user,
  });

  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [excludedIds, setExcludedIds] = useState<string[]>([]);

  const resetForm = () => {
    setForm({ name: '', description: '', tags: '' });
    setPinnedIds([]);
    setExcludedIds([]);
    setEditingView(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (view: ShareView) => {
    setEditingView(view);
    // Merge legacy labels into tags
    const allTags = Array.from(new Set([...(view.tags || []), ...(view.labels || [])]));
    setForm({
      name: view.name,
      description: view.description || '',
      tags: allTags.join(', '),
    });
    setPinnedIds(view.pinned_project_ids || []);
    setExcludedIds(view.excluded_project_ids || []);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      resetForm();
    }
  };

  const handleSubmit = async () => {
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      name: form.name,
      description: form.description || null,
      tags,
      labels: [],
      pinned_project_ids: pinnedIds,
      excluded_project_ids: excludedIds,
    };

    try {
      if (editingView) {
        await updateView.mutateAsync({ id: editingView.id, ...payload });
        toast({ title: 'View updated' });
      } else {
        await createView.mutateAsync(payload);
        toast({ title: 'Share view created!' });
      }
      setDialogOpen(false);
      resetForm();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const copyLink = (shareKey: string) => {
    const url = `${window.location.origin}/share/${shareKey}`;
    navigator.clipboard.writeText(url);
    toast({ title: 'Link copied!', description: url });
  };

  const handleDelete = async (id: string) => {
    await deleteView.mutateAsync(id);
    toast({ title: 'View deleted' });
  };

  const togglePin = (projectId: string) => {
    setPinnedIds(prev =>
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
    setExcludedIds(prev => prev.filter(id => id !== projectId));
  };

  const toggleExclude = (projectId: string) => {
    setExcludedIds(prev =>
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
    setPinnedIds(prev => prev.filter(id => id !== projectId));
  };

  const views = myViews.data || [];

  useEffect(() => {
    const editId = searchParams.get('edit');

    if (!editId || views.length === 0) {
      return;
    }

    const matchingView = views.find((view) => view.id === editId);

    if (!matchingView) {
      return;
    }

    openEdit(matchingView);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('edit');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams, views]);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Share Views</h1>
          <p className="text-muted-foreground">Log in to create curated share links.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Share Views</h1>
            <p className="text-muted-foreground mt-1">
              Curate project collections for different audiences
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> New View
          </Button>
        </div>

        {views.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Link2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No share views yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first curated link to share projects with specific people
              </p>
              <Button onClick={openCreate} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> Create Share View
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {views.map((view) => (
              <Card key={view.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{view.name}</CardTitle>
                      {view.description && (
                        <CardDescription className="mt-1">{view.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(view)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => copyLink(view.share_key)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(view.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Array.from(new Set([...(view.tags || []), ...(view.labels || [])])).map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" /> {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Pin className="h-3 w-3" /> {(view.pinned_project_ids || []).length} pinned
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {view.view_count} views
                    </span>
                    <code className="text-xs bg-muted px-2 py-0.5 rounded">
                      /share/{view.share_key}
                    </code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingView ? 'Edit Share View' : 'Create Share View'}</DialogTitle>
              <DialogDescription>
                Configure which tags auto-fill this share page and which projects stay pinned or excluded.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="e.g. Hardware & Technical"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Description (what the viewer sees)</Label>
                <Textarea
                  placeholder="Projects I'm working on in the hardware space..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div>
                <Label>Auto-match Tags (comma separated)</Label>
                <Input
                  placeholder="hardware, vehicle, robotics, tools"
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Projects with these tags auto-populate into this view
                </p>
              </div>
              {/* Project selection */}
              <div>
                <Label className="mb-2 block">Pin or Exclude Projects</Label>
                {!myProjects || myProjects.length === 0 ? (
                  <div className="text-sm text-muted-foreground border rounded-md p-3 bg-muted/30">
                    No projects loaded yet.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-2">
                    {myProjects.map((project: any) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">{project.name}</span>
                          <div className="flex gap-1 mt-0.5 flex-wrap items-center">
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                              {project.source_table}
                            </Badge>
                            {(project.tags || []).slice(0, 4).map((t: string) => (
                              <span key={t} className="text-xs text-muted-foreground">#{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="sm"
                            variant={pinnedIds.includes(project.id) ? 'default' : 'outline'}
                            className="h-7 px-2 text-xs"
                            onClick={() => togglePin(project.id)}
                          >
                            <Pin className="h-3 w-3 mr-1" />
                            {pinnedIds.includes(project.id) ? 'Pinned' : 'Pin'}
                          </Button>
                          <Button
                            size="sm"
                            variant={excludedIds.includes(project.id) ? 'destructive' : 'outline'}
                            className="h-7 px-2 text-xs"
                            onClick={() => toggleExclude(project.id)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            {excludedIds.includes(project.id) ? 'Excluded' : 'Exclude'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!form.name}
                className="w-full"
              >
                {editingView ? 'Save Changes' : 'Create Share View'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ShareViews;
