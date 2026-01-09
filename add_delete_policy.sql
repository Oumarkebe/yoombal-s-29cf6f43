-- Allow merchants to delete applications linked to their merchant_id
CREATE POLICY "Merchants can delete their own applications"
ON public.bnpl_applications
FOR DELETE
TO authenticated
USING (auth.uid() = merchant_id);
