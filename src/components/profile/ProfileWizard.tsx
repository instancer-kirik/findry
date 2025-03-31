
import React, { useState } from 'react';
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
import ProfileTypeSelector from '../auth/ProfileTypeSelector';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

interface WizardStep {
  id: string;
  title: string;
  description: string;
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
    // Add fields for role-specific attributes
    roleAttributes: {} as Record<string, any>
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
      description: 'Tell us more about your creative work'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Set your preferences and customize your experience'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // Mark current step as completed
      setStepsCompleted(prev => ({
        ...prev,
        [steps[currentStep].id]: true
      }));
      
      // Move to next step
      setCurrentStep(prev => prev + 1);
      
      // Scroll to top
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
      // Mark final step as completed
      setStepsCompleted(prev => ({
        ...prev,
        [steps[currentStep].id]: true
      }));
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      // Prepare profile data
      const submitData = {
        id: user.id,
        username: profileData.displayName.toLowerCase().replace(/\s+/g, '_'),
        full_name: profileData.displayName,
        bio: profileData.bio,
        profile_types: selectedProfileTypes,
        role_attributes: profileData.roleAttributes, // Store role-specific attributes
        updated_at: new Date().toISOString()
      };
      
      // Insert or update profile
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
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      } else {
        // Navigate to home page
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

  // Render role-specific form fields
  const renderRoleFields = (role: string) => {
    switch (role) {
      case 'artist':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Art Styles</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Digital, Illustration, Oil Painting"
                value={(profileData.roleAttributes[role]?.art_styles || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'art_styles', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Portfolio Links</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border rounded-md"
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
              <label className="text-sm font-medium">Brand Name</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Your brand name"
                value={(profileData.roleAttributes[role]?.brand_name || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'brand_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border rounded-md"
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
              <label className="text-sm font-medium">Venue Name</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Your venue name"
                value={(profileData.roleAttributes[role]?.venue_name || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'venue_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Capacity</label>
              <input 
                type="number"
                className="w-full px-3 py-2 border rounded-md"
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
              <label className="text-sm font-medium">Resource Type</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Studio, Equipment, Service"
                value={(profileData.roleAttributes[role]?.resource_type || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'resource_type', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Availability</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Weekdays, Evenings, By appointment"
                value={(profileData.roleAttributes[role]?.availability || '')}
                onChange={(e) => handleRoleAttributeChange(role, 'availability', e.target.value)}
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
              <div className="space-y-4">
                <label className="text-sm font-medium" htmlFor="displayName">Display Name</label>
                <input 
                  id="displayName"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={profileData.displayName}
                  onChange={(e) => handleProfileDataChange('displayName', e.target.value)}
                  placeholder="Your name or artist name"
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium" htmlFor="location">Location</label>
                <input 
                  id="location"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={profileData.location}
                  onChange={(e) => handleProfileDataChange('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium" htmlFor="bio">Bio</label>
              <textarea 
                id="bio"
                className="w-full px-3 py-2 border rounded-md h-32"
                value={profileData.bio}
                onChange={(e) => handleProfileDataChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium" htmlFor="website">Website (optional)</label>
              <input 
                id="website"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
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
                <label htmlFor="notifications">Enable email notifications</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="publicProfile" className="rounded" defaultChecked />
                <label htmlFor="publicProfile">Make my profile public</label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
