-- Ajouter le statut utilisateur pour la gestion du cycle de vie
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text 
  DEFAULT 'active' 
  CHECK (status IN ('active', 'inactive', 'pending', 'suspended', 'blocked'));

-- Index pour les requêtes de filtrage par statut
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Commentaire pour documentation
COMMENT ON COLUMN public.profiles.status IS 'Statut du cycle de vie utilisateur: active, inactive, pending, suspended, blocked';