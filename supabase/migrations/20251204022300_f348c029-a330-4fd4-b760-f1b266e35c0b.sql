-- Create travel_locations table for POI/road resources
CREATE TABLE public.travel_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('public', 'business', 'restaurant', 'gas_station', 'park', 'shopping_center', 'campsite', 'rv_park', 'dump_station', 'water_station', 'parts_store')),
  amenities TEXT[] DEFAULT '{}',
  hours TEXT,
  is_open_24h BOOLEAN DEFAULT false,
  phone TEXT,
  website TEXT,
  photos TEXT[] DEFAULT '{}',
  accessibility BOOLEAN DEFAULT false,
  baby_changing BOOLEAN DEFAULT false,
  free BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  rating NUMERIC(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  cleanliness_rating NUMERIC(2, 1) DEFAULT 0,
  safety_rating NUMERIC(2, 1) DEFAULT 0,
  reported_issues TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create travel_location_reviews table
CREATE TABLE public.travel_location_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES public.travel_locations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  cleanliness_rating NUMERIC(2, 1) CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  safety_rating NUMERIC(2, 1) CHECK (safety_rating >= 1 AND safety_rating <= 5),
  comment TEXT,
  photos TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_travel_locations_type ON public.travel_locations(type);
CREATE INDEX idx_travel_locations_coords ON public.travel_locations(latitude, longitude);
CREATE INDEX idx_travel_locations_rating ON public.travel_locations(rating DESC);
CREATE INDEX idx_travel_location_reviews_location ON public.travel_location_reviews(location_id);

-- Enable RLS
ALTER TABLE public.travel_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_location_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for travel_locations
CREATE POLICY "Anyone can view travel locations"
  ON public.travel_locations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create locations"
  ON public.travel_locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their locations"
  ON public.travel_locations FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their locations"
  ON public.travel_locations FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS policies for travel_location_reviews
CREATE POLICY "Anyone can view reviews"
  ON public.travel_location_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.travel_location_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.travel_location_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.travel_location_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_travel_locations_updated_at
  BEFORE UPDATE ON public.travel_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_travel_location_reviews_updated_at
  BEFORE UPDATE ON public.travel_location_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();