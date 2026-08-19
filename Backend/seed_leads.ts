import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

// We'll use a valid, generic UUID so Postgres doesn't complain
const MOCK_UUID = "00000000-0000-0000-0000-000000000000";

dotenv.config({ path: "./.env" });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function seed() {
  console.log("Seeding leads with mock UUID to bypass PostgreSQL restrictions...");

  const leads = [
    {
      user_id: MOCK_UUID,
      business_name: "TechNova Solutions",
      contact_name: "Alex Mercer",
      email: "alex@technova.example.com",
      phone: "+1-555-0198",
      website: "technovasolutions.com",
      city: "San Francisco",
      country: "USA",
      industry: "Software Development",
      website_status: "UNKNOWN",
      opportunity: "REDESIGN"
    },
    {
      user_id: MOCK_UUID,
      business_name: "GreenLeaf Landscaping",
      contact_name: "Sarah Jenkins",
      email: "sarah@greenleaf.example.com",
      phone: "+1-555-0123",
      website: null,
      city: "Austin",
      country: "USA",
      industry: "Home Services",
      website_status: "NO_WEBSITE",
      opportunity: "NEW_WEBSITE"
    },
    {
      user_id: MOCK_UUID,
      business_name: "Peak Performance Fitness",
      contact_name: "Marcus Thorne",
      email: "marcus@peakfitness.example.com",
      phone: "+44-20-7946-0958",
      website: "peakfitness.co.uk",
      city: "London",
      country: "UK",
      industry: "Health & Fitness",
      website_status: "UNKNOWN",
      opportunity: "REDESIGN"
    }
  ];

  const { error, data } = await supabase.from("leads").insert(leads).select();
  if (error) {
    console.error("Failed to seed leads:", error);
  } else {
    console.log("Successfully seeded 3 leads! Refresh your browser.");
  }
}

seed();
