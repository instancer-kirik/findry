import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus, Sparkles, Users, Calendar, Video, Wrench, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type V = boolean | "partial";
const COLS = ["Planning Pod","Tagvenue","Tripleseat","Peerspace","Eventeny","Accelevents","Releventful","OkWhen","OninFive","Evently (venues)","Evently.ai","501 Fun","Eventbrite","Ticketmaster","SeatGeek","StubHub","Bandsintown","Songkick","DICE","Meetup","Goodshuffle Pro","Prism.fm","Cvent (Social Tables)","AllSeated","Whova","Rentman","Luma","Partiful"] as const;

interface FeatureComparison {
  feature: string;
  description: string;
  us: V;
  others: V[]; // same order as COLS
}

const P = "partial" as const;
const features: FeatureComparison[] = [
  // Order: PlanningPod,Tagvenue,Tripleseat,Peerspace,Eventeny,Accelevents,Releventful,OkWhen,OninFive,Evently,Evently.ai,501Fun,Eventbrite,Ticketmaster,SeatGeek,StubHub,Bandsintown,Songkick,DICE,Meetup,GoodshufflePro,Prism,Cvent,AllSeated,Whova,Rentman,Luma,Partiful
  { feature: "Ticketing & Registration", description: "Sell tickets, RSVPs, tiered pricing", us: P, others: [P,false,false,false,true,true,false,true,false,P,P,false,true,true,true,true,P,P,true,P,false,P, true, false, true, false, true, "partial"] },
  { feature: "Resale & Secondary Market", description: "Fans resell tickets safely", us: false, others: [false,false,false,false,false,false,false,false,false,false,false,false,P,true,true,true,false,false,true,false,false,false, false, false, false, false, false, false] },
  { feature: "Check-In & Badges", description: "QR scanning, badge printing, door management", us: false, others: [P,false,false,false,true,true,false,true,false,false,P,false,true,true,true,true,false,false,true,P,false,false, true, "partial", true, false, "partial", false] },
  { feature: "Attendee Mobile App", description: "Native app for attendees and fans (ours: installable web app)", us: P, others: [false,true,false,true,true,true,false,true,true,false,true,P,true,true,true,true,true,true,true,true,false,false, true, false, true, false, true, "partial"] },
  { feature: "Email & Marketing Tools", description: "Promo campaigns, reminders, audience lists", us: P, others: [true,false,true,false,true,true,true,true,false,true,P,P,true,true,P,false,true,P,P,true,true,P, true, "partial", true, false, "partial", false] },
  { feature: "Analytics & Reporting", description: "Sales, attendance, revenue dashboards", us: P, others: [true,P,true,P,true,true,true,true,false,true,true,true,true,true,true,true,true,P,true,P,true,true, true, "partial", true, "partial", "partial", false] },
  { feature: "CRM & Client Management", description: "Leads, proposals, contracts, client history", us: P, others: [true,P,true,false,P,P,true,true,false,true,P,P,false,false,false,false,false,false,false,false,true,true, true, "partial", "partial", "partial", false, false] },
  { feature: "Virtual & Hybrid Events", description: "Livestream, virtual lobbies, online sessions", us: P, others: [false,false,false,false,false,true,false,true,false,false,P,false,true,false,false,false,true,P,P,true,false,false, true, true, true, false, true, false] },
  { feature: "Fan Following & Alerts", description: "Follow artists, get notified of nearby shows", us: P, others: [false,false,false,false,false,false,false,false,true,false,false,false,true,true,true,P,true,true,true,true,false,false, false, false, false, false, true, false] },
  { feature: "Large Audience Reach", description: "Built-in audience of millions discovering events", us: false, others: [false,P,false,P,P,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false, true, false, false, false, true, false] },
  { feature: "Venue Hardware & Games", description: "In-venue scoring, AR games, POS integration", us: false, others: [false,false,P,false,false,false,true,false,false,P,false,true,false,false,false,false,false,false,false,false,false,false, false, false, false, false, false, false] },
  { feature: "Non-Traditional Venues", description: "Warehouses, studios, maker spaces, unconventional locations", us: true, others: [false,P,false,true,P,false,P,false,P,P,false,false,false,false,false,false,false,false,false,false,false,false, false, "partial", false, false, "partial", "partial"] },
  { feature: "Artist/Creator Profiles", description: "Profiles for performers, artists, and makers", us: true, others: [false,false,false,false,P,false,false,false,true,false,false,false,P,false,false,false,true,true,false,false,false,P, false, false, false, false, "partial", false] },
  { feature: "Booth & Floorplan Layout", description: "Sized booths, movable walls, multi-level plans, 3D walkthrough", us: true, others: [P,false,P,false,P,P,false,P,false,false,P,false,false,false,false,false,false,false,false,false,false,false, true, true, "partial", "partial", false, false] },
  { feature: "Multi-Level Space Planning", description: "Ground floor + mezzanine levels in one plan", us: true, others: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false, "partial", "partial", false, false, false, false] },
  { feature: "3D Walkthrough Preview", description: "Walk the venue layout before setup day", us: true, others: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false, true, true, false, false, false, false] },
  { feature: "Saved Layout Templates", description: "Save and reuse past venue setups", us: true, others: [P,false,P,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false, true, true, false, "partial", false, false] },
  { feature: "Space Module Library", description: "Real-sized pieces: booths, walls, cranes, restrooms, kitchens", us: true, others: [false,false,false,false,P,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false, true, true, false, false, false, false] },
  { feature: "Vendor Applications & Booth Assignment", description: "Collect applications, jury, assign approved vendors to booths", us: P, others: [P,false,false,false,true,P,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false, "partial", "partial", "partial", false, false, false] },
  { feature: "Equipment & Gear Tracking", description: "Technical equipment, AV gear, hardware inventory", us: true, others: [P,false,P,false,false,false,true,P,false,false,false,false,false,false,false,false,false,false,false,false,true,false, "partial", "partial", false, true, false, false] },
  { feature: "Local Discovery Map", description: "Find what's happening nearby tonight", us: P, others: [false,P,false,P,P,false,false,false,true,false,false,false,P,P,P,false,true,true,P,true,P,false, false, false, false, false, "partial", false] },
  { feature: "UGC Content Feed", description: "Behind-the-scenes, highlights, venue tours", us: true, others: [false,false,false,P,false,P,false,false,false,false,false,false,false,false,false,false,P,false,false,false,false,false, false, false, "partial", false, false, false] },
  { feature: "Brand Collaboration", description: "Connect venues, artists, and brands", us: true, others: [false,false,false,false,P,P,false,false,false,false,P,false,false,false,false,false,P,false,false,false,false,false, "partial", false, "partial", false, false, false] },
  { feature: "Event Management", description: "Scheduling, booking, and coordination", us: true, others: [true,true,true,true,true,true,true,true,P,true,P,P,true,true,false,false,P,false,true,true,true,true, true, true, true, true, true, "partial"] },
  { feature: "Payment Processing", description: "Integrated payment and invoicing", us: true, others: [true,true,true,true,true,true,true,true,false,true,false,true,true,true,true,true,false,false,true,P,true,true, "partial", false, "partial", "partial", true, "partial"] },
  { feature: "Community Features", description: "Forums, groups, community building", us: true, others: [false,false,false,false,false,P,false,false,false,false,false,false,false,false,false,false,P,false,false,true,false,false, false, false, true, false, "partial", false] },
  { feature: "Recurring Community Programming", description: "Scheduled circles, weekly gatherings, RSVPs", us: true, others: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false, false, false, "partial", false, true, false] },
  { feature: "Collaborator & Skill Matching", description: "Find makers, artists, and venues to work with", us: true, others: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false, false, false, "partial", true, false, false] },
  { feature: "Booth-Level Messaging", description: "Threads and coordination per booth or project", us: true, others: [false,false,false,false,false,false,false,false,false,false,P,false,false,false,false,false,false,false,false,false,false,false, false, false, "partial", false, false, false] },
  { feature: "Creator Portfolio Pages", description: "Public showcase of builds, art, and projects", us: true, others: [false,false,false,false,P,false,false,false,P,false,false,false,false,false,false,false,false,false,false,false,false,false, false, false, false, false, "partial", false] },
  { feature: "Resource Marketplace", description: "Rent/share equipment, services, spaces", us: true, others: [false,false,false,P,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,P,false, "partial", false, false, false, false, false] },
  { feature: "Travel/Touring Support", description: "Route planning, POI discovery for mobile creators", us: true, others: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,P,false,false,false,false,false, false, false, false, false, false, false] },
];

