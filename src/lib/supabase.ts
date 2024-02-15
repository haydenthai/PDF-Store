import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseURL) {
  throw new Error(`Expected env var NEXT_PUBLIC_SUPABASE_URL`);
}
if (!supabaseKey) {
  throw new Error(`Expected env var NEXT_PUBLIC_SUPABASE_KEY`);
}
const options = {
  auth: {
    debug: false,
  },
};
export const supabase = createClient(supabaseURL, supabaseKey, options);
export default supabase;
