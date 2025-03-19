
import React from 'react';
import Button from '../ui-custom/Button';
import AnimatedSection from '../ui-custom/AnimatedSection';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-background/80"></div>
      
      {/* Abstract shapes/blurs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full filter blur-3xl"></div>
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-100/20 dark:bg-purple-900/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection animation="fade-in-up" delay={100}>
            <div className="inline-block mb-4 px-3 py-1 bg-secondary rounded-full">
              <span className="text-xs font-medium text-foreground/80">
                Introducing the Brand & Venue Interface
              </span>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-in-up" delay={200}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Connect Artists, Brands, and Venues Seamlessly
            </h1>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-in-up" delay={300}>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A sophisticated marketplace bringing together creative talent, brands, and venues in one elegant platform designed for discovery and collaboration.
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-in-up" delay={400}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
              >
                Learn More
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* Preview mockup */}
      <AnimatedSection animation="fade-in-up" delay={600} className="mt-16 md:mt-20 max-w-6xl mx-auto px-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-lg -z-10"></div>
          <div className="p-1 md:p-2 bg-white/80 dark:bg-black/80 rounded-2xl shadow-xl border border-white/30 dark:border-white/10">
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-secondary">
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Interface Preview</span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default Hero;
