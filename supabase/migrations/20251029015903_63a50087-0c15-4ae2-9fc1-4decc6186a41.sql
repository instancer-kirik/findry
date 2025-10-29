-- Step 1: Drop the old constraint
ALTER TABLE resources DROP CONSTRAINT IF EXISTS resources_type_check;

-- Step 2: Update existing resource types
UPDATE resources SET type = 'studio_space' WHERE type = 'space';
UPDATE resources SET type = 'equipment' WHERE type = 'tool';  
UPDATE resources SET type = 'service' WHERE type = 'offerer';

-- Step 3: Add new constraint with updated values
ALTER TABLE resources ADD CONSTRAINT resources_type_check 
CHECK (type IN ('studio_space', 'equipment', 'venue', 'vehicle', 'service', 'other'));

-- Step 4: Add type-specific columns
ALTER TABLE resources ADD COLUMN IF NOT EXISTS capacity INTEGER;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS price_per_hour DECIMAL(10,2);
ALTER TABLE resources ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN resources.capacity IS 'For venues/spaces: max occupancy';
COMMENT ON COLUMN resources.price_per_hour IS 'Hourly rental rate if applicable';
COMMENT ON COLUMN resources.specifications IS 'Type-specific details: equipment specs, vehicle details, service offerings, etc.';