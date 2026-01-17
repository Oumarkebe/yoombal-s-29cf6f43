-- Financial Reconciliation Table
CREATE TABLE IF NOT EXISTS public.payment_reconciliation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id),
    provider TEXT NOT NULL, -- 'orange_money', 'wave', 'cash'
    provider_tx_id TEXT,
    order_amount NUMERIC NOT NULL,
    received_amount NUMERIC,
    status TEXT DEFAULT 'pending', -- 'matched', 'mismatch', 'missing'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_reconciliation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all reconciliation" 
ON public.payment_reconciliation FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Index for orphan search
CREATE INDEX IF NOT EXISTS idx_reconciliation_status ON public.payment_reconciliation(status);
