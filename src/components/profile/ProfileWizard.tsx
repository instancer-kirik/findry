
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
import { ProfileType } from '../auth/ProfileTypeSelector';
import ArtistProfileForm from './ArtistProfileForm';

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

const ProfileWizard: React.FC<{
  initialProfileType?: ProfileType;
  onComplete?: () => void;
}> = ({ initialProfileType = 'artist', onComplete }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileType, setProfileType] = useState<ProfileType>(initialProfileType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepsCompleted, setStepsCompleted] = useState<Record<string, boolean>>({});

  const steps: WizardStep[] = [
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
    },
    {
      id: 'connections',
      title: 'Connect & Discover',
      description: 'Find and connect with others in your field'
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Mark final step as completed
      setStepsCompleted(prev => ({
        ...prev,
        [steps[currentStep].id]: true
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Profile setup complete!',
        description: 'Your profile has been successfully set up.',
      });
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      } else {
        // Navigate to home page
        navigate('/');
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ArtistProfileForm />;
      case 1:
        // Would implement specific forms for each step
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              This step would contain detailed profile fields specific to {profileType}s.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              This step would contain preference settings and notification options.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              This step would help you connect with others and find communities.
            </p>
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
              disabled={isSubmitting}
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
