# 🚀 Guide de Synchronisation Yoombal (Local ↔ Remote)

Ce guide explique comment maintenir votre base de données de production (Supabase Cloud) parfaitement synchronisée avec vos changements locaux.

---

## 🏗️ 1. Synchronisation du Schéma (Structure)

Dès que vous modifiez la structure de la base de données (ajout de tables, colonnes, politiques RLS) dans le dossier `supabase/migrations` :

1.  **Enregistrez vos changements** : `git add .`
2.  **Faites un commit** : `git commit -m "feat: ajout de nouvelles tables"`
3.  **Poussez sur GitHub** : `git push origin main`

**Résultat :** GitHub Actions va détecter le push et appliquer automatiquement les nouvelles migrations sur votre projet Supabase distant. ✅

---

## 📦 2. Synchronisation des Données (Produits, Profils, Config)

Les données que vous créez sur votre ordinateur (nouveaux produits, catégories de test, réglages admin) ne sont pas "vues" par GitHub. Pour les envoyer sur le Cloud :

Lancer la commande suivante dans votre terminal :
```powershell
npm run db:sync-remote
```

**Que fait cette commande ?**
- Elle connecte votre base locale.
- Elle connecte votre compte Supabase Cloud.
- Elle copie (upsert) intelligemment les catégories, profils, produits, plans premium, et réglages vers la production. ✅

---

## 🔐 3. Configuration Initiale (À faire une fois)

Pour que l'automatisme GitHub fonctionne, assurez-vous d'avoir ajouté ces deux secrets dans vos paramètres de dépôt GitHub (**Settings** → **Secrets and variables** → **Actions**) :

1.  **VITE_SUPABASE_URL** : `https://lqchbfhlldvhqqyvzxkg.supabase.co`
2.  **SUPABASE_SERVICE_ROLE_KEY** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y`

---

## 🚦 4. Quand utiliser quelle commande ?

| Action | Commande à utiliser | Type de Sync |
| :--- | :--- | :--- |
| **Changement de code / SQL** | `git push` | Schéma (Automatique) |
| **Nouveaux produits en local** | `npm run db:sync-remote` | Données (Manuelle) |
| **Nouveaux réglages Admin** | `npm run db:sync-remote` | Configuration |

---

## 🧪 5. Comptes de Test Disponibles (PROD)

| Rôle | Email | Mot de Passe |
| :--- | :--- | :--- |
| **Admin** | `admin@yoombal.com` (ou votre email) | `Darousalam2828Touba` |
| **Client** | `client@gmail.com` | `Touba28` |

---
*Dernière mise à jour : 16 Janvier 2026*
