/*
  # Update videos table with custom video sources

  1. Changes
    - Updates existing video URLs to custom Supabase storage sources
    - Only creates the table and policy if they don't already exist
  2. Security
    - Ensures RLS policy exists for public access
*/

-- Check if table exists before creating it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'videos') THEN
    CREATE TABLE videos (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      url text NOT NULL,
      thumbnail_url text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

    -- Create policy only if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM pg_policies 
      WHERE tablename = 'videos' AND policyname = 'Videos are viewable by everyone'
    ) THEN
      CREATE POLICY "Videos are viewable by everyone"
        ON videos
        FOR SELECT
        TO public
        USING (true);
    END IF;
  END IF;
END $$;

-- Delete existing videos if any
DELETE FROM videos;

-- Insert custom videos from Supabase storage
INSERT INTO videos (name, url, thumbnail_url)
VALUES 
  ('Hall Crowd', 'https://bbsrdjhuyigynjezuvne.supabase.co/storage/v1/object/sign/video/hall-crowd-02.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby9oYWxsLWNyb3dkLTAyLm1wNCIsImlhdCI6MTc0MDgyODAzNCwiZXhwIjoxNzcyMzY0MDM0fQ.UNKUy5Wzt6-5GSfer3rIMnPwQzmzIVygmzAzhD6kI2M', NULL),
  ('Entrance Video 1', 'https://bbsrdjhuyigynjezuvne.supabase.co/storage/v1/object/sign/video/01%20-%20Made%20with%20Clipchamp.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby8wMSAtIE1hZGUgd2l0aCBDbGlwY2hhbXAubXA0IiwiaWF0IjoxNzQwODI4MDkwLCJleHAiOjE3NzIzNjQwOTB9.JUrJ1CO6X2dzcighW3kYXklhSBu51au_h-xRgrHTC8E', NULL),
  ('Entrance Video 2', 'https://bbsrdjhuyigynjezuvne.supabase.co/storage/v1/object/sign/video/02%20-%20Made%20with%20Clipchamp.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby8wMiAtIE1hZGUgd2l0aCBDbGlwY2hhbXAubXA0IiwiaWF0IjoxNzQwODI4MTA5LCJleHAiOjE3NzIzNjQxMDl9.ZfeNZP6iUd0fmWrNkkvRZ-qZaH3lnOzc1WZ-yEcSfdY', NULL),
  ('Discussion Space Cam 1', 'https://bbsrdjhuyigynjezuvne.supabase.co/storage/v1/object/sign/video/videos/03.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby92aWRlb3MvMDMubXA0IiwiaWF0IjoxNzQwODM1MDgyLCJleHAiOjE3NzIzNzEwODJ9.xpJGzXIa5facKcY0GXLapuvSGpS0iWGySfCHoWrjLxc', NULL),
  ('Discussion Space Cam 2', 'https://bbsrdjhuyigynjezuvne.supabase.co/storage/v1/object/sign/video/videos/05.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby92aWRlb3MvMDUubXA0IiwiaWF0IjoxNzQwODM1MTgxLCJleHAiOjE3NzIzNzExODF9.1BrWVpE75-G1QCRg0Z3T2zZoSmps-_0cKL2iG_t_lpo', NULL);