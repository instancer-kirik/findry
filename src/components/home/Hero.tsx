import React from 'react';
import Button from '../ui-custom/Button';
import AnimatedSection from '../ui-custom/AnimatedSection';
import { ArrowRight, FileText, Users } from 'lucide-react';
import ScreenshotGallery from './ScreenshotGallery';

const screenshots = [
  {
    src: "/screenshots/funnel-1.png",
    alt: "Main Event",
    title: "Main Event"
  },
  {
    src: "/screenshots/funnel-2.png",
    alt: "Create Event",
    title: "Create Event"
  },
  {
    src: "/screenshots/funnel-3.png",
    alt: "Discovery",
    title: "Discovery"
  },
  {
    src: "/screenshots/funnel-4.png",
    alt: "Discovery Dice Tray",
    title: "Discovery Dice Tray"
  },
  {
    src: "/screenshots/funnel-5.png",
    alt: "Collaborator",
    title: "Collaborator"
  },
  {
    src: "/screenshots/funnel-6.png",
    alt: "Community+Events",
    title: "Community+Events"
  },
  {
    src: "/screenshots/funnel-7.png",
    alt: "Profile Wizard",
    title: "Profile Wizard"
  }
];

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
                Creative Collaboration Platform
              </span>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-in-up" delay={200}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Connect Creative Talent with Brands, Resources, and Venues
            </h1>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-in-up" delay={300}>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover and create opportunities, build relationships, and grow your network with our intuitive platform designed for humans.
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
      
      {/* Screenshot Gallery */}
      <AnimatedSection animation="fade-in-up" delay={600} className="mt-16 md:mt-20 max-w-6xl mx-auto px-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-lg -z-10"></div>
          <div className="p-6 bg-white/80 dark:bg-black/80 rounded-2xl shadow-xl border border-white/30 dark:border-white/10">
            <ScreenshotGallery screenshots={screenshots} />
          </div>
        </div>
      </AnimatedSection>

      {/* DivvyQueue Section */}
      <AnimatedSection animation="fade-in-up" delay={800} className="mt-20 max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Powerful Tools for Creative Teams</h2>
          <p className="text-muted-foreground">
            Streamline your workflow with our integrated tools
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl bg-white/80 dark:bg-black/80 shadow-xl border border-white/30 dark:border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">DivvyQueue</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Streamline your multiparty contracts with our intuitive contract management tool. Split payments, track milestones, and manage deliverables all in one place.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Learn More
            </Button>
          </div>
          
          <div className="p-6 rounded-xl bg-white/80 dark:bg-black/80 shadow-xl border border-white/30 dark:border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">Collaboration Hub</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Connect with your team, share resources, and manage projects efficiently with our built-in collaboration tools.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Learn More
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Funding and Contact Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">Support the Project</h2>
          <p className="text-muted-foreground">
            Help us continue building and improving Findry by supporting the project.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => window.open('https://cash.app/$Instancer', '_blank')}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="currentColor"/>
              </svg>
              Cash App: $Instancer
            </Button>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => window.open('mailto:instance.select@gmail.com', '_blank')}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
              </svg>
              instance.select@gmail.com
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
