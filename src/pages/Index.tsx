import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeatureSection from '@/components/home/FeatureSection';
import EcosystemSection from '@/components/home/EcosystemSection';
import ScreenshotGallery from '@/components/home/ScreenshotGallery';
import EmailWaitlist from '@/components/home/EmailWaitlist';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Compass, Palette, Store, Users } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const platformScreenshots = [
    {
      src: "/screenshots/funnel-1.png",
      alt: "Main Event",
      title: "Create and discover events in your area"
    },
    {
      src: "/screenshots/funnel-2.png",
      alt: "Create Event",
      title: "Easily set up new events with our intuitive form"
    },
    {
      src: "/screenshots/funnel-3.png",
      alt: "Discovery",
      title: "Find resources, artists, and events that match your interests"
    },
    {
      src: "/screenshots/funnel-4.png",
      alt: "Discovery Dice Tray",
      title: "Use our discovery tools to find new opportunities"
    },
    {
      src: "/screenshots/funnel-5.png",
      alt: "Collaborator",
      title: "Connect with collaborators on creative projects"
    },
    {
      src: "/screenshots/funnel-6.png",
      alt: "Community+Events",
      title: "Join communities and participate in their events"
    },
    {
      src: "/screenshots/funnel-7.png",
      alt: "Profile Wizard",
      title: "Create your personalized profile"
    }
  ];

  return (
    <Layout>
      <Hero />
      
      {/* Quick Links Section */}
      <div className="container mx-auto px-4 py-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Explore Findry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/discover')}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Compass className="h-8 w-8" />
            <span>Discover</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/discover?tab=events')}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Calendar className="h-8 w-8" />
            <span>Events</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/discover?tab=artists')}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Palette className="h-8 w-8" />
            <span>Artists</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/communities')}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Users className="h-8 w-8" />
            <span>Communities</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/projects')}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Store className="h-8 w-8" />
            <span>Projects</span>
          </Button>
        </div>
      </div>
      
      <FeatureSection />
      <EcosystemSection />
      
      {/* Platform Screenshots Section */}
      <div className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Platform Preview</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            Take a look at our intuitive interface and powerful features that make creative collaboration easier.
          </p>
          <ScreenshotGallery screenshots={platformScreenshots} />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Join the Creative Ecosystem?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with artists, venues, and resources to make your creative projects come to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/signup')}>
            Sign Up Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
            Explore The Platform
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <EmailWaitlist />
      </div>
    </Layout>
  );
};

export default Landing;
