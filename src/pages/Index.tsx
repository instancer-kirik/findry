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
            onClick={() => navigate('/events')}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Calendar className="h-8 w-8" />
            <span>Events</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/artists')}
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
            onClick={() => navigate('/shops')}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Store className="h-8 w-8" />
            <span>Shops</span>
          </Button>
        </div>
      </div>
      
      <FeatureSection />
      <EcosystemSection />
      
      <ScreenshotGallery 
        screenshots={[
          {
            id: "1",
            title: "Artist Discovery",
            description: "Find and connect with artists in your area",
            image: "https://source.unsplash.com/random/800x600/?artist"
          },
          {
            id: "2",
            title: "Event Management",
            description: "Create and manage creative events",
            image: "https://source.unsplash.com/random/800x600/?event"
          },
          {
            id: "3",
            title: "Resource Marketplace",
            description: "Find spaces, tools, and services for your projects",
            image: "https://source.unsplash.com/random/800x600/?studio"
          }
        ]}
      />
      
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
          <Button size="lg" variant="outline" onClick={() => navigate('/discover')}>
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
