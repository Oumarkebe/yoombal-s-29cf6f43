
-- Create a table for BNPL plans
CREATE TABLE public.bnpl_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  total_amount NUMERIC NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  remaining_months INTEGER NOT NULL,
  next_payment_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, order_id)
);

-- Add Row Level Security (RLS) to ensure users can only interact with their own BNPL plans
ALTER TABLE public.bnpl_plans ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own BNPL plans
CREATE POLICY "Users can view their own BNPL plans"
  ON public.bnpl_plans FOR SELECT
  USING (auth.uid() = user_id);
