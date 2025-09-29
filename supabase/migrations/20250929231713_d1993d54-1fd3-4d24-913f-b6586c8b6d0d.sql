-- Insert the main Bread Truck Conversion project with a new UUID
INSERT INTO projects (
  id,
  name,
  description,
  status,
  type,
  budget,
  location,
  tags,
  version,
  progress,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Bread Truck Conversion',
  'Converting a 1994 Chevrolet P30 Step Van into a mobile tiny home',
  'in_progress',
  'vehicle_build',
  '$25,000',
  'Portland, OR',
  ARRAY['vehicle conversion', 'tiny home', 'DIY', 'step van', 'mobile living'],
  '1.0',
  45,
  NOW(),
  NOW()
)
RETURNING id AS project_id;

-- Store the project ID for subsequent inserts
DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- Get the most recently created project (the one we just inserted)
  SELECT id INTO v_project_id FROM projects 
  WHERE name = 'Bread Truck Conversion' 
  ORDER BY created_at DESC LIMIT 1;

  -- Insert build phases as project components
  INSERT INTO project_components (
    project_id,
    name,
    description,
    type,
    status,
    dependencies,
    created_at,
    updated_at
  ) VALUES
  (v_project_id, 'Assessment & Planning', 'Initial vehicle assessment and project planning phase', 'phase', 'completed', ARRAY[]::text[], NOW(), NOW()),
  (v_project_id, 'Demolition', 'Strip interior and remove unnecessary components', 'phase', 'completed', ARRAY['Assessment & Planning'], NOW(), NOW()),
  (v_project_id, 'Structural Work', 'Reinforce structure and prepare for installations', 'phase', 'in_progress', ARRAY['Demolition'], NOW(), NOW()),
  (v_project_id, 'Electrical System', 'Install solar panels and electrical infrastructure', 'phase', 'pending', ARRAY['Structural Work'], NOW(), NOW()),
  (v_project_id, 'Plumbing', 'Install water tanks and plumbing system', 'phase', 'pending', ARRAY['Structural Work'], NOW(), NOW()),
  (v_project_id, 'Insulation', 'Install insulation throughout the vehicle', 'phase', 'pending', ARRAY['Electrical System', 'Plumbing'], NOW(), NOW()),
  (v_project_id, 'Interior Build', 'Build and install all interior components', 'phase', 'pending', ARRAY['Insulation'], NOW(), NOW()),
  (v_project_id, 'Finishing Touches', 'Final details and aesthetic improvements', 'phase', 'pending', ARRAY['Interior Build'], NOW(), NOW());

  -- Insert tasks
  INSERT INTO project_tasks (project_id, title, description, status, priority, created_at, updated_at) VALUES
  -- Assessment & Planning
  (v_project_id, 'Vehicle Purchase & Inspection', 'Purchase 1994 Chevy P30 and complete mechanical inspection', 'completed', 'high', NOW(), NOW()),
  (v_project_id, 'Create Floor Plan', 'Design interior layout with kitchen, sleeping area, and storage', 'completed', 'high', NOW(), NOW()),
  (v_project_id, 'Budget Planning', 'Estimate costs and create detailed budget breakdown', 'completed', 'medium', NOW(), NOW()),
  -- Demolition
  (v_project_id, 'Remove Interior Fixtures', 'Strip out old shelving and fixtures', 'completed', 'high', NOW(), NOW()),
  (v_project_id, 'Clean & Prep Surfaces', 'Deep clean and prepare all surfaces for work', 'completed', 'medium', NOW(), NOW()),
  -- Structural Work
  (v_project_id, 'Install Roof Rack', 'Mount roof rack for solar panels', 'in_progress', 'high', NOW(), NOW()),
  (v_project_id, 'Reinforce Floor', 'Add support beams and reinforce floor structure', 'completed', 'high', NOW(), NOW()),
  (v_project_id, 'Install Windows', 'Cut openings and install side windows', 'in_progress', 'medium', NOW(), NOW()),
  -- Electrical System
  (v_project_id, 'Solar Panel Installation', 'Mount and wire 400W solar panel system', 'pending', 'high', NOW(), NOW()),
  (v_project_id, 'Battery Bank Setup', 'Install lithium battery bank with charge controller', 'pending', 'high', NOW(), NOW()),
  (v_project_id, 'Wire Electrical System', 'Run all electrical wiring throughout vehicle', 'pending', 'high', NOW(), NOW()),
  -- Plumbing
  (v_project_id, 'Install Water Tanks', 'Mount fresh and grey water tanks', 'pending', 'high', NOW(), NOW()),
  (v_project_id, 'Install Sink & Faucet', 'Install kitchen sink with foot pump faucet', 'pending', 'medium', NOW(), NOW()),
  -- Insulation
  (v_project_id, 'Wall Insulation', 'Install spray foam insulation in walls', 'pending', 'high', NOW(), NOW()),
  (v_project_id, 'Ceiling Insulation', 'Insulate ceiling and roof area', 'pending', 'high', NOW(), NOW()),
  (v_project_id, 'Floor Insulation', 'Add rigid foam insulation to floor', 'pending', 'medium', NOW(), NOW()),
  -- Interior Build
  (v_project_id, 'Build Kitchen Counter', 'Construct and install kitchen counter with storage', 'pending', 'high', NOW(), NOW()),
  (v_project_id, 'Install Bed Platform', 'Build and install raised bed platform with storage', 'pending', 'high', NOW(), NOW()),
  (v_project_id, 'Build Storage Cabinets', 'Construct overhead and floor storage cabinets', 'pending', 'medium', NOW(), NOW()),
  (v_project_id, 'Install Flooring', 'Lay vinyl plank flooring throughout', 'pending', 'medium', NOW(), NOW()),
  -- Finishing Touches
  (v_project_id, 'Wall Paneling', 'Install decorative wall paneling', 'pending', 'low', NOW(), NOW()),
  (v_project_id, 'Paint & Decorate', 'Paint interior and add finishing decorative touches', 'pending', 'low', NOW(), NOW()),
  (v_project_id, 'Install Lighting', 'Add LED lighting fixtures throughout', 'pending', 'medium', NOW(), NOW());
END $$;