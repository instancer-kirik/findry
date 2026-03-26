import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Zap, Sun, Droplets, Fan, Shield, Thermometer, Radio, Battery,
  DollarSign, Weight, Gauge, CheckCircle2, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  enabled: boolean;
  tier: number; // 0=off, 1=basic, 2=mid, 3=premium
  tierLabels: string[];
  baseCost: number[];
  powerDraw: number[]; // watts
  weight: number[]; // lbs
  description: string;
  notes: string;
}

const DEFAULT_SYSTEMS: SystemConfig[] = [
  {
    id: "electrical",
    name: "Electrical / Battery",
    icon: Zap,
    enabled: true,
    tier: 2,
    tierLabels: ["Off", "100Ah AGM", "300Ah LiFePO4", "600Ah LiFePO4"],
    baseCost: [0, 400, 2400, 4800],
    powerDraw: [0, 0, 0, 0],
    weight: [0, 65, 84, 168],
    description: "House battery bank for 12V systems",
    notes: "LiFePO4 recommended for cycle life and weight savings",
  },
  {
    id: "solar",
    name: "Solar Array",
    icon: Sun,
    enabled: true,
    tier: 1,
    tierLabels: ["Off", "200W (1 panel)", "400W (2 panels)", "800W (4 panels)"],
    baseCost: [0, 350, 650, 1200],
    powerDraw: [0, -200, -400, -800], // negative = generation
    weight: [0, 25, 50, 100],
    description: "Rooftop solar charging system",
    notes: "Rule of thumb: 200W per 100Ah of battery",
  },
  {
    id: "water",
    name: "Fresh Water",
    icon: Droplets,
    enabled: true,
    tier: 1,
    tierLabels: ["Off", "10 gal portable", "25 gal fixed", "50 gal + pump"],
    baseCost: [0, 80, 350, 700],
    powerDraw: [0, 0, 30, 60],
    weight: [0, 85, 215, 425],
    description: "Fresh water storage and delivery",
    notes: "Water weighs ~8.3 lbs/gal — plan accordingly",
  },
  {
    id: "climate",
    name: "Climate Control",
    icon: Fan,
    enabled: false,
    tier: 0,
    tierLabels: ["Off", "Roof fan only", "Fan + diesel heater", "Fan + heater + AC"],
    baseCost: [0, 300, 550, 2200],
    powerDraw: [0, 40, 80, 1500],
    weight: [0, 12, 30, 85],
    description: "Heating, cooling, and ventilation",
    notes: "AC requires significant battery capacity",
  },
  {
    id: "comms",
    name: "Communication",
    icon: Radio,
    enabled: false,
    tier: 0,
    tierLabels: ["Off", "Cell booster", "Booster + WiFi router", "+ Starlink"],
    baseCost: [0, 400, 1000, 1600],
    powerDraw: [0, 20, 50, 100],
    weight: [0, 5, 10, 18],
    description: "Internet and cellular connectivity",
    notes: "Starlink draws ~75W average",
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    enabled: false,
    tier: 0,
    tierLabels: ["Off", "Basic alarm", "Alarm + cameras", "Full system + GPS"],
    baseCost: [0, 150, 400, 800],
    powerDraw: [0, 5, 25, 40],
    weight: [0, 2, 8, 12],
    description: "Security and monitoring systems",
    notes: "GPS tracker is great for peace of mind",
  },
];

const SystemsConfigurator: React.FC = () => {
  const [systems, setSystems] = useState<SystemConfig[]>(DEFAULT_SYSTEMS);

  const toggleSystem = (id: string) => {
    setSystems((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, enabled: !s.enabled, tier: !s.enabled ? 1 : 0 }
          : s
      )
    );
  };

  const setTier = (id: string, tier: number) => {
    setSystems((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, tier, enabled: tier > 0 }
          : s
      )
    );
  };

  const totalCost = systems.reduce((sum, s) => sum + s.baseCost[s.tier], 0);
  const totalWeight = systems.reduce((sum, s) => sum + s.weight[s.tier], 0);
  const totalPowerDraw = systems.reduce((sum, s) => sum + (s.powerDraw[s.tier] > 0 ? s.powerDraw[s.tier] : 0), 0);
  const totalGeneration = systems.reduce((sum, s) => sum + (s.powerDraw[s.tier] < 0 ? Math.abs(s.powerDraw[s.tier]) : 0), 0);
  const powerBalance = totalGeneration - totalPowerDraw;
  const enabledCount = systems.filter((s) => s.enabled).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Total Cost</p>
                <p className="text-lg font-bold">${totalCost.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Added Weight</p>
                <p className="text-lg font-bold">{totalWeight} lbs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Power Draw</p>
                <p className="text-lg font-bold">{totalPowerDraw}W</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              {powerBalance >= 0 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Power Balance</p>
                <p className={cn("text-lg font-bold", powerBalance >= 0 ? "text-green-600" : "text-destructive")}>
                  {powerBalance >= 0 ? "+" : ""}{powerBalance}W
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((system) => {
          const Icon = system.icon;
          return (
            <Card
              key={system.id}
              className={cn(
                "transition-all",
                !system.enabled && "opacity-60"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{system.name}</CardTitle>
                  </div>
                  <Switch
                    checked={system.enabled}
                    onCheckedChange={() => toggleSystem(system.id)}
                  />
                </div>
                <CardDescription className="text-xs">{system.description}</CardDescription>
              </CardHeader>
              {system.enabled && (
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Tier</span>
                      <Badge variant="outline" className="text-xs h-5">
                        {system.tierLabels[system.tier]}
                      </Badge>
                    </div>
                    <Slider
                      min={1}
                      max={system.tierLabels.length - 1}
                      step={1}
                      value={[system.tier]}
                      onValueChange={([v]) => setTier(system.id, v)}
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      {system.tierLabels.slice(1).map((l, i) => (
                        <span key={i} className="truncate max-w-[80px]">{l.split(" ")[0]}</span>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Cost</p>
                      <p className="font-medium">${system.baseCost[system.tier].toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Weight</p>
                      <p className="font-medium">{system.weight[system.tier]} lbs</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Power</p>
                      <p className={cn("font-medium", system.powerDraw[system.tier] < 0 && "text-green-600")}>
                        {system.powerDraw[system.tier] < 0 ? `+${Math.abs(system.powerDraw[system.tier])}` : system.powerDraw[system.tier]}W
                      </p>
                    </div>
                  </div>
                  {system.notes && (
                    <p className="text-[11px] text-muted-foreground italic">💡 {system.notes}</p>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SystemsConfigurator;
