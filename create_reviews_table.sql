-- Création de la table reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activation de RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Reviews are viewable by everyone' AND tablename = 'reviews') THEN
        CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
            FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can insert reviews' AND tablename = 'reviews') THEN
        CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own reviews' AND tablename = 'reviews') THEN
        CREATE POLICY "Users can update their own reviews" ON public.reviews
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
