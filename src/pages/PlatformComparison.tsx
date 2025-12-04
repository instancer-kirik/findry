import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus, Sparkles, Users, Calendar, Video, Wrench, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FeatureComparison {
  feature: string;
  description: string;
  us: boolean | "partial";
  planningPod: boolean | "partial";
  tagvenue: boolean | "partial";
  tripleseat: boolean | "partial";
  peerspace: boolean | "partial";
}

const features: FeatureComparison[] = [
  {
    feature: "Non-Traditional Venues",
    description: "Support for warehouses, studios, maker spaces, unconventional locations",
    us: true,
    planningPod: false,
    tagvenue: "partial",
    tripleseat: false,
    peerspace: true,
  },
  {
    feature: "Artist/Creator Profiles",
    description: "Built-in profiles for performers, artists, and creative professionals",
    us: true,
    planningPod: false,
    tagvenue: false,
    tripleseat: false,
    peerspace: false,
  },
  {
    feature: "Equipment & Gear Tracking",
    description: "Manage technical equipment, AV gear, and hardware inventory",
    us: true,
    planningPod: "partial",
    tagvenue: false,
    tripleseat: "partial",
    peerspace: false,
  },
  {
    feature: "UGC Content Feed",
    description: "Social feed for behind-the-scenes, event highlights, venue tours",
    us: true,
    planningPod: false,
    tagvenue: false,
    tripleseat: false,
    peerspace: "partial",
  },
  {
    feature: "Brand Collaboration",
    description: "Connect venues, artists, and brands for partnerships",
    us: true,
    planningPod: false,
    tagvenue: false,
    tripleseat: false,
    peerspace: false,
  },
  {
    feature: "Event Management",
    description: "Full event scheduling, booking, and coordination",
    us: true,
    planningPod: true,
    tagvenue: true,
    tripleseat: true,
    peerspace: true,
  },
  {
    feature: "Payment Processing",
    description: "Integrated payment and invoicing",
    us: true,
    planningPod: true,
    tagvenue: true,
    tripleseat: true,
    peerspace: true,
  },
  {
    feature: "Community Features",
    description: "Forums, groups, and community building tools",
    us: true,
    planningPod: false,
    tagvenue: false,
    tripleseat: false,
    peerspace: false,
  },
  {
    feature: "Resource Marketplace",
    description: "Rent/share equipment, services, and spaces",
    us: true,
    planningPod: false,
    tagvenue: false,
    tripleseat: false,
    peerspace: "partial",
  },
  {
    feature: "Travel/Touring Support",
    description: "Route planning, POI discovery for mobile creators",
    us: true,
    planningPod: false,
    tagvenue: false,
    tripleseat: false,
    peerspace: false,
  },
];

const competitors = [
  {
    name: "Planning Pod",
    focus: "Corporate Events",
    pricing: "$$$",
    bestFor: "Large corporate event planners",
  },
  {
    name: "Tagvenue",
    focus: "Venue Booking",
    pricing: "$$",
    bestFor: "Finding and booking traditional venues",
  },
  {
    name: "Tripleseat",
    focus: "Hospitality",
    pricing: "$$$",
    bestFor: "Restaurants and hotels with event spaces",
  },
  {
    name: "Peerspace",
    focus: "Creative Spaces",
    pricing: "$$",
    bestFor: "Hourly creative space rentals",
  },
];

const FeatureIcon = ({ value }: { value: boolean | "partial" }) => {
  if (value === true) return <Check className="h-5 w-5 text-green-500" />;
  if (value === "partial") return <Minus className="h-5 w-5 text-yellow-500" />;
  return <X className="h-5 w-5 text-muted-foreground/50" />;
};

export default function PlatformComparison() {
  return (
    <Layout>
      <div className="container py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Platform Comparison
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Built for <span className="text-primary">Creators</span>, Not Corporations
          </h1>
          <p className="text-lg text-muted-foreground">
            Traditional venue management platforms focus on corporate events and hospitality. 
            We're building something different—a creator venue ecosystem for indie spaces, 
            artists, and unconventional communities.
          </p>
        </div>

        {/* Key Differentiators */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Creator-First</CardTitle>
              <CardDescription>
                Built around artist profiles, collaboration tools, and creative community features
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <Wrench className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Hardware Ready</CardTitle>
              <CardDescription>
                Full equipment tracking, technical specs, and gear sharing for AV-heavy events
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <Video className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Social Discovery</CardTitle>
              <CardDescription>
                UGC feed, venue tours, and organic discovery through community content
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
            <CardDescription>
              See how we stack up against traditional venue management platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold text-primary">Us</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Planning Pod</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Tagvenue</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Tripleseat</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Peerspace</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((item, index) => (
                    <tr key={item.feature} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                      <td className="py-3 px-4">
                        <div className="font-medium">{item.feature}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex justify-center">
                          <FeatureIcon value={item.us} />
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex justify-center">
                          <FeatureIcon value={item.planningPod} />
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex justify-center">
                          <FeatureIcon value={item.tagvenue} />
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex justify-center">
                          <FeatureIcon value={item.tripleseat} />
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex justify-center">
                          <FeatureIcon value={item.peerspace} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Cards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Who Are They Built For?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitors.map((comp) => (
              <Card key={comp.name} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{comp.name}</CardTitle>
                  <Badge variant="outline">{comp.focus}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground">{comp.bestFor}</div>
                  <div className="font-mono text-primary">{comp.pricing}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Join the Creator Economy?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Whether you're an indie venue, touring artist, or creative community—we're building 
              the infrastructure you actually need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/discover">Explore Platform</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/roadmap">View Roadmap</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
