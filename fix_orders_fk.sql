-- Fix orders foreign keys to reference public.profiles
-- This enables PostgREST to join orders with profiles

BEGIN;

-- Drop existing constraints if they exist (checking typical names)
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_client_id_fkey;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_merchant_id_fkey;

-- Add new constraints referencing profiles
ALTER TABLE public.orders 
ADD CONSTRAINT orders_client_id_fkey 
FOREIGN KEY (client_id) 
REFERENCES public.profiles(id);

ALTER TABLE public.orders 
ADD CONSTRAINT orders_merchant_id_fkey 
FOREIGN KEY (merchant_id) 
REFERENCES public.profiles(id);

COMMIT;
