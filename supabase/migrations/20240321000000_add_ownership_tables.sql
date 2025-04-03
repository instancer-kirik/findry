-- Create enum for content types
CREATE TYPE content_type AS ENUM (
  'project',
  'event',
  'resource',
  'community',
  'shop'
);

-- Create content_ownership table
CREATE TABLE content_ownership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL,
  content_type content_type NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(content_id, content_type)
);

-- Create RLS policies for content_ownership
ALTER TABLE content_ownership ENABLE ROW LEVEL SECURITY;

-- Allow users to view any content ownership
CREATE POLICY "Users can view any content ownership"
  ON content_ownership FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own content ownership
CREATE POLICY "Users can insert their own content ownership"
  ON content_ownership FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own content ownership
CREATE POLICY "Users can update their own content ownership"
  ON content_ownership FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Allow users to delete their own content ownership
CREATE POLICY "Users can delete their own content ownership"
  ON content_ownership FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create function to automatically set updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for content_ownership
CREATE TRIGGER update_content_ownership_updated_at
  BEFORE UPDATE ON content_ownership
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_content_ownership_owner_id ON content_ownership(owner_id);
CREATE INDEX idx_content_ownership_content_id ON content_ownership(content_id);
CREATE INDEX idx_content_ownership_content_type ON content_ownership(content_type);

-- Add RLS policies to existing tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = projects.id
      AND content_type = 'project'
      AND owner_id = auth.uid()
    )
  )
  WITH CHECK (true);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = projects.id
      AND content_type = 'project'
      AND owner_id = auth.uid()
    )
  );

-- Events policies
CREATE POLICY "Users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = events.id
      AND content_type = 'event'
      AND owner_id = auth.uid()
    )
  )
  WITH CHECK (true);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = events.id
      AND content_type = 'event'
      AND owner_id = auth.uid()
    )
  );

-- Resources policies
CREATE POLICY "Users can view all resources"
  ON resources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create resources"
  ON resources FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own resources"
  ON resources FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = resources.id
      AND content_type = 'resource'
      AND owner_id = auth.uid()
    )
  )
  WITH CHECK (true);

CREATE POLICY "Users can delete their own resources"
  ON resources FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = resources.id
      AND content_type = 'resource'
      AND owner_id = auth.uid()
    )
  );

-- Communities policies
CREATE POLICY "Users can view all communities"
  ON communities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create communities"
  ON communities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own communities"
  ON communities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = communities.id
      AND content_type = 'community'
      AND owner_id = auth.uid()
    )
  )
  WITH CHECK (true);

CREATE POLICY "Users can delete their own communities"
  ON communities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = communities.id
      AND content_type = 'community'
      AND owner_id = auth.uid()
    )
  );

-- Shops policies
CREATE POLICY "Users can view all shops"
  ON shops FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create shops"
  ON shops FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own shops"
  ON shops FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = shops.id
      AND content_type = 'shop'
      AND owner_id = auth.uid()
    )
  )
  WITH CHECK (true);

CREATE POLICY "Users can delete their own shops"
  ON shops FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_ownership
      WHERE content_id = shops.id
      AND content_type = 'shop'
      AND owner_id = auth.uid()
    )
  ); 