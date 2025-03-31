import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<ProfileType>('artist');
  const [useWizard, setUseWizard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkip = () => {
    navigate('/');
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
                  <Button variant="outline" onClick={() => setUseWizard(true)}>
                    Use Wizard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
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
                    Simple Mode
                  </Button>
                </div>
                <ProfileWizard 
                  initialProfileType={activeTab} 
                  onComplete={() => navigate('/')}
                />
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};

export default ProfileSetup;
