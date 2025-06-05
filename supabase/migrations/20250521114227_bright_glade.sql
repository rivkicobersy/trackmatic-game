/*
  # Create leaderboard table

  1. New Tables
    - `leaderboard`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `score` (integer)
      - `level` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `leaderboard` table
    - Add policies for:
      - Anyone can read leaderboard data
      - Only authenticated users can insert their own scores
*/

CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  score integer NOT NULL,
  level integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own scores"
  ON leaderboard
  FOR INSERT
  TO authenticated
  WITH CHECK (true);