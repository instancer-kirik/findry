import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Car,
  Bus,
  Truck,
  Bike,
  Home,
  Wind,
  Navigation,
  Bluetooth,
  Usb,
  Package,
  Bed,
  Utensils,
  Bath,
  Wifi,
  Speaker,
  Shield,
  Fuel,
  Zap,
  Gauge
} from 'lucide-react';
import { TripPlanData, VehicleSelection, VEHICLE_FEATURES } from '@/types/tour-planning';
import { cn } from '@/lib/utils';

interface VehicleSelectionStepProps {
  type: 'band_tour' | 'roadtrip';
  data: Partial<TripPlanData>;
  onUpdate: (data: Partial<TripPlanData>) => void;
}

const VehicleSelectionStep: React.FC<VehicleSelectionStepProps> = ({ type, data, onUpdate }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSelection['type']>(
    data.vehicle?.type || 'car'
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    data.vehicle?.features?.map(f => f.id) || []
  );

  const vehicles = [
    {
      type: 'car' as const,
      name: 'Car',
      icon: Car,
      capacity: '2-5 people',
      pros: ['Fuel efficient', 'Easy parking', 'Nimble'],
      cons: ['Limited space', 'Less comfort for long trips'],
      bestFor: 'Solo travelers or couples',
      mpg: '25-35',
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'van' as const,
      name: 'Van',
      icon: Bus,
      capacity: '5-8 people',
      pros: ['Spacious', 'Comfortable', 'Good storage'],
      cons: ['Lower fuel economy', 'Harder to park'],
      bestFor: 'Small groups or bands',
      mpg: '18-25',
      color: 'from-purple-500 to-purple-600'
    },
    {
      type: 'rv' as const,
      name: 'RV/Motorhome',
      icon: Home,
      capacity: '4-8 people',
      pros: ['Sleep onboard', 'Kitchen & bathroom', 'Ultimate comfort'],
      cons: ['Expensive', 'Very low MPG', 'Parking challenges'],
      bestFor: 'Long trips with camping',
      mpg: '8-12',
      color: 'from-green-500 to-green-600'
    },
    {
      type: 'bus' as const,
      name: 'Tour Bus',
      icon: Bus,
      capacity: '10-20 people',
      pros: ['Massive space', 'Full amenities', 'Band equipment storage'],
      cons: ['Very expensive', 'Requires special license', 'Limited routes'],
      bestFor: 'Full bands with crew',
      mpg: '6-10',
      color: 'from-orange-500 to-orange-600',
      bandOnly: true
    },
    {
      type: 'motorcycle' as const,
      name: 'Motorcycle',
      icon: Bike,
      capacity: '1-2 people',
      pros: ['Adventure!', 'Great MPG', 'Easy parking'],
      cons: ['Weather dependent', 'Minimal storage', 'Safety concerns'],
      bestFor: 'Solo adventurers',
      mpg: '40-60',
      color: 'from-red-500 to-red-600'
    },
    {
      type: 'bicycle' as const,
      name: 'Bicycle',
      icon: Bike,
      capacity: '1 person',
      pros: ['Eco-friendly', 'No fuel costs', 'Ultimate freedom'],
      cons: ['Very slow', 'Weather dependent', 'Physical demands'],
      bestFor: 'Eco-warriors & fitness enthusiasts',
      mpg: '∞',
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const getFeatureIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      wind: Wind,
      navigation: Navigation,
      bluetooth: Bluetooth,
      usb: Usb,
      package: Package,
      bed: Bed,
      utensils: Utensils,
      shower: Bath,
      wifi: Wifi,
      speaker: Speaker,
      shield: Shield,
      truck: Truck,
      bike: Bike,
      luggage: Package
    };
    const Icon = icons[iconName] || Package;
    return <Icon className="h-4 w-4" />;
  };

  const handleVehicleSelect = (vehicleType: VehicleSelection['type']) => {
    setSelectedVehicle(vehicleType);
    const vehicle = vehicles.find(v => v.type === vehicleType);

    onUpdate({
      vehicle: {
        type: vehicleType,
        capacity: parseInt(vehicle?.capacity.split('-')[1] || '1'),
        features: selectedFeatures.map(id =>
          VEHICLE_FEATURES.find(f => f.id === id)!
        ).filter(Boolean),
        fuelType: vehicleType === 'bicycle' ? 'electric' : 'gas',
        estimatedMPG: parseInt(vehicle?.mpg.split('-')[0] || '25')
      }
    });
  };

  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];

    setSelectedFeatures(newFeatures);

    onUpdate({
      vehicle: {
        ...data.vehicle!,
        features: newFeatures.map(id =>
          VEHICLE_FEATURES.find(f => f.id === id)!
        ).filter(Boolean)
      }
    });
  };

  const filteredVehicles = type === 'roadtrip'
    ? vehicles.filter(v => !v.bandOnly)
    : vehicles;

  return (
    <div className="space-y-6">
      {/* Vehicle Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">🚗 Choose Your Ride</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVehicles.map((vehicle) => {
            const Icon = vehicle.icon;
            const isSelected = selectedVehicle === vehicle.type;

            return (
              <Card
                key={vehicle.type}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  isSelected && "ring-2 ring-primary"
                )}
                onClick={() => handleVehicleSelect(vehicle.type)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      "p-3 rounded-lg bg-gradient-to-r text-white",
                      vehicle.color
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{vehicle.name}</h3>
                        {isSelected && (
                          <Badge variant="default" className="ml-2">Selected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{vehicle.capacity}</p>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Gauge className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {vehicle.mpg} MPG
                          </span>
                        </div>
                        <p className="text-xs font-medium text-green-600 dark:text-green-400">
                          Best for: {vehicle.bestFor}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div>
                          <p className="text-xs font-medium text-green-600 dark:text-green-400">Pros:</p>
                          <ul className="text-xs text-muted-foreground">
                            {vehicle.pros.map((pro, i) => (
                              <li key={i}>• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Cons:</p>
                          <ul className="text-xs text-muted-foreground">
                            {vehicle.cons.map((con, i) => (
                              <li key={i}>• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Vehicle Features */}
      {selectedVehicle && selectedVehicle !== 'bicycle' && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">✨ Desired Features</Label>
          <p className="text-sm text-muted-foreground">
            Select the features that are important for your {type === 'band_tour' ? 'tour' : 'trip'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VEHICLE_FEATURES.filter(feature => {
              // Filter features based on vehicle type
              if (selectedVehicle === 'motorcycle') {
                return ['gps', 'bluetooth', 'usb', 'storage'].includes(feature.id);
              }
              if (selectedVehicle === 'car') {
                return !['bed', 'kitchen', 'bathroom'].includes(feature.id);
              }
              return true;
            }).map((feature) => (
              <div
                key={feature.id}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={feature.id}
                  checked={selectedFeatures.includes(feature.id)}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                />
                <Label
                  htmlFor={feature.id}
                  className="flex items-center space-x-2 cursor-pointer text-sm"
                >
                  {getFeatureIcon(feature.icon || '')}
                  <span>{feature.name}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fun tip */}
      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg">
        <p className="text-sm">
          <span className="font-semibold">💡 Pro Tip:</span>{' '}
          {selectedVehicle === 'rv' && "RVs let you save on hotels but cost more in fuel!"}
          {selectedVehicle === 'van' && "Vans are the sweet spot for group road trips!"}
          {selectedVehicle === 'car' && "Cars are perfect for flexibility and budget!"}
          {selectedVehicle === 'bus' && "Tour buses are ideal for bands with lots of gear!"}
          {selectedVehicle === 'motorcycle' && "Motorcycles offer the ultimate freedom!"}
          {selectedVehicle === 'bicycle' && "Bike touring is an eco-friendly adventure!"}
          {!selectedVehicle && "Choose the vehicle that matches your adventure style!"}
        </p>
      </div>
    </div>
  );
};

export default VehicleSelectionStep;
