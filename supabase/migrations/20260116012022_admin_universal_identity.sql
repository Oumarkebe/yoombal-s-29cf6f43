-- Migration for Universal Admin Identity
-- Adds role-specific naming columns to profiles and syncs roles for admins

-- 1. Add naming columns to profiles if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'merchant_name') THEN
        ALTER TABLE profiles ADD COLUMN merchant_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'delivery_name') THEN
        ALTER TABLE profiles ADD COLUMN delivery_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'client_name') THEN
        ALTER TABLE profiles ADD COLUMN client_name TEXT;
    END IF;
END $$;

-- 2. Backfill existing business_name to merchant_name
UPDATE profiles SET merchant_name = business_name WHERE merchant_name IS NULL AND business_name IS NOT NULL;

-- 3. Synchronize roles for existing admins
-- Every user with an 'admin' role in user_roles should also have 'merchant' and 'driver' roles
INSERT INTO user_roles (user_id, role)
SELECT DISTINCT user_id, 'merchant'::app_role
FROM user_roles
WHERE role = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT DISTINCT user_id, 'driver'::app_role
FROM user_roles
WHERE role = 'admin'
ON CONFLICT DO NOTHING;

-- 4. Create or update function to ensure auto-role synchronization for future admins
CREATE OR REPLACE FUNCTION public.sync_admin_roles()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'admin' THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.user_id, 'merchant'), (NEW.user_id, 'driver')
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trig_sync_admin_roles') THEN
        CREATE TRIGGER trig_sync_admin_roles
        AFTER INSERT OR UPDATE OF role ON user_roles
        FOR EACH ROW
        EXECUTE FUNCTION sync_admin_roles();
    END IF;
END $$;
