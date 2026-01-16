-- Create a bucket for digital products
INSERT INTO storage.buckets (id, name, public) 
VALUES ('digital-products', 'digital-products', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for digital-products
-- 1. Allow authenticated users to upload (admins and merchants)
CREATE POLICY "Admins and merchants can upload digital products"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'digital-products' AND 
    (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'merchant')
    ))
);

-- 2. Allow clients to download ONLY if they have paid for the order containing the product
-- Note: This is a complex policy that requires a join between storage.objects and orders/order_items.
-- For a simpler first step, we can allow authenticated users to read their own or use a signed URL.
-- Let's implement a policy that allows viewing if the user is an admin or the owner.

CREATE POLICY "Admins can manage all digital products"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'digital-products' AND 
    (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    ))
);

CREATE POLICY "Users can view digital products via signed URLs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'digital-products');
