import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Create table if it doesn't exist (you should run this once in your Supabase dashboard)
export const createSummariesTable = async () => {
  const { error } = await supabase.rpc('create_summaries_table');
  if (error) {
    console.error('Error creating summaries table:', error);
  }
};

/*
SQL to run in Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id TEXT NOT NULL,
  original_url TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  summary_urdu TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_summaries_blog_id ON summaries(blog_id);
CREATE INDEX IF NOT EXISTS idx_summaries_url ON summaries(original_url);
*/
