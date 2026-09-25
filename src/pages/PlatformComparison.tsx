import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus, Sparkles, Users, Calendar, Video, Wrench, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type V = boolean | "partial";
const COLS = ["Planning Pod","Tagvenue","Tripleseat","Peerspace","Eventeny","Accelevents","Releventful","OkWhen","OninFive"] as const;

interface FeatureComparison {
  feature: string;
  description: string;
  us: V;
  others: V[]; // same order as COLS
}

const P = "partial" as const;
const features: FeatureComparison[] = [
  { feature: "Non-Traditional Venues", description: "Warehouses, studios, maker spaces, unconventional locations", us: true, others: [false,P,false,true,P,false,P,false,P] },
  { feature: "Artist/Creator Profiles", description: "Profiles for performers, artists, and makers", us: true, others: [false,false,false,false,P,false,false,false,true] },
  { feature: "Booth & Floorplan Layout", description: "Sized booths, movable walls, multi-level plans, 3D walkthrough", us: true, others: [P,false,P,false,P,P,false,P,false] },
  { feature: "Vendor Applications & Booth Assignment", description: "Collect applications, jury, assign approved vendors to booths", us: P, others: [P,false,false,false,true,P,false,false,false] },
  { feature: "Equipment & Gear Tracking", description: "Technical equipment, AV gear, hardware inventory", us: true, others: [P,false,P,false,false,false,true,P,false] },
  { feature: "Local Discovery Map", description: "Find what's happening nearby tonight", us: P, others: [false,P,false,P,P,false,false,false,true] },
  { feature: "UGC Content Feed", description: "Behind-the-scenes, highlights, venue tours", us: true, others: [false,false,false,P,false,P,false,false,false] },
  { feature: "Brand Collaboration", description: "Connect venues, artists, and brands", us: true, others: [false,false,false,false,P,P,false,false,false] },
  { feature: "Event Management", description: "Scheduling, booking, and coordination", us: true, others: [true,true,true,true,true,true,true,true,P] },
  { feature: "Payment Processing", description: "Integrated payment and invoicing", us: true, others: [true,true,true,true,true,true,true,true,false] },
  { feature: "Community Features", description: "Forums, groups, community building", us: true, others: [false,false,false,false,false,P,false,false,false] },
  { feature: "Resource Marketplace", description: "Rent/share equipment, services, spaces", us: true, others: [false,false,false,P,false,false,false,false,false] },
  { feature: "Travel/Touring Support", description: "Route planning, POI discovery for mobile creators", us: true, others: [false,false,false,false,false,false,false,false,false] },
];

const competitors = [
  { name: "Planning Pod", focus: "Corporate Events", pricing: "$$$", bestFor: "Large corporate event planners" },
  { name: "Tagvenue", focus: "Venue Booking", pricing: "$$", bestFor: "Finding and booking traditional venues" },
  { name: "Tripleseat", focus: "Hospitality", pricing: "$$$", bestFor: "Restaurants and hotels with event spaces" },
  { name: "Peerspace", focus: "Creative Spaces", pricing: "$$", bestFor: "Hourly creative space rentals" },
  { name: "Eventeny", focus: "Vendors & Festivals", pricing: "$$", bestFor: "Vendor applications, jurying, booth maps" },
  { name: "Accelevents", focus: "Conferences", pricing: "$$$", bestFor: "Registration, badges, attendee app" },
  { name: "Releventful", focus: "Venue Back Office", pricing: "$$", bestFor: "Venues, restaurants, caterers: CRM, invoices" },
  { name: "OkWhen", focus: "Full-Service Conferences", pricing: "$$$$", bestFor: "Software plus AV, staging, streaming" },
  { name: "OninFive", focus: "Local Live Music", pricing: "Free", bestFor: "Map-first grassroots gig discovery" },
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
            Built for <span className="text-primary">Creators</span> & <span className="text-primary">Corporations</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Whether you're an indie artist booking your first venue or a corporation planning large-scale events,
            we provide the infrastructure that scales with your vision—bridging creative communities with enterprise reliability.
          </p>
        </div>

        {/* Key Differentiators */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Creator-Friendly</CardTitle>
              <CardDescription>
                Artist profiles, collaboration tools, and creative community features for independent creators
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <Wrench className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Enterprise-Ready</CardTitle>
              <CardDescription>
                Full equipment tracking, technical specs, and scalable infrastructure for large events
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <Video className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Social Discovery</CardTitle>
              <CardDescription>
                UGC feed, venue tours, and organic discovery—connecting creators with corporate opportunities
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
                    <th className="text-center py-3 px-4 font-semibold text-primary">Garflock</th>
                    {COLS.map((c) => (<th key={c} className="text-center py-3 px-3 text-sm font-medium text-muted-foreground whitespace-nowrap">{c}</th>))}
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
                      {item.others.map((v, i) => (<td key={COLS[i]} className="text-center py-3 px-3"><div className="flex justify-center"><FeatureIcon value={v} /></div></td>))}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <h2 className="text-3xl font-bold">Ready to Scale Your Vision?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From indie venues to enterprise events, touring artists to corporate productions—we're building 
              the infrastructure that grows with you.
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