const ORDER = ["Event Management","Payment Processing","Ticketing & Registration","Non-Traditional Venues","Analytics & Reporting","Booth & Floorplan Layout","Email & Marketing Tools","Artist/Creator Profiles","Attendee Mobile App","Vendor Applications & Booth Assignment","CRM & Client Management","Local Discovery Map","Fan Following & Alerts","Community Features","Virtual & Hybrid Events","Equipment & Gear Tracking","Check-In & Badges","Multi-Level Space Planning","Large Audience Reach","3D Walkthrough Preview","Saved Layout Templates","Resale & Secondary Market","Space Module Library","Venue Hardware & Games","Recurring Community Programming","Collaborator & Skill Matching","Booth-Level Messaging","Creator Portfolio Pages","UGC Content Feed","Brand Collaboration","Resource Marketplace","Travel/Touring Support"];
const orderedFeatures = [...features].sort((a, b) => { const ia = ORDER.indexOf(a.feature), ib = ORDER.indexOf(b.feature); return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib); });

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
  { name: "Evently (venues)", focus: "Venue Bookings", pricing: "$$", bestFor: "Breweries, restaurants, event spaces: bookings, payments, menus" },
  { name: "Evently.ai", focus: "Exhibitor Meetings", pricing: "$$", bestFor: "Booth meeting scheduling at trade shows" },
  { name: "501 Fun", focus: "Venue Entertainment", pricing: "$$$", bestFor: "Bars and entertainment venues: darts scoring, AR games, sessions" },
  { name: "Eventbrite", focus: "Ticketing & Events", pricing: "$", bestFor: "Organizers selling tickets to public events" },
  { name: "Ticketmaster", focus: "Primary Ticketing", pricing: "$$$", bestFor: "Large venues and major tours" },
  { name: "SeatGeek", focus: "Ticket Marketplace", pricing: "$$", bestFor: "Buying/reselling sports and concert tickets" },
  { name: "StubHub", focus: "Ticket Resale", pricing: "$$$", bestFor: "Reselling tickets to big events" },
  { name: "Bandsintown", focus: "Artist-Fan Marketing", pricing: "$", bestFor: "Tour promotion and fan announcements" },
  { name: "Songkick", focus: "Concert Discovery", pricing: "Free", bestFor: "Tracking artists' tour dates" },
  { name: "DICE", focus: "Music Ticketing", pricing: "$", bestFor: "Fan-first mobile ticketing for venues and promoters" },
  { name: "Meetup", focus: "Community Groups", pricing: "$$", bestFor: "Recurring local interest groups" },
  { name: "Goodshuffle Pro", focus: "Event Rentals", pricing: "$$$", bestFor: "Rental companies: inventory, quotes, contracts, dispatch" },
  { name: "Prism.fm", focus: "Live Music Venues", pricing: "$$$", bestFor: "Venues and promoters: booking, contracts, settlements, financials" },
  { name: "Cvent (Social Tables)", focus: "Enterprise Diagramming", pricing: "$$$$", bestFor: "Hotels and corporate planners: to-scale diagrams, 3D, seating" },
  { name: "AllSeated", focus: "Diagramming & Virtual Tours", pricing: "$$$", bestFor: "Venues and planners: floor plans, 3D tours, seating" },
  { name: "Whova", focus: "Conference Apps", pricing: "$$$", bestFor: "Conferences: agendas, attendee networking, badges" },
  { name: "Rentman", focus: "AV Equipment Rental", pricing: "$$$", bestFor: "AV rental companies: gear planning, crews, dispatch" },
  { name: "Luma", focus: "Community Event Hosting", pricing: "$", bestFor: "Recurring series and communities: calendars, RSVPs, ticketing" },
  { name: "Partiful", focus: "Party Invites", pricing: "Free", bestFor: "Casual one-off gatherings: playful invites, text RSVPs" },
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
            <div className="overflow-auto max-h-[80vh] rounded-md border">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="border-b">
                    <th className="sticky top-0 left-0 z-30 bg-card border-b text-left py-3 px-4 font-semibold min-w-[200px]">Feature</th>
                    <th className="sticky top-0 z-20 bg-card border-b text-center py-3 px-4 font-semibold text-primary">Garflock</th>
                    {COLS.map((c) => (
                      <th key={c} className="sticky top-0 z-20 bg-card border-b text-center py-3 px-3 text-sm font-semibold min-w-[140px]">
                        <div className="whitespace-nowrap">{c}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="sticky left-0 z-10 bg-card py-3 px-4 font-medium text-muted-foreground">Focus / Best For / Pricing</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="outline" className="text-[10px]">Makers & Communities</Badge>
                      <div className="text-[11px] leading-snug text-muted-foreground mt-1">Zero-to-one creators, venues, DIY fabricators</div>
                      <div className="font-mono text-[11px] text-primary mt-1">Free</div>
                    </td>
                    {COLS.map((c) => { const info = competitors.find((x) => x.name === c); return (
                      <td key={c} className="text-center align-top py-3 px-3">
                        {info && (<div className="space-y-1">
                          <div className="flex justify-center"><Badge variant="outline" className="text-[10px]">{info.focus}</Badge></div>
                          <div className="text-[11px] leading-snug text-muted-foreground">{info.bestFor}</div>
                          <div className="font-mono text-[11px] text-primary">{info.pricing}</div>
                        </div>)}
                      </td>); })}
                  </tr>
                  {orderedFeatures.map((item, index) => (
                    <tr key={item.feature} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                      <td className="sticky left-0 z-10 bg-card py-3 px-4 min-w-[200px]">
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
