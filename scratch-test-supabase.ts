import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function test() {
  console.log("Testing user_profiles table...");
  const { data, error } = await supabase.from("user_profiles").select("firebase_uid").limit(1);
  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Table exists! Data:", data);
  }
}

test();
