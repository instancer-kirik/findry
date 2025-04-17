import React, { ReactNode, useMemo } from 'react';
import DefinitionTerm from './DefinitionTerm';

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  examples?: string[];
  related_terms?: { id: string, term: string }[];
}

interface AutoGlossaryProps {
  /**
   * Text content to scan for glossary terms
   */
  children: string;
  
  /**
   * Array of glossary terms to highlight
   */
  terms: GlossaryTerm[];
  
  /**
   * Custom class for the term span
   */
  termClassName?: string;
  
  /**
   * Whether to mark terms with subtle styling 
   */
  markTerms?: boolean;
  
  /**
   * Maximum number of terms to highlight (to avoid visual clutter)
   */
  maxTerms?: number;
}

/**
 * Component that scans text and automatically highlights glossary terms with definitions
 */
export const AutoGlossary: React.FC<AutoGlossaryProps> = ({
  children,
  terms,
  termClassName,
  markTerms = true,
  maxTerms = 10,
}) => {
  // Sort terms by length (longest first) to ensure we match longer terms before shorter ones
  const sortedTerms = useMemo(() => {
    return [...terms].sort((a, b) => b.term.length - a.term.length);
  }, [terms]);
  
  // Create a map of term text to term objects for quick lookup
  const termMap = useMemo(() => {
    const map = new Map<string, GlossaryTerm>();
    sortedTerms.forEach(term => {
      map.set(term.term.toLowerCase(), term);
    });
    return map;
  }, [sortedTerms]);
  
  // Process the text to find and replace terms with DefinitionTerm components
  const processedContent = useMemo(() => {
    if (!children || !terms.length) {
      return children;
    }
    
    // Limit the number of terms to highlight to avoid clutter
    const limitedTerms = sortedTerms.slice(0, maxTerms);
    
    // Split the text by terms and create a fragments array
    const text = children;
    const fragments: ReactNode[] = [];
    
    // Use a regex to identify word boundaries for more accurate term matching
    let remainingText = text;
    let lastIndex = 0;
    
    // Keep track of processed positions to avoid overlapping replacement
    const processedPositions = new Set<number>();
    
    // Process each term
    limitedTerms.forEach(term => {
      const termText = term.term;
      const termLower = termText.toLowerCase();
      const regex = new RegExp(`\\b${termText}\\b`, 'gi');
      
      let match;
      while ((match = regex.exec(remainingText)) !== null) {
        const startPos = match.index;
        const endPos = startPos + match[0].length;
        
        // Skip if this position has already been processed
        let shouldSkip = false;
        for (let i = startPos; i < endPos; i++) {
          if (processedPositions.has(i)) {
            shouldSkip = true;
            break;
          }
        }
        
        if (shouldSkip) continue;
        
        // Mark all positions as processed
        for (let i = startPos; i < endPos; i++) {
          processedPositions.add(i);
        }
        
        // Add text before the term
        if (startPos > lastIndex) {
          fragments.push(remainingText.substring(lastIndex, startPos));
        }
        
        // Add the term with definition
        const matchedTerm = match[0]; // Use the actual match text to preserve capitalization
        const termInfo = termMap.get(termLower);
        
        if (termInfo) {
          fragments.push(
            <DefinitionTerm
              key={`term-${startPos}`}
              term={matchedTerm}
              definition={termInfo.definition}
              termId={termInfo.id}
              className={termClassName}
              markTerm={markTerms}
              examples={termInfo.examples}
              relatedTerms={termInfo.related_terms}
            />
          );
        } else {
          fragments.push(matchedTerm);
        }
        
        lastIndex = endPos;
      }
    });
    
    // Add any remaining text
    if (lastIndex < remainingText.length) {
      fragments.push(remainingText.substring(lastIndex));
    }
    
    return fragments.length > 0 ? <>{fragments}</> : children;
  }, [children, sortedTerms, maxTerms, termMap, termClassName, markTerms]);
  
  return processedContent;
};

export default AutoGlossary; 