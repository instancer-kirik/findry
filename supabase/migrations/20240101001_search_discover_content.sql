-- Create or replace stored procedure for searching discover content
CREATE OR REPLACE FUNCTION search_discover_content(
  content_type text,
  search_query text DEFAULT NULL,
  tag_filters text[] DEFAULT NULL
) RETURNS SETOF jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If content_type is artists or not specified, search in artists table
  IF content_type = 'artists' OR content_type = 'all' THEN
    RETURN QUERY
    SELECT json_build_object(
      'id', a.id,
      'name', a.name,
      'type', COALESCE(a.type, 'artist'),
      'subtype', COALESCE(a.subtype, 'artist'),
      'location', COALESCE(a.location, 'Location not specified'),
      'tags', COALESCE(a.tags, '{}'),
      'image_url', a.image_url,
      'multidisciplinary', a.multidisciplinary,
      'styles', a.styles,
      'disciplines', a.disciplines
    )
    FROM artists a
    WHERE (
      search_query IS NULL OR
      a.name ILIKE '%' || search_query || '%' OR
      a.location ILIKE '%' || search_query || '%'
    )
    AND (
      tag_filters IS NULL OR
      a.tags && tag_filters
    );
  END IF;

  -- If content_type is resources or not specified, search in resources
  IF content_type = 'resources' OR content_type = 'all' THEN
    RETURN QUERY
    SELECT json_build_object(
      'id', r.id,
      'name', r.name,
      'type', COALESCE(r.type, 'resource'),
      'subtype', COALESCE(r.subtype, r.type),
      'location', COALESCE(r.location, 'Location not specified'),
      'tags', COALESCE(r.tags, '{}'),
      'image_url', r.image_url
    )
    FROM (
      -- Union resource-related tables here
      SELECT id, name, 'space' AS type, subtype, location, tags, image_url
      FROM spaces
      UNION ALL
      SELECT id, name, 'tool' AS type, subtype, location, tags, image_url
      FROM tools
      UNION ALL
      SELECT id, name, 'offerer' AS type, subtype, location, tags, image_url
      FROM service_providers
    ) r
    WHERE (
      search_query IS NULL OR
      r.name ILIKE '%' || search_query || '%' OR
      r.location ILIKE '%' || search_query || '%'
    )
    AND (
      tag_filters IS NULL OR
      r.tags && tag_filters
    );
  END IF;

  -- If content_type is events or not specified, search in events
  IF content_type = 'events' OR content_type = 'all' THEN
    RETURN QUERY
    SELECT json_build_object(
      'id', e.id,
      'name', e.name,
      'type', 'event',
      'subtype', COALESCE(e.subtype, 'event'),
      'location', COALESCE(e.location, 'Location not specified'),
      'tags', COALESCE(e.tags, '{}'),
      'image_url', e.image_url,
      'start_date', e.start_date,
      'end_date', e.end_date
    )
    FROM events e
    WHERE (
      search_query IS NULL OR
      e.name ILIKE '%' || search_query || '%' OR
      e.location ILIKE '%' || search_query || '%' OR
      e.description ILIKE '%' || search_query || '%'
    )
    AND (
      tag_filters IS NULL OR
      e.tags && tag_filters
    );
  END IF;

  -- If content_type is venues or not specified, search in venues
  IF content_type = 'venues' OR content_type = 'all' THEN
    RETURN QUERY
    SELECT json_build_object(
      'id', v.id,
      'name', v.name,
      'type', 'venue',
      'subtype', COALESCE(v.subtype, 'venue'),
      'location', COALESCE(v.location, 'Location not specified'),
      'tags', COALESCE(v.tags, '{}'),
      'image_url', v.image_url,
      'capacity', v.capacity
    )
    FROM venues v
    WHERE (
      search_query IS NULL OR
      v.name ILIKE '%' || search_query || '%' OR
      v.location ILIKE '%' || search_query || '%'
    )
    AND (
      tag_filters IS NULL OR
      v.tags && tag_filters
    );
  END IF;

  -- If content_type is communities or not specified, search in communities
  IF content_type = 'communities' OR content_type = 'all' THEN
    RETURN QUERY
    SELECT json_build_object(
      'id', c.id,
      'name', c.name,
      'type', 'community',
      'subtype', COALESCE(c.subtype, 'community'),
      'location', COALESCE(c.location, 'Location not specified'),
      'tags', COALESCE(c.tags, '{}'),
      'image_url', c.image_url,
      'member_count', c.member_count
    )
    FROM communities c
    WHERE (
      search_query IS NULL OR
      c.name ILIKE '%' || search_query || '%' OR
      c.location ILIKE '%' || search_query || '%'
    )
    AND (
      tag_filters IS NULL OR
      c.tags && tag_filters
    );
  END IF;

  -- If content_type is brands or not specified, search in brands
  IF content_type = 'brands' OR content_type = 'all' THEN
    RETURN QUERY
    SELECT json_build_object(
      'id', b.id,
      'name', b.name,
      'type', 'brand',
      'subtype', COALESCE(b.subtype, 'brand'),
      'location', COALESCE(b.location, 'Location not specified'),
      'tags', COALESCE(b.tags, '{}'),
      'image_url', b.image_url
    )
    FROM brands b
    WHERE (
      search_query IS NULL OR
      b.name ILIKE '%' || search_query || '%' OR
      b.location ILIKE '%' || search_query || '%'
    )
    AND (
      tag_filters IS NULL OR
      b.tags && tag_filters
    );
  END IF;

  -- If content_type is projects or not specified, search in projects
  IF content_type = 'projects' OR content_type = 'all' THEN
    RETURN QUERY
    SELECT json_build_object(
      'id', p.id,
      'name', p.name,
      'type', 'project',
      'subtype', COALESCE(p.subtype, 'project'),
      'location', COALESCE(p.location, 'Location not specified'),
      'tags', COALESCE(p.tags, '{}'),
      'image_url', p.image_url,
      'timeline', p.timeline,
      'budget', p.budget
    )
    FROM projects p
    WHERE (
      search_query IS NULL OR
      p.name ILIKE '%' || search_query || '%' OR
      p.location ILIKE '%' || search_query || '%'
    )
    AND (
      tag_filters IS NULL OR
      p.tags && tag_filters
    );
  END IF;

  RETURN;
END;
$$; 