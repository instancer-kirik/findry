import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DefinitionTermProps {
  /**
   * The term to display
   */
  term: string;
  
  /**
   * The definition to show in the hover card
   */
  definition: string;
  
  /**
   * Optional ID of the glossary entry for linking to the full definition
   */
  termId?: string;
  
  /**
   * Optional CSS class for the term text
   */
  className?: string;
  
  /**
   * Optional array of related terms
   */
  relatedTerms?: Array<{id: string, term: string}>;
  
  /**
   * Optional examples to display
   */
  examples?: string[];
  
  /**
   * Whether to mark the term with subtle styling
   */
  markTerm?: boolean;
}

/**
 * Component that renders a term with its definition in a hover card
 */
export const DefinitionTerm: React.FC<DefinitionTermProps> = ({
  term,
  definition,
  termId,
  className,
  relatedTerms,
  examples,
  markTerm = true,
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span 
          className={cn(
            markTerm && "border-b border-dotted border-muted-foreground/50 cursor-help",
            className
          )}
        >
          {term}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">{term}</h4>
          <p className="text-sm text-muted-foreground">{definition}</p>
          
          {examples && examples.length > 0 && (
            <div className="pt-2">
              <h5 className="text-xs font-medium mb-1">Example{examples.length > 1 ? 's' : ''}</h5>
              <ul className="text-xs list-disc pl-4 space-y-1">
                {examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
          )}
          
          {relatedTerms && relatedTerms.length > 0 && (
            <div className="pt-2">
              <h5 className="text-xs font-medium mb-1">Related Terms</h5>
              <div className="flex flex-wrap gap-1">
                {relatedTerms.map((related) => (
                  <Button 
                    key={related.id} 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-xs"
                    asChild
                  >
                    <Link to={`/glossary/${related.id}`}>{related.term}</Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {termId && (
            <div className="pt-2 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                asChild
              >
                <Link to={`/glossary/${termId}`}>
                  <span>More details</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default DefinitionTerm; 