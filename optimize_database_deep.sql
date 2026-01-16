-- 🚀 Optimisation Profonde Yoombal-s (Phase 2)

-- 1. Index sur les Profils (Recherches Admin et Filtres)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles (status);

-- 2. Index sur les Abonnements (Vérification de droits en temps réel)
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_user_premium_subscriptions_user_id ON public.user_premium_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_user_premium_subscriptions_feature_id ON public.user_premium_subscriptions (feature_id);

-- 3. Index sur les Transactions et Crédits (Finances)
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits (user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions (user_id);

-- 4. Index sur les Avis/Reviews (Affichage produit)
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews (product_id);

-- 5. Maintenance
ANALYZE public.profiles;
ANALYZE public.user_subscriptions;
ANALYZE public.user_premium_subscriptions;
ANALYZE public.reviews;
