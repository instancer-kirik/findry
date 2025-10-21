import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload } from 'lucide-react';

const CreateResource: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    subtype: '',
    description: '',
    location: '',
    size_sqft: '',
    tags: '',
    image_url: '',
  });

  const resourceTypes = [
    'Studio Space',
    'Equipment',
    'Venue',
    'Vehicle',
    'Service',
    'Other',
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `resources/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));

      toast({
        title: 'Image uploaded',
        description: 'Resource image uploaded successfully.',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a resource.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name || !formData.type) {
      toast({
        title: 'Missing information',
        description: 'Please provide at least a name and type for the resource.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create the resource
      const { data: resource, error: resourceError } = await supabase
        .from('resources')
        .insert({
          name: formData.name,
          type: formData.type,
          subtype: formData.subtype || null,
          description: formData.description || null,
          location: formData.location || null,
          size_sqft: formData.size_sqft ? parseInt(formData.size_sqft) : null,
          tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
          image_url: formData.image_url || null,
          availability: [],
        })
        .select()
        .single();

      if (resourceError) throw resourceError;

      // Create content ownership record
      const { error: ownershipError } = await supabase
        .from('content_ownership')
        .insert({
          content_id: resource.id,
          content_type: 'resource',
          owner_id: user.id,
        });

      if (ownershipError) throw ownershipError;

      toast({
        title: 'Resource created',
        description: 'Your resource has been created successfully.',
      });

      navigate(`/resources/${resource.id}`);
    } catch (error) {
      console.error('Error creating resource:', error);
      toast({
        title: 'Creation failed',
        description: 'Failed to create resource. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create Resource</CardTitle>
              <CardDescription>
                Add a resource to list on the Discover page for others to request and use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Resource Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Recording Studio A"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtype">Subtype</Label>
                  <Input
                    id="subtype"
                    value={formData.subtype}
                    onChange={(e) => handleChange('subtype', e.target.value)}
                    placeholder="e.g., Podcast Studio, Photo Studio"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe your resource..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g., Brooklyn, NY"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size_sqft">Size (sq ft)</Label>
                  <Input
                    id="size_sqft"
                    type="number"
                    value={formData.size_sqft}
                    onChange={(e) => handleChange('size_sqft', e.target.value)}
                    placeholder="e.g., 500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    placeholder="Separate tags with commas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Resource Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="flex-1"
                    />
                    {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  {formData.image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.image_url}
                        alt="Resource preview"
                        className="h-32 w-auto object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading || uploading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Resource
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/discover')}
                    disabled={loading || uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateResource;
