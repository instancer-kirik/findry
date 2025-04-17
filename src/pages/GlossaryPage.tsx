import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, BookOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { GlossaryEntry, GlossaryCategory } from '@/types/glossary';
import { Badge } from '@/components/ui/badge';

// Sample glossary data for demonstration
const sampleEntries: GlossaryEntry[] = [
  {
    id: '1',
    term: 'Gallery',
    definition: 'A space dedicated to the exhibition of visual art, typically owned by an individual or group that displays and sells artwork.',
    category_id: 'art-spaces',
    examples: ['Contemporary art gallery', 'Artist-run gallery space'],
    related_terms: ['Exhibition', 'Curator'],
    created_at: '2023-06-15T10:30:00Z',
    updated_at: '2023-06-15T10:30:00Z',
    created_by: 'system',
    status: 'published'
  },
  {
    id: '2',
    term: 'Exhibition',
    definition: 'A public display of artworks or artistic projects in a gallery, museum, or other venue.',
    category_id: 'art-events',
    examples: ['Solo exhibition', 'Group exhibition', 'Retrospective exhibition'],
    created_at: '2023-06-20T14:15:00Z',
    updated_at: '2023-06-20T14:15:00Z',
    created_by: 'system',
    status: 'published'
  },
  {
    id: '3',
    term: 'Curator',
    definition: 'A person who selects, organizes, and cares for items in a collection or exhibition.',
    category_id: 'art-professions',
    examples: ['Museum curator', 'Independent curator'],
    created_at: '2023-06-25T09:45:00Z',
    updated_at: '2023-06-25T09:45:00Z',
    created_by: 'system',
    status: 'published'
  },
  {
    id: '4',
    term: 'Installation',
    definition: 'Site-specific, three-dimensional works designed to transform a viewer\'s perception of a space.',
    category_id: 'art-forms',
    examples: ['Light installation', 'Sound installation', 'Interactive installation'],
    created_at: '2023-07-05T16:20:00Z',
    updated_at: '2023-07-05T16:20:00Z',
    created_by: 'system',
    status: 'published'
  },
  {
    id: '5',
    term: 'Vernissage',
    definition: 'A private view of an art exhibition before it officially opens to the public, typically including a reception.',
    category_id: 'art-events',
    examples: ['Gallery vernissage', 'Museum opening'],
    created_at: '2023-07-12T18:30:00Z',
    updated_at: '2023-07-12T18:30:00Z',
    created_by: 'system',
    status: 'published'
  }
];

const sampleCategories: GlossaryCategory[] = [
  {
    id: 'art-spaces',
    name: 'Art Spaces',
    description: 'Terms related to spaces where art is displayed or created',
    created_at: '2023-05-10T00:00:00Z'
  },
  {
    id: 'art-events',
    name: 'Art Events',
    description: 'Terms related to art events and exhibitions',
    created_at: '2023-05-10T00:00:00Z'
  },
  {
    id: 'art-forms',
    name: 'Art Forms',
    description: 'Different types and forms of artistic expression',
    created_at: '2023-05-10T00:00:00Z'
  },
  {
    id: 'art-professions',
    name: 'Art Professions',
    description: 'Roles and professions in the art world',
    created_at: '2023-05-10T00:00:00Z'
  }
];

const GlossaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('all');
  
  // Filter entries based on search query and selected category
  const filteredEntries = sampleEntries.filter(entry => {
    const matchesSearch = searchQuery 
      ? entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.definition.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesCategory = selectedCategory 
      ? entry.category_id === selectedCategory
      : true;
      
    return matchesSearch && matchesCategory;
  });
  
  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = sampleCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Art Glossary</h1>
          <p className="text-muted-foreground mt-1">
            Explore and learn art terminology
          </p>
        </div>
        
        {user && (
          <Button 
            onClick={() => navigate('/glossary/create')}
            className="mt-4 md:mt-0"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Term
          </Button>
        )}
      </div>
      
      <div className="mb-8">
        <div className="flex gap-4 max-w-xl">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search terms..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button
            variant={selectedCategory ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Terms</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          {user && (
            <TabsTrigger value="examples">Examples</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {selectedCategory && (
            <div className="mb-4">
              <Badge className="text-sm py-1 px-3">
                Filtered by: {getCategoryName(selectedCategory)}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => setSelectedCategory(null)}
                >
                  ×
                </Button>
              </Badge>
            </div>
          )}
          
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Terms Found</h2>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No terms matching "${searchQuery}"`
                  : 'There are no glossary terms available yet'}
              </p>
              {user && (
                <Button onClick={() => navigate('/glossary/create')}>
                  Add the First Term
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntries.map(entry => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{entry.term}</CardTitle>
                    <CardDescription>
                      <span className="font-medium">{getCategoryName(entry.category_id)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {entry.definition}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between"
                      onClick={() => navigate(`/glossary/${entry.id}`)}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleCategories.map(category => {
              const categoryEntryCount = sampleEntries.filter(
                entry => entry.category_id === category.id
              ).length;
              
              return (
                <Card 
                  key={category.id} 
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    selectedCategory === category.id ? 'border-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentTab('all');
                  }}
                >
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>
                      {categoryEntryCount} term{categoryEntryCount !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="examples">
          <div className="text-center">
            <Button onClick={() => navigate('/glossary-examples')}>
              View Component Examples
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GlossaryPage; 