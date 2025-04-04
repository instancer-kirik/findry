import React from 'react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import GlassmorphicCard from '../ui-custom/GlassmorphicCard';
import { ArrowRight, Music, Building, Store } from 'lucide-react';

const MarketplaceSection: React.FC = () => {
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Creative Ecosystem Marketplace</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Where artists, brands, and venues connect to create, license, and showcase diverse content and experiences.
            </p>
          </div>
        </AnimatedSection>
        
        <div className="flex flex-col md:flex-row gap-8 mx-auto max-w-5xl relative">
          {/* Connection lines */}
          <div className="absolute inset-0 z-0 hidden md:block">
            <svg className="w-full h-full" viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M200 100 L400 50 L600 100 M400 50 L400 250 M200 100 L200 200 M600 100 L600 200 M200 200 L400 250 L600 200" 
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
            className="flex-1 z-10"
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
            className="flex-1 z-10 md:mt-16"
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
            className="flex-1 z-10"
          >
            <GlassmorphicCard className="h-full p-6" hoverEffect>
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full mb-4">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Venues & Spaces & Resources</h3>
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
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
