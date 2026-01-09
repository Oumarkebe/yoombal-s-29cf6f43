
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view their own BNPL documents" ON storage.objects;

-- Create a more permissive policy for viewing (SELECT)
-- This allows any authenticated user (like the merchant) to view the documents 
-- if they have the valid path (which they get from the database).
CREATE POLICY "Authenticated users can view BNPL documents"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'bnpl-documents' );
