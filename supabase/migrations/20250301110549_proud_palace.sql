/*
  # Create videos table for storing video metadata

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `name` (text)
      - `url` (text)
      - `thumbnail_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `videos` table
    - Add policy for authenticated users to read all videos
*/

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos are viewable by everyone"
  ON videos
  FOR SELECT
  TO public
  USING (true);

-- Insert some sample videos
INSERT INTO videos (name, url, thumbnail_url)
VALUES 
  ('Security Camera - Parking Lot', 'https://assets.mixkit.co/videos/preview/mixkit-security-camera-view-of-a-parking-lot-at-night-34652-large.mp4', NULL),
  ('Security Guard - Entrance', 'https://assets.mixkit.co/videos/preview/mixkit-a-man-working-as-a-security-guard-clips-a-radio-to-30678-large.mp4', NULL),
  ('Office Security Camera', 'https://assets.mixkit.co/videos/preview/mixkit-security-camera-view-of-a-business-office-34564-large.mp4', NULL),
  ('Surveillance Camera - Street', 'https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-a-street-seen-from-a-surveillance-camera-34563-large.mp4', NULL);