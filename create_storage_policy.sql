-- Allow anyone to read objects from the digital-products bucket (public access)
CREATE POLICY "Allow_public_read_digital_products" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'digital-products');
