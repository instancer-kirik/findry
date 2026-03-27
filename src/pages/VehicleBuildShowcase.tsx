import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import LayoutConfigurator from "@/components/vehicle-build/LayoutConfigurator";
import SystemsConfigurator from "@/components/vehicle-build/SystemsConfigurator";
import SchematicsCanvas from "@/components/vehicle-build/SchematicsCanvas";
import { sampleVehicleBuild } from "@/data/sampleVehicleBuild";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  Wrench,
  Car,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const VehicleBuildShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const { vehicleInfo } = sampleVehicleBuild;

  // Map sampleVehicleBuild phases into local state so tasks can be toggled
  const [phases, setPhases] = useState(() =>
    sampleVehicleBuild.phases.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      icon: p.icon,
      status: p.status as "not_started" | "in_progress" | "completed" | "blocked",
      priority: p.priority as "low" | "medium" | "high" | "critical",
      estimatedCost: p.estimatedCost,
      actualCost: (p as any).actualCost as number | undefined,
      estimatedDuration: p.estimatedDuration,
      actualDuration: (p as any).actualDuration as string | undefined,
      startDate: (p as any).startDate as Date | undefined,
      completedDate: (p as any).completedDate as Date | undefined,
      tasks: p.tasks.map((t) => ({
        id: t.id,
        name: t.name,
        completed: t.completed,
        estimatedHours: t.estimatedHours,
        actualHours: (t as any).actualHours as number | undefined,
        notes: undefined as string | undefined,
      })),
      parts: (p.partsList || []).map((pt: any) => ({
        id: pt.id,
        name: pt.name,
        brand: pt.brand,
        model: pt.model,
        cost: pt.cost,
        quantity: pt.quantity,
        vendor: pt.vendor,
        warrantyInfo: pt.warrantyInfo,
      })),
      notes: (p as any).notes as string | undefined,
    })),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in_progress": return "bg-blue-500";
      case "blocked": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle2;
      case "in_progress": return Clock;
      case "blocked": return AlertCircle;
      default: return Clock;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateTotalBudget = () =>
    phases.reduce((t, p) => t + p.estimatedCost, 0);

  const calculateActualSpend = () =>
    phases.reduce((t, p) => t + (p.actualCost || 0), 0);

  const handleTaskToggle = (phaseId: string, taskId: string) => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              tasks: phase.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task,
              ),
            }
          : phase,
      ),
    );
  };

  const completedPhases = phases.filter((p) => p.status === "completed").length;
  const totalPhases = phases.length;
  const totalTasks = phases.reduce((s, p) => s + p.tasks.length, 0);
  const completedTasks = phases.reduce(
    (s, p) => s + p.tasks.filter((t) => t.completed).length,
    0,
  );
  const overallProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/projects")} className="mb-4">
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

        {/* Project Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">
                  Step Van Conversion Project
                </CardTitle>
                <p className="text-lg text-muted-foreground mb-4">
                  Converting a {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} into a mobile maker space and tiny home
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Hardware Project</Badge>
                  <Badge variant="secondary">Vehicle Build</Badge>
                  <Badge variant="secondary">Custom Fabrication</Badge>
                  <Badge variant="secondary">Maker Space</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary mb-1">{overallProgress}%</div>
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
                  <p className="text-sm text-muted-foreground">Jan 2024 – Present</p>
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
            <p className="text-center text-sm text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed across {totalPhases} phases
            </p>
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
                    Step Van Build
                    {vehicleInfo.mileage ? ` • ${vehicleInfo.mileage.toLocaleString()} miles` : " • Mileage TBD"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">${vehicleInfo.purchasePrice.toLocaleString()}</div>
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
              <div className="text-2xl font-bold">${calculateTotalBudget().toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Estimated Budget</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">${calculateActualSpend().toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Actual Spend</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{completedPhases}</div>
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

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About This Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This project involves the conversion of a {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} into a mobile maker space and tiny home.
              Purchased for ${vehicleInfo.purchasePrice.toLocaleString()}, the truck needs frame repair, new fuel and brake lines, and a driveshaft replacement before any build-out begins.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 800W solar power system with lithium battery bank</li>
                  <li>• Workshop / maker space area</li>
                  <li>• Compact living area with convertible bed</li>
                  <li>• Fresh water system with gray water collection</li>
                  <li>• Climate control with ventilation and heating</li>
                  <li>• Starlink + cellular booster connectivity</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technologies & Skills:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 12V DC electrical systems design</li>
                  <li>• Solar power system configuration</li>
                  <li>• Custom metalworking and welding</li>
                  <li>• Chassis repair and drivetrain work</li>
                  <li>• Plumbing and water system design</li>
                  <li>• Custom fabrication (visor, roof rack)</li>
                </ul>
              </div>
            </div>
            <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 dark:bg-orange-950/20 p-4 rounded-r">
              <p className="text-sm">
                <strong>Why a step van?</strong> Step vans offer incredible interior volume
                with full standing height throughout. The commercial-grade P30 chassis is built
                for heavy loads — perfect for a mobile workshop. At $1,500 it's a project truck
                that needs love, but the bones are solid.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configurator Tabs */}
        <Tabs defaultValue="build-log" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="systems">Systems</TabsTrigger>
            <TabsTrigger value="schematics">Schematics</TabsTrigger>
            <TabsTrigger value="build-log">Build Log</TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="mt-6">
            <LayoutConfigurator />
          </TabsContent>

          <TabsContent value="systems" className="mt-6">
            <SystemsConfigurator />
          </TabsContent>

          <TabsContent value="schematics" className="mt-6">
            <SchematicsCanvas />
          </TabsContent>

          <TabsContent value="build-log" className="mt-6 space-y-8">
            {/* Phase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phases.map((phase) => {
                const StatusIcon = getStatusIcon(phase.status);
                const Icon = phase.icon;
                const done = phase.tasks.filter((t) => t.completed).length;
                const taskProgress =
                  phase.tasks.length > 0 ? Math.round((done / phase.tasks.length) * 100) : 0;

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
                          <div className="p-2 bg-muted rounded-lg">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium">{phase.name}</CardTitle>
                            <Badge variant="outline" className={getPriorityColor(phase.priority)}>
                              {phase.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className={cn("w-3 h-3 rounded-full", getStatusColor(phase.status))} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {phase.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tasks: {done}/{phase.tasks.length}</span>
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
                          <span className="text-sm capitalize">{phase.status.replace("_", " ")}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedPhase(selectedPhase === phase.id ? null : phase.id)
                          }
                        >
                          {selectedPhase === phase.id ? "Collapse" : "Expand"}
                        </Button>
                      </div>

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
                                    onCheckedChange={() => handleTaskToggle(phase.id, task.id)}
                                  />
                                  <div className="flex-1">
                                    <p
                                      className={cn(
                                        "font-medium",
                                        task.completed && "line-through text-muted-foreground",
                                      )}
                                    >
                                      {task.name}
                                    </p>
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

                          {phase.parts.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Key Parts</h4>
                              <div className="space-y-2">
                                {phase.parts.slice(0, 5).map((part) => (
                                  <div key={part.id} className="p-2 border rounded-lg text-sm">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium">{part.name}</p>
                                        <p className="text-muted-foreground">
                                          {part.brand} {part.model || ""}
                                        </p>
                                      </div>
                                      <Badge variant="outline">
                                        ${(part.cost * part.quantity).toLocaleString()}
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
                  {phases.map((phase) => (
                    <div key={phase.id} className="flex items-start space-x-4">
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1",
                          phase.status === "completed"
                            ? "bg-green-500 border-green-500"
                            : phase.status === "in_progress"
                              ? "bg-blue-500 border-blue-500"
                              : "bg-gray-200 border-gray-300",
                        )}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <phase.icon className="h-4 w-4" />
                          <p className="font-medium">{phase.name}</p>
                          <Badge variant="outline" className={getPriorityColor(phase.priority)}>
                            {phase.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {phase.estimatedDuration} • ${phase.estimatedCost.toLocaleString()}
                          {phase.actualCost && ` (actual: $${phase.actualCost.toLocaleString()})`}
                        </p>
                        {phase.startDate && (
                          <p className="text-xs text-muted-foreground">
                            Started: {phase.startDate.toLocaleDateString()}
                            {phase.completedDate && ` • Completed: ${phase.completedDate.toLocaleDateString()}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Why / What's Next */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Why a Step Van?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border-l-4 border-blue-300 bg-blue-50 dark:bg-blue-950/20">
                    <h5 className="font-medium">Incredible Interior Volume</h5>
                    <p className="text-sm text-muted-foreground">
                      Full standing height and huge floor area vs a typical van conversion
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-green-300 bg-green-50 dark:bg-green-950/20">
                    <h5 className="font-medium">Commercial Grade Chassis</h5>
                    <p className="text-sm text-muted-foreground">
                      P30 chassis built for heavy loads — perfect for a mobile workshop
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-orange-300 bg-orange-50 dark:bg-orange-950/20">
                    <h5 className="font-medium">Budget Entry Point</h5>
                    <p className="text-sm text-muted-foreground">
                      $1,500 purchase price leaves budget for the build itself
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
                      Currently tackling mechanical repairs — frame, fuel lines, brake lines, and driveshaft — before any build-out begins.
                    </p>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <h4 className="font-semibold text-red-700 dark:text-red-300 text-sm">Critical</h4>
                        <p className="text-sm mt-1">Complete frame repair and drivetrain fixes</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">Next Up</h4>
                        <p className="text-sm mt-1">Finish electrical system and install solar panels</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <h4 className="font-semibold text-green-700 dark:text-green-300 text-sm">Goal</h4>
                        <p className="text-sm mt-1">Insulation, interior buildout, and first road test</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VehicleBuildShowcase;
