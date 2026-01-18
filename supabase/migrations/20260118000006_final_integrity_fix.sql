-- Final Integrity Fix: Profiles and KYC
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS merchant_name TEXT,
ADD COLUMN IF NOT EXISTS delivery_name TEXT,
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS kyc_type TEXT,
ADD COLUMN IF NOT EXISTS kyc_document_url TEXT,
ADD COLUMN IF NOT EXISTS kyc_rejection_reason TEXT;

-- Ensure premium_features has trial_days and is_free
ALTER TABLE public.premium_features 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS trial_days INTEGER DEFAULT 0;
