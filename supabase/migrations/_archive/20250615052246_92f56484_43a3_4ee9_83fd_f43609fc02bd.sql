
-- Cette politique autorise les utilisateurs ayant le rôle 'admin' 
-- à lire tous les enregistrements dans la table user_roles.
CREATE POLICY "Les administrateurs peuvent lire tous les roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin());
