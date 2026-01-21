import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { parseToonFile, ToonProject, ToonParseResult, normalizeStatus } from '@/utils/toon-parser';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/use-user';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface ToonImporterProps {
  onComplete?: () => void;
}

export function ToonImporter({ onComplete }: ToonImporterProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [parseResult, setParseResult] = useState<ToonParseResult | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setImportResults(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = parseToonFile(content);
        setParseResult(result);
        // Select all by default
        setSelectedIds(new Set(result.allProjects.map(p => p.id)));
      } catch (err) {
        setError(`Failed to parse file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleToggleProject = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (parseResult) {
      setSelectedIds(new Set(parseResult.allProjects.map(p => p.id)));
    }
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleImport = async () => {
    if (!parseResult || selectedIds.size === 0 || !user) {
      toast.error('Please select projects to import and ensure you are logged in');
      return;
    }

    setIsImporting(true);
    setError(null);
    let success = 0;
    let failed = 0;

    const projectsToImport = parseResult.allProjects.filter(p => selectedIds.has(p.id));

    for (const project of projectsToImport) {
      try {
        // Check if project already exists (by name or id)
        const { data: existing } = await supabase
          .from('projects')
          .select('id')
          .or(`id.eq.${project.id},name.eq.${project.name}`)
          .maybeSingle();

        if (existing) {
          // Update existing project
          const { error: updateError } = await supabase
            .from('projects')
            .update({
              description: project.description || null,
              status: normalizeStatus(project.status || 'planning'),
              repo_url: project.repo_url || null,
              tags: Array.isArray(project.tags) ? project.tags : 
                    project.tags ? [project.tags] : [],
              type: project.source || 'catalog',
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;
        } else {
          // Insert new project
          const { data: newProject, error: insertError } = await supabase
            .from('projects')
            .insert({
              id: project.id.startsWith('catalog-') ? undefined : project.id,
              name: project.name,
              description: project.description || null,
              status: normalizeStatus(project.status || 'planning'),
              repo_url: project.repo_url || null,
              tags: Array.isArray(project.tags) ? project.tags : 
                    project.tags ? [project.tags] : [],
              type: project.source || 'catalog',
              owner_id: user.id,
              created_by: user.id,
              is_public: false,
              progress: 0,
              version: '0.1.0',
            })
            .select('id')
            .single();

          if (insertError) throw insertError;

          // Create content ownership record
          if (newProject) {
            await supabase.from('content_ownership').insert({
              content_id: newProject.id,
              content_type: 'project',
              owner_id: user.id,
            });
          }
        }
        success++;
      } catch (err) {
        console.error(`Failed to import ${project.name}:`, err);
        failed++;
      }
    }

    setImportResults({ success, failed });
    setIsImporting(false);
    
    // Invalidate queries to refresh the project list
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    
    if (success > 0) {
      toast.success(`Imported ${success} projects successfully${failed > 0 ? `, ${failed} failed` : ''}`);
    }
    
    if (onComplete && failed === 0) {
      onComplete();
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400',
      beta: 'bg-blue-500/20 text-blue-400',
      prototype: 'bg-yellow-500/20 text-yellow-400',
      releasable: 'bg-emerald-500/20 text-emerald-400',
      stable: 'bg-teal-500/20 text-teal-400',
      shelved: 'bg-gray-500/20 text-gray-400',
      prohibited: 'bg-red-500/20 text-red-400',
      new: 'bg-purple-500/20 text-purple-400',
      planning: 'bg-orange-500/20 text-orange-400',
      in_progress: 'bg-blue-500/20 text-blue-400',
    };
    return colors[status?.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Import .toon File
        </CardTitle>
        <CardDescription>
          Import projects from a TOON export file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {importResults && (
          <Alert className={importResults.failed > 0 ? 'border-yellow-500' : 'border-green-500'}>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Imported {importResults.success} projects
              {importResults.failed > 0 && `, ${importResults.failed} failed`}
            </AlertDescription>
          </Alert>
        )}

        {!parseResult ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 gap-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              Upload a .toon file to import projects
            </p>
            <input
              type="file"
              accept=".toon,.md,.txt"
              onChange={handleFileSelect}
              className="hidden"
              id="toon-file-input"
            />
            <Button asChild>
              <label htmlFor="toon-file-input" className="cursor-pointer">
                Select File
              </label>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Found {parseResult.allProjects.length} projects • {selectedIds.size} selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                  Deselect All
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[400px] rounded-md border p-2">
              <div className="space-y-2">
                {parseResult.allProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      selectedIds.has(project.id) ? 'bg-accent/50' : 'bg-background hover:bg-accent/25'
                    }`}
                  >
                    <Checkbox
                      checked={selectedIds.has(project.id)}
                      onCheckedChange={() => handleToggleProject(project.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">{project.name}</span>
                        {project.status && (
                          <Badge variant="secondary" className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {project.source}
                        </Badge>
                      </div>
                      {project.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {project.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setParseResult(null);
                  setSelectedIds(new Set());
                  setImportResults(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={isImporting || selectedIds.size === 0 || !user}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  `Import ${selectedIds.size} Projects`
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
