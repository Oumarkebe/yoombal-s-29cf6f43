-- Allow users to delete order items if they own the order
CREATE POLICY "Users can delete their own order items" 
ON public.order_items FOR DELETE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_items.order_id AND client_id = auth.uid()
    )
);

-- Allow admins to delete any order items
CREATE POLICY "Admins can delete any order items" 
ON public.order_items FOR DELETE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
