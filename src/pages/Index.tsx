import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import Hero from "@/components/home/Hero";
import FeatureSection from "@/components/home/FeatureSection";
import EcosystemSection from "@/components/home/EcosystemSection";
import ScreenshotGallery from "@/components/home/ScreenshotGallery";
import EmailWaitlist from "@/components/home/EmailWaitlist";
import FeedbackQuestionnaire from "@/components/home/FeedbackQuestionnaire";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import UnifiedCalendar from "@/components/home/UnifiedCalendar";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Compass,
  Palette,
  Store,
  Users,
  ChevronDown,
  ZoomIn,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const divvyQueueRef = useRef<HTMLDivElement>(null);
  const [contributeDialogOpen, setContributeDialogOpen] = useState(false);
  const [selectedWishlistItem, setSelectedWishlistItem] = useState<{
    title: string;
    description: string;
    type: string;
  } | null>(null);

  const handleContributeClick = (item: { title: string; description: string; type: string }) => {
    if (user) {
      // Logged in - go to create resource
      navigate("/create-resource");
    } else {
      // Not logged in - show dialog
      setSelectedWishlistItem(item);
      setContributeDialogOpen(true);
    }
  };

  const handleEmailUs = () => {
    if (selectedWishlistItem) {
      localStorage.setItem(
        "prefillContact",
        JSON.stringify({
          subject: `Contribution: ${selectedWishlistItem.title}`,
          message: `I'd like to contribute to the Developer Wishlist item:\n\n${selectedWishlistItem.title}\n${selectedWishlistItem.description}\n\nHere's what I can offer:`,
          type: selectedWishlistItem.type,
        })
      );
    }
    setContributeDialogOpen(false);
    navigate("/contact");
  };

  const handleLoginToContribute = () => {
    setContributeDialogOpen(false);
    navigate("/login");
  };

  const platformScreenshots = [
    {
      src: "/screenshots/funnel-1.png",
      alt: "Main Event",
      title: "Create and discover events in your area",
    },
    {
      src: "/screenshots/funnel-2.png",
      alt: "Create Event",
      title: "Easily set up new events with our intuitive form",
    },
    {
      src: "/screenshots/funnel-3.png",
      alt: "Discovery",
      title: "Find resources, artists, and events that match your interests",
    },
    {
      src: "/screenshots/funnel-4.png",
      alt: "Discovery Dice Tray",
      title: "Use our discovery tools to find new opportunities",
    },
    {
      src: "/screenshots/funnel-5.png",
      alt: "Collaborator",
      title: "Connect with collaborators on creative projects",
    },
    {
      src: "/screenshots/funnel-6.png",
      alt: "Community+Events",
      title: "Join communities and participate in their events",
    },
    {
      src: "/screenshots/funnel-7.png",
      alt: "Profile Wizard",
      title: "Create your personalized profile",
    },
  ];

  const scrollToDivvyQueue = () => {
    divvyQueueRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Waitlist Section at the top */}
      <div className="container mx-auto px-4 pt-8">
        <EmailWaitlist />
      </div>

      {/* Feedback Questionnaire Section */}
      <div className="container mx-auto px-4 py-12">
        <FeedbackQuestionnaire />
      </div>

      {/* Hero Section */}
      <Hero />

      {/* Scroll Indicator */}
      <div className="flex justify-center pb-8 -mt-8 relative z-10">
        <div className="animate-bounce bg-primary/10 p-2 rounded-full">
          <ChevronDown className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Screenshots Section */}
      <div className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <ScreenshotGallery screenshots={platformScreenshots} />
        </div>
      </div>

      {/* Featured Projects Section */}
      <FeaturedProjects />

      {/* Calendar Section */}
      <div className="container mx-auto px-4 py-12">
        <UnifiedCalendar />
      </div>

      {/* Visual Feature Showcase */}
      <FeatureSection />

      {/* Ecosystem */}
      <EcosystemSection />

      {/* Quick Links Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Explore Findry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/discover")}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Compass className="h-8 w-8" />
            <span>Discover</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/discover?tab=events")}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Calendar className="h-8 w-8" />
            <span>Events</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/discover?tab=artists")}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Palette className="h-8 w-8" />
            <span>Artists</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/communities")}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Users className="h-8 w-8" />
            <span>Communities</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/discover/projects")}
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10"
          >
            <Store className="h-8 w-8" />
            <span>Projects</span>
          </Button>
        </div>
      </div>

      {/* Community Call to Action */}
      <div className="container mx-auto px-4 py-12 text-center bg-muted/10 rounded-lg">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Join the Creative Ecosystem?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with artists, venues, and resources to make your creative
          projects come to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/signup")}>
            Sign Up Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/discover/projects")}
          >
            Explore Projects
          </Button>
        </div>
      </div>
      {/* DivvyQueue Section with Ref for Scrolling */}
      <div ref={divvyQueueRef} className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">DivvyQueue</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
            Our multiparty contract system streamlining complex agreements
            between collaborators
          </p>

          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {[
                {
                  src: "/screenshots/divvyqueue-1.png",
                  alt: "Contracts List",
                  title: "Contracts List",
                },
                {
                  src: "/screenshots/divvyqueue-2.png",
                  alt: "Contract Editor",
                  title: "Contract Editor",
                },
                {
                  src: "/screenshots/divvyqueue-3.png",
                  alt: "Contract Editor",
                  title: "Contract Editor",
                },
                {
                  src: "/screenshots/divvyqueue-templates.png",
                  alt: "Templates",
                  title: "Templates",
                },
                {
                  src: "/screenshots/divvyqueue-invoice.png",
                  alt: "Invoice",
                  title: "Invoice",
                },
                {
                  src: "/screenshots/divvyqueue-activity.png",
                  alt: "Activity and progress tracking",
                  title: "Activity and progress tracking",
                },
                {
                  src: "/screenshots/divvyqueue-document.png",
                  alt: "Document Editor",
                  title: "Document Editor",
                },
                {
                  src: "/screenshots/divvyqueue-ambiguous.png",
                  alt: "Ambiguituous tool",
                  title: "Ambiguituous tool",
                },
                {
                  src: "/screenshots/divvyqueue-ambiguous.png",
                  alt: "Breach Resolution",
                  title: "Breach Resolution",
                },
              ].map((screenshot, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col p-0">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="aspect-video relative overflow-hidden rounded-t-lg group cursor-pointer">
                              <img
                                src={screenshot.src}
                                alt={screenshot.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                                width="640"
                                height="360"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ZoomIn className="text-white h-8 w-8" />
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl w-full p-1">
                            <img
                              src={screenshot.src}
                              alt={screenshot.alt}
                              className="w-full h-auto object-contain"
                              loading="eager"
                            />
                          </DialogContent>
                        </Dialog>
                        <div className="p-4">
                          <h3 className="font-semibold">{screenshot.alt}</h3>
                          {screenshot.title && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {screenshot.title}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 -translate-x-1/2" />
            <CarouselNext className="absolute right-0 translate-x-1/2" />
          </Carousel>

          <div className="mt-8 text-center">
            <Button size="lg" onClick={() => navigate("/divvyqueue")}>
              Learn More About DivvyQueue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Developer Wishlist Section */}
      <div className="container mx-auto px-4 py-12 bg-muted/10 rounded-lg my-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Developer Wishlist
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
            Resources we're seeking to expand our creative projects and
            collaborative space
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Workshop Space",
                description:
                  "Indoor/outdoor venue for creative workshops and collaborative sessions",
                icon: "🏗️",
                type: "space",
              },
              {
                title: "Food Truck",
                description:
                  "Mobile food service for events and community gatherings",
                icon: "🚚",
                type: "food",
              },
              {
                title: "Robot Parts",
                description:
                  "Components for robotics projects and interactive installations",
                icon: "🤖",
                type: "electronics",
              },
              {
                title: "Storage Devices and Servers",
                description:
                  "External hard drives, SSDs, and NAS systems for project archiving and media storage",
                icon: "💾",
                type: "equipment",
              },

              {
                title: "Lighting Equipment",
                description:
                  "Professional lighting for events, performances and installations",
                icon: "💡",
                type: "equipment",
              },
              {
                title: "Sound System",
                description:
                  "Audio equipment for events, performances and interactive experiences",
                icon: "🔊",
                type: "equipment",
              },
              {
                title: "Camera Gear",
                description:
                  "Photography and video equipment for documentation and content creation",
                icon: "📷",
                type: "equipment",
              },
              {
                title: "Hard Gear",
                description:
                  "Tools, machines, and equipment for building and repairing projects",
                icon: "🔧",
                type: "equipment",
              },
              {
                title: "Developers and Fabricators",
                description: "Many projects, free to join.",
                icon: "👩‍💻",
                type: "offerer",
              },
              {
                title: "Project Materials Fund",
                description:
                  "Financial support for components for endorsed projects",
                icon: "💰",
                type: "funding",
              },
              {
                title: "Transportation",
                description:
                  "Vehicles, trailers, and boats, Earth-movers, etc.",
                icon: "🚐",
                type: "vehicle",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow flex flex-col"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-auto">
                    {item.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => handleContributeClick(item)}
                  >
                    Contribute
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" onClick={() => navigate("/contact")}>
              I Can Help With Something
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Funding and Contact Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">Support the Project</h2>
          <p className="text-muted-foreground">
            Help us continue building and improving Findry by supporting the
            project.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() =>
                window.open("https://cash.app/$Instancer", "_blank")
              }
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="currentColor"
                />
                <path
                  d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z"
                  fill="currentColor"
                />
              </svg>
              Cash App: $Instancer
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() =>
                window.open("mailto:instance.select@gmail.com", "_blank")
              }
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                  fill="currentColor"
                />
              </svg>
              instance.select@gmail.com
            </Button>
          </div>
        </div>
      </div>

      {/* Contribute Dialog for non-logged-in users */}
      <AlertDialog open={contributeDialogOpen} onOpenChange={setContributeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>How would you like to contribute?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedWishlistItem && (
                <span>
                  You're interested in contributing to <strong>{selectedWishlistItem.title}</strong>.
                </span>
              )}{" "}
              You can either log in to list your resource directly, or send us a message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="outline" onClick={handleEmailUs}>
              Email Us
            </Button>
            <AlertDialogAction onClick={handleLoginToContribute}>
              Log In to List Resource
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Landing;
