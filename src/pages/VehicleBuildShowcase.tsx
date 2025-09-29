import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  Wrench,
  Car,
  Zap,
  Sun,
  Bed,
  Radio,
  Shield,
  Package,
  Thermometer,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  Hammer,
  Droplets,
  Fan,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface VehicleBuildPhase {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: "not_started" | "in_progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "critical";
  estimatedCost: number;
  actualCost?: number;
  estimatedDuration: string;
  actualDuration?: string;
  startDate?: Date;
  completedDate?: Date;
  tasks: VehicleBuildTask[];
  parts: VehiclePart[];
  photos?: string[];
  notes?: string;
}

interface VehicleBuildTask {
  id: string;
  name: string;
  completed: boolean;
  notes?: string;
  estimatedHours?: number;
  actualHours?: number;
}

interface VehiclePart {
  id: string;
  name: string;
  brand: string;
  model?: string;
  cost: number;
  quantity: number;
  vendor: string;
  purchaseDate?: Date;
  warrantyInfo?: string;
}

const VehicleBuildShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  // Vehicle build project data (would come from database in real implementation)
  const vehicleInfo = {
    make: "Isuzu",
    model: "NPR Step Van (Bread Truck)",
    year: 1995,
    type: "step_van" as const,
    mileage: 156000,
    purchaseDate: new Date("2024-01-15"),
    purchasePrice: 15500,
  };

  const [phases, setPhases] = useState<VehicleBuildPhase[]>([
    {
      id: "planning-assessment",
      name: "Planning & Assessment",
      description:
        "Initial planning, measurements, mechanical assessment, and design phase",
      icon: Wrench,
      status: "completed",
      priority: "critical",
      estimatedCost: 800,
      actualCost: 950,
      estimatedDuration: "3 weeks",
      actualDuration: "3 weeks",
      startDate: new Date("2024-01-20"),
      completedDate: new Date("2024-02-10"),
      tasks: [
        {
          id: "measure",
          name: "Measure interior dimensions (10ft x 7ft x 6.5ft)",
          completed: true,
          estimatedHours: 3,
          actualHours: 2,
        },
        {
          id: "research",
          name: "Research step van conversions",
          completed: true,
          estimatedHours: 8,
          actualHours: 12,
        },
        {
          id: "design",
          name: "Create floor plan and 3D model",
          completed: true,
          estimatedHours: 12,
          actualHours: 18,
        },
        {
          id: "inspection",
          name: "Mechanical inspection",
          completed: true,
          estimatedHours: 4,
          actualHours: 3,
        },
        {
          id: "budget",
          name: "Cost estimation and budgeting",
          completed: true,
          estimatedHours: 6,
          actualHours: 8,
        },
      ],
      parts: [
        {
          id: "tools",
          name: "Measuring tools and supplies",
          brand: "Various",
          cost: 85,
          quantity: 1,
          vendor: "Home Depot",
        },
        {
          id: "software",
          name: "SketchUp Pro License",
          brand: "Trimble",
          cost: 299,
          quantity: 1,
          vendor: "Trimble",
          warrantyInfo: "1 year",
        },
      ],
      notes:
        "Spent extra time researching - glad I did! Found great resources on Skoolie.net forums. The step van has tons of potential.",
    },
    {
      id: "mechanical-restoration",
      name: "Mechanical Restoration",
      description:
        "Engine work, transmission service, brakes, and mechanical systems",
      icon: Car,
      status: "completed",
      priority: "critical",
      estimatedCost: 3500,
      actualCost: 4200,
      estimatedDuration: "1 month",
      actualDuration: "5 weeks",
      startDate: new Date("2024-02-15"),
      completedDate: new Date("2024-03-20"),
      tasks: [
        {
          id: "oil",
          name: "Oil change and engine service",
          completed: true,
          estimatedHours: 4,
          actualHours: 3,
        },
        {
          id: "trans",
          name: "Transmission service",
          completed: true,
          estimatedHours: 6,
          actualHours: 8,
        },
        {
          id: "brakes",
          name: "Replace brake pads and rotors",
          completed: true,
          estimatedHours: 8,
          actualHours: 10,
        },
        {
          id: "tires",
          name: "New tires (6)",
          completed: true,
          estimatedHours: 3,
          actualHours: 4,
        },
        {
          id: "cooling",
          name: "Cooling system flush and repair",
          completed: true,
          estimatedHours: 6,
          actualHours: 12,
        },
        {
          id: "fuel",
          name: "Fuel system cleaning",
          completed: true,
          estimatedHours: 4,
          actualHours: 3,
        },
      ],
      parts: [
        {
          id: "oil",
          name: "Engine Oil and Filter",
          brand: "Mobil 1",
          model: "15W-40",
          cost: 65,
          quantity: 1,
          vendor: "AutoZone",
        },
        {
          id: "trans-fluid",
          name: "Transmission Fluid",
          brand: "Isuzu",
          model: "OEM ATF",
          cost: 120,
          quantity: 2,
          vendor: "Isuzu Dealer",
        },
        {
          id: "brakes",
          name: "Brake Pads and Rotors",
          brand: "Wagner",
          model: "ThermoQuiet",
          cost: 380,
          quantity: 1,
          vendor: "RockAuto",
          warrantyInfo: "2 years",
        },
        {
          id: "tires",
          name: "Commercial Truck Tires",
          brand: "Michelin",
          model: "XZE2+",
          cost: 1850,
          quantity: 6,
          vendor: "Discount Tire",
          warrantyInfo: "5 years",
        },
        {
          id: "hoses",
          name: "Radiator Hoses",
          brand: "Gates",
          model: "Upper/Lower Set",
          cost: 85,
          quantity: 1,
          vendor: "NAPA",
        },
      ],
      notes:
        "Transmission fluid was black - much better now! Had to replace more than expected but truck runs like a dream.",
    },
    {
      id: "electrical-system",
      name: "Electrical System",
      description: "12V house electrical system with solar charging capability",
      icon: Zap,
      status: "in_progress",
      priority: "critical",
      estimatedCost: 4000,
      actualCost: 2800,
      estimatedDuration: "3 weeks",
      startDate: new Date("2024-03-25"),
      tasks: [
        {
          id: "batteries",
          name: "Install house battery bank (300Ah LiFePO4)",
          completed: true,
          estimatedHours: 6,
          actualHours: 8,
        },
        {
          id: "inverter",
          name: "Install 2000W inverter/charger",
          completed: true,
          estimatedHours: 4,
          actualHours: 6,
        },
        {
          id: "wiring",
          name: "Run main 12V wiring harness",
          completed: true,
          estimatedHours: 12,
          actualHours: 15,
        },
        {
          id: "fuses",
          name: "Install DC fuse box and breakers",
          completed: false,
          estimatedHours: 4,
        },
        {
          id: "outlets",
          name: "Wire 12V outlets and USB charging",
          completed: false,
          estimatedHours: 6,
        },
        {
          id: "monitoring",
          name: "Install battery monitoring system",
          completed: false,
          estimatedHours: 3,
        },
        {
          id: "shore",
          name: "Install shore power connection",
          completed: false,
          estimatedHours: 4,
        },
      ],
      parts: [
        {
          id: "batteries",
          name: "LiFePO4 Battery Bank",
          brand: "Battle Born",
          model: "BB10012",
          cost: 3600,
          quantity: 3,
          vendor: "Battle Born",
          warrantyInfo: "8 years",
        },
        {
          id: "inverter",
          name: "2000W Inverter/Charger",
          brand: "Victron",
          model: "MultiPlus 12/2000/80",
          cost: 680,
          quantity: 1,
          vendor: "Amazon",
          warrantyInfo: "5 years",
        },
        {
          id: "wire",
          name: "Marine Grade Wiring",
          brand: "Ancor",
          model: "12AWG Tinned Copper",
          cost: 180,
          quantity: 3,
          vendor: "West Marine",
        },
        {
          id: "panel",
          name: "DC Electrical Panel",
          brand: "Blue Sea Systems",
          model: "SafetyHub 150",
          cost: 220,
          quantity: 1,
          vendor: "Blue Sea Direct",
          warrantyInfo: "2 years",
        },
      ],
      notes:
        "Battle Born batteries are expensive but worth every penny. Victron components are bulletproof.",
    },
    {
      id: "solar-system",
      name: "Solar Power System",
      description: "600W solar array with MPPT charge controller",
      icon: Sun,
      status: "not_started",
      priority: "high",
      estimatedCost: 2500,
      estimatedDuration: "1 week",
      tasks: [
        {
          id: "panels",
          name: "Install 3x 200W solar panels on roof",
          completed: false,
          estimatedHours: 8,
        },
        {
          id: "controller",
          name: "Install MPPT charge controller",
          completed: false,
          estimatedHours: 4,
        },
        {
          id: "solar-wiring",
          name: "Run wiring from panels to controller",
          completed: false,
          estimatedHours: 6,
        },
        {
          id: "test",
          name: "Test and optimize solar charging",
          completed: false,
          estimatedHours: 2,
        },
      ],
      parts: [
        {
          id: "panels",
          name: "Monocrystalline Solar Panels",
          brand: "Renogy",
          model: "200W Mono",
          cost: 180,
          quantity: 3,
          vendor: "Renogy",
          warrantyInfo: "25 years",
        },
        {
          id: "controller",
          name: "MPPT Charge Controller",
          brand: "Victron",
          model: "SmartSolar 100/30",
          cost: 220,
          quantity: 1,
          vendor: "Amazon",
          warrantyInfo: "5 years",
        },
        {
          id: "cables",
          name: "MC4 Cables and Connectors",
          brand: "Renogy",
          cost: 80,
          quantity: 1,
          vendor: "Renogy",
        },
        {
          id: "mounting",
          name: "Solar Panel Mounting Hardware",
          brand: "Renogy",
          cost: 150,
          quantity: 1,
          vendor: "Renogy",
        },
      ],
    },
    {
      id: "insulation-interior",
      name: "Insulation & Interior Frame",
      description: "Insulate cargo area and build interior framework",
      icon: Thermometer,
      status: "not_started",
      priority: "high",
      estimatedCost: 1800,
      estimatedDuration: "2 weeks",
      tasks: [
        {
          id: "floor-insulation",
          name: "Install floor insulation and subfloor",
          completed: false,
          estimatedHours: 12,
        },
        {
          id: "wall-insulation",
          name: "Install wall and ceiling insulation",
          completed: false,
          estimatedHours: 16,
        },
        {
          id: "vapor-barrier",
          name: "Install vapor barrier",
          completed: false,
          estimatedHours: 8,
        },
        {
          id: "framing",
          name: "Build interior wall framing",
          completed: false,
          estimatedHours: 20,
        },
        {
          id: "paneling",
          name: "Install wall paneling",
          completed: false,
          estimatedHours: 16,
        },
      ],
      parts: [],
    },
    {
      id: "workshop-area",
      name: "Workshop Area",
      description: "Build out maker space with workbench and tool storage",
      icon: Hammer,
      status: "not_started",
      priority: "medium",
      estimatedCost: 2200,
      estimatedDuration: "2 weeks",
      tasks: [
        {
          id: "workbench",
          name: "Build heavy-duty workbench",
          completed: false,
          estimatedHours: 16,
        },
        {
          id: "tool-storage",
          name: "Install tool storage cabinets",
          completed: false,
          estimatedHours: 12,
        },
        {
          id: "power-tools",
          name: "Mount power tool charging station",
          completed: false,
          estimatedHours: 6,
        },
        {
          id: "air-compressor",
          name: "Install compact air compressor",
          completed: false,
          estimatedHours: 4,
        },
        {
          id: "ventilation",
          name: "Install workshop ventilation fan",
          completed: false,
          estimatedHours: 4,
        },
      ],
      parts: [],
    },
    {
      id: "living-space",
      name: "Living Space",
      description: "Sleeping area, kitchenette, and storage solutions",
      icon: Bed,
      status: "not_started",
      priority: "medium",
      estimatedCost: 1800,
      estimatedDuration: "1.5 weeks",
      tasks: [
        {
          id: "bed",
          name: "Build convertible bed/seating area",
          completed: false,
          estimatedHours: 12,
        },
        {
          id: "kitchen",
          name: "Install compact kitchenette",
          completed: false,
          estimatedHours: 10,
        },
        {
          id: "storage",
          name: "Build storage cabinets and cubbies",
          completed: false,
          estimatedHours: 16,
        },
        {
          id: "lighting",
          name: "Install LED lighting throughout",
          completed: false,
          estimatedHours: 6,
        },
      ],
      parts: [],
    },
    {
      id: "water-plumbing",
      name: "Water & Plumbing",
      description: "Fresh water tank, gray water, and plumbing connections",
      icon: Droplets,
      status: "not_started",
      priority: "medium",
      estimatedCost: 800,
      estimatedDuration: "1 week",
      tasks: [
        {
          id: "fresh-tank",
          name: "Install 20-gallon fresh water tank",
          completed: false,
          estimatedHours: 6,
        },
        {
          id: "gray-tank",
          name: "Install gray water collection system",
          completed: false,
          estimatedHours: 6,
        },
        {
          id: "pump",
          name: "Install 12V water pump",
          completed: false,
          estimatedHours: 4,
        },
        {
          id: "sink",
          name: "Install compact sink with foot pump",
          completed: false,
          estimatedHours: 4,
        },
      ],
      parts: [],
    },
    {
      id: "climate-control",
      name: "Climate Control",
      description: "Ventilation fan and heating system for year-round use",
      icon: Fan,
      status: "not_started",
      priority: "low",
      estimatedCost: 600,
      estimatedDuration: "2 days",
      tasks: [
        {
          id: "roof-fan",
          name: "Install MaxxFan roof ventilator",
          completed: false,
          estimatedHours: 4,
        },
        {
          id: "heater",
          name: "Install diesel air heater (Espar/Webasto)",
          completed: false,
          estimatedHours: 8,
        },
        {
          id: "ducting",
          name: "Install heating ducting",
          completed: false,
          estimatedHours: 4,
        },
      ],
      parts: [],
    },
    {
      id: "exterior-security",
      name: "Exterior & Security",
      description: "Exterior storage, awning, and security systems",
      icon: Shield,
      status: "not_started",
      priority: "low",
      estimatedCost: 1200,
      estimatedDuration: "1 week",
      tasks: [
        {
          id: "rear-box",
          name: "Build rear storage box",
          completed: false,
          estimatedHours: 12,
        },
        {
          id: "awning",
          name: "Install retractable awning",
          completed: false,
          estimatedHours: 6,
        },
        {
          id: "security",
          name: "Install security system and cameras",
          completed: false,
          estimatedHours: 8,
        },
        {
          id: "exterior-power",
          name: "Install exterior power outlet",
          completed: false,
          estimatedHours: 3,
        },
      ],
      parts: [],
    },
  ]);

  const getStatusColor = (status: VehicleBuildPhase["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: VehicleBuildPhase["status"]) => {
    switch (status) {
      case "completed":
        return CheckCircle2;
      case "in_progress":
        return Clock;
      case "blocked":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getPriorityColor = (priority: VehicleBuildPhase["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateOverallProgress = () => {
    if (phases.length === 0) return 0;
    const completedPhases = phases.filter(
      (p) => p.status === "completed",
    ).length;
    return Math.round((completedPhases / phases.length) * 100);
  };

  const calculateTotalBudget = () => {
    return phases.reduce((total, phase) => total + phase.estimatedCost, 0);
  };

  const calculateActualSpend = () => {
    return phases.reduce((total, phase) => total + (phase.actualCost || 0), 0);
  };

  const handleTaskToggle = (phaseId: string, taskId: string) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id === phaseId) {
          return {
            ...phase,
            tasks: phase.tasks.map((task) =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task,
            ),
          };
        }
        return phase;
      }),
    );
  };

  const completedPhases = phases.filter((p) => p.status === "completed").length;
  const totalPhases = phases.length;
  const overallProgress = Math.round((completedPhases / totalPhases) * 100);

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/projects")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Github className="h-4 w-4 mr-2" />
              Build Log
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Photos
            </Button>
          </div>
        </div>

        {/* Project Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">
                  Bread Truck Conversion Project
                </CardTitle>
                <p className="text-lg text-muted-foreground mb-4">
                  Converting a 1995 Isuzu NPR step van into a mobile maker space
                  and tiny home
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Hardware Project</Badge>
                  <Badge variant="secondary">Vehicle Build</Badge>
                  <Badge variant="secondary">Electrical Systems</Badge>
                  <Badge variant="secondary">Maker Space</Badge>
                  <Badge variant="secondary">Mobile Living</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary mb-1">
                  {overallProgress}%
                </div>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Timeline</p>
                  <p className="text-sm text-muted-foreground">
                    Jan 2024 - Present
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">Portland, OR</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Team Size</p>
                  <p className="text-sm text-muted-foreground">Solo Project</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Wrench className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </div>
            <Progress value={overallProgress} className="mb-4" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {completedPhases} of {totalPhases} phases completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg">
                  <Car className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Step Van Build • {vehicleInfo.mileage.toLocaleString()}{" "}
                    miles
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">
                  ${vehicleInfo.purchasePrice.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Purchase Price</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                ${calculateTotalBudget().toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Estimated Budget</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                ${calculateActualSpend().toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Actual Spend</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {phases.filter((p) => p.status === "completed").length}
              </div>
              <p className="text-sm text-muted-foreground">Phases Complete</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {phases.filter((p) => p.status === "in_progress").length}
              </div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Project Description */}
        <Card>
          <CardHeader>
            <CardTitle>About This Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This project involves the complete conversion of a 1995 Isuzu NPR
              step van (bread truck) into a mobile maker space and tiny home.
              The unique high-cube design provides 70 square feet of floor space
              with 6.5 feet of standing height, perfect for both living and
              working.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 600W solar power system with 900Wh battery bank</li>
                  <li>• Full workshop with heavy-duty workbench</li>
                  <li>• Compact living area with convertible bed/seating</li>
                  <li>• Fresh water system with gray water collection</li>
                  <li>• Climate control with ventilation and heating</li>
                  <li>• Exterior storage and security systems</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technologies & Skills:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 12V DC electrical systems design</li>
                  <li>• Solar power system configuration</li>
                  <li>• Custom metalworking and welding</li>
                  <li>• Plumbing and water system design</li>
                  <li>• Automotive mechanical restoration</li>
                  <li>• Project management and budgeting</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 dark:bg-orange-950/20 p-4 rounded-r">
              <p className="text-sm">
                <strong>Why a bread truck?</strong> Step vans offer incredible
                interior volume compared to traditional vans, with the high cube
                design providing full standing height throughout. The
                commercial-grade chassis and engine are built for heavy loads
                and frequent stops - perfect for a mobile workshop loaded with
                tools and materials.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Phases Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase) => {
            const StatusIcon = getStatusIcon(phase.status);
            const Icon = phase.icon;
            const completedTasks = phase.tasks.filter(
              (t) => t.completed,
            ).length;
            const taskProgress =
              phase.tasks.length > 0
                ? Math.round((completedTasks / phase.tasks.length) * 100)
                : 0;

            return (
              <Card
                key={phase.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  selectedPhase === phase.id && "ring-2 ring-primary",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {phase.name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(phase.priority)}
                        >
                          {phase.priority}
                        </Badge>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        getStatusColor(phase.status),
                      )}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {phase.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Tasks: {completedTasks}/{phase.tasks.length}
                      </span>
                      <span>{taskProgress}%</span>
                    </div>
                    <Progress value={taskProgress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                    <span>${phase.estimatedCost.toLocaleString()}</span>
                    <span>{phase.estimatedDuration}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-1">
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-sm capitalize">
                        {phase.status.replace("_", " ")}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSelectedPhase(
                          selectedPhase === phase.id ? null : phase.id,
                        )
                      }
                    >
                      {selectedPhase === phase.id ? "Collapse" : "Expand"}
                    </Button>
                  </div>

                  {/* Expanded Phase Details */}
                  {selectedPhase === phase.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Tasks</h4>
                        <div className="space-y-2">
                          {phase.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center space-x-3 p-2 bg-muted/30 rounded-lg text-sm"
                            >
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() =>
                                  handleTaskToggle(phase.id, task.id)
                                }
                              />
                              <div className="flex-1">
                                <p
                                  className={cn(
                                    "font-medium",
                                    task.completed &&
                                      "line-through text-muted-foreground",
                                  )}
                                >
                                  {task.name}
                                </p>
                                {task.notes && (
                                  <p className="text-xs text-muted-foreground">
                                    {task.notes}
                                  </p>
                                )}
                              </div>
                              {task.estimatedHours && (
                                <Badge variant="outline" className="text-xs">
                                  {task.actualHours || task.estimatedHours}h
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {phase.parts && phase.parts.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Key Parts</h4>
                          <div className="space-y-2">
                            {phase.parts.slice(0, 3).map((part) => (
                              <div
                                key={part.id}
                                className="p-2 border rounded-lg text-sm"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{part.name}</p>
                                    <p className="text-muted-foreground">
                                      {part.brand} {part.model}
                                    </p>
                                  </div>
                                  <Badge variant="outline">
                                    $
                                    {(
                                      part.cost * part.quantity
                                    ).toLocaleString()}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {phase.notes && (
                        <div>
                          <h4 className="font-medium mb-2">Notes</h4>
                          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                            {phase.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Timeline View */}
        <Card>
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div key={phase.id} className="flex items-center space-x-4">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex-shrink-0",
                      phase.status === "completed"
                        ? "bg-green-500 border-green-500"
                        : phase.status === "in_progress"
                          ? "bg-blue-500 border-blue-500"
                          : "bg-gray-200 border-gray-300",
                    )}
                  />
                  {index < phases.length - 1 && (
                    <div className="absolute left-6 top-8 w-0.5 h-16 bg-gray-200 -z-10" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <phase.icon className="h-4 w-4" />
                      <p className="font-medium">{phase.name}</p>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(phase.priority)}
                      >
                        {phase.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {phase.estimatedDuration} • $
                      {phase.estimatedCost.toLocaleString()}
                      {phase.actualCost &&
                        ` (actual: $${phase.actualCost.toLocaleString()})`}
                    </p>
                    {phase.startDate && (
                      <p className="text-xs text-muted-foreground">
                        Started: {phase.startDate.toLocaleDateString()}
                        {phase.completedDate &&
                          ` • Completed: ${phase.completedDate.toLocaleDateString()}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Challenges & What's Next */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Why a Bread Truck?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border-l-4 border-blue-300 bg-blue-50 dark:bg-blue-950/20">
                <h5 className="font-medium">Incredible Interior Volume</h5>
                <p className="text-sm text-muted-foreground">
                  70 sq ft with 6.5ft height vs ~35 sq ft in a van conversion
                </p>
              </div>
              <div className="p-3 border-l-4 border-green-300 bg-green-50 dark:bg-green-950/20">
                <h5 className="font-medium">Commercial Grade</h5>
                <p className="text-sm text-muted-foreground">
                  Built for heavy loads and frequent stops - perfect for a
                  mobile workshop
                </p>
              </div>
              <div className="p-3 border-l-4 border-purple-300 bg-purple-50 dark:bg-purple-950/20">
                <h5 className="font-medium">Unique Factor</h5>
                <p className="text-sm text-muted-foreground">
                  Step vans turn heads and start conversations everywhere they
                  go
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What's Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  Currently finishing the electrical system, then moving on to
                  solar installation and interior buildout.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                      Next Up
                    </h4>
                    <p className="text-sm mt-1">
                      Complete electrical system and install solar panels
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 text-sm">
                      This Summer
                    </h4>
                    <p className="text-sm mt-1">
                      Insulation and interior framework construction
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-semibold text-green-700 dark:text-green-300 text-sm">
                      Goal
                    </h4>
                    <p className="text-sm mt-1">
                      First road trip and mobile workshop test by fall 2024
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleBuildShowcase;
