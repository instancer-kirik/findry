
# Venue Floorplans — vendor booths, panel rooms, gallery walls, outdoor festivals

A spatial planner attached to events. Organizers design the layout in a 2D top-down editor, viewers walk it in 3D. Spots can be assigned by the organizer or self-claimed by vendors/artists/speakers.

## What gets built

### 1. Editor: top-down 2D canvas
Extends the proven `LayoutConfigurator` pattern (palette → canvas → properties panel).

- **Canvas presets**: Indoor hall (rectangle), L-shape, multi-room gallery, outdoor field
- **Tools**: pan, zoom, grid snap, ruler (feet/meters), aisle-width guides
- **Item palette** (categorized):
  - *Expo*: 10×10 booth, 10×20 booth, table, power drop, signage
  - *Panel/Stage*: stage, seating block, AV booth, entrance
  - *Gallery*: wall segment, pedestal, bench, lighting track
  - *Outdoor*: tent, food truck, port-a-loo, generator, fence, path
- **Per-item**: position, rotation, size, label, capacity, optional asset (artwork/vendor/panel)

### 2. Walkable 3D view
`@react-three/fiber@^8.18` + `@react-three/drei@^9.122.0` (React 18 compatible).
- Extrudes 2D plan into 3D: walls 3m tall, booths as 2.5m boxes with signage decal, pedestals with floating artwork plane, tents as cones, stages as raised platforms
- `PointerLockControls` for WASD + mouse-look fly-through, plus orbit fallback
- Click a booth/wall/pedestal in 3D → opens its assignment drawer
- Lazy-loaded route to keep bundle slim

### 3. Assignment model (both organizer + self-claim)
Per-floorplan setting: `claim_mode = organizer | open | hybrid`.
- Organizer can pre-assign any spot from a roster
- Open spots show a "Claim this spot" CTA to logged-in users; vendor/artist application includes a note, organizer approves
- Each spot links to one of: `profiles`, `projects` (vendor brand), `panels`, `ugc_content` (artwork)

### 4. Where it lives
- New page `/events/:id/floorplan` (editor for organizer, view for everyone)
- New tab on event detail "Floorplan"
- Standalone `/floorplans` index of public layouts
- Walkable view at `/events/:id/floorplan/walk`

## Data model

```text
venue_floorplans
  event_id (nullable — also reusable for venues/garages)
  venue_id (nullable)
  title, description
  canvas (jsonb)   -- {width, height, units, rooms:[{shape, points}], background}
  claim_mode       -- organizer | open | hybrid
  created_by, is_public

floorplan_items
  floorplan_id
  kind             -- booth | table | wall | pedestal | stage | tent | truck | path | misc
  label
  x, y, w, h, rotation, z   -- z used for 3D height override
  meta (jsonb)              -- color, icon, capacity, etc.

floorplan_assignments
  item_id
  status           -- assigned | pending_claim | confirmed | declined
  assigned_user_id (nullable)
  project_id (nullable)     -- vendor brand
  panel_id (nullable)
  ugc_id (nullable)         -- artwork on a wall/pedestal
  note
```
RLS: organizer of the event (creator) writes; everyone reads public floorplans; claimants can insert pending_claim rows for their own user_id.

## Technical notes

- Reuse the drag/select/rotate logic from `vehicle-build/LayoutConfigurator.tsx` — split it into a generic `<SpatialCanvas>` so vehicles and floorplans share it
- 3D scene is a pure function of `floorplan_items` — no separate 3D file format
- Artwork textures pulled from `ugc_content.media_url`; booth signage rendered as a Three.js `<Text>` from drei
- Realtime: subscribe to `floorplan_items` + `floorplan_assignments` so collaborative editing and live claim updates work
- Bundle: lazy-load the 3D route; keep Three.js out of the main chunk

## Build order

1. Migration: 3 tables + grants + RLS + realtime publication
2. Generic `<SpatialCanvas>` extracted from vehicle configurator
3. `/events/:id/floorplan` editor page + `use-floorplan` hook
4. Assignment drawer (organizer assign + self-claim flow)
5. Install `@react-three/fiber@8.18` + `@react-three/drei@9.122.0`, build `<FloorplanScene3D>` and `/walk` route
6. Floorplan tab on event detail + `/floorplans` index
7. Seed a demo expo, a gallery, and an outdoor festival on existing demo events
