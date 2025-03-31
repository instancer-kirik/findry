
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const artistProfileSchema = z.object({
  displayName: z.string().min(2, { message: 'Display name must be at least 2 characters' }),
  bio: z.string().max(500, { message: 'Bio must be less than 500 characters' }),
  location: z.string().min(2, { message: 'Location is required' }),
  website: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  primaryDiscipline: z.string().min(1, { message: 'Please select a primary discipline' }),
  styles: z.array(z.string()).optional(),
  isMultidisciplinary: z.boolean().default(false),
  otherDisciplines: z.array(z.string()).optional(),
});

type ArtistProfileFormValues = z.infer<typeof artistProfileSchema>;

const disciplines = [
  { id: 'music', label: 'Music' },
  { id: 'visual-art', label: 'Visual Art' },
  { id: 'performance', label: 'Performance' },
  { id: 'writing', label: 'Writing' },
  { id: 'design', label: 'Design' },
  { id: 'film', label: 'Film/Video' },
  { id: 'digital', label: 'Digital Art/NFT' },
  { id: 'craft', label: 'Craft' },
];

const musicStyles = [
  { id: 'rock', label: 'Rock' },
  { id: 'pop', label: 'Pop' },
  { id: 'hip-hop', label: 'Hip-Hop/Rap' },
  { id: 'electronic', label: 'Electronic' },
  { id: 'jazz', label: 'Jazz' },
  { id: 'classical', label: 'Classical' },
  { id: 'folk', label: 'Folk' },
  { id: 'r-and-b', label: 'R&B/Soul' },
  { id: 'country', label: 'Country' },
  { id: 'experimental', label: 'Experimental' },
];

const ArtistProfileForm: React.FC = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<ArtistProfileFormValues>({
    resolver: zodResolver(artistProfileSchema),
    defaultValues: {
      displayName: '',
      bio: '',
      location: '',
      website: '',
      primaryDiscipline: '',
      styles: [],
      isMultidisciplinary: false,
      otherDisciplines: [],
    },
  });

  // Watch for changes in the form values
  const watchPrimaryDiscipline = form.watch('primaryDiscipline');
  const watchIsMultidisciplinary = form.watch('isMultidisciplinary');

  // Update selected discipline when primary discipline changes
  React.useEffect(() => {
    setSelectedDiscipline(watchPrimaryDiscipline);
  }, [watchPrimaryDiscipline]);

  // Get styles based on the selected discipline
  const getStylesForDiscipline = (discipline: string) => {
    switch (discipline) {
      case 'music':
        return musicStyles;
      // Would add cases for other disciplines with their own styles
      default:
        return [];
    }
  };

  const styles = getStylesForDiscipline(selectedDiscipline);

  const onSubmit = async (data: ArtistProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('You must be logged in to create a profile');
      }
      
      const userId = userData.user.id;
      
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw profileError;
      }
      
      // Prepare profile data
      const profileData = {
        id: userId,
        username: data.displayName.toLowerCase().replace(/\s+/g, '_'),
        full_name: data.displayName,
        bio: data.bio,
        updated_at: new Date().toISOString()
      };
      
      // Insert or update profile
      const operation = existingProfile 
        ? supabase.from('profiles').update(profileData).eq('id', userId)
        : supabase.from('profiles').insert([profileData]);
        
      const { error: updateError } = await operation;
      
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Profile saved",
        description: "Your artist profile has been updated successfully.",
      });
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your artist name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, State/Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about yourself"
                  className="h-32"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Briefly describe yourself as an artist (max 500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://yourwebsite.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primaryDiscipline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Discipline</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your main artistic discipline" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {disciplines.map((discipline) => (
                    <SelectItem key={discipline.id} value={discipline.id}>
                      {discipline.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedDiscipline && styles.length > 0 && (
          <FormField
            control={form.control}
            name="styles"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Styles/Genres</FormLabel>
                  <FormDescription>
                    Select the styles that best describe your work
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {styles.map((style) => (
                    <FormField
                      key={style.id}
                      control={form.control}
                      name="styles"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={style.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(style.id)}
                                onCheckedChange={(checked) => {
                                  const currentStyles = field.value || [];
                                  return checked
                                    ? field.onChange([...currentStyles, style.id])
                                    : field.onChange(
                                        currentStyles.filter((value) => value !== style.id)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {style.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="isMultidisciplinary"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I work in multiple disciplines</FormLabel>
                <FormDescription>
                  Check this if you create across different artistic fields
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {watchIsMultidisciplinary && (
          <FormField
            control={form.control}
            name="otherDisciplines"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Other Disciplines</FormLabel>
                  <FormDescription>
                    Select other artistic fields you work in
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {disciplines
                    .filter((d) => d.id !== selectedDiscipline)
                    .map((discipline) => (
                      <FormField
                        key={discipline.id}
                        control={form.control}
                        name="otherDisciplines"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={discipline.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(discipline.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValues, discipline.id])
                                      : field.onChange(
                                          currentValues.filter((value) => value !== discipline.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {discipline.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </Form>
  );
};

export default ArtistProfileForm;
