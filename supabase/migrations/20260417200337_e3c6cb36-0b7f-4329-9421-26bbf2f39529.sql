
-- 1. Extend content_type enum to cover all project sources
ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'development_project';
ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'product_idea';
ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'loreum_work';
ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'vehicle_config';
ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'video_project';
ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'catalog_entry';
