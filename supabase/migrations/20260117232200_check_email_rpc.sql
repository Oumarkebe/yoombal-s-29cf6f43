-- Migration pour ajouter la fonction check_email_exists
-- Créée automatiquement par Yoombal AI Assistant

create or replace function public.check_email_exists(email_arg text)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 
    from auth.users 
    where lower(email) = lower(trim(email_arg))
  );
end;
$$;

grant execute on function public.check_email_exists to anon, authenticated;
