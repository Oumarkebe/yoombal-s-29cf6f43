-- Allow users to delete their own orders
CREATE POLICY "Users can delete their own orders" 
ON public.orders FOR DELETE 
TO authenticated 
USING (auth.uid() = client_id);

-- Allow admins to delete any order
CREATE POLICY "Admins can delete any order" 
ON public.orders FOR DELETE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
