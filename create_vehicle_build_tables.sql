-- Create vehicle build project tables
-- This extends the existing projects table to support detailed vehicle build tracking

-- Vehicle build projects table (extends projects)
CREATE TABLE IF NOT EXISTS vehicle_builds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    vehicle_make TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    vehicle_year INTEGER NOT NULL,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('van', 'rv', 'truck', 'car', 'bus', 'step_van', 'bread_truck')),
    vehicle_mileage INTEGER,
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle build phases table
CREATE TABLE IF NOT EXISTS vehicle_build_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_build_id UUID REFERENCES vehicle_builds(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'wrench',
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'blocked')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    estimated_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    actual_cost DECIMAL(10,2),
    estimated_duration TEXT,
    actual_duration TEXT,
    start_date DATE,
    completed_date DATE,
    dependencies TEXT[], -- Array of phase IDs that must be completed first
    notes TEXT,
    vendors TEXT[],
    photos TEXT[], -- Array of photo URLs
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle build tasks table (tasks within each phase)
CREATE TABLE IF NOT EXISTS vehicle_build_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id UUID REFERENCES vehicle_build_phases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle parts/components table
CREATE TABLE IF NOT EXISTS vehicle_build_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id UUID REFERENCES vehicle_build_phases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT,
    cost DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    vendor TEXT NOT NULL,
    purchase_date DATE,
    warranty_info TEXT,
    installation_notes TEXT,
    part_url TEXT, -- Link to product page
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicle_builds_project_id ON vehicle_builds(project_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_build_phases_vehicle_build_id ON vehicle_build_phases(vehicle_build_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_build_phases_status ON vehicle_build_phases(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_build_phases_sort_order ON vehicle_build_phases(sort_order);
CREATE INDEX IF NOT EXISTS idx_vehicle_build_tasks_phase_id ON vehicle_build_tasks(phase_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_build_tasks_sort_order ON vehicle_build_tasks(sort_order);
CREATE INDEX IF NOT EXISTS idx_vehicle_build_parts_phase_id ON vehicle_build_parts(phase_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicle_builds_updated_at
    BEFORE UPDATE ON vehicle_builds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_build_phases_updated_at
    BEFORE UPDATE ON vehicle_build_phases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_build_tasks_updated_at
    BEFORE UPDATE ON vehicle_build_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_build_parts_updated_at
    BEFORE UPDATE ON vehicle_build_parts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for bread truck build
-- First create the main project
INSERT INTO projects (
    id,
    name,
    description,
    type,
    status,
    version,
    progress,
    tags,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Bread Truck Conversion',
    'Complete conversion of a vintage bread truck into a mobile maker space and tiny home. This project combines electrical systems, woodworking, and custom fabrication to create a unique off-grid capable vehicle.',
    'Vehicle Build',
    'in_progress',
    '0.3.0',
    25,
    ARRAY['hardware', 'vehicle-build', 'electrical-systems', 'woodworking', 'mobile-living', 'maker-space'],
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    status = EXCLUDED.status,
    version = EXCLUDED.version,
    progress = EXCLUDED.progress,
    tags = EXCLUDED.tags,
    updated_at = EXCLUDED.updated_at;

-- Create the vehicle build record
INSERT INTO vehicle_builds (
    id,
    project_id,
    vehicle_make,
    vehicle_model,
    vehicle_year,
    vehicle_type,
    vehicle_mileage,
    purchase_date,
    purchase_price,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Isuzu',
    'NPR Step Van',
    1995,
    'step_van',
    156000,
    '2024-01-15',
    15500.00,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    vehicle_make = EXCLUDED.vehicle_make,
    vehicle_model = EXCLUDED.vehicle_model,
    vehicle_year = EXCLUDED.vehicle_year,
    vehicle_type = EXCLUDED.vehicle_type,
    vehicle_mileage = EXCLUDED.vehicle_mileage,
    purchase_date = EXCLUDED.purchase_date,
    purchase_price = EXCLUDED.purchase_price,
    updated_at = EXCLUDED.updated_at;

-- Insert phases
INSERT INTO vehicle_build_phases (id, vehicle_build_id, name, description, icon, status, priority, estimated_cost, actual_cost, estimated_duration, start_date, completed_date, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Planning & Assessment', 'Initial planning, measurements, mechanical assessment, and design phase', 'clipboard', 'completed', 'critical', 800.00, 950.00, '3 weeks', '2024-01-20', '2024-02-10', 1),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Mechanical Restoration', 'Engine work, transmission service, brakes, and mechanical systems', 'wrench', 'completed', 'critical', 3500.00, 4200.00, '1 month', '2024-02-15', '2024-03-20', 2),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'Electrical System', '12V house electrical system with solar charging capability', 'zap', 'in_progress', 'critical', 4000.00, 2800.00, '3 weeks', '2024-03-25', NULL, 3),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', 'Solar Power System', '600W solar array with battery storage', 'sun', 'not_started', 'high', 2500.00, NULL, '1 week', NULL, NULL, 4),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', 'Insulation & Interior Frame', 'Insulate cargo area and build interior framework', 'home', 'not_started', 'high', 1800.00, NULL, '2 weeks', NULL, NULL, 5),
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', 'Workshop Area', 'Build out maker space with workbench and tool storage', 'hammer', 'not_started', 'medium', 2200.00, NULL, '2 weeks', NULL, NULL, 6),
('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440001', 'Living Space', 'Sleeping area, kitchenette, and storage solutions', 'bed', 'not_started', 'medium', 1800.00, NULL, '1.5 weeks', NULL, NULL, 7),
('550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440001', 'Water & Plumbing', 'Fresh water tank, gray water, and plumbing connections', 'droplets', 'not_started', 'medium', 800.00, NULL, '1 week', NULL, NULL, 8),
('550e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440001', 'Climate Control', 'Ventilation fan and heating system for year-round use', 'thermometer', 'not_started', 'low', 600.00, NULL, '2 days', NULL, NULL, 9),
('550e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440001', 'Exterior & Security', 'Exterior storage, awning, and security systems', 'shield', 'not_started', 'low', 1200.00, NULL, '1 week', NULL, NULL, 10)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    priority = EXCLUDED.priority,
    estimated_cost = EXCLUDED.estimated_cost,
    actual_cost = EXCLUDED.actual_cost,
    estimated_duration = EXCLUDED.estimated_duration,
    start_date = EXCLUDED.start_date,
    completed_date = EXCLUDED.completed_date,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

-- Insert some sample tasks for completed phases
INSERT INTO vehicle_build_tasks (phase_id, name, completed, notes, estimated_hours, actual_hours, sort_order) VALUES
-- Planning phase tasks
('550e8400-e29b-41d4-a716-446655440010', 'Measure interior dimensions', true, 'Cargo area is 10ft x 7ft x 6.5ft height', 3, 2, 1),
('550e8400-e29b-41d4-a716-446655440010', 'Research step van conversions', true, 'Found great resources on Skoolie.net forums', 8, 12, 2),
('550e8400-e29b-41d4-a716-446655440010', 'Create floor plan and 3D model', true, 'Used SketchUp - plan is solid!', 12, 18, 3),
('550e8400-e29b-41d4-a716-446655440010', 'Mechanical inspection', true, 'Needs transmission service and new brake pads', 4, 3, 4),
('550e8400-e29b-41d4-a716-446655440010', 'Cost estimation and budgeting', true, 'Total estimated budget: $19,200', 6, 8, 5),

-- Mechanical restoration tasks
('550e8400-e29b-41d4-a716-446655440011', 'Oil change and engine service', true, 'Engine runs great - just needed TLC', 4, 3, 1),
('550e8400-e29b-41d4-a716-446655440011', 'Transmission service', true, 'Fluid was black - much better now', 6, 8, 2),
('550e8400-e29b-41d4-a716-446655440011', 'Replace brake pads and rotors', true, 'Safety first! Stops like new', 8, 10, 3),
('550e8400-e29b-41d4-a716-446655440011', 'New tires (6)', true, 'Load range E tires for heavy build-out', 3, 4, 4),
('550e8400-e29b-41d4-a716-446655440011', 'Cooling system flush and repair', true, 'Had to replace radiator hoses', 6, 12, 5),
('550e8400-e29b-41d4-a716-446655440011', 'Fuel system cleaning', true, 'Ran some seafoam through - much smoother', 4, 3, 6),

-- Electrical system tasks (in progress)
('550e8400-e29b-41d4-a716-446655440012', 'Install house battery bank (300Ah LiFePO4)', true, 'Battle Born batteries - expensive but worth it', 6, 8, 1),
('550e8400-e29b-41d4-a716-446655440012', 'Install 2000W inverter/charger', true, 'Victron MultiPlus - quality gear', 4, 6, 2),
('550e8400-e29b-41d4-a716-446655440012', 'Run main 12V wiring harness', true, 'Used marine grade wire throughout', 12, 15, 3),
('550e8400-e29b-41d4-a716-446655440012', 'Install DC fuse box and breakers', false, 'Blue Sea Systems panel ordered', 4, NULL, 4),
('550e8400-e29b-41d4-a716-446655440012', 'Wire 12V outlets and USB charging', false, 'Planning locations for optimal access', 6, NULL, 5),
('550e8400-e29b-41d4-a716-446655440012', 'Install battery monitoring system', false, 'Victron BMV-712 for monitoring', 3, NULL, 6),
('550e8400-e29b-41d4-a716-446655440012', 'Install shore power connection', false, 'For when parked with power available', 4, NULL, 7)
ON CONFLICT DO NOTHING;

-- Insert some sample parts
INSERT INTO vehicle_build_parts (phase_id, name, brand, model, cost, quantity, vendor, purchase_date, warranty_info) VALUES
-- Planning phase parts
('550e8400-e29b-41d4-a716-446655440010', 'Measuring tools and supplies', 'Various', NULL, 85.00, 1, 'Home Depot', '2024-01-22', NULL),
('550e8400-e29b-41d4-a716-446655440010', 'SketchUp Pro License', 'Trimble', '2024', 299.00, 1, 'Trimble', '2024-01-25', '1 year'),

-- Mechanical restoration parts
('550e8400-e29b-41d4-a716-446655440011', 'Engine Oil and Filter', 'Mobil 1', '15W-40', 65.00, 1, 'AutoZone', '2024-02-16', NULL),
('550e8400-e29b-41d4-a716-446655440011', 'Transmission Fluid', 'Isuzu', 'OEM ATF', 120.00, 2, 'Isuzu Dealer', '2024-02-18', NULL),
('550e8400-e29b-41d4-a716-446655440011', 'Brake Pads and Rotors', 'Wagner', 'ThermoQuiet', 380.00, 1, 'RockAuto', '2024-02-20', '2 years'),
('550e8400-e29b-41d4-a716-446655440011', 'Commercial Truck Tires', 'Michelin', 'XZE2+', 1850.00, 6, 'Discount Tire', '2024-03-01', '5 years'),
('550e8400-e29b-41d4-a716-446655440011', 'Radiator Hoses', 'Gates', 'Upper/Lower Set', 85.00, 1, 'NAPA', '2024-03-05', NULL),

-- Electrical system parts
('550e8400-e29b-41d4-a716-446655440012', 'LiFePO4 Battery Bank', 'Battle Born', 'BB10012', 3600.00, 3, 'Battle Born', '2024-03-20', '8 years'),
('550e8400-e29b-41d4-a716-446655440012', '2000W Inverter/Charger', 'Victron', 'MultiPlus 12/2000/80', 680.00, 1, 'Amazon', '2024-03-22', '5 years'),
('550e8400-e29b-41d4-a716-446655440012', 'Marine Grade Wiring', 'Ancor', '12AWG Tinned Copper', 180.00, 3, 'West Marine', '2024-03-25', NULL),
('550e8400-e29b-41d4-a716-446655440012', 'DC Electrical Panel', 'Blue Sea Systems', 'SafetyHub 150', 220.00, 1, 'Blue Sea Direct', '2024-04-01', '2 years')
ON CONFLICT DO NOTHING;
