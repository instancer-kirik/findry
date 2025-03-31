import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '../ui-custom/AnimatedSection';
import ProfileTypeSelector, { ProfileType } from '../auth/ProfileTypeSelector';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

interface RoleAttribute {
  [key: string]: any;
}

interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  profile_types?: string[];
  role_attributes?: Record<string, RoleAttribute>;
}

const ProfileWizard: React.FC<{
  onComplete?: () => void;
  allowMultipleTypes?: boolean;
}> = ({ onComplete, allowMultipleTypes = false }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProfileTypes, setSelectedProfileTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepsCompleted, setStepsCompleted] = useState<Record<string, boolean>>({});
  
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    roleAttributes: {} as Record<string, RoleAttribute>
  });

  const steps: WizardStep[] = [
    {
      id: 'profile-types',
      title: 'Profile Types',
      description: 'Select the types of profiles you want to create'
    },
    {
      id: 'basics',
      title: 'Basic Information',
      description: 'Let\'s start with your profile basics'
    },
    {
      id: 'details',
      title: 'Profile Details',
      description: 'Tell us more about your work and interests'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Set your preferences and customize your experience'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setStepsCompleted(prev => ({
        ...prev,
        [steps[currentStep].id]: true
      }));
      
      setCurrentStep(prev => prev + 1);
      
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleProfileDataChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleRoleAttributeChange = (role: string, field: string, value: any) => {
    setProfileData({
      ...profileData,
      roleAttributes: {
        ...profileData.roleAttributes,
        [role]: {
          ...(profileData.roleAttributes[role] || {}),
          [field]: value
        }
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      setStepsCompleted(prev => ({
        ...prev,
        [steps[currentStep].id]: true
      }));
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      const submitData = {
        id: user.id,
        username: profileData.displayName.toLowerCase().replace(/\s+/g, '_'),
        full_name: profileData.displayName,
        bio: profileData.bio,
        profile_types: selectedProfileTypes,
        role_attributes: profileData.roleAttributes,
        updated_at: new Date().toISOString()
      };
      
      const operation = existingProfile 
        ? supabase.from('profiles').update(submitData).eq('id', user.id)
        : supabase.from('profiles').insert([submitData]);
        
      const { error: updateError } = await operation;
      
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: 'Profile setup complete!',
        description: 'Your profile has been successfully set up.',
      });
      
      if (onComplete) {
        onComplete();
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error completing profile setup:', error);
      toast({
        title: 'Error',
        description: 'There was a problem setting up your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRoleFields = (role: string) => {
    switch (role) {
      case 'artist':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-art-styles`}>Art Styles</Label>
              <Input 
                id={`${role}-art-styles`}
                className="w-full"
                placeholder="e.g., Digital, Illustration, Oil Painting"
                value={(profileData.roleAttributes[role]?.art_styles || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'art_styles', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-portfolio-links`}>Portfolio Links</Label>
              <Input 
                id={`${role}-portfolio-links`}
                className="w-full"
                placeholder="e.g., https://behance.net/yourname"
                value={(profileData.roleAttributes[role]?.portfolio_links || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'portfolio_links', e.target.value)}
              />
            </div>
          </div>
        );
      case 'brand':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-brand-name`}>Brand Name</Label>
              <Input 
                id={`${role}-brand-name`}
                className="w-full"
                placeholder="Your brand name"
                value={(profileData.roleAttributes[role]?.brand_name || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'brand_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-industry`}>Industry</Label>
              <Input 
                id={`${role}-industry`}
                className="w-full"
                placeholder="e.g., Fashion, Music, Technology"
                value={(profileData.roleAttributes[role]?.industry || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'industry', e.target.value)}
              />
            </div>
          </div>
        );
      case 'venue':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-venue-name`}>Venue Name</Label>
              <Input 
                id={`${role}-venue-name`}
                className="w-full"
                placeholder="Your venue name"
                value={(profileData.roleAttributes[role]?.venue_name || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'venue_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-capacity`}>Capacity</Label>
              <Input 
                id={`${role}-capacity`}
                type="number"
                className="w-full"
                placeholder="Maximum capacity"
                value={(profileData.roleAttributes[role]?.capacity || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'capacity', e.target.value)}
              />
            </div>
          </div>
        );
      case 'resource':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-resource-type`}>Resource Type</Label>
              <Input 
                id={`${role}-resource-type`}
                className="w-full"
                placeholder="e.g., Studio, Equipment, Service"
                value={(profileData.roleAttributes[role]?.resource_type || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'resource_type', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-availability`}>Availability</Label>
              <Input 
                id={`${role}-availability`}
                className="w-full"
                placeholder="e.g., Weekdays, Evenings, By appointment"
                value={(profileData.roleAttributes[role]?.availability || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'availability', e.target.value)}
              />
            </div>
          </div>
        );
      case 'community':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-community-focus`}>Community Focus</Label>
              <Input 
                id={`${role}-community-focus`}
                className="w-full"
                placeholder="e.g., Digital Art, Sustainability, Education"
                value={(profileData.roleAttributes[role]?.community_focus || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'community_focus', e.target.value)}
              />
            </div>
          </div>
        );
      case 'event':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-event-types`}>Event Types</Label>
              <Input 
                id={`${role}-event-types`}
                className="w-full"
                placeholder="e.g., Exhibitions, Workshops, Performances"
                value={(profileData.roleAttributes[role]?.event_types || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'event_types', e.target.value)}
              />
            </div>
          </div>
        );
      case 'project':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-project-focus`}>Project Focus</Label>
              <Input 
                id={`${role}-project-focus`}
                className="w-full"
                placeholder="e.g., Film, Publication, Research"
                value={(profileData.roleAttributes[role]?.project_focus || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'project_focus', e.target.value)}
              />
            </div>
          </div>
        );
      case 'user':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${role}-interests`}>Main Interests</Label>
              <Input 
                id={`${role}-interests`}
                className="w-full"
                placeholder="e.g., Art, Music, Design, Technology"
                value={(profileData.roleAttributes[role]?.interests || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'interests', e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground mb-4">
              Select the types of profiles you want to create. You can select multiple types if needed.
            </p>
            <ProfileTypeSelector 
              value={selectedProfileTypes} 
              onChange={setSelectedProfileTypes} 
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                  id="displayName"
                  className="w-full"
                  value={profileData.displayName}
                  onChange={(e) => handleProfileDataChange('displayName', e.target.value)}
                  placeholder="Your name or artist name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  className="w-full"
                  value={profileData.location}
                  onChange={(e) => handleProfileDataChange('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio"
                className="w-full min-h-32"
                value={profileData.bio}
                onChange={(e) => handleProfileDataChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website (optional)</Label>
              <Input 
                id="website"
                className="w-full"
                value={profileData.website}
                onChange={(e) => handleProfileDataChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Profile Details for Selected Types</h3>
            
            {selectedProfileTypes.length === 0 ? (
              <p className="text-muted-foreground">
                No profile types selected. Go back to step 1 to select profile types.
              </p>
            ) : (
              selectedProfileTypes.map((type, index) => (
                <div key={type} className="space-y-4">
                  {index > 0 && <Separator className="my-6" />}
                  <h4 className="text-md font-medium capitalize">{type} Profile Details</h4>
                  {renderRoleFields(type)}
                </div>
              ))
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Preferences</h3>
            <p className="text-muted-foreground">
              Set your notification preferences and privacy settings.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="notifications" className="rounded" />
                <Label htmlFor="notifications">Enable email notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="publicProfile" className="rounded" defaultChecked />
                <Label htmlFor="publicProfile">Make my profile public</Label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error || !profile) return;
        
        if (profile.full_name) {
          setProfileData(prev => ({
            ...prev,
            displayName: profile.full_name || '',
            bio: profile.bio || '',
          }));
        }
        
        if (profile.profile_types && Array.isArray(profile.profile_types)) {
          setSelectedProfileTypes(profile.profile_types);
        }
        
        if (profile.role_attributes) {
          setProfileData(prev => ({
            ...prev,
            roleAttributes: profile.role_attributes as Record<string, RoleAttribute>
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfile();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatedSection animation="fade-in-up">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`flex flex-col items-center ${index !== 0 ? 'ml-4' : ''}`}
                style={{ flex: 1 }}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                    ${index < currentStep || stepsCompleted[step.id] 
                      ? 'bg-primary text-primary-foreground' 
                      : index === currentStep 
                        ? 'bg-primary/20 text-primary border-2 border-primary' 
                        : 'bg-muted text-muted-foreground'}`}
                >
                  {index < currentStep || stepsCompleted[step.id] ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span 
                  className={`text-xs font-medium hidden md:block
                    ${index === currentStep 
                      ? 'text-primary' 
                      : index < currentStep || stepsCompleted[step.id]
                        ? 'text-primary/70' 
                        : 'text-muted-foreground'}`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted"></div>
            <div 
              className="absolute top-0 left-0 h-1 bg-primary transition-all" 
              style={{ width: `${((currentStep + (stepsCompleted[steps[currentStep].id] ? 1 : 0)) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderStepContent()}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            
            <Button 
              onClick={currentStep < steps.length - 1 ? handleNext : handleSubmit}
              disabled={isSubmitting || 
                (currentStep === 0 && selectedProfileTypes.length === 0) ||
                (currentStep === 1 && !profileData.displayName)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </CardFooter>
        </Card>
      </AnimatedSection>
    </div>
  );
};

export default ProfileWizard;
