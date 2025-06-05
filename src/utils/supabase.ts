import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please click the "Connect to Supabase" button in the top right to set up your database connection.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getLeaderboard = async () => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data;
};

export const getPlayerEmails = async () => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('name, email')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching player emails:', error);
    return [];
  }

  return data;
};

export const updateLeaderboard = async (player: {
  name: string;
  email: string;
  score: number;
  level: number;
}) => {
  const { error } = await supabase
    .from('leaderboard')
    .insert([player]);

  if (error) {
    console.error('Error updating leaderboard:', error);
  }
};