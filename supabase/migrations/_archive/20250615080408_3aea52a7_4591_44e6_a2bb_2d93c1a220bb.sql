
-- Créer la table pour les paramètres des modules IA
CREATE TABLE public.ai_module_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activer la sécurité au niveau des lignes (RLS)
ALTER TABLE public.ai_module_settings ENABLE ROW LEVEL SECURITY;

-- Donner l'accès en lecture à tous les utilisateurs authentifiés
-- car ces paramètres peuvent être nécessaires côté client pour savoir si un module est actif.
CREATE POLICY "Allow authenticated read access to AI module settings"
ON public.ai_module_settings
FOR SELECT
TO authenticated
USING (true);

-- Donner l'accès en écriture (modification) uniquement aux administrateurs
CREATE POLICY "Admins can update AI module settings"
ON public.ai_module_settings
FOR UPDATE
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insérer les modules IA par défaut, désactivés.
-- Si un module existe déjà, il ne sera pas dupliqué.
INSERT INTO public.ai_module_settings (key)
VALUES
  ('chatbot'),
  ('recommendations'),
  ('moderation'),
  ('translation'),
  ('predictions'),
  ('scoring'),
  ('content_generation'),
  ('logistics'),
  ('pricing')
ON CONFLICT (key) DO NOTHING;

