# 🌍 Guide Complet de Migration Yoombal-s (De Zéro à la Production)

Ce guide est conçu pour vous accompagner pas à pas dans le transfert de votre projet **Yoombal-s** complet (Base de données, IA, et Site Web) vers un serveur distant.

---

## 📋 Table des Matières
1. [Phase 1 : Sauvegarde (Sur votre ordinateur)](#phase-1)
2. [Phase 2 : Préparation du nouveau serveur](#phase-2)
3. [Phase 3 : Migration de Supabase (La Base de Données)](#phase-3)
4. [Phase 4 : Installation de l'IA (Llama / Ollama)](#phase-4)
5. [Phase 5 : Déploiement du Site Web (Le Frontend)](#phase-5)
6. [Phase 6 : Vérification finale](#phase-6)

---

## 🏗 Architecture du Serveur (Wanekoo)

Une fois la migration terminée, votre serveur Wanekoo contiendra **tout l'écosystème** Yoombal fonctionnant en parfaite harmonie :

- **Le Site Web (Frontend)** : Ce que vos clients voient et utilisent.
- **Supabase (Le Backend)** : Installé directement sur votre serveur, il gère vos produits, vos utilisateurs et vos commandes dans des "conteneurs" Docker.
- **Llama / Ollama (L'IA)** : Votre moteur de réflexion interne, également hébergé sur le serveur.

### Les Avantages de cette organisation :
- **Économies** : Pas d'abonnement Supabase Cloud ou d'API coûteuses.
- **Confidentialité** : Vos données et vos générations d'IA ne sortent jamais de votre serveur.
- **Vitesse** : La communication entre le site et la base de données est instantanée.
- **Automatisation** : Sur Wanekoo, Supabase et l'IA se lanceront automatiquement à chaque démarrage du serveur.

---

<a name="phase-1"></a>
## 🛠 Phase 1 : Sauvegarde (Sur votre ordinateur)

Avant de partir, il faut récupérer tout ce que vous avez fait.

### 1. Sauvegarder la base de données
Ouvrez votre terminal (PowerShell) dans le dossier du projet et tapez :
```powershell
# Exporte vos données et votre structure dans un fichier
docker exec -it supabase_db_lqchbfhlldvhqqyvzxkg pg_dumpall -U postgres > sauvegarde_yoombal.sql
```
*Le fichier `sauvegarde_yoombal.sql` contiendra toutes vos tables, produits, utilisateurs et réglages.*

---

<a name="phase-2"></a>
## 📂 Phase 2 : Préparation du nouveau serveur (Wanekoo / VPS)

Connectez-vous à votre nouveau serveur via SSH (utilisez Putty ou votre terminal).

### 1. Installer les outils de base
Tapez ces commandes l'une après l'autre :
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Docker (Indispensable pour Supabase et l'IA)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installation de Node.js (Pour le site web)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

---

<a name="phase-3"></a>
## 🗄 Phase 3 : Migration de Supabase (Base de Données)

### 1. Installer Supabase sur le serveur
```bash
# Installer la CLI
- npm install -g supabase

# Initialiser dans votre dossier de projet sur le serveur
mkdir yoombal-prod && cd yoombal-prod
supabase init

# Lancer Supabase
supabase start
```

### 2. Importer vos données sauvegardées
Copiez votre fichier `sauvegarde_yoombal.sql` sur le serveur (via FileZilla par exemple), puis :
```bash
# Importer le fichier dans votre nouvelle base de données
cat sauvegarde_yoombal.sql | docker exec -i supabase_db_yoombal-prod psql -U postgres
```

---

<a name="phase-4"></a>
## 🧠 Phase 4 : Installation de l'IA (Ollama sur le Port 8000)

C'est ici qu'on installe le cerveau de Yoombal.

### 1. Installer Ollama (Version Linux)
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Forcer le Port 8000 (Important !)
Par défaut, Ollama utilise un port qui peut coincer. On va le régler sur 8000 :
```bash
# Editer le service
sudo systemctl edit ollama.service
```
Dans la fenêtre qui s'ouvre, collez ceci :
```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:8000"
```
*Enregistrez et quittez. Puis redémarrez :*
```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

### 3. Télécharger le modèle Llama
```bash
ollama run llama3.2
```

---

<a name="phase-5"></a>
## 🎨 Phase 5 : Déploiement du Site Web (Le Frontend)

### 1. Préparer les fichiers (Sur votre ordinateur)
Dans votre dossier projet local :
```powershell
# Crée le dossier 'dist' (le site optimisé pour le web)
npm run build
```

### 2. Envoyer sur le serveur
Envoyez tout le contenu du dossier **`dist`** vers votre serveur web (Wanekoo) via FTP ou FileZilla.

### 3. Configurer l'URL Supabase
Sur le serveur, créez ou modifiez le fichier `.env` pour qu'il pointe vers l'adresse IP de votre serveur au lieu de `localhost`.

---

<a name="phase-6"></a>
## ✅ Phase 6 : Vérification finale

### 1. L'IA parle-t-elle ?
Dans un terminal sur le serveur, tapez :
`curl http://localhost:8000/v1/models`
*Si vous voyez une réponse avec "llama3.2", c'est parfait !*

### 2. Brancher l'IA dans l'admin
Connectez-vous à votre dashboard Yoombal (le site en ligne), allez dans **Paramètres Admin** et assurez-vous que :
- Le module `content_generation` est **Activé**.
- Le fournisseur est sur **`local`**.

---

## 💡 Résumé pour réussir
- **Local** = Votre PC (Windows).
- **Production** = Le serveur Wanekoo (Linux).
- **Le lien** = Supabase Cloud (si vous ne voulez pas auto-héberger) ou l'IP de votre serveur.

> [!TIP]
> **Si vous avez un doute** : Gardez toujours vos clés **Groq** ou **OpenAI** sous le coude. En cas de panne de votre serveur Llama, Yoombal basculera dessus automatiquement si vous avez rempli les clés dans le panneau d'administration !

---

## 📦 Présentation Complète de Yoombal-s

**Yoombal-s** est une plateforme e-commerce multi-vendeurs de nouvelle génération, conçue pour allier performance technologique et simplicité d'usage (Teranga). Elle intègre nativement l'Intelligence Artificielle pour automatiser les tâches chronophages des marchands.

### 🌟 Fonctionnalités Clés

#### 1. Marketplace & Shopping
- **Navigation Fluide** : Recherche temps réel, filtrage par catégories et tri intelligent.
- **Paiement Flexible (BNPL)** : "Achetez maintenant, payez plus tard" avec calculatrice d'échéances intégrée.
- **Gestion du Panier** : Système de panier persistant et checkout sécurisé.

#### 2. Espace Marchand "Ultimate"
- **Gestion de Stock Avancée** : Suivi des unités, alertes de stock bas et SKU uniques.
- **Fiches Produits Riches** : Galerie d'images, spécifications dynamiques et gestion SEO complète.
- **Dashboard de Performance** : Statistiques de ventes, gestion des commandes et suivi des revenus.

#### 3. Intelligence Artificielle (Griot AI)
- **Rédaction Automatique** : Génération de descriptions de produits convaincantes en un clic.
- **Optimisation SEO** : Création assistée de titres et méta-descriptions pour Google.
- **Assistant Conversationnel** : Chatbot intelligent capable d'aider les clients à trouver le produit idéal.
- **Moteur Multi-Source** : Switch dynamique entre IA locale (Llama/Ollama) et Cloud (OpenAI/Groq).

#### 4. Logistique & Livraison
- **Suivi en Temps Réel** : Interface dédiée pour les livreurs.
- **Gestion des Zones** : Optimisation des livraisons selon la localisation.
- **Statuts Dynamiques** : Mise à jour automatique de la préparation à la remise au client.

#### 5. Administration & Système
- **Centre de Contrôle AI** : Gestion des clés API, des modèles utilisés et des prompts systèmes.
- **Gestion des Rôles** : Système de permissions strictes pour Admins, Marchands et Livreurs (RoleGuard).
- **Architecture Résiliente** : Support de l'auto-hébergement complet (Supabase + IA + Web) pour une souveraineté totale des données.

### 🎯 Vision du Projet
Yoombal-s n'est pas qu'un simple site de vente ; c'est un écosystème complet qui permet aux commerçants de se concentrer sur leurs produits pendant que l'IA s'occupe de la rédaction, du référencement et de l'assistance client. 🚀
