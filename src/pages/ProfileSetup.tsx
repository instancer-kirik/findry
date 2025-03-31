import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedSection from '../components/ui-custom/AnimatedSection';
import { ProfileType } from '../components/auth/ProfileTypeSelector';
import ProfileWizard from '../components/profile/ProfileWizard';
import ArtistProfileForm from '../components/profile/ArtistProfileForm';
import { Loader2 } from 'lucide-react';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ProfileType>('artist');
  const [useWizard, setUseWizard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // For the step-by-step wizard approach
  const [wizardStep, setWizardStep] = useState(1);
  const totalWizardSteps = 4;

  const handleSkip = () => {
    toast({
      title: "Profile setup skipped",
      description: "You can complete your profile anytime from your settings.",
    });
    navigate('/');
  };

  const handleStepChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (wizardStep < totalWizardSteps) {
        setWizardStep(wizardStep + 1);
      } else {
        // Profile completed
        toast({
          title: "Profile setup complete!",
          description: "Your profile has been successfully created.",
        });
        navigate('/');
      }
    } else {
      if (wizardStep > 1) {
        setWizardStep(wizardStep - 1);
      }
    }
  };

  // Wizard step content
  const renderWizardStep = () => {
    switch (wizardStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Basic Information</h3>
            <p className="text-muted-foreground">
              Let's start with some basic information about your profile.
            </p>
            <ArtistProfileForm />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Portfolio & Skills</h3>
            <p className="text-muted-foreground">
              Add your portfolio items and highlight your main skills.
            </p>
            <div className="p-8 border rounded-md border-dashed text-center">
              <p className="text-muted-foreground">Portfolio section content</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Connections & Preferences</h3>
            <p className="text-muted-foreground">
              Set up your connection preferences and discovery settings.
            </p>
            <div className="p-8 border rounded-md border-dashed text-center">
              <p className="text-muted-foreground">Connections section content</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Review Your Profile</h3>
            <p className="text-muted-foreground">
              Let's review everything before finalizing your profile.
            </p>
            <div className="p-8 border rounded-md border-dashed text-center">
              <p className="text-muted-foreground">Profile review section</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-in-up">
          <div className="max-w-4xl mx-auto">
            {!useWizard ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold">Complete Your Profile</h1>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setUseWizard(true)}>
                      Step-by-Step Wizard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Profile Details</CardTitle>
                    <CardDescription>
                      Share more about yourself so others can discover you and your work.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProfileType)}>
                      <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-6">
                        <TabsTrigger value="artist">Artist</TabsTrigger>
                        <TabsTrigger value="venue">Venue</TabsTrigger>
                        <TabsTrigger value="resource">Resource</TabsTrigger>
                        <TabsTrigger value="community">Community</TabsTrigger>
                        <TabsTrigger value="brand">Brand</TabsTrigger>
                        <TabsTrigger value="event">Event</TabsTrigger>
                        <TabsTrigger value="project">Project</TabsTrigger>
                      </TabsList>
                      <TabsContent value="artist">
                        <ArtistProfileForm />
                      </TabsContent>
                      <TabsContent value="venue">
                        <p className="text-muted-foreground py-8 text-center">
                          Venue profile setup coming soon
                        </p>
                      </TabsContent>
                      <TabsContent value="resource">
                        <p className="text-muted-foreground py-8 text-center">
                          Resource profile setup coming soon
                        </p>
                      </TabsContent>
                      <TabsContent value="community">
                        <p className="text-muted-foreground py-8 text-center">
                          Community profile setup coming soon
                        </p>
                      </TabsContent>
                      <TabsContent value="brand">
                        <p className="text-muted-foreground py-8 text-center">
                          Brand profile setup coming soon
                        </p>
                      </TabsContent>
                      <TabsContent value="event">
                        <p className="text-muted-foreground py-8 text-center">
                          Event profile setup coming soon
                        </p>
                      </TabsContent>
                      <TabsContent value="project">
                        <p className="text-muted-foreground py-8 text-center">
                          Project profile setup coming soon
                        </p>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-3">
                    <Button variant="outline" onClick={handleSkip}>
                      Skip for now
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold">Profile Wizard</h1>
                  <Button variant="outline" onClick={() => setUseWizard(false)}>
                    Standard Mode
                  </Button>
                </div>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl">Profile Setup</CardTitle>
                        <CardDescription>
                          Complete your profile step by step
                        </CardDescription>
                      </div>
                      <div className="text-sm font-medium">
                        Step {wizardStep} of {totalWizardSteps}
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-muted h-2 rounded-full mt-4">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(wizardStep / totalWizardSteps) * 100}%` }}
                      ></div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-6">
                    {renderWizardStep()}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <div>
                      {wizardStep > 1 ? (
                        <Button 
                          variant="outline" 
                          onClick={() => handleStepChange('prev')}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={handleSkip}>
                          Skip for now
                        </Button>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => handleStepChange('next')}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : wizardStep === totalWizardSteps ? (
                        <>
                          Complete Profile
                          <Check className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Next Step
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Alternative full wizard component */}
                {/* <ProfileWizard 
                  initialProfileType={activeTab} 
                  onComplete={() => navigate('/')}
                /> */}
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};

export default ProfileSetup;
