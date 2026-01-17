
-- Add columns for Proof of Delivery
ALTER TABLE public.deliveries 
ADD COLUMN IF NOT EXISTS signature_url TEXT,
ADD COLUMN IF NOT EXISTS proof_photo_url TEXT;

-- Storage Bucket for Delivery Proofs
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('delivery-proofs', 'delivery-proofs', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Policy for Storage (Public Read, Auth Insert)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'delivery-proofs' );

CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'delivery-proofs' );
