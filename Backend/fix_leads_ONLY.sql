-- 1. Drop foreign key constraint on leads
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_user_id_fkey;

-- 2. Drop restrictive policies on leads
DROP POLICY IF EXISTS "Users can view own leads" ON leads;
DROP POLICY IF EXISTS "Users can create own leads" ON leads;
DROP POLICY IF EXISTS "Users can update own leads" ON leads;
DROP POLICY IF EXISTS "Users can delete own leads" ON leads;

-- 3. Alter the user_id column on leads
ALTER TABLE leads ALTER COLUMN user_id TYPE TEXT;
