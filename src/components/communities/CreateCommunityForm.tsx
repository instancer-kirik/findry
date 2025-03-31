import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { uploadFile } from '@/lib/supabaseStorage';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Community name must be at least 3 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  category: z.string({
    required_error: 'Please select a category.',
  }),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCommunityFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateCommunityForm = ({ onSuccess, onCancel }: CreateCommunityFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      imageUrl: '',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL for the image
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a community",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      let finalImageUrl = values.imageUrl;
      
      // Upload image if provided
      if (imageFile) {
        const fileName = `${user.id}_${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        
        try {
          finalImageUrl = await uploadFile('community_images', fileName, imageFile);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Image upload failed",
            description: "We couldn't upload your image, but you can still create the community.",
            variant: "destructive",
          });
        }
      }
      
      // Insert the new community into the database
      const { data, error } = await supabase
        .from('communities')
        .insert({
          name: values.name,
          description: values.description,
          category: values.category,
          image_url: finalImageUrl || null,
          created_by: user.id,
        })
        .select('id')
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Add the creator as a member with admin role
      if (data) {
        const { error: memberError } = await supabase
          .from('community_members')
          .insert({
            community_id: data.id,
            user_id: user.id,
            role: 'admin',
          });
          
        if (memberError) {
          console.error('Error adding creator as member:', memberError);
          // We continue even if this fails
        }
      }
      
      toast({
        title: "Community created!",
        description: "Your community has been successfully created.",
      });
      
      // Call onSuccess callback or redirect to the community page
      if (onSuccess) {
        onSuccess();
      } else if (data) {
        navigate(`/communities/${data.id}`);
      }
      
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: "Failed to create community",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Arts", "Music", "Dance", "Theater", "Film", 
    "Writing", "Photography", "Design", "Technology", 
    "Gaming", "Sports", "Food", "Travel", "Education", 
    "Health", "Business", "Networking", "Social", "Other"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter community name" {...field} />
              </FormControl>
              <FormDescription>
                This is how your community will appear to others.
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
                  placeholder="Tell people what your community is about"
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Describe the purpose, activities, and goals of your community.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category that best represents your community.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <FormLabel>Community Image (Optional)</FormLabel>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full object-contain rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                    </div>
                  )}
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
            
            {imagePreview && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
              >
                Remove
              </Button>
            )}
          </div>
          <FormDescription>
            Upload an image that represents your community. This is optional.
          </FormDescription>
        </FormItem>
        
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Community'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCommunityForm;
