import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Flame,
  Star,
  ShoppingCart,
  Heart,
  Zap,
  Award,
  Users,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';

interface ProductLandingPageProps {
  project: Project;
}

interface FlavorProfile {
  name: string;
  description: string;
  heatLevel: number;
  color: string;
  icon: React.ReactNode;
  status: 'available' | 'coming_soon' | 'sold_out';
}

const ProductLandingPage = ({ project }: ProductLandingPageProps) => {
  // Mock flavor data - in real app this would come from project data
  const flavors: FlavorProfile[] = [
    {
      name: "Ghost Pepper Gloss",
      description: "The ultimate heat with supernatural shine",
      heatLevel: 5,
      color: "from-red-500 to-orange-600",
      icon: <Flame className="h-5 w-5" />,
      status: "available"
    },
    {
      name: "Habanero Heat",
      description: "Tropical fire meets lip luxury",
      heatLevel: 4,
      color: "from-orange-400 to-red-500",
      icon: <Zap className="h-5 w-5" />,
      status: "available"
    },
    {
      name: "Sriracha Smooth",
      description: "The perfect balance of heat and sweet",
      heatLevel: 3,
      color: "from-red-400 to-orange-400",
      icon: <Heart className="h-5 w-5" />,
      status: "coming_soon"
    },
    {
      name: "Jalapeño Jazz",
      description: "Classic heat with a smooth finish",
      heatLevel: 2,
      color: "from-green-400 to-yellow-400",
      icon: <Star className="h-5 w-5" />,
      status: "coming_soon"
    },
    {
      name: "Chipotle Chill",
      description: "Smoky sophistication for your lips",
      heatLevel: 2,
      color: "from-amber-600 to-red-600",
      icon: <Award className="h-5 w-5" />,
      status: "coming_soon"
    },
    {
      name: "Carolina Reaper Rush",
      description: "For the truly brave - proceed with caution",
      heatLevel: 5,
      color: "from-red-600 to-black",
      icon: <Flame className="h-5 w-5" />,
      status: "coming_soon"
    }
  ];

  const getHeatIndicator = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Flame
        key={i}
        className={cn(
          "h-3 w-3",
          i < level ? "text-red-500 fill-red-500" : "text-gray-300"
        )}
      />
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Available Now</Badge>;
      case 'coming_soon':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Coming Soon</Badge>;
      case 'sold_out':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Sold Out</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-yellow-950/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="h-8 w-8 text-red-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              OFFWOCKEN
            </h1>
            <Flame className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Spicy Chapstick That Brings the Heat
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {project.description}
          </p>

          {/* Progress Section */}
          <Card className="max-w-md mx-auto mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Development Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Launch Q2 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Pre-Order Now
            </Button>
            <Button size="lg" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              <Users className="h-5 w-5 mr-2" />
              Join Beta Testing
            </Button>
          </div>
        </div>

        {/* Flavors Grid */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
            Our Fiery Flavors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flavors.map((flavor, index) => (
              <Card
                key={flavor.name}
                className={cn(
                  "overflow-hidden hover:shadow-lg transition-all cursor-pointer group",
                  "border-2 hover:border-orange-300"
                )}
              >
                <CardHeader className={`bg-gradient-to-br ${flavor.color} text-white relative`}>
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(flavor.status)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      {flavor.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">
                        {flavor.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        {getHeatIndicator(flavor.heatLevel)}
                        <span className="text-xs text-white/90 ml-2">
                          Heat Level {flavor.heatLevel}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {flavor.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-orange-50 group-hover:border-orange-300"
                    disabled={flavor.status === 'sold_out'}
                  >
                    {flavor.status === 'available' ? 'Add to Cart' :
                     flavor.status === 'coming_soon' ? 'Notify Me' : 'Sold Out'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center border-orange-200">
            <CardContent className="pt-8 pb-8">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Flame className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Real Heat</h4>
              <p className="text-muted-foreground">
                Made with authentic peppers for genuine spice that tingles and warms
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-red-200">
            <CardContent className="pt-8 pb-8">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Lip Care</h4>
              <p className="text-muted-foreground">
                Premium moisturizing ingredients keep your lips soft and protected
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-yellow-200">
            <CardContent className="pt-8 pb-8">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Unique Experience</h4>
              <p className="text-muted-foreground">
                Break free from boring chapstick with flavors that make a statement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
          <CardContent className="text-center py-12">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Feel the Heat?
            </h3>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Join thousands of heat seekers who've already discovered the OFFWOCKEN difference.
              Pre-order now and get 20% off your first order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Pre-Order Collection - $29.99
              </Button>
              <div className="text-red-100 text-sm">
                ✨ Free shipping on orders over $25
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Tags */}
        <div className="flex flex-wrap gap-2 justify-center mt-8">
          {project.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-orange-100 text-orange-800 border-orange-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductLandingPage;
