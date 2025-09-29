import {
  Zap,
  Sun,
  Bed,
  Radio,
  Shield,
  Package,
  Thermometer,
  Wrench,
  WifiIcon,
  Smartphone,
  Battery,
  Fan,
  Car
} from 'lucide-react';

export const sampleVehicleBuild = {
  vehicleInfo: {
    make: 'Ford',
    model: 'Transit 250',
    year: 2019,
    type: 'van' as const,
    mileage: 85000,
    purchaseDate: new Date('2024-01-15'),
    purchasePrice: 28500
  },
  phases: [
    {
      id: 'planning-research',
      name: 'Planning & Research',
      description: 'Initial planning, measurements, and research phase',
      icon: Wrench,
      status: 'completed' as const,
      priority: 'critical' as const,
      estimatedCost: 500,
      actualCost: 650,
      estimatedDuration: '2 weeks',
      actualDuration: '3 weeks',
      startDate: new Date('2024-01-20'),
      completedDate: new Date('2024-02-10'),
      tasks: [
        { id: 'measure-interior', name: 'Measure interior dimensions', completed: true, estimatedHours: 4, actualHours: 3 },
        { id: 'create-floor-plan', name: 'Create detailed floor plan', completed: true, estimatedHours: 8, actualHours: 12 },
        { id: 'research-components', name: 'Research electrical components', completed: true, estimatedHours: 10, actualHours: 15 },
        { id: 'create-wiring-diagram', name: 'Create wiring diagram', completed: true, estimatedHours: 6, actualHours: 8 },
        { id: 'source-materials', name: 'Source materials and vendors', completed: true, estimatedHours: 8, actualHours: 10 }
      ],
      partsList: [
        { id: 'measuring-tools', name: 'Measuring Tools & Supplies', brand: 'Various', cost: 150, quantity: 1, vendor: 'Home Depot' },
        { id: 'planning-software', name: 'SketchUp Pro License', brand: 'Trimble', cost: 299, quantity: 1, vendor: 'SketchUp' },
        { id: 'reference-books', name: 'Van Life Build Guides', brand: 'Various', cost: 89, quantity: 3, vendor: 'Amazon' }
      ],
      notes: 'Spent extra time on research - glad I did! Found some great component deals and avoided common mistakes.'
    },
    {
      id: 'electrical-system',
      name: 'Electrical System',
      description: '12V electrical system with solar charging and shore power',
      icon: Zap,
      status: 'in_progress' as const,
      priority: 'critical' as const,
      estimatedCost: 3500,
      actualCost: 2850,
      estimatedDuration: '1 month',
      startDate: new Date('2024-02-15'),
      dependencies: ['planning-research'],
      tasks: [
        { id: 'install-battery-bank', name: 'Install lithium battery bank (400Ah)', completed: true, estimatedHours: 8, actualHours: 6 },
        { id: 'install-inverter', name: 'Install 2000W inverter/charger', completed: true, estimatedHours: 6, actualHours: 8 },
        { id: 'run-main-wiring', name: 'Run main 12V wiring harness', completed: true, estimatedHours: 12, actualHours: 15 },
        { id: 'install-fuse-box', name: 'Install fuse box and breakers', completed: false, estimatedHours: 4 },
        { id: 'install-monitoring', name: 'Install battery monitoring system', completed: false, estimatedHours: 3 },
        { id: 'install-shore-power', name: 'Install shore power inlet', completed: false, estimatedHours: 4 },
        { id: 'wire-outlets', name: 'Wire 12V and 120V outlets', completed: false, estimatedHours: 8 }
      ],
      partsList: [
        { id: 'batteries', name: 'LiFePO4 Battery Bank', brand: 'Battle Born', model: 'BB10012', cost: 1200, quantity: 4, vendor: 'Battle Born Batteries', warrantyInfo: '8 years' },
        { id: 'inverter', name: '2000W Inverter/Charger', brand: 'Victron', model: 'MultiPlus 12/2000/80', cost: 650, quantity: 1, vendor: 'Amazon', warrantyInfo: '2 years' },
        { id: 'wiring', name: '12AWG Marine Wire', brand: 'Ancor', cost: 200, quantity: 500, vendor: 'West Marine' },
        { id: 'fuses', name: 'Fuse Box & Breakers', brand: 'Blue Sea Systems', cost: 180, quantity: 1, vendor: 'West Marine' },
        { id: 'monitoring', name: 'Battery Monitor', brand: 'Victron', model: 'BMV-712', cost: 150, quantity: 1, vendor: 'Amazon' }
      ],
      notes: 'Electrical system is the backbone - taking time to do it right. Victron components are pricey but worth it.'
    },
    {
      id: 'solar-system',
      name: 'Solar Power System',
      description: '800W solar array with MPPT charge controller',
      icon: Sun,
      status: 'not_started' as const,
      priority: 'high' as const,
      estimatedCost: 2200,
      estimatedDuration: '1 week',
      dependencies: ['electrical-system'],
      tasks: [
        { id: 'install-roof-panels', name: 'Install 4x 200W solar panels on roof', completed: false, estimatedHours: 8 },
        { id: 'install-charge-controller', name: 'Install MPPT charge controller', completed: false, estimatedHours: 4 },
        { id: 'run-solar-wiring', name: 'Run wiring from panels to controller', completed: false, estimatedHours: 6 },
        { id: 'test-solar-system', name: 'Test and optimize solar charging', completed: false, estimatedHours: 2 }
      ],
      partsList: [
        { id: 'solar-panels', name: 'Monocrystalline Solar Panels', brand: 'Renogy', model: '200W Mono', cost: 180, quantity: 4, vendor: 'Renogy', warrantyInfo: '25 years' },
        { id: 'charge-controller', name: 'MPPT Charge Controller', brand: 'Victron', model: 'SmartSolar 100/50', cost: 280, quantity: 1, vendor: 'Amazon', warrantyInfo: '5 years' },
        { id: 'solar-wiring', name: 'MC4 Cables and Connectors', brand: 'Renogy', cost: 120, quantity: 1, vendor: 'Renogy' },
        { id: 'roof-mounting', name: 'Solar Panel Mounting Hardware', brand: 'Renogy', cost: 200, quantity: 1, vendor: 'Renogy' }
      ]
    },
    {
      id: 'insulation-walls',
      name: 'Insulation & Interior Walls',
      description: 'Insulate van and install interior wall paneling',
      icon: Thermometer,
      status: 'not_started' as const,
      priority: 'high' as const,
      estimatedCost: 1800,
      estimatedDuration: '2 weeks',
      dependencies: ['electrical-system'],
      tasks: [
        { id: 'install-floor-insulation', name: 'Install floor insulation and subfloor', completed: false, estimatedHours: 12 },
        { id: 'install-wall-insulation', name: 'Install wall and ceiling insulation', completed: false, estimatedHours: 16 },
        { id: 'vapor-barrier', name: 'Install vapor barrier', completed: false, estimatedHours: 8 },
        { id: 'wall-paneling', name: 'Install wood wall paneling', completed: false, estimatedHours: 20 },
        { id: 'ceiling-finish', name: 'Install ceiling finish', completed: false, estimatedHours: 10 }
      ],
      partsList: [
        { id: 'insulation', name: 'Sheep Wool Insulation', brand: 'Havelock Wool', cost: 600, quantity: 10, vendor: 'Havelock Wool' },
        { id: 'subfloor', name: 'Plywood Subfloor', brand: 'Home Depot', cost: 200, quantity: 8, vendor: 'Home Depot' },
        { id: 'wall-panels', name: 'Cedar Wall Planks', brand: 'Local Mill', cost: 800, quantity: 200, vendor: 'Local Lumber Mill' },
        { id: 'vapor-barrier', name: 'Vapor Barrier Material', brand: '3M', cost: 150, quantity: 1, vendor: 'Home Depot' }
      ]
    },
    {
      id: 'kitchen-build',
      name: 'Kitchen Installation',
      description: 'Install kitchen with sink, stove, and refrigerator',
      icon: Wrench,
      status: 'not_started' as const,
      priority: 'medium' as const,
      estimatedCost: 2500,
      estimatedDuration: '1.5 weeks',
      dependencies: ['insulation-walls'],
      tasks: [
        { id: 'build-countertop', name: 'Build and install butcher block countertop', completed: false, estimatedHours: 12 },
        { id: 'install-sink', name: 'Install sink with foot pump', completed: false, estimatedHours: 6 },
        { id: 'install-stove', name: 'Install 2-burner propane stove', completed: false, estimatedHours: 4 },
        { id: 'install-fridge', name: 'Install 12V compressor fridge', completed: false, estimatedHours: 4 },
        { id: 'kitchen-storage', name: 'Build kitchen storage cabinets', completed: false, estimatedHours: 16 },
        { id: 'water-system', name: 'Install fresh/gray water system', completed: false, estimatedHours: 10 }
      ],
      partsList: [
        { id: 'countertop', name: 'Butcher Block Countertop', brand: 'IKEA', model: 'MÖLLEKULLA', cost: 200, quantity: 1, vendor: 'IKEA' },
        { id: 'sink', name: 'Stainless Steel Sink', brand: 'Dometic', model: 'VA 8005', cost: 180, quantity: 1, vendor: 'Amazon' },
        { id: 'stove', name: '2-Burner Propane Stove', brand: 'Atwood', model: 'DV-20S', cost: 250, quantity: 1, vendor: 'Camping World' },
        { id: 'fridge', name: '65L 12V Compressor Fridge', brand: 'ARB', model: '10800472', cost: 800, quantity: 1, vendor: 'Amazon', warrantyInfo: '2 years' },
        { id: 'water-tanks', name: 'Fresh & Gray Water Tanks', brand: 'Barker', cost: 300, quantity: 2, vendor: 'Camping World' }
      ]
    },
    {
      id: 'sleeping-area',
      name: 'Sleeping Area',
      description: 'Build convertible bed/seating area',
      icon: Bed,
      status: 'not_started' as const,
      priority: 'medium' as const,
      estimatedCost: 1200,
      estimatedDuration: '1 week',
      dependencies: ['insulation-walls'],
      tasks: [
        { id: 'build-bed-frame', name: 'Build convertible bed frame', completed: false, estimatedHours: 12 },
        { id: 'install-cushions', name: 'Install custom cushions', completed: false, estimatedHours: 4 },
        { id: 'bed-storage', name: 'Build under-bed storage', completed: false, estimatedHours: 8 },
        { id: 'install-privacy-curtain', name: 'Install privacy curtain system', completed: false, estimatedHours: 3 }
      ],
      partsList: [
        { id: 'bed-lumber', name: 'Bed Frame Lumber', brand: 'Home Depot', cost: 200, quantity: 1, vendor: 'Home Depot' },
        { id: 'cushions', name: 'Custom Foam Cushions', brand: 'FoamOrder', cost: 400, quantity: 1, vendor: 'FoamOrder.com' },
        { id: 'fabric', name: 'Upholstery Fabric', brand: 'Sunbrella', cost: 300, quantity: 8, vendor: 'Sailrite' },
        { id: 'curtains', name: 'Privacy Curtain Hardware', brand: 'IKEA', cost: 80, quantity: 1, vendor: 'IKEA' }
      ]
    },
    {
      id: 'communication-tech',
      name: 'Communication & Tech',
      description: 'Internet, cellular booster, and tech setup',
      icon: Radio,
      status: 'not_started' as const,
      priority: 'medium' as const,
      estimatedCost: 1500,
      estimatedDuration: '3 days',
      dependencies: ['electrical-system'],
      tasks: [
        { id: 'install-cellular-booster', name: 'Install cellular signal booster', completed: false, estimatedHours: 4 },
        { id: 'install-wifi-router', name: 'Install 4G/5G WiFi router', completed: false, estimatedHours: 2 },
        { id: 'external-antennas', name: 'Install external antennas', completed: false, estimatedHours: 6 },
        { id: 'setup-starlink', name: 'Install Starlink mount and setup', completed: false, estimatedHours: 4 },
        { id: 'office-workspace', name: 'Setup mobile office workspace', completed: false, estimatedHours: 6 }
      ],
      partsList: [
        { id: 'cell-booster', name: 'Cellular Signal Booster', brand: 'WeBoost', model: 'Drive Reach RV', cost: 500, quantity: 1, vendor: 'Amazon', warrantyInfo: '2 years' },
        { id: 'wifi-router', name: '5G WiFi Router', brand: 'Pepwave', model: 'MAX BR1 Pro 5G', cost: 600, quantity: 1, vendor: 'Pepwave' },
        { id: 'starlink', name: 'Starlink Kit', brand: 'SpaceX', cost: 300, quantity: 1, vendor: 'Starlink', installationNotes: 'Need roof mount adapter' },
        { id: 'antennas', name: 'External Antennas', brand: 'Panorama', cost: 150, quantity: 2, vendor: 'Amazon' }
      ]
    },
    {
      id: 'climate-control',
      name: 'Climate Control',
      description: 'Ventilation fan and heating system',
      icon: Fan,
      status: 'not_started' as const,
      priority: 'low' as const,
      estimatedCost: 800,
      estimatedDuration: '2 days',
      dependencies: ['electrical-system'],
      tasks: [
        { id: 'install-roof-fan', name: 'Install MaxxAir roof fan', completed: false, estimatedHours: 4 },
        { id: 'install-diesel-heater', name: 'Install diesel air heater', completed: false, estimatedHours: 8 },
        { id: 'vent-fan-wiring', name: 'Wire fan controls', completed: false, estimatedHours: 3 }
      ],
      partsList: [
        { id: 'roof-fan', name: 'MaxxAir Roof Ventilator', brand: 'MaxxAir', model: '00-07500K', cost: 300, quantity: 1, vendor: 'Amazon', warrantyInfo: '1 year' },
        { id: 'diesel-heater', name: 'Diesel Air Heater', brand: 'Vevor', model: '2kW', cost: 200, quantity: 1, vendor: 'Amazon' },
        { id: 'heater-ducting', name: 'Heater Ducting Kit', brand: 'Various', cost: 100, quantity: 1, vendor: 'Amazon' }
      ]
    },
    {
      id: 'exterior-storage',
      name: 'Exterior Storage & Accessories',
      description: 'Rear storage box, bike rack, and exterior accessories',
      icon: Package,
      status: 'not_started' as const,
      priority: 'low' as const,
      estimatedCost: 1000,
      estimatedDuration: '1 week',
      tasks: [
        { id: 'install-hitch', name: 'Install 2" receiver hitch', completed: false, estimatedHours: 3 },
        { id: 'rear-storage-box', name: 'Build rear storage cargo box', completed: false, estimatedHours: 12 },
        { id: 'bike-rack', name: 'Install swing-away bike rack', completed: false, estimatedHours: 2 },
        { id: 'awning', name: 'Install retractable awning', completed: false, estimatedHours: 6 },
        { id: 'exterior-shower', name: 'Install exterior shower connection', completed: false, estimatedHours: 4 }
      ],
      partsList: [
        { id: 'hitch', name: '2" Receiver Hitch', brand: 'Curt', model: '13417', cost: 200, quantity: 1, vendor: 'Amazon' },
        { id: 'cargo-box', name: 'Rear Cargo Box Materials', brand: 'Various', cost: 300, quantity: 1, vendor: 'Home Depot' },
        { id: 'bike-rack', name: 'Swing-Away Bike Rack', brand: 'Yakima', model: 'SwingDaddy', cost: 400, quantity: 1, vendor: 'REI' },
        { id: 'awning', name: 'Retractable Awning', brand: 'Dometic', model: '8500', cost: 600, quantity: 1, vendor: 'Camping World' }
      ]
    },
    {
      id: 'safety-security',
      name: 'Safety & Security',
      description: 'Security system, fire safety, and emergency equipment',
      icon: Shield,
      status: 'not_started' as const,
      priority: 'high' as const,
      estimatedCost: 600,
      estimatedDuration: '2 days',
      tasks: [
        { id: 'install-alarm-system', name: 'Install security alarm system', completed: false, estimatedHours: 4 },
        { id: 'fire-extinguisher', name: 'Install fire extinguisher and smoke detectors', completed: false, estimatedHours: 2 },
        { id: 'first-aid-kit', name: 'Stock comprehensive first aid kit', completed: false, estimatedHours: 1 },
        { id: 'emergency-tools', name: 'Install emergency tools and equipment', completed: false, estimatedHours: 2 }
      ],
      partsList: [
        { id: 'alarm-system', name: 'Van Security System', brand: 'Omega', cost: 250, quantity: 1, vendor: 'Amazon' },
        { id: 'fire-safety', name: 'Fire Extinguisher & Smoke Detectors', brand: 'First Alert', cost: 100, quantity: 1, vendor: 'Home Depot' },
        { id: 'first-aid', name: 'Comprehensive First Aid Kit', brand: 'Adventure Medical', cost: 150, quantity: 1, vendor: 'REI' },
        { id: 'emergency-tools', name: 'Emergency Tool Kit', brand: 'Various', cost: 200, quantity: 1, vendor: 'Amazon' }
      ]
    }
  ]
};

export type VehicleBuildData = typeof sampleVehicleBuild;
