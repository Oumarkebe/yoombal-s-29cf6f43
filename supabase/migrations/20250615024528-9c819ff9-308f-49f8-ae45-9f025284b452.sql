
-- Permet aux administrateurs de lire tous les rôles des utilisateurs
CREATE POLICY "Admins can read all user roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin());

-- Permet aux administrateurs d'ajouter des rôles aux utilisateurs
CREATE POLICY "Admins can insert user roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.is_admin());

-- Permet aux administrateurs de supprimer les rôles des utilisateurs
CREATE POLICY "Admins can delete user roles"
  ON public.user_roles FOR DELETE
  USING (public.is_admin());

-- Permet aux administrateurs de mettre à jour les rôles des utilisateurs
CREATE POLICY "Admins can update user roles"
  ON public.user_roles FOR UPDATE
  USING (public.is_admin());
