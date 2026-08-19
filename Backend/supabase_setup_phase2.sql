-- Run this in your Supabase SQL Editor

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Firebase UID
  name TEXT NOT NULL,
  target TEXT NOT NULL,
  daily_limit INTEGER DEFAULT 50,
  randomized_delay BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'PAUSED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign Leads Join Table
CREATE TABLE IF NOT EXISTS campaign_leads (
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'PENDING',
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (campaign_id, lead_id)
);

-- Emails Table
CREATE TABLE IF NOT EXISTS emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Firebase UID
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, SENT, FAILED
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: The backend uses the Service Role key, so RLS policies are not strictly required for backend access,
-- but they are good practice if the frontend ever reads directly.
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
