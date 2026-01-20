-- 1. Renommer product_reviews en reviews pour cohérence avec Typescript & Hooks
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'product_reviews') THEN
        ALTER TABLE public.product_reviews RENAME TO reviews;
    END IF;
END $$;

-- 2. Création des buckets de stockage nécessaires
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('bnpl-documents', 'bnpl-documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS pour le bucket products (Public read, Authenticated upload)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Merchant Upload" ON storage.objects;
DROP POLICY IF EXISTS "Merchant Update" ON storage.objects;
DROP POLICY IF EXISTS "Merchant Delete" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Merchant Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "Merchant Update" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "Merchant Delete" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- 4. RLS pour le bucket bnpl-documents (Private, restricted to owner/admin)
DROP POLICY IF EXISTS "Owner Access" ON storage.objects;
DROP POLICY IF EXISTS "Owner Upload" ON storage.objects;

-- NOTE: is_admin() takes no arguments and uses auth.uid() internally
CREATE POLICY "Owner Access" ON storage.objects FOR SELECT USING (bucket_id = 'bnpl-documents' AND (auth.uid() = owner OR public.is_admin()));
CREATE POLICY "Owner Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'bnpl-documents' AND auth.role() = 'authenticated');
