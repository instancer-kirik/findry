import React from 'react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import GlassmorphicCard from '../ui-custom/GlassmorphicCard';
import { ArrowRight, Music, Building, Store, Users } from 'lucide-react';

const EcosystemSection: React.FC = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -bottom-24 right-0 w-96 h-96 bg-blue-100/20 dark:bg-blue-900/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-0 left-0 w-80 h-80 bg-purple-100/10 dark:bg-purple-900/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-in-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Creative Ecosystem Network</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Where artists, brands, venues, and community members connect to create, experience, and share diverse content and events.
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto max-w-6xl relative">
          {/* Connection lines */}
          <div className="absolute inset-0 z-0 hidden lg:block">
            <svg className="w-full h-full" viewBox="0 0 1000 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M125 100 L375 50 L625 100 L875 50 M375 50 L375 250 M125 100 L125 200 M625 100 L625 200 M875 50 L875 200 M125 200 L375 250 L625 200 L875 200" 
                stroke="currentColor" 
                strokeOpacity="0.1" 
                strokeWidth="2"
                strokeDasharray="6 6" 
              />
            </svg>
          </div>
          
          {/* Artist Card */}
          <AnimatedSection 
            animation="fade-in-up" 
            delay={100}
            className="z-10"
          >
            <GlassmorphicCard className="h-full p-6" hoverEffect>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full mb-4">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Artists & Creators</h3>
              <p className="text-muted-foreground mb-4">
                Showcase your original work, manage performance rights, and find collaboration or booking opportunities.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>Apply to venues</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>Connect with brands</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>Find resources and tools</span>
                </li>
              </ul>
              <a href="/signup?role=artist" className="text-sm font-medium inline-flex items-center text-primary hover:text-primary/80">
                Join Soon, not yet available
                <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </GlassmorphicCard>
          </AnimatedSection>
          
          {/* Brand Card */}
          <AnimatedSection 
            animation="fade-in-up" 
            delay={200}
            className="z-10"
          >
            <GlassmorphicCard className="h-full p-6" hoverEffect>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full mb-4">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Brands & Businesses</h3>
              <p className="text-muted-foreground mb-4">
                Discover unique talent, license creative content, sponsor events, and book venues for activations.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>Find creators & performers</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>License artistic content</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>Sponsor events & venues</span>
                </li>
              </ul>
              <a href="/signup?role=brand" className="text-sm font-medium inline-flex items-center text-primary hover:text-primary/80">
                Join Soon, not yet available
                <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </GlassmorphicCard>
          </AnimatedSection>
          
          {/* Venue Card */}
          <AnimatedSection 
            animation="fade-in-up" 
            delay={300}
            className="z-10"
          >
            <GlassmorphicCard className="h-full p-6" hoverEffect>
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full mb-4">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Venues & Spaces</h3>
              <p className="text-muted-foreground mb-4">
                List your space, host diverse events featuring artists, manage bookings, and control usage rights.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>Manage availability & bookings</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>Discover artists & performers</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>Host curated events</span>
                </li>
              </ul>
              <a href="/signup?role=venue" className="text-sm font-medium inline-flex items-center text-primary hover:text-primary/80">
                Join Soon, not yet available
                <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </GlassmorphicCard>
          </AnimatedSection>
          
          {/* Community Card */}
          <AnimatedSection 
            animation="fade-in-up" 
            delay={400}
            className="z-10"
          >
            <GlassmorphicCard className="h-full p-6" hoverEffect>
              <div className="flex items-center justify-center w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community & Attendees</h3>
              <p className="text-muted-foreground mb-4">
                Discover exciting events, connect with creators, and enjoy unique experiences in your community and beyond.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>Find local and virtual events</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>Support favorite artists</span>
                </li>
                <li className="flex items-center text-sm">
                  <ArrowRight className="w-4 h-4 mr-2 text-primary/70" />
                  <span>Connect with like-minded people</span>
                </li>
              </ul>
              <a href="/signup?role=community" className="text-sm font-medium inline-flex items-center text-primary hover:text-primary/80">
                Join Soon, not yet available
                <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </GlassmorphicCard>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
