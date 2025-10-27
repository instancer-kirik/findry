# Project Landing Page Debug Guide

This document helps debug and test the landing page functionality for Findry projects.

## Quick Troubleshooting Checklist

### 1. Check Project Landing Page Status

When viewing a project detail page (`/projects/:id`), look for the debug info in the "Landing Page" section:

```
Landing: ✓/✗ | Data: ✓/✗ | Public: ✓/✗
```

- **Landing**: `has_custom_landing` field in database
- **Data**: `landing_page` field has content
- **Public**: `is_public` field is true

### 2. Database Fields Required

For a project to have a working landing page, check these fields in the `projects` table:

```sql
SELECT 
  id,
  name,
  has_custom_landing,
  is_public,
  landing_page,
  view_count,
  like_count
FROM projects 
WHERE id = 'your-project-id';
```

### 3. Expected UI Elements

#### On Project Detail Page (`/projects/:id`):
- [ ] "Landing Page" section with debug info
- [ ] "View Landing" button (if has landing page)
- [ ] "Edit Landing" button (if owner)
- [ ] "Share Landing" button
- [ ] Share dropdown includes "View Landing Page" option

#### On Projects List (`/projects`):
- [ ] Projects with landing pages show "Landing" button in footer
- [ ] Featured van project shows "Landing Page" button

#### On Projects Showcase (`/discover/projects`):
- [ ] Landing page icon on project cards (top-right corner)
- [ ] Projects with `has_custom_landing: true` show external link button

### 4. URL Patterns

- **Project Detail**: `/projects/:id`
- **Project Landing**: `/projects/:id/landing`
- **Projects List**: `/projects`
- **Projects Showcase**: `/discover/projects`

### 5. Common Issues & Solutions

#### Issue: "No landing page available for this project" error
**Cause**: Project doesn't have `has_custom_landing: true` or `landing_page` data
**Solution**: 
1. Go to project detail page
2. Click "Create Landing Page"
3. Fill out the landing page form
4. Save the landing page

#### Issue: Landing page buttons not showing
**Cause**: Project missing required flags
**Solution**:
```sql
UPDATE projects 
SET 
  has_custom_landing = true,
  is_public = true
WHERE id = 'your-project-id' 
  AND landing_page IS NOT NULL;
```

#### Issue: Landing page shows 404 or "not found"
**Cause**: 
1. Project is not public (`is_public = false`)
2. Landing page data is malformed
3. Project doesn't exist

**Solution**: Check database and ensure:
```sql
SELECT * FROM projects 
WHERE id = 'your-project-id' 
  AND is_public = true 
  AND has_custom_landing = true;
```

### 6. Test Landing Page Creation

#### Step-by-step test:
1. Create a new project: `/create-project`
2. Go to project detail: `/projects/:id`
3. Click "Create Landing Page"
4. Fill in required fields:
   - Hero Title
   - Hero Subtitle
   - Background image/video (optional)
   - Call-to-action button text and link
5. Save landing page
6. Verify debug info shows: `Landing: ✓ | Data: ✓ | Public: ✓`
7. Click "View Landing" button
8. Should open `/projects/:id/landing` in new tab

### 7. Sample Landing Page Data Structure

```json
{
  "hero_title": "My Amazing Project",
  "hero_subtitle": "Building the future, one component at a time",
  "hero_image": "https://example.com/image.jpg",
  "cta_text": "View Project",
  "cta_link": "/projects/project-id",
  "theme": "default",
  "sections": [
    {
      "type": "text",
      "content": "This is my project description..."
    },
    {
      "type": "features",
      "features": ["Feature 1", "Feature 2", "Feature 3"]
    }
  ],
  "social_links": {
    "github": "https://github.com/user/repo",
    "twitter": "https://twitter.com/user"
  }
}
```

### 8. Manual Database Setup (if needed)

If you need to manually set up a project with a landing page:

```sql
-- Create or update project with landing page
UPDATE projects SET
  landing_page = '{
    "hero_title": "Test Project",
    "hero_subtitle": "A test project with landing page",
    "cta_text": "Learn More",
    "cta_link": "/projects/project-id",
    "theme": "default"
  }'::jsonb,
  has_custom_landing = true,
  is_public = true
WHERE id = 'your-project-id';
```

### 9. Sharing URLs

Projects with landing pages should use these URLs for sharing:
- **Social sharing**: `/projects/:id/landing` (public landing page)
- **Internal links**: `/projects/:id` (full project detail)

### 10. ProductHunt-like Features Checklist

- [ ] Featured projects section on main page
- [ ] Project cards with hover effects and stats
- [ ] Like/unlike functionality
- [ ] View count tracking
- [ ] Social sharing buttons (Twitter, Facebook, LinkedIn)
- [ ] Landing page external link buttons
- [ ] Progress bars on project cards
- [ ] Sorting by trending, newest, most liked
- [ ] Status filtering
- [ ] Search functionality

### 11. Debug Commands

```javascript
// Check project data in browser console
console.log('Project data:', project);
console.log('Has landing:', project?.has_custom_landing);
console.log('Landing data:', project?.landing_page);
console.log('Is public:', project?.is_public);

// Test landing page URL
window.open(`/projects/${projectId}/landing`, '_blank');
```

### 12. Quick Test Script

Run this in browser console on project detail page:

```javascript
// Quick landing page test
const projectId = window.location.pathname.split('/')[2];
console.log('Testing project:', projectId);

// Try to open landing page
fetch(`/projects/${projectId}/landing`)
  .then(response => {
    if (response.ok) {
      console.log('✅ Landing page accessible');
      window.open(`/projects/${projectId}/landing`, '_blank');
    } else {
      console.log('❌ Landing page not accessible:', response.status);
    }
  })
  .catch(error => {
    console.log('❌ Error accessing landing page:', error);
  });
```

### 13. Expected Behavior Summary

1. **New Projects**: Show "Create Landing Page" button and CTA
2. **Projects with Landing Pages**: Show "View Landing", "Edit Landing", and "Share Landing" buttons
3. **Public Projects**: Landing pages accessible via `/projects/:id/landing`
4. **Private Projects**: Landing pages only accessible to owner
5. **Project Cards**: Show external link icon if `has_custom_landing: true`
6. **Social Sharing**: Use landing page URL when available, otherwise use project detail URL

This debug guide should help identify and resolve any landing page issues quickly!