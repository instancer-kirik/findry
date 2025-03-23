
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArtistProfileForm from '../components/profile/ArtistProfileForm';
import AnimatedSection from '../components/ui-custom/AnimatedSection';

const ProfileSetup: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('artist');

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // For now, just simulate saving the profile
    setTimeout(() => {
      toast({
        title: 'Profile saved!',
        description: 'Your profile has been successfully set up.',
      });
      setIsSubmitting(false);
      navigate('/');
    }, 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-in-up">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
                <CardDescription>
                  Share more about yourself so others can discover you and your work.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="artist" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6">
                    <TabsTrigger value="artist">Artist</TabsTrigger>
                    <TabsTrigger value="venue">Venue</TabsTrigger>
                    <TabsTrigger value="resource">Resource</TabsTrigger>
                    <TabsTrigger value="community">Community</TabsTrigger>
                    <TabsTrigger value="brand">Brand</TabsTrigger>
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
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => navigate('/')}>
                  Skip for now
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};

export default ProfileSetup;
