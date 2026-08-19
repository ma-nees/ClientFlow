-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid TEXT NOT NULL UNIQUE,
  gmail_email TEXT,
  gmail_access_token TEXT,
  gmail_refresh_token TEXT,
  gmail_connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security) but since the backend uses the Service Role key, it bypasses RLS anyway.
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
