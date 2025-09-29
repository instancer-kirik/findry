import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Car,
  Hotel,
  Activity,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Clock,
  Fuel,
  Home,
  Music,
  Camera,
  Coffee,
  Mountain,
  Waves,
  Trees,
  Building,
} from "lucide-react";
import { format } from "date-fns";
import { TripPlanData } from "@/types/tour-planning";
import { cn } from "@/lib/utils";

interface TripSummaryProps {
  type: "band_tour" | "roadtrip";
  data: TripPlanData;
}

const TripSummary: React.FC<TripSummaryProps> = ({ type, data }) => {
  const calculateTripDuration = () => {
    if (!data.startDate || !data.endDate) return 0;
    return Math.ceil(
      (data.endDate.getTime() - data.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
  };

  const calculateTotalDistance = () => {
    // This would normally calculate actual distances between destinations
    // For now, we'll estimate based on number of destinations
    return data.destinations.length * 250; // Rough estimate of 250 miles between stops
  };

  const calculateFuelCost = () => {
    if (!data.vehicle || !data.vehicle.estimatedMPG) return 0;
    const distance = calculateTotalDistance();
    const gallons = distance / data.vehicle.estimatedMPG;
    const pricePerGallon = 3.5; // Average price
    return Math.round(gallons * pricePerGallon);
  };

  const getVehicleIcon = () => {
    const vehicleIcons: { [key: string]: any } = {
      car: Car,
      van: Car,
      rv: Home,
      bus: Car,
      motorcycle: Car,
      bicycle: Car,
    };
    return vehicleIcons[data.vehicle?.type || "car"] || Car;
  };

  const getInterestIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      mountain: Mountain,
      music: Music,
      camera: Camera,
      coffee: Coffee,
      beach: Waves,
      trees: Trees,
      building: Building,
    };
    return icons[iconName] || Activity;
  };

  const VehicleIcon = getVehicleIcon();
  const duration = calculateTripDuration();
  const perPersonCost = data.budget.total / data.partySize;
  const dailyCost = data.budget.total / duration;

  const getCompletionStatus = () => {
    const checks = [
      {
        label: "Trip basics",
        completed: !!data.name && !!data.startDate && !!data.endDate,
      },
      { label: "Vehicle selected", completed: !!data.vehicle },
      { label: "Budget planned", completed: data.budget.total > 0 },
      { label: "Destinations added", completed: data.destinations.length > 0 },
      {
        label: "Accommodation arranged",
        completed: data.accommodation.length > 0,
      },
    ];

    const completed = checks.filter((c) => c.completed).length;
    const total = checks.length;

    return { checks, completed, total, percentage: (completed / total) * 100 };
  };

  const status = getCompletionStatus();

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Trip Overview</span>
            <Badge
              variant={status.percentage === 100 ? "default" : "secondary"}
            >
              {status.percentage}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {status.checks.map((check, index) => (
              <div key={index} className="flex items-center gap-2">
                {check.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    check.completed
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {check.label}
                </span>
              </div>
            ))}
          </div>

          {status.percentage < 100 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Complete all sections above to finalize your{" "}
                {type === "band_tour" ? "tour" : "trip"} plan.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Trip Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                {data.name ||
                  `Unnamed ${type === "band_tour" ? "Tour" : "Trip"}`}
              </h2>
              {data.description && (
                <p className="text-muted-foreground">{data.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {data.startDate && format(data.startDate, "MMM d")} -{" "}
                  {data.endDate && format(data.endDate, "MMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {duration} days
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {data.partySize} {data.partySize === 1 ? "person" : "people"}
                </span>
              </div>
            </div>
            <Badge variant={data.isPublic ? "default" : "secondary"}>
              {data.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${data.budget.total}</p>
                <p className="text-xs text-muted-foreground">
                  ${perPersonCost.toFixed(0)}/person
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Destinations</p>
                <p className="text-2xl font-bold">{data.destinations.length}</p>
                <p className="text-xs text-muted-foreground">
                  ~{calculateTotalDistance()} miles
                </p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Cost</p>
                <p className="text-2xl font-bold">${dailyCost.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">per day</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle & Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.vehicle && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <VehicleIcon className="h-5 w-5" />
                Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold capitalize">{data.vehicle.type}</p>
                <div className="flex flex-wrap gap-2">
                  {data.vehicle.features.map((feature) => (
                    <Badge key={feature.id} variant="secondary">
                      {feature.name}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Capacity: {data.vehicle.capacity} people</p>
                  <p>
                    Fuel: {data.vehicle.fuelType} • {data.vehicle.estimatedMPG}{" "}
                    MPG
                  </p>
                  <p>Est. fuel cost: ${calculateFuelCost()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {data.interests && data.interests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5" />
                Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest) => (
                  <Badge key={interest} variant="default">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Budget Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.budget)
              .filter(([key, value]) => key !== "total" && value > 0)
              .map(([category, amount]) => {
                const percentage = (amount / data.budget.total) * 100;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">
                        {category.replace("_", " ")}
                      </span>
                      <span className="font-medium">
                        ${amount} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Route Overview */}
      {data.destinations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Route Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.destinations.map((dest, index) => (
                <div key={dest.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        dest.isHighlight
                          ? "bg-yellow-500 text-white"
                          : "bg-primary text-primary-foreground",
                      )}
                    >
                      {index + 1}
                    </div>
                    {index < data.destinations.length - 1 && (
                      <div className="w-0.5 h-16 bg-muted mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {dest.name}
                          {dest.isHighlight && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {dest.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(dest.arrivalDate, "MMM d")} -{" "}
                          {format(dest.departureDate, "MMM d")}
                          {dest.estimatedCost > 0 &&
                            ` • $${dest.estimatedCost}`}
                        </p>
                      </div>
                      <Badge variant="outline">{dest.type}</Badge>
                    </div>
                    {dest.activities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dest.activities.map((activity) => (
                          <Badge
                            key={activity}
                            variant="secondary"
                            className="text-xs"
                          >
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accommodation Summary */}
      {data.accommodation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Hotel className="h-5 w-5" />
              Accommodation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.accommodation.map((acc) => (
                <div key={acc.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{acc.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {acc.type}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(acc.checkIn, "MMM d")} -{" "}
                    {format(acc.checkOut, "MMM d")}
                    {acc.cost > 0 && ` • $${acc.cost}`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fun Completion Message */}
      {status.percentage === 100 && (
        <div className="text-center p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
          <Sparkles className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">
            🎉 Your {type === "band_tour" ? "Tour" : "Trip"} is Ready!
          </h3>
          <p className="text-muted-foreground">
            Everything looks great! You're all set for an amazing {duration}-day
            adventure with {data.partySize}{" "}
            {data.partySize === 1 ? "person" : "people"}
            visiting {data.destinations.length} incredible{" "}
            {data.destinations.length === 1 ? "destination" : "destinations"}.
          </p>
        </div>
      )}
    </div>
  );
};

export default TripSummary;
