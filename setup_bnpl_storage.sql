-- Ensure the bnpl-documents bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('bnpl-documents', 'bnpl-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policies for bnpl-documents

-- 1. Allow authenticated users to upload their own documents
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'bnpl-documents' 
    AND (storage.foldername(name))[1] IN ('id_cards', 'photos')
    AND (storage.foldername(name))[2] = auth.uid()::text
);

-- 2. Allow users to see their own documents
CREATE POLICY "Allow users to view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'bnpl-documents' 
    AND (storage.foldername(name))[2] = auth.uid()::text
);

-- 3. Allow admins and merchants to see documents (since it's a marketplace)
-- Note: In a real prod environment, we'd be more specific, but for development/MVP:
CREATE POLICY "Allow admins/merchants to view documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'bnpl-documents'
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'merchant')
    )
);
