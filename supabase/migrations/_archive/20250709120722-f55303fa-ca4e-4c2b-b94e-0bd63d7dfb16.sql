
-- Ajouter des colonnes manquantes à la table bnpl_plans
ALTER TABLE public.bnpl_plans 
ADD COLUMN IF NOT EXISTS plan_duration INTEGER,
ADD COLUMN IF NOT EXISTS fees_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS first_payment_amount NUMERIC,
ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'pending';

-- Ajouter une table pour les demandes BNPL
CREATE TABLE IF NOT EXISTS public.bnpl_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL,
  requested_amount NUMERIC NOT NULL,
  plan_duration INTEGER NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  fees_amount NUMERIC NOT NULL DEFAULT 0,
  first_payment_amount NUMERIC NOT NULL,
  application_status TEXT NOT NULL DEFAULT 'pending',
  merchant_decision TEXT,
  merchant_decision_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ajouter les politiques RLS pour bnpl_applications
ALTER TABLE public.bnpl_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own BNPL applications"
  ON public.bnpl_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own BNPL applications"
  ON public.bnpl_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Merchants can view applications for their products"
  ON public.bnpl_applications FOR SELECT
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update applications for their products"
  ON public.bnpl_applications FOR UPDATE
  USING (auth.uid() = merchant_id);

-- Ajouter des politiques manquantes pour bnpl_plans
CREATE POLICY "Users can create their own BNPL plans"
  ON public.bnpl_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own BNPL plans"
  ON public.bnpl_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- Ajouter une colonne pour indiquer si un produit accepte le BNPL
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS bnpl_enabled BOOLEAN DEFAULT false;

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_bnpl_applications_user_id ON public.bnpl_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_bnpl_applications_merchant_id ON public.bnpl_applications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_bnpl_applications_product_id ON public.bnpl_applications(product_id);
CREATE INDEX IF NOT EXISTS idx_bnpl_applications_status ON public.bnpl_applications(application_status);
