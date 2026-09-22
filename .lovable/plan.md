# Touch-first floorplan pass

## Goal
Make the floorplan editor reliable on touchscreen laptops, phones, and compact windows without shrinking the usable plan area.

## Changes
- Replace immediate drag-on-touch with a short movement threshold so tapping selects an item without accidental movement.
- Keep the active gesture alive when the pointer leaves an item, and prevent browser scrolling/refresh gestures while moving or resizing.
- Enlarge resize handles and editing controls for touch, with clearer selected and locked states.
- Treat compact laptop widths as a tray layout, not only phone widths; keep Add and Details accessible from a bottom tray while the canvas stays prominent.
- Make the page header and saved-layout controls collapse cleanly at narrow widths.
- Keep exact-size inputs and booth presets available in the Details tray.

## Validation
- Test tap-to-select, drag, resize, zoom controls, and tray switching at mobile and compact-laptop sizes.
- Confirm a completed drag saves once and does not refresh or jump the page.
