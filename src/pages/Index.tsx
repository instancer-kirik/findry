import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeatureSection from '@/components/home/FeatureSection';
import EcosystemSection from '@/components/home/EcosystemSection';
import ScreenshotGallery from '@/components/home/ScreenshotGallery';
import EmailWaitlist from '@/components/home/EmailWaitlist';

// Renamed from Index to Landing to reflect its purpose as a landing page for visitors
const Landing: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <EmailWaitlist />
      </div>
      <Hero />
      <FeatureSection />
      <EcosystemSection />
    
    </Layout>
  );
};

export default Landing;
