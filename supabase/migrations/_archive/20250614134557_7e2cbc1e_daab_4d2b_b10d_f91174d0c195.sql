
-- Création de la table `product_reviews`
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Un utilisateur ne peut laisser qu’un seul avis par produit
CREATE UNIQUE INDEX ON public.product_reviews (product_id, user_id);

-- Ajout de la RLS (Row Level Security)
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- RLS : Un utilisateur authentifié peut insérer son propre avis
CREATE POLICY "user-can-insert-own-review" ON public.product_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS : Un utilisateur peut voir tous les avis (reviews publics)
CREATE POLICY "all-can-select" ON public.product_reviews
  FOR SELECT
  USING (true);

-- RLS : Mise à jour/suppression limitée à son propre avis
CREATE POLICY "user-can-update-own-review" ON public.product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user-can-delete-own-review" ON public.product_reviews
  FOR DELETE USING (auth.uid() = user_id);
