import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Droplets, Sun, Thermometer, ZoomIn, ZoomOut } from "lucide-react";

interface SchematicNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  details?: string;
}

interface SchematicConnection {
  from: string;
  to: string;
  label?: string;
  color: string;
  gauge?: string;
}

const ELECTRICAL_NODES: SchematicNode[] = [
  { id: "solar", label: "Solar Panels\n600–800W", x: 300, y: 20, width: 140, height: 50, color: "hsl(45 90% 50%)" },
  { id: "mppt", label: "MPPT\nController", x: 330, y: 100, width: 80, height: 50, color: "hsl(45 70% 40%)" },
  { id: "battery", label: "Battery Bank\n300Ah LiFePO4", x: 280, y: 190, width: 160, height: 60, color: "hsl(30 90% 50%)" },
  { id: "bms", label: "BMS", x: 200, y: 200, width: 60, height: 40, color: "hsl(30 60% 40%)" },
  { id: "fuse-box", label: "DC Fuse Box", x: 180, y: 290, width: 100, height: 40, color: "hsl(0 0% 45%)" },
  { id: "inverter", label: "Inverter\n2000W", x: 350, y: 290, width: 100, height: 50, color: "hsl(210 60% 50%)" },
  { id: "shore", label: "Shore Power\nInlet", x: 500, y: 290, width: 90, height: 50, color: "hsl(120 50% 40%)" },
  { id: "12v-loads", label: "12V Loads\nLights · Fans · USB", x: 80, y: 370, width: 140, height: 50, color: "hsl(210 40% 55%)" },
  { id: "120v-loads", label: "120V Loads\nOutlets", x: 320, y: 380, width: 120, height: 50, color: "hsl(270 40% 50%)" },
  { id: "alternator", label: "Alternator\nCharger", x: 500, y: 190, width: 90, height: 50, color: "hsl(0 50% 45%)" },
  { id: "monitor", label: "Battery\nMonitor", x: 100, y: 200, width: 80, height: 40, color: "hsl(180 50% 40%)" },
];

const ELECTRICAL_CONNECTIONS: SchematicConnection[] = [
  { from: "solar", to: "mppt", label: "MC4", color: "hsl(45 90% 50%)", gauge: "10 AWG" },
  { from: "mppt", to: "battery", label: "", color: "hsl(45 70% 40%)", gauge: "6 AWG" },
  { from: "battery", to: "bms", color: "hsl(30 60% 40%)" },
  { from: "battery", to: "fuse-box", label: "", color: "hsl(0 70% 50%)", gauge: "4 AWG" },
  { from: "battery", to: "inverter", label: "", color: "hsl(0 70% 50%)", gauge: "2/0 AWG" },
  { from: "shore", to: "inverter", label: "AC In", color: "hsl(120 50% 40%)" },
  { from: "fuse-box", to: "12v-loads", label: "", color: "hsl(210 40% 55%)", gauge: "12–14 AWG" },
  { from: "inverter", to: "120v-loads", label: "AC Out", color: "hsl(270 40% 50%)" },
  { from: "alternator", to: "battery", label: "DC-DC", color: "hsl(0 50% 45%)", gauge: "6 AWG" },
  { from: "battery", to: "monitor", color: "hsl(180 50% 40%)" },
];

const PLUMBING_NODES: SchematicNode[] = [
  { id: "fresh-tank", label: "Fresh Water\n25 gal", x: 100, y: 50, width: 120, height: 60, color: "hsl(200 70% 50%)" },
  { id: "pump", label: "12V Pump", x: 130, y: 150, width: 80, height: 40, color: "hsl(200 50% 40%)" },
  { id: "filter", label: "Inline Filter", x: 130, y: 220, width: 80, height: 35, color: "hsl(200 40% 55%)" },
  { id: "kitchen-sink", label: "Kitchen Sink", x: 50, y: 300, width: 100, height: 45, color: "hsl(200 60% 45%)" },
  { id: "ext-shower", label: "Exterior\nShower", x: 220, y: 300, width: 90, height: 45, color: "hsl(200 60% 45%)" },
  { id: "gray-tank", label: "Gray Water\n15 gal", x: 130, y: 400, width: 120, height: 60, color: "hsl(200 30% 45%)" },
  { id: "city-water", label: "City Water\nInlet", x: 350, y: 150, width: 100, height: 45, color: "hsl(120 40% 45%)" },
  { id: "heater", label: "Water Heater\n(optional)", x: 350, y: 250, width: 100, height: 45, color: "hsl(0 50% 50%)" },
];

