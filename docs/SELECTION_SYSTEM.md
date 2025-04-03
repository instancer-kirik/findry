# Selection System

## Overview

The Selection System in Findry enables users to easily discover, view, and select items for events, collections, and other organizational purposes. This document outlines the structure and functionality of the selection mechanics across the application.

## Components and Flows

### 1. Discover Page Selection Flow

The primary entry point for selecting items is the Discover page:

1. User navigates to the Discover page
2. User filters content by category (artists, venues, resources, etc.)
3. User finds desired items in the results grid
4. **Selection Actions:**
   - Click on an item card to view details
   - Use "Select" button to add item to current context (event, collection)
   - Use "Quick Add" button in the item card for immediate selection

### 2. Selection Dialog

When selecting items for events or collections, a dedicated selection dialog appears:

```tsx
<Dialog>
  <DialogTrigger>
    <Button>Select {itemType}</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Select {itemType} for {contextType}</DialogTitle>
    </DialogHeader>
    <Tabs>
      <TabsList>
        <TabsTrigger value="recent">Recent</TabsTrigger>
        <TabsTrigger value="saved">Saved</TabsTrigger>
        <TabsTrigger value="search">Search</TabsTrigger>
      </TabsList>
      <TabsContent value="recent">
        {/* Recently viewed/used items */}
      </TabsContent>
      <TabsContent value="saved">
        {/* Items in user's saved collections */}
      </TabsContent>
      <TabsContent value="search">
        {/* Search interface with filters */}
      </TabsContent>
    </Tabs>
    <DialogFooter>
      <Button>Add Selected</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 3. Direct Selection from Artist/Resource Profile

Users can select items directly from profile pages:

1. Navigate to an artist, venue, or resource profile
2. Click "Select for Event" button
3. Choose existing event or create new event
4. Confirm selection

### 4. Batch Selection

For adding multiple items at once:

1. Enter "Selection Mode" by toggling the multi-select option
2. Check multiple items in the grid view
3. Click "Add Selected" to add all items to current context
4. View selected items count in the selection summary panel

## Selection Contexts

### 1. Event Creation/Editing

When creating or editing an event, users can select:

- **Artists** to perform at the event
- **Venues** to host the event
- **Resources** needed for the event (equipment, services)
- **Time slots** for scheduling artists and resources

### 2. Collection Building

Users can create and manage collections of:

- Favorite artists
- Bookmarked venues
- Curated resource lists
- Thematic groupings across categories

### 3. User Circles

Organizing people into logical groups:

- Collaborators
- Regular venues/clients
- Session musicians
- Production team members

## Integration with Other Systems

### 1. Tag System Integration

Selected items can be:
- Tagged for easier future selection
- Filtered by existing tags
- Organized into custom categories

### 2. Event Slot Manager Integration

The selection system connects with the Event Slot Manager to:
- Assign artists to specific time slots
- Allocate resources for particular segments
- Visualize scheduling conflicts

### 3. User Permission Integration

Item selection respects user permissions:
- Public vs. private items
- Collaboration permissions
- Booking request workflows

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Basic item selection | ✅ Complete | Selection from item cards and profiles |
| Selection dialog | 🟡 In Progress | Basic dialog implemented, needs refinement |
| Multi-select capability | 🟡 In Progress | UI elements added, functionality in development |
| Saved selections | 🔴 Planned | Will be part of user collections feature |
| Drag-and-drop organization | 🔴 Planned | For visual organization of selections |

## Next Steps

1. **Selection Dialog Enhancement**
   - Add recently used items section
   - Implement selection history
   - Add quick filters within dialog

2. **Persistent Selection**
   - Store selections in local storage for session persistence
   - Implement selection sync across devices

3. **Context-Aware Selection**
   - Suggest items based on current selection context
   - Implement smart recommendations for complementary items 