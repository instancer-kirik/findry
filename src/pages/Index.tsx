
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import SectionHeader from '../components/home/SectionHeader';
import ProfileCard from '../components/home/ProfileCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/ui-custom/AnimatedSection';
import { ProfileType } from '../components/auth/ProfileTypeSelector';

// Helper function to truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

interface ProfileData {
  id: string;
  name: string;
  type: ProfileType;
  location: string;
  image: string;
  tags: string[];
}

const featuredProfiles: ProfileData[] = [
  {
    id: "1",
    name: "Me",
    type: "artist",
    location: "Sykesville, MD",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3276&q=80",
    tags: ["Vocalist", "poet", "designer", "developer"]
  },
  {
    id: "2",
    name: "Recording Studio",
    type: "resource",
    location: "Moon",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    tags: ["Studio", "Equipment Rental", "Professional"]
  },
  {
    id: "3",
    name: "The Stage",
    type: "venue",
    location: "outside",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3270&q=80",
    tags: ["Live Music", "200 Capacity", "Indie"]
  },
  {
    id: "4",
    name: "Beginner's Community",
    type: "community",
    location: "Worldwide (Online)",
    image: "https://images.unsplash.com/photo-1516057747705-0609711c769b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3270&q=80",
    tags: ["Music Production", "Collaboration", "200+ Members"]
  }
];

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />

      <div className="container mx-auto px-4 py-12">
        <AnimatedSection animation="fade-in-up">
          <SectionHeader
            title="Featured Profiles"
            description="Explore a curated selection of top artists, resources, and venues."
          />
        </AnimatedSection>

        <AnimatedSection animation="fade-in-up" delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                id={profile.id}
                name={profile.name}
                type={profile.type}
                location={profile.location}
                image={profile.image}
                tags={profile.tags}
              />
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-in-up" delay={200}>
          <div className="flex justify-center mt-8">
            <Button asChild size="lg">
              <Link to="/discover" className="flex items-center">
                Explore More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};

export default Index;
