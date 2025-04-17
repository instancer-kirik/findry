import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// Removed import for deleted hook
// import { useGetGlossaryEntry } from '@/hooks/use-glossary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { GlossaryEntry } from '@/types/glossary';

// Simple mock/fallback implementation for the glossary entry hook
const useGetGlossaryEntry = (entryId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<GlossaryEntry | null>(null);
  
  useEffect(() => {
    // Simulate an API call
    const timer = setTimeout(() => {
      if (!entryId) {
        setError(new Error('No entry ID provided'));
        setIsLoading(false);
        return;
      }
      
      // Create sample data for development/demo
      setData({
        id: entryId,
        term: 'Art Gallery',
        definition: 'A space dedicated to the exhibition and sale of visual art, typically owned by an individual or business that displays and sells the work of artists.',
        category_id: 'art-spaces',
        examples: [
          'Contemporary art gallery',
          'Commercial gallery',
          'Artist-run gallery space'
        ],
        related_terms: ['Exhibition', 'Curator'],
        sources: [
          'The Art Guide: Glossary of Terms',
          'Museum Studies: A Comprehensive Resource'
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        status: 'published'
      });
      
      setIsLoading(false);
    }, 800); // Simulate loading delay
    
    return () => clearTimeout(timer);
  }, [entryId]);
  
  return { data, isLoading, error };
};

const GlossaryEntryDetail: React.FC = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: entry, isLoading, error } = useGetGlossaryEntry(entryId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/glossary')}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Glossary
          </Button>
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/4 mb-6" />
          <Skeleton className="h-24 w-full mb-6" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/glossary')}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Glossary
          </Button>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-red-500">Error</h2>
            <p className="text-muted-foreground mt-2">
              {error ? `Failed to load glossary entry: ${error.message}` : 'Glossary entry not found'}
            </p>
            <Button onClick={() => navigate('/glossary')} className="mt-4">
              Return to Glossary
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === entry.author_id || user?.id === entry.created_by;

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/glossary')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Glossary
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{entry.term}</CardTitle>
              <CardDescription className="mt-2">
                Added on {new Date(entry.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
            {entry.status && (
              <Badge variant={entry.status === 'published' ? 'default' : 'outline'}>
                {entry.status}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-lg">{entry.definition}</p>
          </div>

          {entry.examples && entry.examples.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Examples</h3>
              <ul className="list-disc pl-6 space-y-1">
                {entry.examples.map((example, i) => (
                  <li key={i}>{example}</li>
                ))}
              </ul>
            </div>
          )}

          {entry.related_terms && entry.related_terms.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Related Terms</h3>
              <div className="flex flex-wrap gap-2">
                {entry.related_terms.map((termId) => (
                  <Button 
                    key={termId} 
                    variant="outline" 
                    asChild
                  >
                    <Link to={`/glossary/${termId}`}>
                      {termId} {/* Ideally, we'd display the term name here */}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {entry.sources && entry.sources.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Sources</h3>
              <ul className="list-disc pl-6 space-y-1">
                {entry.sources.map((source, i) => (
                  <li key={i}>{source}</li>
                ))}
              </ul>
            </div>
          )}

          {entry.image_url && (
            <div>
              <h3 className="text-lg font-medium mb-2">Image</h3>
              <img 
                src={entry.image_url} 
                alt={entry.term} 
                className="rounded-md max-h-96 object-contain" 
              />
            </div>
          )}
        </CardContent>

        {isOwner && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link to={`/glossary/edit/${entry.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default GlossaryEntryDetail; 