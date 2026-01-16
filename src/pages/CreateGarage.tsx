import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Warehouse, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useGarages } from '@/hooks/use-garages';
import { PrivacyLevel } from '@/types/garage';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  privacy_level: z.enum(['public', 'friends_only', 'private', 'invite_only']),
  
  // Features
  has_lift: z.boolean(),
  lift_capacity_lbs: z.coerce.number().optional(),
  has_storage: z.boolean(),
  storage_sqft: z.coerce.number().optional(),
  has_tools: z.boolean(),
  has_electricity: z.boolean(),
  has_air_compressor: z.boolean(),
  has_welding: z.boolean(),
  bay_count: z.coerce.number().min(1),
  
  // Rental
  is_available_for_rent: z.boolean(),
  hourly_rate: z.coerce.number().optional(),
  daily_rate: z.coerce.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateGarage() {
  const navigate = useNavigate();
  const { useCreateGarage } = useGarages();
  const createMutation = useCreateGarage();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      address: '',
      privacy_level: 'private',
      has_lift: false,
      has_storage: false,
      has_tools: false,
      has_electricity: true,
      has_air_compressor: false,
      has_welding: false,
      bay_count: 1,
      is_available_for_rent: false,
    },
  });

  const hasLift = form.watch('has_lift');
  const hasStorage = form.watch('has_storage');
  const isAvailableForRent = form.watch('is_available_for_rent');

  const onSubmit = async (data: FormData) => {
    try {
      const garage = await createMutation.mutateAsync({
        name: data.name,
        description: data.description || null,
        location: data.location || null,
        address: data.address || null,
        privacy_level: data.privacy_level as PrivacyLevel,
        has_lift: data.has_lift,
        lift_capacity_lbs: data.has_lift ? data.lift_capacity_lbs || null : null,
        has_storage: data.has_storage,
        storage_sqft: data.has_storage ? data.storage_sqft || null : null,
        has_tools: data.has_tools,
        has_electricity: data.has_electricity,
        has_air_compressor: data.has_air_compressor,
        has_welding: data.has_welding,
        bay_count: data.bay_count,
        is_available_for_rent: data.is_available_for_rent,
        hourly_rate: data.is_available_for_rent ? data.hourly_rate || null : null,
        daily_rate: data.is_available_for_rent ? data.daily_rate || null : null,
      });
      navigate(`/garages/${garage.id}`);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-2xl">
        <Link to="/garages" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Garages
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Warehouse className="h-6 w-6 text-primary" />
              <CardTitle>Add Your Garage</CardTitle>
            </div>
            <CardDescription>
              Create a listing for your garage workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Garage Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Workshop" {...field} />
                        </FormControl>
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
                          <Textarea placeholder="Tell others about your garage..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City/Area</FormLabel>
                          <FormControl>
                            <Input placeholder="Los Angeles, CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="privacy_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Privacy</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">Public - Anyone can view</SelectItem>
                              <SelectItem value="friends_only">Friends Only</SelectItem>
                              <SelectItem value="invite_only">Invite Only</SelectItem>
                              <SelectItem value="private">Private - Only you</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="font-medium">Features & Equipment</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="bay_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Bays</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="has_lift"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel>Indoor Lift</FormLabel>
                            <FormDescription>Vehicle lift for working underneath</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {hasLift && (
                      <FormField
                        control={form.control}
                        name="lift_capacity_lbs"
                        render={({ field }) => (
                          <FormItem className="ml-6">
                            <FormLabel>Lift Capacity (lbs)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="10000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="has_storage"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel>Storage Space</FormLabel>
                            <FormDescription>Additional storage available</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {hasStorage && (
                      <FormField
                        control={form.control}
                        name="storage_sqft"
                        render={({ field }) => (
                          <FormItem className="ml-6">
                            <FormLabel>Storage Size (sqft)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="200" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="has_tools"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel>Tools Available</FormLabel>
                            <FormDescription>Basic or specialty tools on-site</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="has_electricity"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel>Electricity</FormLabel>
                            <FormDescription>Power available for tools</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="has_air_compressor"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel>Air Compressor</FormLabel>
                            <FormDescription>Compressed air available</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="has_welding"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel>Welding Equipment</FormLabel>
                            <FormDescription>Welding setup available</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Rental */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_available_for_rent"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <FormLabel>Available for Rent</FormLabel>
                          <FormDescription>Allow others to rent your garage space</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {isAvailableForRent && (
                    <div className="grid gap-4 sm:grid-cols-2 ml-6">
                      <FormField
                        control={form.control}
                        name="hourly_rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="25.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="daily_rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Daily Rate ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="150.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/garages')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create Garage'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
