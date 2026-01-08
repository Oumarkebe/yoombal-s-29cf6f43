
-- 1. Récupère l'id de l'utilisateur lié à l'email (remplace si déjà existant)
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Récupérer l'id utilisateur via l'email
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'yoombal28@gmail.com';

  -- S'il n'existe pas encore, l'utilisateur doit d'abord être créé via l'interface d'inscription
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'L''utilisateur avec cet email doit d''abord être créé manuellement via la page d''inscription ou l''API.';
  ELSE
    -- Ajoute le rôle admin uniquement s'il n'existe pas déjà
    INSERT INTO public.user_roles(user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
