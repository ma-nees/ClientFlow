import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// This uses the service role key to bypass RLS, as this is the backend.
// Do NOT expose this key to the frontend.
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
