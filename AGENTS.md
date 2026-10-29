# Architecture rules
- Keep tentative meeting availability separate from scheduled meetings; link-scoped RPCs expose names and times without exposing respondent edit keys, while only authenticated organizers can finalize a poll.

- Keep inventory edits as row-local drafts with explicit saves to `space_tools`; this prevents incomplete cell edits from being persisted.
- Store cutting-part maintenance as a validated `params.cutting_maintenance` object, and keep inferred inspection suggestions separate from saved condition; this preserves inventory permissions and avoids claiming unobserved wear.
- Share a place-scoped inventory state between floorplan assignment and zone contents, checking inventory admin rights independently of plan ownership; this keeps successful assignments synchronized without broadening permissions.
- Parse DXF drawings with dxf-parser and store normalized line segments in a single floorplan item's metadata (or a bundled drawing key for seeded reference drawings); this preserves editable placement and existing floorplan access rules without creating hundreds of wall items.
- Import drawings at explicit physical units without auto-fitting room dimensions; this prevents distortion of measured floorplans.
- Run inventory photo recognition in the admin-or-manager (moderator role) checked `catalog-detect` edge function and save only user-reviewed rows to `space_tools`; this keeps the AI key server-side and prevents unreviewed guesses from entering inventory.
- Keep camera recognition sequential and pause on failures; suppress exact repeated identities per explicit batch and release camera tracks on close/unmount so bulk capture cannot overlap requests or silently inflate quantities.
