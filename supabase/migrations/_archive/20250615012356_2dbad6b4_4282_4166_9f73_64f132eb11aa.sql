
-- Fonction utilitaire pour vérifier si l'utilisateur actuel est un administrateur
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Vérifie si l'utilisateur a le rôle 'admin' dans son profil
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Créer une table pour les paramètres de la plateforme
CREATE TABLE public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Déclencheur pour mettre à jour automatiquement la colonne 'updated_at'
CREATE TRIGGER handle_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- 2. Ajouter la sécurité au niveau des lignes (RLS) pour la nouvelle table des paramètres
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les administrateurs peuvent gérer les paramètres de la plateforme"
ON public.platform_settings
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 3. Sécuriser la table des zones de livraison
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs authentifiés peuvent voir les zones de livraison"
ON public.delivery_zones
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Les administrateurs peuvent gérer les zones de livraison"
ON public.delivery_zones
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Sécuriser la table des profils
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Les administrateurs peuvent gérer tous les profils"
ON public.profiles
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. Assurer que les produits sont visibles publiquement
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les produits sont visibles publiquement"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Les administrateurs peuvent gérer les produits"
ON public.products FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());
