/*
  # Update videos table with reliable video sources

  1. Changes
    - Updates existing video URLs to more reliable Vimeo sources
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

-- Insert sample videos using Vimeo URLs which are more reliable
INSERT INTO videos (name, url, thumbnail_url)
VALUES 
  ('Security Camera - Parking Lot', 'https://player.vimeo.com/external/477260959.sd.mp4?s=b45f0cc4b0f8503a2d55d5c0f1c0ce0f55d7d516&profile_id=164&oauth2_token_id=57447761', NULL),
  ('Security Guard - Entrance', 'https://player.vimeo.com/external/371837720.sd.mp4?s=6e69e8b3e8bf7719d9e133e9b4512b55b8b6b683&profile_id=164&oauth2_token_id=57447761', NULL),
  ('Office Security Camera', 'https://player.vimeo.com/external/403295268.sd.mp4?s=3446f36ca57399e7bf3613c296fb4b5b26ffd468&profile_id=164&oauth2_token_id=57447761', NULL),
  ('Surveillance Camera - Street', 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761', NULL);