import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useShareViewByKey, useShareViewProjects } from '@/hooks/use-share-views';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag, ExternalLink, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShareViewPublic: React.FC = () => {
  const { shareKey } = useParams<{ shareKey: string }>();
  const { data: view, isLoading: viewLoading, error } = useShareViewByKey(shareKey);
  const { data: projects, isLoading: projectsLoading } = useShareViewProjects(view);

  if (viewLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 max-w-4xl px-4">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !view) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold mb-2">View Not Found</h1>
          <p className="text-muted-foreground">This share link may have expired or been removed.</p>
        </div>
      </Layout>
    );
  }

  const isLoading = projectsLoading;
  const items = projects || [];

  return (
    <Layout>
      <div className="container mx-auto py-12 max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{view.name}</h1>
          {view.description && (
            <p className="text-muted-foreground mt-2 text-lg">{view.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {(view.labels || []).map(label => (
              <Badge key={label} variant="outline">{label}</Badge>
            ))}
            {(view.tags || []).map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                <Tag className="h-3 w-3" /> {tag}
              </Badge>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
          </div>
        ) : items.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No projects in this collection yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((project: any) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="hover:border-primary/50 transition-colors h-full">
                  {project.image_url && (
                    <div className="h-32 overflow-hidden rounded-t-lg">
                      <img
                        src={project.image_url}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    </div>
                    {project.description && (
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {(project.tags || []).slice(0, 4).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.type && (
                        <Badge variant="outline" className="text-xs">{project.type}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ShareViewPublic;
