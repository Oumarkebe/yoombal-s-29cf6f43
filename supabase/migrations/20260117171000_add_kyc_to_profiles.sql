-- Add KYC fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS kyc_document_url TEXT,
ADD COLUMN IF NOT EXISTS kyc_type TEXT,
ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS kyc_rejection_reason TEXT;

-- Index for better admin filtering
CREATE INDEX IF NOT EXISTS idx_profiles_kyc_status ON public.profiles(kyc_status);

-- RLS Update (optional if already handled, but let's be safe)
DROP POLICY IF EXISTS "Users can update their OWN kyc fields" ON public.profiles;
CREATE POLICY "Users can update their OWN kyc fields" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
    -- Prevent users from setting kyc_status to verified directly
    (CASE WHEN kyc_status = 'verified' AND (SELECT kyc_status FROM public.profiles WHERE id = auth.uid()) != 'verified' THEN false ELSE true END)
);
