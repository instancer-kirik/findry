import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreateGlossaryEntryParams, GlossaryCategory } from '@/types/glossary';
import { v4 as uuidv4 } from 'uuid';

// Mock categories for development
const mockCategories: GlossaryCategory[] = [
  {
    id: 'art-terms',
    name: 'Art Terms',
    description: 'General terms used in art',
    created_at: new Date().toISOString()
  },
  {
    id: 'art-spaces',
    name: 'Art Spaces',
    description: 'Terms related to art exhibition spaces',
    created_at: new Date().toISOString()
  },
  {
    id: 'art-techniques',
    name: 'Art Techniques',
    description: 'Methods and approaches used in creating art',
    created_at: new Date().toISOString()
  }
];

// Simple mock implementation for useGetGlossaryCategories
const useGetGlossaryCategories = () => {
  return {
    data: mockCategories,
    isLoading: false
  };
};

// Simple mock implementation for useCreateGlossaryEntry
const useCreateGlossaryEntry = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const mutateAsync = async (entry: CreateGlossaryEntryParams & { status: string, created_by: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock created entry
    const newEntry = {
      ...entry,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Show success toast
    toast({
      title: "Entry Created",
      description: "This is a mock implementation. In a real app, this would save to the database."
    });
    
    return newEntry;
  };
  
  return {
    mutateAsync,
    isLoading: false
  };
};

const CreateGlossaryEntry: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutateAsync: createEntry, isLoading } = useCreateGlossaryEntry();
  const { data: categories, isLoading: isLoadingCategories } = useGetGlossaryCategories();
  
  const [formData, setFormData] = useState({
    term: '',
    definition: '',
    category_id: '',
    examples: [''],
    related_terms: [''],
    sources: [''],
    image_url: '',
  });
  
  if (!user) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground mt-2">
            Please log in to add new glossary entries.
          </p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Log In
          </Button>
        </div>
      </div>
    );
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category_id: value }));
  };
  
  const handleArrayItemChange = (arrayName: 'examples' | 'related_terms' | 'sources', index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return { ...prev, [arrayName]: newArray };
    });
  };
  
  const handleAddArrayItem = (arrayName: 'examples' | 'related_terms' | 'sources') => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };
  
  const handleRemoveArrayItem = (arrayName: 'examples' | 'related_terms' | 'sources', index: number) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray.splice(index, 1);
      return { ...prev, [arrayName]: newArray };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.term.trim() || !formData.definition.trim() || !formData.category_id) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (term, definition, and category).",
        variant: "destructive"
      });
      return;
    }
    
    // Filter out empty array items
    const filteredExamples = formData.examples.filter(ex => ex.trim());
    const filteredRelatedTerms = formData.related_terms.filter(term => term.trim());
    const filteredSources = formData.sources.filter(source => source.trim());
    
    try {
      const entry = await createEntry({
        term: formData.term,
        definition: formData.definition,
        category_id: formData.category_id,
        examples: filteredExamples.length > 0 ? filteredExamples : undefined,
        related_terms: filteredRelatedTerms.length > 0 ? filteredRelatedTerms : undefined,
        sources: filteredSources.length > 0 ? filteredSources : undefined,
        image_url: formData.image_url.trim() || undefined,
        status: 'published',
        created_by: user.id
      });
      
      toast({
        title: "Success",
        description: "Glossary entry created successfully!"
      });
      
      navigate(`/glossary/${entry.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create glossary entry: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };
  
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
          <CardTitle className="text-2xl">Add New Glossary Entry</CardTitle>
          <CardDescription>
            Create a new definition to contribute to the art community glossary
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="term">Term <span className="text-red-500">*</span></Label>
              <Input
                id="term"
                name="term"
                placeholder="Enter the term or phrase"
                value={formData.term}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="definition">Definition <span className="text-red-500">*</span></Label>
              <Textarea
                id="definition"
                name="definition"
                placeholder="Enter the definition"
                value={formData.definition}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Select 
                onValueChange={handleCategoryChange}
                value={formData.category_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                  ) : categories && categories.length > 0 ? (
                    categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No categories found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Examples</Label>
              {formData.examples.map((example, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Example ${index + 1}`}
                    value={example}
                    onChange={(e) => handleArrayItemChange('examples', index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveArrayItem('examples', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddArrayItem('examples')}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Example
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Related Terms</Label>
              {formData.related_terms.map((term, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Related term ${index + 1}`}
                    value={term}
                    onChange={(e) => handleArrayItemChange('related_terms', index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveArrayItem('related_terms', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddArrayItem('related_terms')}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Related Term
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Sources</Label>
              {formData.sources.map((source, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Source ${index + 1}`}
                    value={source}
                    onChange={(e) => handleArrayItemChange('sources', index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveArrayItem('sources', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddArrayItem('sources')}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Source
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                placeholder="Enter image URL (optional)"
                value={formData.image_url}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/glossary')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Entry'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateGlossaryEntry; 