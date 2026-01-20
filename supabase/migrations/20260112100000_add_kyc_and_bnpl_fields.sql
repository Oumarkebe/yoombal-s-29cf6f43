
-- Migration: Add KYC and BNPL fields to profiles table
-- Date: 2026-01-12

-- 1. Add columns to public.profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS kyc_status text DEFAULT 'none' CHECK (kyc_status IN ('none', 'pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS kyc_id_card_url text,
ADD COLUMN IF NOT EXISTS kyc_selfie_url text,
ADD COLUMN IF NOT EXISTS kyc_contract_signed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS credit_limit numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_debt numeric DEFAULT 0;

-- 2. Create Storage Bucket for KYC Documents (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own documents (insert)
DROP POLICY IF EXISTS "Users can upload their own KYC documents" on storage.objects;
create policy "Users can upload their own KYC documents"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'kyc-documents' AND auth.uid() = owner );

-- Allow users to view their own documents
DROP POLICY IF EXISTS "Users can view their own KYC documents" on storage.objects;
create policy "Users can view their own KYC documents"
on storage.objects for select
to authenticated
using ( bucket_id = 'kyc-documents' AND auth.uid() = owner );

-- Allow admins to view all KYC documents
DROP POLICY IF EXISTS "Admins can view all KYC documents" on storage.objects;
create policy "Admins can view all KYC documents"
on storage.objects for select
to authenticated
using ( bucket_id = 'kyc-documents' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- Allow admins to update/delete (manage) KYC documents if needed
DROP POLICY IF EXISTS "Admins can manage all KYC documents" on storage.objects;
create policy "Admins can manage all KYC documents"
on storage.objects for all
to authenticated
using ( bucket_id = 'kyc-documents' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- Comment on columns
COMMENT ON COLUMN public.profiles.kyc_status IS 'Status of KYC verification: none, pending, verified, rejected';
COMMENT ON COLUMN public.profiles.credit_limit IS 'Maximum BNPL amount allowed for this user';
COMMENT ON COLUMN public.profiles.current_debt IS 'Total unpaid BNPL amount';
