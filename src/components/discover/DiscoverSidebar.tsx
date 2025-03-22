
import React from 'react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import SavedItemsTracker from '../marketplace/SavedItemsTracker';
import MarketplaceChat from '../marketplace/MarketplaceChat';

const DiscoverSidebar: React.FC = () => {
  return (
    <div className="w-full md:w-4/12 space-y-6">
      <AnimatedSection animation="slide-in-left" delay={200}>
        <SavedItemsTracker />
      </AnimatedSection>

      <AnimatedSection animation="slide-in-left" delay={300}>
        <MarketplaceChat />
      </AnimatedSection>
    </div>
  );
};

export default DiscoverSidebar;
