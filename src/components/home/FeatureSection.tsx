import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FeatureShowcase {
  id: string;
  title: string;
  screenshot: string;
  route: string;
  accent: string;
}

const features: FeatureShowcase[] = [
  {
    id: 'discover',
    title: 'Discover',
    screenshot: '/screenshots/funnel-3.png',
    route: '/discover',
    accent: 'from-purple-500/20 to-blue-500/20',
  },
  {
    id: 'events',
    title: 'Events',
    screenshot: '/screenshots/funnel-1.png',
    route: '/discover?tab=events',
    accent: 'from-orange-500/20 to-red-500/20',
  },
  {
    id: 'collaborate',
    title: 'Collaborate',
    screenshot: '/screenshots/funnel-5.png',
    route: '/collaboration',
    accent: 'from-green-500/20 to-teal-500/20',
  },
  {
    id: 'communities',
    title: 'Communities',
    screenshot: '/screenshots/funnel-6.png',
    route: '/communities',
    accent: 'from-pink-500/20 to-purple-500/20',
  },
];

const FeatureSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(features[0]);
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dynamic background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${activeFeature.accent} transition-all duration-700 opacity-50`}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Feature tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFeature.id === feature.id
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-102'
              }`}
            >
              {feature.title}
            </button>
          ))}
        </div>

        {/* Main showcase */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              {/* Screenshot container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                {/* Browser chrome mockup */}
                <div className="bg-muted/80 px-4 py-3 flex items-center gap-2 border-b border-border/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground max-w-xs">
                      findry.app{activeFeature.route}
                    </div>
                  </div>
                </div>
                
                {/* Screenshot */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={activeFeature.screenshot}
                    alt={activeFeature.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                    <Button 
                      size="lg" 
                      onClick={() => navigate(activeFeature.route)}
                      className="shadow-xl"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Try {activeFeature.title}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Floating action */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate(activeFeature.route)}
                  className="shadow-lg hover:shadow-xl transition-shadow"
                >
                  Explore {activeFeature.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quick stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: '500+', label: 'Artists' },
            { value: '150+', label: 'Venues' },
            { value: '1K+', label: 'Events' },
            { value: '∞', label: 'Possibilities' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
