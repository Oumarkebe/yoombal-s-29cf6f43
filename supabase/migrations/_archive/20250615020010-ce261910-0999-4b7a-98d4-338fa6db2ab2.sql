
-- Ajoute la colonne email à la table des profils
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Met à jour la fonction pour inclure l'email lors de la création d'un nouvel utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, role, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'phone',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'client'),
    NEW.email
  );
  RETURN NEW;
END;
$function$
