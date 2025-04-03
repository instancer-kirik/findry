
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeatureSection from '@/components/home/FeatureSection';
import MarketplaceSection from '@/components/home/MarketplaceSection';
import ScreenshotGallery from '@/components/home/ScreenshotGallery';
import EmailWaitlist from '@/components/home/EmailWaitlist';

// Define screenshots for the gallery
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
  }
];

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <EmailWaitlist />
      </div>
      <FeatureSection />
      <MarketplaceSection />
      <div className="container mx-auto px-4 py-12">
        <ScreenshotGallery screenshots={screenshots} />
      </div>
    </Layout>
  );
};

export default Index;
