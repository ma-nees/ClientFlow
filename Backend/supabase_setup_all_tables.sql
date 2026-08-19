-- 1. Drop foreign key constraints that link to the old Supabase auth.users table
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_user_id_fkey;
ALTER TABLE email_events DROP CONSTRAINT IF EXISTS email_events_user_id_fkey;
ALTER TABLE follow_ups DROP CONSTRAINT IF EXISTS follow_ups_user_id_fkey;
ALTER TABLE gmail_connections DROP CONSTRAINT IF EXISTS gmail_connections_user_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE website_analyses DROP CONSTRAINT IF EXISTS website_analyses_user_id_fkey;
ALTER TABLE user_settings DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Drop restrictive policies
DROP POLICY IF EXISTS "Users can view own leads" ON leads;
DROP POLICY IF EXISTS "Users can create own leads" ON leads;
DROP POLICY IF EXISTS "Users can update own leads" ON leads;
DROP POLICY IF EXISTS "Users can delete own leads" ON leads;

DROP POLICY IF EXISTS "Users can view own email events" ON email_events;
DROP POLICY IF EXISTS "Users can create own email events" ON email_events;
DROP POLICY IF EXISTS "Users can update own email events" ON email_events;
DROP POLICY IF EXISTS "Users can delete own email events" ON email_events;

DROP POLICY IF EXISTS "Users can view own follow ups" ON follow_ups;
DROP POLICY IF EXISTS "Users can create own follow ups" ON follow_ups;
DROP POLICY IF EXISTS "Users can update own follow ups" ON follow_ups;
DROP POLICY IF EXISTS "Users can delete own follow ups" ON follow_ups;

DROP POLICY IF EXISTS "Users can view own gmail connections" ON gmail_connections;
DROP POLICY IF EXISTS "Users can create own gmail connections" ON gmail_connections;
DROP POLICY IF EXISTS "Users can update own gmail connections" ON gmail_connections;
DROP POLICY IF EXISTS "Users can delete own gmail connections" ON gmail_connections;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can create own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;

DROP POLICY IF EXISTS "Users can view own website analyses" ON website_analyses;
DROP POLICY IF EXISTS "Users can create own website analyses" ON website_analyses;
DROP POLICY IF EXISTS "Users can update own website analyses" ON website_analyses;
DROP POLICY IF EXISTS "Users can delete own website analyses" ON website_analyses;

-- 3. Alter columns safely
ALTER TABLE leads ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE email_events ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE follow_ups ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE gmail_connections ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE notifications ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE website_analyses ALTER COLUMN user_id TYPE TEXT;
