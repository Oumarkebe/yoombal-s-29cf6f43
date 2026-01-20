-- 1. Table des échéances payées
CREATE TABLE IF NOT EXISTS public.bnpl_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES public.bnpl_plans(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_method TEXT DEFAULT 'wallet',
    status TEXT DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activation RLS
ALTER TABLE public.bnpl_installments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
DROP POLICY IF EXISTS "Users can view their own installments" ON public.bnpl_installments;
CREATE POLICY "Users can view their own installments" ON public.bnpl_installments
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.bnpl_plans 
        WHERE id = plan_id AND client_id = auth.uid()
    )
);

-- 2. Fonction RPC pour traiter un paiement
CREATE OR REPLACE FUNCTION public.process_bnpl_payment(
    p_plan_id UUID,
    p_amount NUMERIC,
    p_payment_method TEXT DEFAULT 'wallet'
)
RETURNS JSONB AS $$
DECLARE
    v_plan RECORD;
    v_result JSONB;
BEGIN
    -- Récupérer le plan
    SELECT * INTO v_plan FROM public.bnpl_plans WHERE id = p_plan_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Plan non trouvé');
    END IF;

    IF v_plan.status = 'paid' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Le plan est déjà entièrement payé');
    END IF;

    -- Enregistrer l'échéance
    INSERT INTO public.bnpl_installments (plan_id, amount, payment_method)
    VALUES (p_plan_id, p_amount, p_payment_method);

    -- Mettre à jour le plan
    UPDATE public.bnpl_plans
    SET 
        remaining_months = remaining_months - 1,
        next_payment_date = next_payment_date + interval '1 month',
        status = CASE 
            WHEN remaining_months - 1 <= 0 THEN 'paid' 
            ELSE 'active' 
        END,
        updated_at = NOW()
    WHERE id = p_plan_id;

    RETURN jsonb_build_object('success', true, 'message', 'Paiement traité avec succès');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Automatisation des retards (Overdue)
-- Optionnel: Une fonction à appeler via cron ou périodiquement
CREATE OR REPLACE FUNCTION public.check_bnpl_overdue()
RETURNS VOID AS $$
BEGIN
    UPDATE public.bnpl_plans
    SET status = 'overdue'
    WHERE status = 'active'
    AND next_payment_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
