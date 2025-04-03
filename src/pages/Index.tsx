
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeatureSection from '@/components/home/FeatureSection';
import MarketplaceSection from '@/components/home/MarketplaceSection';
import ScreenshotGallery from '@/components/home/ScreenshotGallery';
import EmailWaitlist from '@/components/home/EmailWaitlist';

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <EmailWaitlist />
      </div>
      <FeatureSection />
      <MarketplaceSection />
      <ScreenshotGallery />
    </Layout>
  );
};

export default Index;
