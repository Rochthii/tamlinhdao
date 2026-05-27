import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Connecting to Supabase at:", supabaseUrl);
  const { data, error } = await supabase.from('services').select('*');
  if (error) {
    console.error("Error fetching services:", error);
  } else {
    console.log("Services loaded from database count:", data.length);
    console.log("Services list:");
    console.log(JSON.stringify(data, null, 2));
  }
}

test();