const PLUMBING_CONNECTIONS: SchematicConnection[] = [
  { from: "fresh-tank", to: "pump", label: "3/4\" PEX", color: "hsl(200 70% 50%)" },
  { from: "pump", to: "filter", color: "hsl(200 50% 40%)" },
  { from: "filter", to: "kitchen-sink", label: "1/2\" PEX", color: "hsl(200 60% 45%)" },
  { from: "filter", to: "ext-shower", label: "1/2\" PEX", color: "hsl(200 60% 45%)" },
  { from: "kitchen-sink", to: "gray-tank", label: "Gray", color: "hsl(200 30% 45%)" },
  { from: "ext-shower", to: "gray-tank", label: "Gray", color: "hsl(200 30% 45%)" },
  { from: "city-water", to: "filter", label: "Bypass", color: "hsl(120 40% 45%)" },
  { from: "filter", to: "heater", label: "Hot line", color: "hsl(0 50% 50%)" },
];

const getNodeCenter = (node: SchematicNode) => ({
  x: node.x + node.width / 2,
  y: node.y + node.height / 2,
});

const SchematicDiagram: React.FC<{
  nodes: SchematicNode[];
  connections: SchematicConnection[];
  zoom: number;
}> = ({ nodes, connections, zoom }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const svgWidth = 700 * zoom;
  const svgHeight = 500 * zoom;

  return (
    <div className="overflow-auto border rounded-lg bg-muted/20 p-2">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 700 500`}
        className="mx-auto"
      >
        {/* Connections */}
        {connections.map((conn, i) => {
          const fromNode = nodes.find((n) => n.id === conn.from);
          const toNode = nodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;
          const from = getNodeCenter(fromNode);
          const to = getNodeCenter(toNode);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={`conn-${i}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={conn.color}
                strokeWidth={2.5}
                strokeDasharray={conn.gauge ? "none" : "6 3"}
                opacity={hoveredNode && hoveredNode !== conn.from && hoveredNode !== conn.to ? 0.2 : 0.8}
              />
              {conn.label && (
                <text
                  x={midX}
                  y={midY - 6}
                  textAnchor="middle"
                  className="fill-foreground text-[9px] font-medium"
                  opacity={hoveredNode && hoveredNode !== conn.from && hoveredNode !== conn.to ? 0.2 : 1}
                >
                  {conn.label}
                </text>
              )}
              {conn.gauge && (
                <text
                  x={midX}
                  y={midY + 8}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[8px]"
                  opacity={hoveredNode && hoveredNode !== conn.from && hoveredNode !== conn.to ? 0.1 : 0.7}
                >
                  {conn.gauge}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const dimmed = hoveredNode && !isHovered;
          const lines = node.label.split("\n");
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: "pointer" }}
              opacity={dimmed ? 0.3 : 1}
            >
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx={6}
                fill={node.color}
                stroke={isHovered ? "hsl(var(--foreground))" : "transparent"}
                strokeWidth={2}
                className="transition-all"
              />
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2 + (i - (lines.length - 1) / 2) * 13}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-[10px] font-medium pointer-events-none"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const SchematicsCanvas: React.FC = () => {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hover over components to highlight connections
        </p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(2, z + 0.1))}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="electrical">
        <TabsList>
          <TabsTrigger value="electrical" className="gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Electrical
          </TabsTrigger>
          <TabsTrigger value="plumbing" className="gap-1.5">
            <Droplets className="h-3.5 w-3.5" /> Plumbing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="electrical" className="mt-4">
          <SchematicDiagram nodes={ELECTRICAL_NODES} connections={ELECTRICAL_CONNECTIONS} zoom={zoom} />
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(45 90% 50%)" }} />
              <span>Solar</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(30 90% 50%)" }} />
              <span>Battery</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(210 60% 50%)" }} />
              <span>AC (Inverter)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(0 70% 50%)" }} />
              <span>DC Main</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plumbing" className="mt-4">
          <SchematicDiagram nodes={PLUMBING_NODES} connections={PLUMBING_CONNECTIONS} zoom={zoom} />
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(200 70% 50%)" }} />
              <span>Fresh Water</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(200 30% 45%)" }} />
              <span>Gray Water</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(0 50% 50%)" }} />
              <span>Hot Water</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchematicsCanvas;
