-- Run this to update the leads table to support Firebase UIDs
ALTER TABLE leads ALTER COLUMN user_id TYPE TEXT;
