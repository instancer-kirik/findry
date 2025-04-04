
import React from 'react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import { 
  Search, 
  Calendar, 
  MessageSquare, 
  Users, 
  Globe, 
  CheckCircle 
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay = 0 }) => (
  <AnimatedSection animation="fade-in-up" delay={delay} className="flex-1 min-w-[280px]">
    <div className="p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </AnimatedSection>
);

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Discovery",
      description: "Find various things."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Calendar with pictures",
      description: "Manage your availability and bookings in one streamlined calendar."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Chat",
      description: "Connect and share with others."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Verified Profiles",
      description: "Trust our community with verified and reviewed profiles for all users."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Event planning and collaboration tools",
      description: "Plan and share events and content with others."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Connect with talent and opportunities around the world."
    }
  ];

  return (
    <section className="section-padding relative bg-secondary/50">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-in-up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Key Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Designed with precision and thoughtfulness to provide a seamless experience for all users.
          </p>
        </AnimatedSection>
        
        <div className="flex flex-wrap gap-6 justify-center">
          {features.map((feature, index) => (
            <Feature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={100 * (index % 3)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
