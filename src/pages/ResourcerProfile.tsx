import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Save, ArrowRight, X, Camera } from 'lucide-react';
import { formatAvailabilityToJson } from '@/types/resource';
import { resourceTypes as baseResourceTypes } from '@/components/discover/DiscoverData';

interface ResourceFormData {
  id?: string;
  name: string;
  description: string;
  type: string;
  subtype: string;
  location: string;
  location_privacy: 'public' | 'on_request' | 'private';
  location_type?: 'physical' | 'virtual' | 'mobile';
  state_region: string;
  mobility_radius?: number;
  exact_address?: string;
  weight_lbs?: number;
  dimensions?: string;
  requires_assistance?: boolean;
  assistance_details?: string;
  tags: string[];
  image_url?: string;
  size_sqft?: number;
  owner_id?: string;
}

// Extend the base resource types with additional options
const resourceTypes = [
  // Filter out the "all" option from the base resource types
  ...baseResourceTypes.filter(type => type.value !== 'all').map(type => ({
    value: type.value === 'tool' ? 'equipment' : type.value, // Map 'tool' to 'equipment' for consistency
    label: type.value === 'tool' ? 'Equipment' : type.label
  })),
  // Add additional resource types not in the base list
  { value: 'material', label: 'Material' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'food', label: 'Food' },
  { value: 'funding', label: 'Funding' }
];

const ResourcerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [step, setStep] = useState<'intro' | 'form' | 'success'>('intro');
  const [resources, setResources] = useState<ResourceFormData[]>([]);
  const [currentResource, setCurrentResource] = useState<ResourceFormData>({
    name: '',
    description: '',
    type: '',
    subtype: '',
    location: '',
    location_privacy: 'on_request',
    location_type: 'physical',
    state_region: '',
    mobility_radius: undefined,
    exact_address: '',
    weight_lbs: undefined,
    dimensions: '',
    requires_assistance: false,
    assistance_details: '',
    tags: [],
    size_sqft: undefined
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check for prefilled resource data when component mounts
  useEffect(() => {
    const prefillData = localStorage.getItem('prefillResource');
    
    if (prefillData) {
      try {
        const parsedData = JSON.parse(prefillData);
        setCurrentResource(prev => ({
          ...prev,
          ...parsedData
        }));
        
        // Move directly to the form step if we have prefilled data
        setStep('form');
        
        // Clear the localStorage item to prevent re-filling on future visits
        localStorage.removeItem('prefillResource');
        
        toast({
          title: "Resource prefilled",
          description: `${parsedData.name} has been added to your form`,
        });
      } catch (error) {
        console.error('Error parsing prefilled resource data:', error);
      }
    }
  }, [toast]);
  
  const handleAddTag = () => {
    if (currentTag && !currentResource.tags.includes(currentTag)) {
      setCurrentResource({
        ...currentResource,
        tags: [...currentResource.tags, currentTag]
      });
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setCurrentResource({
      ...currentResource,
      tags: currentResource.tags.filter(t => t !== tag)
    });
  };
  
  const handleResourceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentResource(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: any) => {
    setCurrentResource(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddResource = () => {
    // Validate resource data
    if (!currentResource.name || !currentResource.type || !currentResource.state_region) {
      toast({
        title: 'Missing information',
        description: 'Please provide at least a name, type, and region for your resource.',
        variant: 'destructive'
      });
      return;
    }
    
    // Add resource to list
    setResources([...resources, currentResource]);
    
    // Reset form for next resource
    setCurrentResource({
      name: '',
      description: '',
      type: '',
      subtype: '',
      location: '',
      location_privacy: 'on_request',
      location_type: 'physical',
      state_region: '',
      mobility_radius: undefined,
      exact_address: '',
      weight_lbs: undefined,
      dimensions: '',
      requires_assistance: false,
      assistance_details: '',
      tags: [],
      size_sqft: undefined
    });
    
    toast({
      title: 'Resource added',
      description: `${currentResource.name} has been added to your list.`
    });
  };
  
  const handleRemoveResource = (index: number) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setResources(newResources);
  };
  
  const handleSubmitResources = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to submit resources.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit each resource to the database
      for (const resource of resources) {
        // Insert resource
        const { data: resourceData, error: resourceError } = await supabase
          .from('resources')
          .insert({
            name: resource.name,
            description: resource.description || null,
            type: resource.type,
            subtype: resource.subtype || null,
            // For location display in the UI
            location: resource.location_type === 'virtual' 
              ? resource.location 
              : resource.state_region + (
                resource.location_type === 'mobile' && resource.mobility_radius 
                  ? ` (Mobile: ${resource.mobility_radius} mile radius)`
                  : ''
              ),
            location_privacy: resource.location_privacy,
            location_type: resource.location_type,
            // Store the detailed location data in separate fields
            state_region: resource.state_region,
            mobility_radius: resource.mobility_radius || null,
            exact_address: resource.exact_address || null,
            // Mobile-specific properties
            weight_lbs: resource.weight_lbs || null,
            dimensions: resource.dimensions || null,
            requires_assistance: resource.requires_assistance || false,
            assistance_details: resource.assistance_details || null,
            tags: resource.tags.length > 0 ? resource.tags : null,
            image_url: resource.image_url || null,
            size_sqft: resource.size_sqft || null,
            availability: formatAvailabilityToJson([])
          })
          .select()
          .single();
        
        if (resourceError) throw resourceError;
        
        // Create ownership record
        const { error: ownershipError } = await supabase
          .from('content_ownership')
          .insert({
            content_id: resourceData.id,
            content_type: 'resource',
            owner_id: user.id
          });
        
        if (ownershipError) throw ownershipError;
      }
      
      // Success! Move to success step
      setStep('success');
      
    } catch (error) {
      console.error('Error submitting resources:', error);
      toast({
        title: 'Submission error',
        description: 'There was a problem submitting your resources. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderIntroStep = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Become a Resource Provider</CardTitle>
        <CardDescription>
          Share your equipment, space, materials, or other resources with the community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          As a Resource Provider, you can contribute to the creative ecosystem by offering resources
          that others might need for their projects and events.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {['Workshop Space', 'Food Truck', 'Robot Parts', 'Lighting Equipment', 'Sound System', 'Camera Gear'].map((item) => (
            <div key={item} className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">
                {item === 'Workshop Space' ? '🏗️' : 
                 item === 'Food Truck' ? '🚚' : 
                 item === 'Robot Parts' ? '🤖' : 
                 item === 'Lighting Equipment' ? '💡' : 
                 item === 'Sound System' ? '🔊' : '📷'}
              </div>
              <div className="font-medium">{item}</div>
            </div>
          ))}
        </div>
        
        <p className="text-muted-foreground">
          You can add up to 5 resources in this session. You can always come back later to add more.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setStep('form')} className="w-full">
          Start Adding Resources
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
  
  const renderResourceForm = () => (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Your Resources</CardTitle>
          <CardDescription>
            {resources.length}/5 resources added
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Resource Name*</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g., 3D Printer, Workshop Space" 
                value={currentResource.name}
                onChange={handleResourceChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Resource Type*</Label>
              <Select 
                value={currentResource.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtype">Subtype (Optional)</Label>
              <Input 
                id="subtype" 
                name="subtype" 
                placeholder="e.g., Indoor, Digital, Heavy-duty" 
                value={currentResource.subtype}
                onChange={handleResourceChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location_type">Location Type</Label>
              <Select 
                value={currentResource.location_type} 
                onValueChange={(value) => handleSelectChange('location_type', value as 'physical' | 'virtual' | 'mobile')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical Location</SelectItem>
                  <SelectItem value="virtual">Virtual/Online</SelectItem>
                  <SelectItem value="mobile">Mobile (Can Travel)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location_privacy">Location Sharing</Label>
              <Select 
                value={currentResource.location_privacy} 
                onValueChange={(value) => handleSelectChange('location_privacy', value as 'public' | 'on_request' | 'private')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select privacy level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public (Address visible to all)</SelectItem>
                  <SelectItem value="on_request">On Request (Reveal address when accepted)</SelectItem>
                  <SelectItem value="private">Private (Never show exact address)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {currentResource.location_type !== 'virtual' && (
              <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 bg-muted/10">
                <div className="space-y-2">
                  <Label htmlFor="state_region">
                    State/Region<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={currentResource.state_region}
                    onValueChange={(value) => handleSelectChange('state_region', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WY-NE">Wyoming - Northeast</SelectItem>
                      <SelectItem value="WY-NW">Wyoming - Northwest</SelectItem>
                      <SelectItem value="WY-SE">Wyoming - Southeast</SelectItem>
                      <SelectItem value="WY-SW">Wyoming - Southwest</SelectItem>
                      <SelectItem value="WY-C">Wyoming - Central</SelectItem>
                      <SelectItem value="MT">Montana</SelectItem>
                      <SelectItem value="CO-N">Colorado - North</SelectItem>
                      <SelectItem value="CO-S">Colorado - South</SelectItem>
                      <SelectItem value="ID">Idaho</SelectItem>
                      <SelectItem value="UT">Utah</SelectItem>
                      <SelectItem value="NE">Nebraska</SelectItem>
                      <SelectItem value="SD">South Dakota</SelectItem>
                      <SelectItem value="OTHER">Other Region</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {currentResource.location_type === 'mobile' && (
                  <div className="col-span-2 border-t border-border mt-4 pt-4 space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Mobility Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobility_radius">
                          Mobility Radius
                          <span className="text-xs text-muted-foreground ml-1">(in miles)</span>
                        </Label>
                        <Input
                          id="mobility_radius"
                          name="mobility_radius"
                          type="number"
                          placeholder="How far can this resource travel?"
                          value={currentResource.mobility_radius || ''}
                          onChange={(e) => handleSelectChange('mobility_radius', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="weight_lbs">
                          Weight
                          <span className="text-xs text-muted-foreground ml-1">(in pounds)</span>
                        </Label>
                        <Input
                          id="weight_lbs"
                          name="weight_lbs"
                          type="number"
                          placeholder="Approximate weight"
                          value={currentResource.weight_lbs || ''}
                          onChange={(e) => handleSelectChange('weight_lbs', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dimensions">
                          Dimensions
                          <span className="text-xs text-muted-foreground ml-1">(L×W×H)</span>
                        </Label>
                        <Input
                          id="dimensions"
                          name="dimensions"
                          placeholder="e.g., 24×18×12 inches"
                          value={currentResource.dimensions}
                          onChange={handleResourceChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={currentResource.requires_assistance}
                            onChange={(e) => handleSelectChange('requires_assistance', e.target.checked)}
                            className="h-4 w-4"
                          />
                          Requires Assistance
                        </Label>
                        {currentResource.requires_assistance && (
                          <Input
                            id="assistance_details"
                            name="assistance_details"
                            placeholder="Details about assistance needed"
                            value={currentResource.assistance_details}
                            onChange={handleResourceChange}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="exact_address">
                    Exact Address
                    <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                  </Label>
                  <Input
                    id="exact_address"
                    name="exact_address"
                    placeholder="Full address (shared according to your privacy settings)"
                    value={currentResource.exact_address}
                    onChange={handleResourceChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentResource.location_privacy === 'public' 
                      ? "Warning: Address will be visible to all users"
                      : currentResource.location_privacy === 'on_request'
                      ? "Address will only be revealed when you accept a request"
                      : "Address will never be shown publicly"}
                  </p>
                </div>
              </div>
            )}
            
            {currentResource.location_type === 'virtual' && (
              <div className="space-y-2">
                <Label htmlFor="location">Virtual Location/Access</Label>
                <Input 
                  id="location" 
                  name="location" 
                  placeholder="e.g., Zoom, Discord, specific platform"
                  value={currentResource.location}
                  onChange={handleResourceChange}
                />
              </div>
            )}
            
            {currentResource.type === 'space' && (
              <div className="space-y-2">
                <Label htmlFor="size_sqft">Size (sq ft)</Label>
                <Input 
                  id="size_sqft" 
                  name="size_sqft" 
                  type="number"
                  placeholder="Size in square feet" 
                  value={currentResource.size_sqft || ''}
                  onChange={handleResourceChange}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Describe your resource, its condition, and any limitations" 
              rows={4}
              value={currentResource.description}
              onChange={handleResourceChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Add tags (e.g., outdoor, electronic)" 
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            
            {currentResource.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {currentResource.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="flex items-center gap-1 py-1 px-2"
                  >
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Resource Image (Coming soon)</Label>
            <div className="border border-dashed rounded-lg p-6 text-center">
              <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Image upload functionality will be available soon
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleAddResource} 
              disabled={resources.length >= 5 || !currentResource.name || !currentResource.type}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Resources ({resources.length}/5)</CardTitle>
            <CardDescription>
              Resources you've added in this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{resource.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{resource.type}</Badge>
                        {resource.subtype && (
                          <Badge variant="outline">{resource.subtype}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {resource.description || 'No description provided'}
                      </p>
                      
                      {resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resource.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveResource(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/profile')}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitResources}
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit All Resources'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
  
  const renderSuccessStep = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-green-600">Resources Successfully Added!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <p>
          Thank you for contributing resources to our community! Your {resources.length} resource{resources.length > 1 ? 's' : ''} have been added to the platform.
        </p>
        <p className="text-muted-foreground">
          You can manage your resources from your profile page.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate('/resources')}>
          View All Resources
        </Button>
        <Button onClick={() => navigate('/profile')}>
          Go to Profile
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Resource Provider</h1>
        </div>
        
        <Separator className="my-6" />
        
        {step === 'intro' && renderIntroStep()}
        {step === 'form' && renderResourceForm()}
        {step === 'success' && renderSuccessStep()}
      </div>
    </Layout>
  );
};

export default ResourcerProfile; 