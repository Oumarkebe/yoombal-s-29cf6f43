
-- Mettre à jour la politique de sécurité pour permettre aux administrateurs de modifier les paramètres des modules IA.
-- La clause USING manquante empêchait la mise à jour de s'appliquer correctement.
ALTER POLICY "Admins can update AI module settings"
ON public.ai_module_settings
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
