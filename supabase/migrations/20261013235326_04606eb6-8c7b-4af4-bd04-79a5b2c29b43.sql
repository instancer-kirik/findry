UPDATE public.floorplan_items SET meta = meta || '{"locked": true}'::jsonb
WHERE floorplan_id='617b20a6-8edf-4218-a6b4-ed6cfca9f749' AND meta->>'source'='shop_dxf_outline';