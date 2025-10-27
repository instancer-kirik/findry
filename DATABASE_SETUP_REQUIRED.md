# Database Setup Required for Landing Pages

## Issue: Missing Database Columns

The landing page functionality requires additional columns in the `projects` table that are currently missing. You need to run the following SQL commands in your database to fix this.

## Required SQL Migration

Run these SQL commands in your PostgreSQL database (via Supabase dashboard, psql, or your preferred database tool):

```sql
-- Add landing page columns to projects table
-- This migration adds the necessary columns for custom landing pages

-- Add the landing_page column to store JSON data
ALTER TABLE projects
ADD COLUMN landing_page jsonb DEFAULT NULL;

-- Add the has_custom_landing flag
ALTER TABLE projects
ADD COLUMN has_custom_landing boolean NOT NULL DEFAULT false;

-- Create an index on has_custom_landing for better query performance
CREATE INDEX idx_projects_has_custom_landing ON projects (has_custom_landing) WHERE has_custom_landing = true;

-- Create an index on landing_page for JSON queries
CREATE INDEX idx_projects_landing_page_gin ON projects USING gin (landing_page) WHERE landing_page IS NOT NULL;

-- Update existing projects that might have landing page data
-- This is a safety measure in case there's any existing data
UPDATE projects
SET has_custom_landing = true
WHERE landing_page IS NOT NULL
  AND landing_page != 'null'::jsonb
  AND jsonb_typeof(landing_page) = 'object';

-- Add comments to document the columns
COMMENT ON COLUMN projects.landing_page IS 'JSON data for custom landing page configuration including hero section, sections, theme, and social links';
COMMENT ON COLUMN projects.has_custom_landing IS 'Boolean flag indicating if the project has a custom landing page configured and ready for public viewing';
```

## How to Run This Migration

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste the SQL commands above
5. Click "Run" to execute

### Option 2: Command Line (if you have direct access)
```bash
# Connect to your database
psql "postgresql://username:password@host:port/database"

# Run the migration
\i add_landing_page_columns.sql
```

### Option 3: Database GUI Tool
- Use pgAdmin, DBeaver, or similar tool
- Connect to your database
- Execute the SQL commands

## Verification

After running the migration, verify it worked by checking the columns exist:

```sql
-- Verify the changes
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'projects'
  AND column_name IN ('landing_page', 'has_custom_landing')
ORDER BY column_name;
```

You should see output like:
```
      column_name      | data_type | is_nullable | column_default
-----------------------+-----------+-------------+---------------
 has_custom_landing    | boolean   | NO          | false
 landing_page          | jsonb     | YES         | 
```

## What This Fixes

Once you run this migration:

1. ✅ The "🧪 Test Save" button will work
2. ✅ Landing page creation and editing will work
3. ✅ Projects will show landing page options when they have them
4. ✅ The debug info will show `Landing: ✓` for projects with landing pages
5. ✅ All ProductHunt-like features will be fully functional

## Sample Landing Page Data Structure

After the migration, landing pages will be stored as JSON in the `landing_page` column like this:

```json
{
  "hero_title": "My Amazing Project",
  "hero_subtitle": "Building the future, one component at a time",
  "call_to_action": "Learn More",
  "cta_link": "/projects/project-id",
  "theme": "default",
  "sections": [
    {
      "id": "features",
      "type": "features", 
      "title": "Key Features",
      "order": 1,
      "visible": true,
      "content": "List of amazing features..."
    }
  ],
  "social_links": [
    {
      "platform": "github",
      "url": "https://github.com/user/repo",
      "label": "View Source"
    }
  ]
}
```

## After Migration - Test Steps

1. Refresh your browser
2. Go to any project detail page (`/projects/:id`)
3. Try the "🧪 Test Save" button - it should now work!
4. Create a real landing page using "Create Landing Page"
5. The debug info should show: `Landing: ✓ | Data: ✓ | Public: ✓`
6. Click "View Landing" to see your landing page

## Troubleshooting

### If you get permission errors:
- Make sure you're running the commands as a user with ALTER TABLE permissions
- In Supabase, make sure you're using the service role key, not the anon key

### If the commands fail:
- Check that the `projects` table exists: `\dt projects`
- Verify you're connected to the correct database
- Check for any existing columns with those names: `\d projects`

### If you see "column already exists" errors:
That's fine! It means the columns were already added. You can skip those specific commands.

## Performance Notes

The indexes created will help with:
- Fast queries for projects with landing pages (`has_custom_landing = true`)
- Efficient JSON queries on landing page data
- Better performance in the projects showcase page

## Security Notes

The `landing_page` column stores user-generated content as JSON. The application validates this data before saving, but you may want to add additional database constraints if needed.

## Next Steps

After running this migration, all the ProductHunt-like features we implemented will work perfectly:
- ✨ Featured projects on the main page
- 💖 Like and view tracking  
- 🔗 Shareable landing pages
- 📱 Social sharing integration
- 🎨 Custom themes and layouts
- 📊 Project discovery and filtering

Your Findry instance will be ready to showcase projects like ProductHunt! 🚀