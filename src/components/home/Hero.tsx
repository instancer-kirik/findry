
import React, { useEffect, useState } from 'react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import { FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Hero: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(data.session !== null);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(session !== null);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-background/80"></div>
      
      {/* Abstract shapes/blurs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100/30 dark:bg-teal-900/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-green-100/20 dark:bg-green-900/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection animation="fade-in-up" delay={100}>
            <div className="inline-block mb-4 px-3 py-1 bg-secondary rounded-full">
              <span className="text-xs font-medium text-foreground/80">
                
              </span>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-in-up" delay={200}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-normal pb-2 bg-gradient-to-r from-purple-400 via-teal-400 to-green-500 text-transparent bg-clip-text">
              {isAuthenticated ? "Welcome Wonder Seeker and/or Mighty Artist\n" : "Bonj! Wonder Seeker and/or Mighty Artist\n"}
            </h1>
          </AnimatedSection>
          <br></br>
          <AnimatedSection animation="fade-in-up" delay={300}>
            <p className="text-lg md:text-xl text-muted-foreground/90 dark:text-muted-foreground/80 mb-8 max-w-2xl mx-auto">
              {isAuthenticated 
                ? "Manage your items, track offers, and grow your creative network all in one place."
                : "Let's explore vibrant ecosystems and design opportunities. "
              }
            </p>
          </AnimatedSection>
        </div>
      </div>

     

     
    </section>
  );
};

export default Hero;
