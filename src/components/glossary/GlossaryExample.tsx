import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DefinitionTerm from './DefinitionTerm';
import AutoGlossary from './AutoGlossary';

// Sample glossary terms for demonstration
const sampleTerms = [
  {
    id: '1',
    term: 'Gallery',
    definition: 'A space dedicated to the exhibition of visual art, typically owned by an individual or group that displays and sells artwork.',
    examples: ['Contemporary art gallery', 'Artist-run gallery space'],
    related_terms: [
      { id: '2', term: 'Exhibition' },
      { id: '3', term: 'Curator' }
    ]
  },
  {
    id: '2',
    term: 'Exhibition',
    definition: 'A public display of artworks or artistic projects in a gallery, museum, or other venue.',
    examples: ['Solo exhibition', 'Group exhibition', 'Retrospective exhibition'],
  },
  {
    id: '3',
    term: 'Curator',
    definition: 'A person who selects, organizes, and cares for items in a collection or exhibition.',
    examples: ['Museum curator', 'Independent curator']
  },
  {
    id: '4',
    term: 'Installation',
    definition: 'Site-specific, three-dimensional works designed to transform a viewer\'s perception of a space.',
    examples: ['Light installation', 'Sound installation', 'Interactive installation']
  }
];

// Sample text with glossary terms
const sampleText = `
An Exhibition is a vital part of an artist's career, offering visibility and engagement with audiences. 
When planning an exhibition, artists often work with a Curator who helps develop the concept and select works. 
Many contemporary artists create Installation pieces specifically for a Gallery space, 
considering the unique architectural features and lighting conditions.
`;

const GlossaryExample: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Individual Term Examples</h2>
        <Card>
          <CardHeader>
            <CardTitle>Art Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The term <DefinitionTerm 
                term="Gallery" 
                definition={sampleTerms[0].definition}
                examples={sampleTerms[0].examples}
                relatedTerms={sampleTerms[0].related_terms}
                termId={sampleTerms[0].id}
              /> refers to a space where art is displayed.
            </p>
            
            <p>
              An <DefinitionTerm 
                term="Exhibition" 
                definition={sampleTerms[1].definition}
                examples={sampleTerms[1].examples}
                termId={sampleTerms[1].id}
              /> is organized by a <DefinitionTerm 
                term="Curator" 
                definition={sampleTerms[2].definition}
                examples={sampleTerms[2].examples}
                termId={sampleTerms[2].id}
              /> to showcase artworks.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Auto Glossary Example</h2>
        <Card>
          <CardHeader>
            <CardTitle>Art Text with Automatic Term Highlighting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">
              <AutoGlossary terms={sampleTerms}>
                {sampleText}
              </AutoGlossary>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlossaryExample; 