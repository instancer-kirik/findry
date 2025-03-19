
import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import MarketplaceSection from '../components/home/MarketplaceSection';
import FeatureSection from '../components/home/FeatureSection';
import ProfileCard from '../components/home/ProfileCard';
import AnimatedSection from '../components/ui-custom/AnimatedSection';
import Button from '../components/ui-custom/Button';
import { ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  // Sample profiles for the discover section
  const profiles = [
    {
      name: "Elena Rivera",
      type: "artist" as const,
      location: "Los Angeles, CA",
      tags: ["Vocalist", "R&B", "Soul"]
    },
    {
      name: "Summit Beats",
      type: "brand" as const,
      location: "New York, NY",
      tags: ["Music Production", "Events"]
    },
    {
      name: "The Acoustic Lounge",
      type: "venue" as const,
      location: "Austin, TX",
      tags: ["Live Music", "Intimate", "200 capacity"]
    },
    {
      name: "James Wilson",
      type: "artist" as const,
      location: "Chicago, IL",
      tags: ["Guitar", "Blues", "Jazz"]
    }
  ];

  return (
    <Layout>
      <Hero />
      
      <MarketplaceSection />
      
      <FeatureSection />
      
      {/* Discover Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Discover Talent & Opportunities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse through our curated selection of artists, brands, and venues to find your perfect match.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {profiles.map((profile, index) => (
              <AnimatedSection 
                key={index} 
                animation="fade-in-up" 
                delay={100 * index}
              >
                <ProfileCard 
                  name={profile.name}
                  type={profile.type}
                  location={profile.location}
                  tags={profile.tags}
                />
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection animation="fade-in-up" delay={500} className="text-center mt-12">
            <Button 
              variant="outline" 
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              View More
            </Button>
          </AnimatedSection>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section-padding bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection animation="fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the TandemX Ecosystem Today</h2>
              <p className="text-lg text-gray-300 mb-8">
                Whether you're an artist, brand, or venue - the platform is designed to help you make meaningful connections and grow.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black"
              >
                Create Your Account
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
