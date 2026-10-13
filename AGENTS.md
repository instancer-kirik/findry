# Architecture rules

- Keep inventory edits as row-local drafts with explicit saves to `space_tools`; this prevents incomplete cell edits from being persisted.
- Parse DXF drawings with dxf-parser and store normalized line segments in a single floorplan item's metadata (or a bundled drawing key for seeded reference drawings); this preserves editable placement and existing floorplan access rules without creating hundreds of wall items.
- Import drawings at explicit physical units without auto-fitting room dimensions; this prevents distortion of measured floorplans.