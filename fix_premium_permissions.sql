
-- Standardisation et Correction des Permissions Système Premium

-- 1. Table premium_features (Lecture pour tous les authentifiés)
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture publique des fonctionnalités premium" ON public.premium_features;
CREATE POLICY "Lecture publique des fonctionnalités premium" ON public.premium_features 
FOR SELECT TO authenticated USING (true);

-- 2. Table user_premium_subscriptions (Accès aux modules achetés)
ALTER TABLE public.user_premium_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Les utilisateurs voient leurs propres modules" ON public.user_premium_subscriptions;
CREATE POLICY "Les utilisateurs voient leurs propres modules" ON public.user_premium_subscriptions 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent insérer leurs propres modules" ON public.user_premium_subscriptions;
CREATE POLICY "Les utilisateurs peuvent insérer leurs propres modules" ON public.user_premium_subscriptions 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3. Table user_subscriptions (Plan Principal)
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Les utilisateurs voient leur propre abonnement" ON public.user_subscriptions;
CREATE POLICY "Les utilisateurs voient leur propre abonnement" ON public.user_subscriptions 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 4. Table premium_plans (Lecture publique)
ALTER TABLE public.premium_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture publique des plans" ON public.premium_plans;
CREATE POLICY "Lecture publique des plans" ON public.premium_plans 
FOR SELECT TO authenticated USING (true);

-- 5. Attribution des droits
GRANT SELECT ON public.premium_features TO authenticated;
GRANT SELECT, INSERT ON public.user_premium_subscriptions TO authenticated;
GRANT SELECT ON public.premium_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_subscriptions TO authenticated;

-- 6. Insertion des données de base si absentes (Optionnel mais recommandé)
-- Note: Ce script ne fait pas d'insert pour ne pas écraser vos données,
-- mais assurez-vous que les feature_key correspondent à 'ai_assistant'
-- dans vos tables premium_features et premium_plans (features JSON array).
