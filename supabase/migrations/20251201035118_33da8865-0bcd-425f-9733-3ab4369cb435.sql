-- Add new columns to shopping_list table
ALTER TABLE shopping_list
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS actual_cost DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'budgeted', 'ordered', 'purchased', 'received')),
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS resource_id UUID REFERENCES resources(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_shopping_list_owner ON shopping_list(owner_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_project ON shopping_list(project_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_category ON shopping_list(category);
CREATE INDEX IF NOT EXISTS idx_shopping_list_status ON shopping_list(status);

-- Update RLS policies if they don't exist
DO $$ BEGIN
  -- Enable RLS
  ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own shopping list" ON shopping_list;
  DROP POLICY IF EXISTS "Users can insert their own shopping list items" ON shopping_list;
  DROP POLICY IF EXISTS "Users can update their own shopping list items" ON shopping_list;
  DROP POLICY IF EXISTS "Users can delete their own shopping list items" ON shopping_list;
  
  -- Create new policies
  CREATE POLICY "Users can view their own shopping list"
    ON shopping_list FOR SELECT
    USING (auth.uid() = owner_id);
  
  CREATE POLICY "Users can insert their own shopping list items"
    ON shopping_list FOR INSERT
    WITH CHECK (auth.uid() = owner_id);
  
  CREATE POLICY "Users can update their own shopping list items"
    ON shopping_list FOR UPDATE
    USING (auth.uid() = owner_id);
  
  CREATE POLICY "Users can delete their own shopping list items"
    ON shopping_list FOR DELETE
    USING (auth.uid() = owner_id);
END $$;