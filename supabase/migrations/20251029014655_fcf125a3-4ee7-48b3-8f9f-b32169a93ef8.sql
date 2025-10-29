-- Sync owner_id field with content_ownership table for consistency
-- This ensures projects have owner_id set based on content_ownership records

UPDATE projects p
SET owner_id = co.owner_id,
    updated_at = now()
FROM content_ownership co
WHERE co.content_id = p.id
  AND co.content_type = 'project'
  AND p.owner_id IS NULL;