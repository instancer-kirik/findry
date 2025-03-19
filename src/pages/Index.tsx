
import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import MarketplaceSection from '../components/home/MarketplaceSection';
import FeatureSection from '../components/home/FeatureSection';
import ProfileCard from '../components/home/ProfileCard';
import AnimatedSection from '../components/ui-custom/AnimatedSection';
import Button from '../components/ui-custom/Button';
import { ArrowRight, Users, Music, Building, Store, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Index: React.FC = () => {
  // Sample profiles for the discover section with more variety
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
      name: "SoundGear Pro",
      type: "resource" as const,
      location: "Chicago, IL",
      tags: ["Audio Equipment", "Rental", "Tool"]
    }
  ];

  // Sample events for the featured section
  const featuredEvents = [
    {
      name: "Summer Music Festival",
      type: "event",
      location: "Central Park, NY",
      date: "Aug 15-17, 2023",
      tags: ["Festival", "Multiple Artists", "Outdoor"]
    },
    {
      name: "DJ Workshop Series",
      type: "event",
      location: "Online",
      date: "Every Saturday",
      tags: ["Educational", "Interactive", "Resource"]
    }
  ];

  return (
    <Layout>
      <Hero />
      
      <MarketplaceSection />
      
      <FeatureSection />
      
      {/* Discover Multi-Way Marketplace Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Discover Our Multi-Way Marketplace</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with artists, brands, venues, and resources in our comprehensive ecosystem.
            </p>
          </AnimatedSection>

          <Tabs defaultValue="everyone" className="max-w-5xl mx-auto">
            <TabsList className="grid grid-cols-4 mb-8 w-full max-w-2xl mx-auto">
              <TabsTrigger value="everyone" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>For Everyone</span>
              </TabsTrigger>
              <TabsTrigger value="artists" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span>Artists</span>
              </TabsTrigger>
              <TabsTrigger value="brands" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <span>Brands</span>
              </TabsTrigger>
              <TabsTrigger value="venues" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Venues</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="everyone" className="space-y-8">
              <AnimatedSection animation="fade-in-up">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-background rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Events & Collaborations</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Discover and share exciting events, connect with friends, and build your network within the creative community.
                    </p>
                    <Link to="/discover" className="text-primary font-medium flex items-center hover:underline">
                      Explore events
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="bg-background rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Talent & Resources</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Browse our curated selection of artists, brands, venues, and creative resources all in one place.
                    </p>
                    <Link to="/discover" className="text-primary font-medium flex items-center hover:underline">
                      Discover talent
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </TabsContent>

            <TabsContent value="artists" className="space-y-6">
              <AnimatedSection animation="fade-in-up">
                <div className="bg-background rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">For Artists</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect with brands for sponsorships, find venues for performances, and discover resources to enhance your craft.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                      <span>Venue opportunities for live performances</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                      <span>Brand partnerships and sponsorships</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                      <span>Creative tools and resources</span>
                    </li>
                  </ul>
                  <Link to="/discover" className="text-primary font-medium flex items-center hover:underline">
                    Start exploring
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </AnimatedSection>
            </TabsContent>

            <TabsContent value="brands" className="space-y-6">
              <AnimatedSection animation="fade-in-up">
                <div className="bg-background rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">For Brands</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect with artists for endorsements, book venues for events, and find creative resources for campaigns.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                      <span>Artist collaborations and ambassadors</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                      <span>Venue bookings for brand events</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                      <span>Creative production resources</span>
                    </li>
                  </ul>
                  <Link to="/discover" className="text-primary font-medium flex items-center hover:underline">
                    Start connecting
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </AnimatedSection>
            </TabsContent>

            <TabsContent value="venues" className="space-y-6">
              <AnimatedSection animation="fade-in-up">
                <div className="bg-background rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">For Venues</h3>
                  <p className="text-muted-foreground mb-4">
                    Find talented artists to book, connect with brands for sponsorships, and discover resources for your space.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                      <span>Artist discovery for performances</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                      <span>Brand partnerships for events</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                      <span>Production and equipment resources</span>
                    </li>
                  </ul>
                  <Link to="/discover" className="text-primary font-medium flex items-center hover:underline">
                    Start discovering
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </AnimatedSection>
            </TabsContent>
          </Tabs>
          
          <AnimatedSection animation="fade-in-up" delay={300} className="mt-12">
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
          </AnimatedSection>
          
          <AnimatedSection animation="fade-in-up" delay={500} className="text-center mt-12">
            <Button 
              variant="outline" 
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              as={Link}
              to="/discover"
            >
              Explore Full Marketplace
            </Button>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Events</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover and share exciting events happening in the creative community.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredEvents.map((event, index) => (
              <AnimatedSection 
                key={index} 
                animation="fade-in-up" 
                delay={200 * index}
              >
                <div className="bg-background rounded-lg overflow-hidden shadow-sm border border-border">
                  <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                    <Calendar className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{event.location}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-1 bg-secondary text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        Share
                      </Button>
                      <Button 
                        size="sm"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section - Updated to reflect multi-way marketplace */}
      <section className="section-padding bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection animation="fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the TandemX Ecosystem Today</h2>
              <p className="text-lg text-gray-300 mb-8">
                Whether you're an artist, brand, venue, or creative resource provider - our platform is designed to help you make meaningful connections and grow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black"
                >
                  Create Your Account
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="border-white text-white hover:bg-white/10"
                  as={Link}
                  to="/discover"
                >
                  Explore First
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
