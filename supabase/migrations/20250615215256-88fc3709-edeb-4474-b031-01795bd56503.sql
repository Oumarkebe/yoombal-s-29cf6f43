
-- Nouvelle table pour permettre d'activer/désactiver un outil IA par type de profil/compte
CREATE TABLE public.ai_feature_profile_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_type TEXT NOT NULL, -- ex: 'client', 'marchand', 'livreur', 'admin', 'pro'
    feature_key TEXT NOT NULL,  -- ex: 'content_generation', 'pricing', 'predictions'
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (profile_type, feature_key)
);

-- (Vous pouvez ajouter une contrainte CHECK sur profile_type si la liste est fermée : à discuter)
-- Ex : CHECK (profile_type IN ('client', 'marchand', 'livreur', 'admin', 'pro'))

-- (Optionnel : activer la RLS si vous voulez restreindre l'accès, mais typiquement c’est que pour l’admin)

