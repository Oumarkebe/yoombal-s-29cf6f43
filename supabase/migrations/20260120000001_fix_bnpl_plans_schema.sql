-- =============================================
-- Migration: Fix BNPL Plans Schema
-- Description: Align bnpl_plans with frontend requirements (product_id, merchant_id, installments)
-- =============================================

-- 1. Add missing columns
ALTER TABLE public.bnpl_plans 
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS installments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS duration_months INTEGER;

-- 2. Make order_id nullable (frontend doesn't always provide it during plan creation)
ALTER TABLE public.bnpl_plans 
ALTER COLUMN order_id DROP NOT NULL;

-- 3. Update RLS policies to ensure consistency with client_id
-- (Existing policies already use client_id based on previous migrations, 
-- but we ensure they cover the merchant as well for viewing)

-- Drop existing if needed to recreate cleanly
DROP POLICY IF EXISTS "Users can view their own BNPL plans" ON public.bnpl_plans;
DROP POLICY IF EXISTS "Merchants can view plans for their products" ON public.bnpl_plans;
DROP POLICY IF EXISTS "Users can create their own BNPL plans" ON public.bnpl_plans;

CREATE POLICY "Users can view their own BNPL plans"
ON public.bnpl_plans FOR SELECT
USING (auth.uid() = client_id OR auth.uid() = merchant_id);

CREATE POLICY "Users can create their own BNPL plans"
ON public.bnpl_plans FOR INSERT
WITH CHECK (auth.uid() = client_id);

-- Ensure Realtime is enabled for this table if not already
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'bnpl_plans') THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.bnpl_plans;
        END IF;
    END IF;
END $$;
