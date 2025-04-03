import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';
import { Store, X, Plus, Upload, MapPin, Globe, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define the form schema
const shopFormSchema = z.object({
  name: z.string().min(2, { message: 'Shop name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters' }),
  website_url: z.string().url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
  logo_url: z.string().optional(),
  banner_image_url: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type ShopFormValues = z.infer<typeof shopFormSchema>;

const CreateShop: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Initialize form
  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      website_url: '',
      logo_url: '',
      banner_image_url: '',
      tags: [],
    },
  });

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const currentTags = form.getValues('tags') || [];
    if (currentTags.includes(tagInput.trim())) {
      toast({
        title: 'Tag already exists',
        description: 'This tag is already added to your shop',
        variant: 'destructive',
      });
      return;
    }
    
    form.setValue('tags', [...currentTags, tagInput.trim()]);
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };

  const onSubmit = async (values: ShopFormValues) => {
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create a shop');
      }
      
      // Create shop
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .insert([
          {
            name: values.name,
            description: values.description,
            location: values.location,
            website_url: values.website_url || null,
            logo_url: values.logo_url || null,
            banner_image_url: values.banner_image_url || null,
            tags: values.tags || [],
          }
        ])
        .select()
        .single();
      
      if (shopError) throw shopError;
      
      // Create content ownership
      const { error: ownershipError } = await supabase
        .from('content_ownership')
        .insert([
          {
            content_id: shopData.id,
            content_type: 'shop',
            owner_id: user.id,
          }
        ]);
      
      if (ownershipError) throw ownershipError;
      
      toast({
        title: 'Shop created!',
        description: 'Your shop has been created successfully.',
      });
      
      // Navigate to the new shop
      navigate(`/shops/${shopData.id}`);
      
    } catch (error: any) {
      console.error('Error creating shop:', error);
      toast({
        title: 'Error creating shop',
        description: error.message || 'Failed to create shop',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle file uploads
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'banner_image_url') => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `shops/${field === 'logo_url' ? 'logos' : 'banners'}/${fileName}`;
    
    setIsLoading(true);
    
    try {
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      // Set the URL in the form
      form.setValue(field, publicUrl);
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error uploading file',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Shop</h1>
          <p className="text-muted-foreground">Set up your shop to showcase and sell your products</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <Separator />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your shop name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is how your shop will appear to customers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your shop and what you sell"
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Tell customers about your shop, products, and brand
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location and Contact */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Location & Contact</h2>
              <Separator />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input className="pl-10" placeholder="City, State" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Where your shop or business is based
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input className="pl-10" placeholder="https://your-website.com" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Your official website or external store
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Shop Images */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Shop Images</h2>
              <Separator />
              
              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Logo</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <div className="relative border rounded-md p-4 w-32 h-32 flex items-center justify-center">
                          {field.value ? (
                            <img 
                              src={field.value} 
                              alt="Shop logo" 
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <Store className="h-12 w-12 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </Button>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'logo_url')}
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Recommended size: 200x200px
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="banner_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="relative border rounded-md p-2 h-40 w-full flex items-center justify-center bg-muted/20">
                          {field.value ? (
                            <img 
                              src={field.value} 
                              alt="Shop banner" 
                              className="max-w-full max-h-full object-cover w-full h-full"
                            />
                          ) : (
                            <div className="text-center">
                              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground">Banner image will appear here</p>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('banner-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Banner
                        </Button>
                        <input
                          id="banner-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'banner_image_url')}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Recommended size: 1200x300px
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tags</h2>
              <Separator />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Tags</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {field.value?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button 
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:bg-muted rounded-full p-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          {field.value?.length === 0 && (
                            <p className="text-sm text-muted-foreground">No tags added yet</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              className="pl-10"
                              placeholder="Add a tag and press Enter"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddTag}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Add tags to help customers discover your shop
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Shop...' : 'Create Shop'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default CreateShop; 