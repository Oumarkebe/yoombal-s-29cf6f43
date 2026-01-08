# Guide pour Pousser les Changements Supabase

Ce guide explique comment synchroniser votre base de données Supabase entre le local et le cloud.

## Prérequis
- Supabase CLI installé et configuré.
- Projet local Supabase en cours d'exécution (`supabase start`).
- Projet cloud Supabase lié (`supabase link --project-ref <ID_PROJET>`).

## 1. Pousser du Local vers le Cloud
Utilisez cette commande pour appliquer les changements locaux (migrations) au projet cloud.

```bash
supabase db push
```

- Cela applique toutes les migrations non appliquées au cloud.
- Confirme avant d'appliquer.
- Utile après avoir développé localement avec Lovable.

**Exemple :**
```bash
supabase db push
# Output: Applying migration 20260108_init.sql...
# Finished supabase db push.
```

## 2. Pousser du Cloud vers le Local
Utilisez cette commande pour synchroniser les changements du cloud vers votre base locale.

```bash
supabase db pull
```

- Cela récupère les migrations du cloud et les applique localement.
- Si le cloud a des changements que le local n'a pas, cela les importe.

**Exemple :**
```bash
supabase db pull
# Output: Pulling migrations from remote...
# Finished supabase db pull.
```

### Option Alternative : Reset Local avec le Cloud
Si vous voulez remplacer complètement la base locale par celle du cloud :

```bash
supabase db reset
```

- **Attention :** Cela supprime toutes les données locales et les remplace par celles du cloud.
- Utile si le cloud est la source de vérité.

## 3. Générer une Nouvelle Migration
Après avoir modifié le schéma localement (via SQL ou outils), générez une migration :

```bash
supabase db diff --schema public,storage -f supabase/migrations/YYYYMMDD_description.sql
```

- Remplacez `YYYYMMDD_description` par une date et description (ex: `20260108_add_users_table`).
- Puis poussez avec `supabase db push`.

## 4. Vérifier l'État
- **État local :** `supabase status`
- **Migrations appliquées :** Vérifiez `supabase/migrations/`
- **État cloud :** Via https://supabase.com/dashboard/project/<ID_PROJET>

## 5. Workflow Recommandé
1. Développez localement avec Lovable (connecté au local).
2. Testez les changements.
3. Générez une migration : `supabase db diff ...`
4. Poussez au cloud : `supabase db push`
5. Si besoin, synchronisez le cloud vers local : `supabase db pull`

## Dépannage
- **Erreur d'authentification :** Vérifiez que vous êtes connecté (`supabase login`) et que le projet est lié.
- **Conflits :** Si des conflits surviennent, résolvez manuellement dans les fichiers de migration.
- **Images Docker obsolètes :** Commentez les lignes `image` dans `supabase/config.toml` si nécessaire.

Pour plus d'infos : https://supabase.com/docs/guides/cli/local-development</content>
<parameter name="filePath">c:\Mes Sites Web\Yoombal-s\PUSH_GUIDE.md