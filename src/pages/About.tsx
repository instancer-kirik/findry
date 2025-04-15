import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github, Globe, Heart, Lightbulb, MessageCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <section className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">About Findry</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                from Ultimate Starter Kit - instance.select 
            </p>
          </section>

          {/* Mission Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
              <CardDescription>Why we built Findry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Creative communities(me) often struggle to connect with the resources, 
                spaces, and collaborators they need to bring their visions to life. We set out to build a platform that bridges 
                these gaps and empowers artists to focus on what they do best—creating.
              </p>
              <br />
              <p>
                And scheduling events with component slots (gigs?) Eventbrite for ticketing.
              </p>
              <br />
              <p>
                With this platform for collaboration and resource sharing, we can unlock new possibilities 
                for creative expression and community building.
              </p>
              <br />
              <p>
                Maybe I should add a project pitch section?
              </p>
            </CardContent>
          </Card>

          {/* Core Values */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Accessible Culture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    One's desired culture should be accessible, and the resources to create it should be too.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <Lightbulb className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Sustainable Culture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Utilization, reutilization, and creation of resources should be sustainable.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <Heart className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Epicer Software</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The awesome thing about me making this, is that I want and make fantastic software.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">AL</span>
                    </div>
                    <div>
                      <CardTitle>Ultimate Starter Kit</CardTitle>
                      <CardDescription>Founder & Lead Developer</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    With a background in both art and technology, he founded Findry to bridge the gap 
                    between creative minds and the resources they need to thrive.
                  </p>
                  <div className="flex mt-4 gap-2">
                    <Button variant="outline" size="icon">
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">JD</span>
                    </div>
                    <div>
                      <CardTitle>instancer-kirik</CardTitle>
                      <CardDescription>UX Designer & Community Lead</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    He brings a wealth of experience in UX design and community building, 
                    ensuring that Findry remains intuitive and responsive.
                  </p>
                  <div className="flex mt-4 gap-2">
                    <Button variant="outline" size="icon">
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Get Involved Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Get Involved</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Join Our Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground mb-6">
                    Become part of our growing network of creators, innovators, and resource providers.
                    Share your work, find collaborators, and access the resources you need.
                  </p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link to="/signup">
                    <Button className="w-full">
                      Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
              
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground mb-6">
                    Have questions, feedback, or ideas for improving Findry? We'd love to hear from you.
                    Reach out to our team and let's build a better platform together.
                  </p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link to="/contact">
                    <Button variant="outline" className="w-full">
                      Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is Findry?</h3>
                <p className="text-muted-foreground">
                  Findry is the present tense of foundry.
                </p>
              </div>
              <Separator className="my-4" />
              <div>
                <h3 className="text-lg font-semibold mb-2">How can I ask a question and get on this list?</h3>
                <p className="text-muted-foreground">
                  choose your words
                </p>
              </div>
              <Separator className="my-4" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Is Findry available in my area?</h3>
                <p className="text-muted-foreground">
                  Findry is currently focused on building strong communities in select regions, with plans to expand. 
                  Even if you're outside our primary regions, you can still join and connect with resources and communities 
                  that might be relevant to your work.
                </p>
              </div>
              <Separator className="my-4" />
              <div>
                <h3 className="text-lg font-semibold mb-2">How can I contribute to Findry's development?</h3>
                <p className="text-muted-foreground">
                  We welcome feedback, feature suggestions, and community contributions. 
                  Contact us through our <Link to="/contact" className="text-primary hover:underline">contact page</Link> to 
                  share your ideas or inquire about partnership opportunities.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About; 