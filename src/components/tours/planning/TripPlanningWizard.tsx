import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Car,
  DollarSign,
  Calendar,
  Users,
  Music,
  Camera,
  Fuel,
  Home,
  Tent,
  Hotel,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Star,
  Coffee,
  Utensils,
  Mountain,
  Waves,
  Trees,
  Building,
} from "lucide-react";
import TripBasicsStep from "./TripBasicsStep";
import VehicleSelectionStep from "./VehicleSelectionStep";
import BudgetPlanningStep from "./BudgetPlanningStep";
import DestinationsStep from "./DestinationsStep";
import AccommodationStep from "./AccommodationStep";
import TripSummary from "./TripSummary";
import { TripPlanData } from "@/types/tour-planning";

interface TripPlanningWizardProps {
  type: "band_tour" | "roadtrip";
  onComplete: (data: TripPlanData) => void;
  onCancel: () => void;
}

const TripPlanningWizard: React.FC<TripPlanningWizardProps> = ({
  type,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tripData, setTripData] = useState<Partial<TripPlanData>>({
    type,
    vehicle: undefined,
    budget: {
      total: 0,
      fuel: 0,
      accommodation: 0,
      food: 0,
      activities: 0,
      emergency: 0,
    },
    destinations: [],
    accommodation: [],
    partySize: 1,
    interests: [],
  });

  const steps = [
    {
      id: "basics",
      title: "Trip Basics",
      icon: Sparkles,
      description: "Let's start with the essentials",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "vehicle",
      title: "Choose Your Ride",
      icon: Car,
      description: "Select the perfect vehicle for your adventure",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "budget",
      title: "Budget Planning",
      icon: DollarSign,
      description: "Plan your finances wisely",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "destinations",
      title: "Destinations",
      icon: MapPin,
      description: "Where will your journey take you?",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "accommodation",
      title: "Where to Stay",
      icon: Home,
      description: "Plan your rest stops",
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "summary",
      title: "Review & Launch",
      icon: Star,
      description: "Review your amazing trip plan",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(tripData as TripPlanData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateTripData = (data: Partial<TripPlanData>) => {
    setTripData((prev) => ({ ...prev, ...data }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-full bg-gradient-to-r ${steps[currentStep].color} text-white`}
            >
              <CurrentStepIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {type === "band_tour" ? "🎸 Band Tour" : "🚗 Road Trip"} Planner
              </h2>
              <p className="text-muted-foreground">
                Step {currentStep + 1} of {steps.length}:{" "}
                {steps[currentStep].title}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => index <= currentStep && setCurrentStep(index)}
                className={`flex flex-col items-center space-y-1 cursor-pointer transition-all ${
                  index <= currentStep ? "opacity-100" : "opacity-40"
                }`}
                disabled={index > currentStep}
              >
                <div
                  className={`p-2 rounded-full ${
                    index === currentStep
                      ? `bg-gradient-to-r ${step.color} text-white`
                      : index < currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                <span className="text-xs hidden sm:block">{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2">
            <CardHeader
              className={`bg-gradient-to-r ${steps[currentStep].color} text-white`}
            >
              <CardTitle className="flex items-center space-x-2">
                <CurrentStepIcon className="h-5 w-5" />
                <span>{steps[currentStep].title}</span>
              </CardTitle>
              <CardDescription className="text-white/90">
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {currentStep === 0 && (
                <TripBasicsStep
                  type={type}
                  data={tripData}
                  onUpdate={updateTripData}
                />
              )}
              {currentStep === 1 && (
                <VehicleSelectionStep
                  type={type}
                  data={tripData}
                  onUpdate={updateTripData}
                />
              )}
              {currentStep === 2 && (
                <BudgetPlanningStep
                  type={type}
                  data={tripData}
                  onUpdate={updateTripData}
                />
              )}
              {currentStep === 3 && (
                <DestinationsStep
                  type={type}
                  data={tripData}
                  onUpdate={updateTripData}
                />
              )}
              {currentStep === 4 && (
                <AccommodationStep
                  type={type}
                  data={tripData}
                  onUpdate={updateTripData}
                />
              )}
              {currentStep === 5 && (
                <TripSummary type={type} data={tripData as TripPlanData} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2">
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Sparkles className="h-4 w-4" />
              <span>Create {type === "band_tour" ? "Tour" : "Trip"}</span>
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Fun motivational messages */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground italic">
          {currentStep === 0 &&
            "✨ Every great adventure starts with a single step!"}
          {currentStep === 1 &&
            "🚗 The journey is just as important as the destination!"}
          {currentStep === 2 &&
            "💰 Smart planning today, worry-free travels tomorrow!"}
          {currentStep === 3 && "🗺️ The world is your playground!"}
          {currentStep === 4 && "🏡 Rest well, adventure hard!"}
          {currentStep === 5 && "🎉 Your epic journey awaits!"}
        </p>
      </div>
    </div>
  );
};

export default TripPlanningWizard;
