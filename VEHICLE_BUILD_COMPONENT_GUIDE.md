# Vehicle Build Project Component Guide

This document explains how to target and work with the Vehicle Build Project components in the Findry application.

## Overview

The Vehicle Build project type is a specialized project view that provides detailed tracking for vehicle conversion projects. It includes phases, tasks, parts tracking, and specialized UI components.

## Component Location and Structure

### Main Components

1. **VehicleBuildProject** (`src/components/projects/VehicleBuildProject.tsx`)
   - Main component for rendering Vehicle Build projects
   - Displays phases, tasks, progress tracking, and project details
   - Conditionally rendered when `project.type === "Vehicle Build"`

2. **VehicleBuildShowcase** (`src/pages/VehicleBuildShowcase.tsx`)
   - Standalone showcase page at `/vehicle-build` route
   - Contains sample/demo data for Vehicle Build projects

3. **EditProject** (`src/pages/EditProject.tsx`)
   - Edit form for all project types including Vehicle Build
   - Route: `/projects/:projectId/edit`

## Routing Structure

```
/projects/:projectId          -> ProjectDetail.tsx (conditionally renders VehicleBuildProject)
/projects/:projectId/edit     -> EditProject.tsx
/vehicle-build                -> VehicleBuildShowcase.tsx (demo page)
```

## How Project Type Routing Works

In `src/pages/ProjectDetail.tsx`, the component checks the project type and conditionally renders:

```typescript
// Check if this is a product landing page project
if (project.type === "product_launch" || project.name?.toLowerCase().includes("offwocken")) {
  return <ProductLandingPage project={project} />;
}

// Check if this is a vehicle build project
if (project.type === "Vehicle Build") {
  return <VehicleBuildProject project={project} />;
}

// Default project detail view
return <Layout>...</Layout>;
```

## Database Schema

Vehicle Build projects use the standard `projects` table but with specific type and additional tables:

### Core Tables
- `projects` - Main project data with `type = "Vehicle Build"`
- `vehicle_builds` - Extended vehicle-specific data
- `vehicle_build_phases` - Build phases/components
- `vehicle_build_tasks` - Tasks within each phase
- `vehicle_build_parts` - Parts and materials tracking

### Key Fields
- `project.type` should be `"Vehicle Build"` to trigger the specialized component
- `project.components` - Mapped to build phases
- `project.tasks` - Individual tasks within phases

## How to Target Vehicle Build Components

### 1. For UI/Frontend Changes

Target these files:
- `src/components/projects/VehicleBuildProject.tsx` - Main Vehicle Build component
- `src/pages/VehicleBuildShowcase.tsx` - Demo/showcase page
- `src/pages/ProjectDetail.tsx` - Conditional rendering logic

### 2. For Database/Backend Changes

Work with these files:
- `create_vehicle_build_tables.sql` - Database schema
- `src/types/project.ts` - TypeScript interfaces
- `src/hooks/use-project.ts` - Data fetching logic

### 3. For Routing Changes

Modify:
- `src/App.tsx` - Route definitions
- `src/pages/ProjectDetail.tsx` - Conditional component rendering

## Component Features

### VehicleBuildProject Features
- ✅ Project header with edit button (owner only)
- ✅ Navigation back to projects list
- ✅ Phase-based progress tracking
- ✅ Task management within phases
- ✅ Parts and materials tracking
- ✅ Cost estimation vs actual costs
- ✅ Timeline and status management

### User Permissions
- Only project owners can see the "Edit Project" button
- Ownership determined by `project.owner_id === user.id || project.created_by === user.id`

## Recent Fixes Applied

### 1. Fixed "Edit Project" Button Issue
**Problem**: Clicking "Edit Project" went to 404 (route didn't exist)
**Solution**: 
- Created `EditProject.tsx` component
- Added route `/projects/:projectId/edit` in `App.tsx`
- Added edit button to `VehicleBuildProject.tsx`

### 2. Fixed Vehicle Build Project Detection
**Problem**: VehicleBuildProject component wasn't being rendered
**Solution**: Added conditional rendering in `ProjectDetail.tsx` for `project.type === "Vehicle Build"`

## Testing Vehicle Build Projects

### 1. Create a Vehicle Build Project
```typescript
// In your project creation form, set:
{
  type: "Vehicle Build",
  name: "My Van Conversion",
  description: "Converting a van into a mobile home"
}
```

### 2. Navigate to Project Detail
- URL: `/projects/{projectId}`
- Should render `VehicleBuildProject` component instead of default project view

### 3. Test Edit Functionality
- Click "Edit Project" button (visible to owners only)
- Should navigate to `/projects/{projectId}/edit`
- Should load `EditProject.tsx` component

## Sample Data

See `create_vehicle_build_tables.sql` for sample project data:
- Project ID: `550e8400-e29b-41d4-a716-446655440000`
- Type: "Vehicle Build"
- Name: "Bread Truck Conversion"

## Future Enhancements

Potential areas for improvement:
1. Add more vehicle-specific fields to edit form
2. Implement parts inventory management
3. Add photo/progress image uploads
4. Integrate with external parts suppliers
5. Add cost tracking and budget alerts
6. Implement phase dependencies and scheduling

## Troubleshooting

### Edit Button Goes to 404
- Verify route exists in `App.tsx`
- Check that `EditProject.tsx` component is imported
- Ensure project ID is valid

### VehicleBuildProject Not Rendering
- Verify `project.type === "Vehicle Build"` exactly
- Check conditional rendering logic in `ProjectDetail.tsx`
- Ensure project data is loaded correctly

### Permission Issues
- Verify user authentication
- Check ownership logic (`project.owner_id` or `project.created_by`)
- Ensure user ID matches project owner