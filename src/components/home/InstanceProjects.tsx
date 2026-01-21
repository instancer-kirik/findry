import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Cpu, Car, Coffee, Shield, Radio, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const projectCategories = [
  {
    title: "Wearables & Protective",
    icon: Shield,
    projects: [
      { name: "ClipboardArmor", status: "prototype", desc: "Modular protective case" },
      { name: "LaptopArmor", status: "concept", desc: "Shock-absorbent shell" },
      { name: "Chapstick", status: "prototype", desc: "Artisan lip balm" },
    ],
  },
  {
    title: "Tea & Beverage",
    icon: Coffee,
    projects: [
      { name: "BentTea", status: "formulation", desc: "Oolong with hibiscus & ginger" },
      { name: "MeadeHoneyWine", status: "brewing", desc: "Small-batch honey wine" },
    ],
  },
  {
    title: "Electronics & Hardware",
    icon: Cpu,
    projects: [
      { name: "RemoteDoorbell", status: "prototype", desc: "ESP32 smart doorbell" },
      { name: "ComboCounter", status: "demo", desc: "Multi-input counter display" },
      { name: "PhoneNode", status: "concept", desc: "Privacy-focused device" },
      { name: "SmartParking", status: "demo", desc: "Automated parking system" },
    ],
  },
  {
    title: "Vehicles & Mobility",
    icon: Car,
    projects: [
      { name: "TruckNode", status: "installed", desc: "Vehicle sensor broadcast" },
      { name: "MotorcycleNode", status: "concept", desc: "Audio & bluetooth node" },
      { name: "POCKETSRadio", status: "active", desc: "Vehicle broadcast station" },
    ],
  },
  {
    title: "Merch & Lore",
    icon: Sparkles,
    projects: [
      { name: "Stickers", status: "production", desc: "Post-historic MMVO series" },
      { name: "LoreArtifacts", status: "collection", desc: "Mythic props & objects" },
    ],
  },
];

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  installed: "bg-green-500/20 text-green-400 border-green-500/30",
  production: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  brewing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  formulation: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  prototype: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  demo: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  concept: "bg-muted text-muted-foreground border-border",
  collection: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

export function InstanceProjects() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold mb-3">OverHere Enterprise</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-4">
            Personal projects spanning hardware, beverages, vehicles, and more.
          </p>
          <Button asChild variant="outline" className="gap-2">
            <a href="https://instance.select" target="_blank" rel="noopener noreferrer">
              <Radio className="h-4 w-4" />
              instance.select
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <category.icon className="h-5 w-5 text-primary" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.projects.map((project) => (
                    <div
                      key={project.name}
                      className="flex items-start justify-between gap-2 p-2 rounded-lg bg-muted/30"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{project.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{project.desc}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] shrink-0 ${statusColors[project.status] || ""}`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
