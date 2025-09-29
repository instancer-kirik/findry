import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Map,
  Route,
  Car,
  Music,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plus,
  Sparkles,
  Compass,
  Mountain,
  Waves,
  Trees,
  Building,
  Camera,
  Coffee,
  Star,
} from "lucide-react";
import TripPlanningWizard from "@/components/tours/planning/TripPlanningWizard";
import TourMap from "@/components/tours/TourMap";
import TourStopsList from "@/components/tours/TourStopsList";
import CreateStopForm from "@/components/tours/CreateStopForm";
import { TourPlan, TourStop } from "@/types/content";
import { TripPlanData } from "@/types/tour-planning";
import { toast } from "sonner";

const TourPlanner: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"band_tour" | "roadtrip">(
    "band_tour",
  );
  const [isCreatingTour, setIsCreatingTour] = useState(false);
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [tourPlans, setTourPlans] = useState<TourPlan[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourPlan | null>(null);

  const handleCreateTour = (tripData: TripPlanData) => {
    // Convert TripPlanData to TourPlan format
    const newTour: TourPlan = {
      id: `tour-${Date.now()}`,
      name: tripData.name,
      description: tripData.description,
      start_date: tripData.startDate.toISOString(),
      end_date: tripData.endDate.toISOString(),
      is_public: tripData.isPublic,
      type: tripData.type,
      stops: tripData.destinations.map((dest, index) => ({
        id: dest.id,
        tour_id: `tour-${Date.now()}`,
        name: dest.name,
        location: dest.location,
        date: dest.arrivalDate.toISOString(),
        departure_time: dest.departureDate.toISOString(),
        description: dest.notes,
        order: index + 1,
        accommodation: tripData.accommodation.find(
          (a) => a.destinationId === dest.id,
        )?.name,
      })),
      owner_id: "current-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTourPlans([...tourPlans, newTour]);
    setSelectedTour(newTour);
    setIsCreatingTour(false);
    toast.success(
      `${tripData.type === "band_tour" ? "Tour" : "Trip"} created successfully!`,
    );
  };

  const handleAddStop = (stop: Omit<TourStop, "id" | "tour_id">) => {
    if (!selectedTour) return;

    const newStop: TourStop = {
      ...stop,
      id: `stop-${Date.now()}`,
      tour_id: selectedTour.id,
    };

    const updatedTour = {
      ...selectedTour,
      stops: [...selectedTour.stops, newStop].sort((a, b) => a.order - b.order),
      updated_at: new Date().toISOString(),
    };

    setSelectedTour(updatedTour);
    setTourPlans(
      tourPlans.map((tour) =>
        tour.id === updatedTour.id ? updatedTour : tour,
      ),
    );

    setIsAddingStop(false);
    toast.success("Stop added successfully");
  };

  const handleDeleteStop = (stopId: string) => {
    if (!selectedTour) return;

    const updatedStops = selectedTour.stops.filter(
      (stop) => stop.id !== stopId,
    );
    const reorderedStops = updatedStops.map((stop, index) => ({
      ...stop,
      order: index + 1,
    }));

    const updatedTour = {
      ...selectedTour,
      stops: reorderedStops,
      updated_at: new Date().toISOString(),
    };

    setSelectedTour(updatedTour);
    setTourPlans(
      tourPlans.map((tour) =>
        tour.id === updatedTour.id ? updatedTour : tour,
      ),
    );

    toast.success("Stop removed successfully");
  };

  const sampleTours = {
    band_tour: [
      {
        id: "sample-1",
        name: "West Coast Rock Tour",
        stops: 5,
        duration: "14 days",
        budget: "$12,000",
        highlight: "Los Angeles",
      },
      {
        id: "sample-2",
        name: "Midwest Music Festival Circuit",
        stops: 8,
        duration: "21 days",
        budget: "$18,000",
        highlight: "Chicago",
      },
    ],
    roadtrip: [
      {
        id: "sample-3",
        name: "Pacific Coast Highway Adventure",
        stops: 7,
        duration: "10 days",
        budget: "$3,500",
        highlight: "Big Sur",
      },
      {
        id: "sample-4",
        name: "National Parks Explorer",
        stops: 6,
        duration: "18 days",
        budget: "$4,200",
        highlight: "Yellowstone",
      },
    ],
  };

  const inspirationCards = [
    {
      icon: Mountain,
      title: "Mountain Escape",
      description: "Explore peaks and valleys",
      color: "from-gray-500 to-slate-600",
    },
    {
      icon: Waves,
      title: "Coastal Journey",
      description: "Sun, sand, and surf",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Trees,
      title: "Forest Adventure",
      description: "Discover hidden trails",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Building,
      title: "City Explorer",
      description: "Urban adventures await",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-6">
        {isCreatingTour ? (
          <TripPlanningWizard
            type={activeTab}
            onComplete={handleCreateTour}
            onCancel={() => setIsCreatingTour(false)}
          />
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold flex items-center gap-3">
                    <Compass className="h-10 w-10 text-primary" />
                    Tour & Trip Planner
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Plan your perfect adventure with our interactive planner
                  </p>
                </div>
                <Badge variant="secondary" className="text-sm py-2 px-4">
                  <Sparkles className="h-4 w-4 mr-1" />
                  New Experience
                </Badge>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "band_tour" | "roadtrip")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger
                  value="band_tour"
                  className="flex items-center gap-2"
                >
                  <Music className="h-4 w-4" />
                  Band Tour
                </TabsTrigger>
                <TabsTrigger
                  value="roadtrip"
                  className="flex items-center gap-2"
                >
                  <Car className="h-4 w-4" />
                  Road Trip
                </TabsTrigger>
              </TabsList>

              <TabsContent value="band_tour" className="space-y-6">
                {selectedTour && selectedTour.type === "band_tour" ? (
                  // Show selected tour details
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{selectedTour.name}</CardTitle>
                        <CardDescription>
                          {selectedTour.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TourMap stops={selectedTour.stops} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Tour Stops</CardTitle>
                        <CardDescription>
                          Manage your tour venues
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isAddingStop ? (
                          <CreateStopForm
                            onSubmit={handleAddStop}
                            onCancel={() => setIsAddingStop(false)}
                            order={selectedTour.stops.length + 1}
                          />
                        ) : (
                          <>
                            <TourStopsList
                              stops={selectedTour.stops}
                              onDeleteStop={handleDeleteStop}
                            />
                            <Button
                              onClick={() => setIsAddingStop(true)}
                              className="w-full mt-4"
                              variant="outline"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Stop
                            </Button>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <>
                    {/* Hero Section */}
                    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-3xl font-bold mb-2">
                              🎸 Plan Your Band Tour
                            </h2>
                            <p className="text-white/90 mb-4">
                              Organize venues, plan routes, and manage your
                              band's journey
                            </p>
                            <Button
                              size="lg"
                              variant="secondary"
                              onClick={() => setIsCreatingTour(true)}
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-5 w-5" />
                              Start Planning Tour
                            </Button>
                          </div>
                          <Music className="h-32 w-32 text-white/20" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sample Tours */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Example Tours
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sampleTours.band_tour.map((tour) => (
                          <Card
                            key={tour.id}
                            className="hover:shadow-lg transition-all cursor-pointer"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">{tour.name}</h4>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="secondary">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {tour.stops} stops
                                    </Badge>
                                    <Badge variant="secondary">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {tour.duration}
                                    </Badge>
                                    <Badge variant="secondary">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      {tour.budget}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Highlight: {tour.highlight}
                                  </p>
                                </div>
                                <Star className="h-5 w-5 text-yellow-500" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="roadtrip" className="space-y-6">
                {selectedTour && selectedTour.type === "roadtrip" ? (
                  // Show selected tour details
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{selectedTour.name}</CardTitle>
                        <CardDescription>
                          {selectedTour.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TourMap stops={selectedTour.stops} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Trip Stops</CardTitle>
                        <CardDescription>
                          Manage your destinations
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isAddingStop ? (
                          <CreateStopForm
                            onSubmit={handleAddStop}
                            onCancel={() => setIsAddingStop(false)}
                            order={selectedTour.stops.length + 1}
                          />
                        ) : (
                          <>
                            <TourStopsList
                              stops={selectedTour.stops}
                              onDeleteStop={handleDeleteStop}
                            />
                            <Button
                              onClick={() => setIsAddingStop(true)}
                              className="w-full mt-4"
                              variant="outline"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Stop
                            </Button>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <>
                    {/* Hero Section */}
                    <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-3xl font-bold mb-2">
                              🚗 Plan Your Road Trip
                            </h2>
                            <p className="text-white/90 mb-4">
                              Create the perfect adventure with destinations,
                              budget, and more
                            </p>
                            <Button
                              size="lg"
                              variant="secondary"
                              onClick={() => setIsCreatingTour(true)}
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-5 w-5" />
                              Start Planning Trip
                            </Button>
                          </div>
                          <Car className="h-32 w-32 text-white/20" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Inspiration Cards */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Get Inspired
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {inspirationCards.map((card, index) => {
                          const Icon = card.icon;
                          return (
                            <Card
                              key={index}
                              className="hover:shadow-lg transition-all cursor-pointer"
                            >
                              <CardContent className="p-4">
                                <div
                                  className={`p-3 rounded-lg bg-gradient-to-r ${card.color} text-white mb-3 w-fit`}
                                >
                                  <Icon className="h-6 w-6" />
                                </div>
                                <h4 className="font-semibold text-sm">
                                  {card.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {card.description}
                                </p>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sample Trips */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Example Road Trips
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sampleTours.roadtrip.map((tour) => (
                          <Card
                            key={tour.id}
                            className="hover:shadow-lg transition-all cursor-pointer"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">{tour.name}</h4>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="secondary">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {tour.stops} stops
                                    </Badge>
                                    <Badge variant="secondary">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {tour.duration}
                                    </Badge>
                                    <Badge variant="secondary">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      {tour.budget}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Highlight: {tour.highlight}
                                  </p>
                                </div>
                                <Star className="h-5 w-5 text-yellow-500" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default TourPlanner;
