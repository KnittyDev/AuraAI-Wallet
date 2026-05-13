import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing Supabase connection...");
  const { data, error, status } = await supabase
    .from('balances')
    .select('amount')
    .limit(1);

  if (error) {
    console.error("Error:", error);
    console.error("Status:", status);
  } else {
    console.log("Success! Data:", data);
  }
}

test();
