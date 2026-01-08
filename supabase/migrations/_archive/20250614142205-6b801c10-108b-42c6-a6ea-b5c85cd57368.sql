
-- Création de la table user_roles pour la gestion des rôles utilisateurs
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index unique afin d’éviter les doublons pour un utilisateur/role
CREATE UNIQUE INDEX ON public.user_roles (user_id, role);

-- Activation de la Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies RLS pour la gestion sécurisée

CREATE POLICY "Un utilisateur peut insérer ses rôles"
  ON public.user_roles FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Un utilisateur peut mettre à jour ses rôles"
  ON public.user_roles FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Un utilisateur peut supprimer ses rôles"
  ON public.user_roles FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Un utilisateur peut lire ses rôles"
  ON public.user_roles FOR SELECT USING (user_id = auth.uid());
