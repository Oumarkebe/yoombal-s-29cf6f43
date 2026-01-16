# 🕋 La Constitution de Yoombal-s (Version 3.0)
## *Guide Suprême pour la Migration, la Maintenance et l'Évolution Souveraine*

---

## 📖 Introduction : La Vision de Yoombal
Yoombal-s n'est pas une simple application, c'est un **écosystème numérique complet** basé sur la confiance (*Teranga*) et la puissance technologique. Ce document constitue la référence absolue pour quiconque souhaite maintenir ou déployer le système de manière totalement indépendante (Souveraineté Numérique).

---

## 🏗 Chapitre I : Architecture du Système Universel

Une fois déployé sur votre serveur (Wanekoo ou VPS dédié), Yoombal-s forme une trinité technologique :

1.  **L'Interface (Le Corps - Frontend)** :
    - Construit avec **React 18** et **Vite**.
    - Design System : **Shadcn UI** pour une esthétique premium et responsive.
    - État : Persistant via **TanStack Query** (cache) et **Context API**.

2.  **Le Cœur (Le Backend - Supabase)** :
    - **PostgreSQL** : La base de données relationnelle la plus robuste au monde.
    - **GoTrue** : Système d'authentification gérant les rôles (Admin, Marchand, Livreur, Client).
    - **PostgREST** : API instantanée qui transforme vos tables SQL en endpoints sécurisés.
    - **Edge Functions** : Micro-services en TypeScript (Deno) pour le traitement lourd (IA, Paiements).

3.  **L'Esprit (Le Cerveau - IA Locale)** :
    - **Llama.cpp / Ollama** : Moteur d'IA auto-hébergé sur le port 8000.
    - **Modèles** : Llama 3.2 (3B/8B) optimisés pour la langue française et les contextes locaux.

---

## 🛠 Chapitre II : Le Protocole de Migration "Zéro Faute"

### 🛡 Phase 1 : Extraction des Données Sacrées (Local)
Transformez votre travail local en un script de vie indestructible.
```powershell
# Commande pour extraire TOUTE la base (Structure + Données + Rôles)
docker exec -it supabase_db_lqchbfhlldvhqqyvzxkg pg_dumpall -U postgres > CORAN_DONNEES_YOOMBAL.sql
```

### 🌍 Phase 2 : Préparation de la Terre Promise (Wanekoo Linux)
Initialisez un environnement Linux vierge pour accueillir l'écosystème.
```bash
# Protocoles de mise à jour et installation des moteurs (Docker & Node)
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs
```

### ⚡ Phase 3 : Reconstruction de Supabase
```bash
# Installation de la tour de contrôle
npm install -g supabase
mkdir yoombal-production && cd yoombal-production
supabase init
supabase start

# Injection des données sacrées dans le nouveau système
cat CORAN_DONNEES_YOOMBAL.sql | docker exec -i supabase_db_yoombal-production psql -U postgres
```

---

## 🧠 Chapitre III : Les Lois de l'Intelligence Artificielle Locale

### 1. Installation de la Griot AI (Ollama)
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Configuration du Grand Canal (Port 8000)
Il est DEVOIR du système d'éviter les conflits avec le port 8080 de l'application.
```bash
sudo systemctl edit ollama.service
# AJOUTER DANS LE FICHIER :
# [Service]
# Environment="OLLAMA_HOST=0.0.0.0:8000"
# Environment="OLLAMA_ORIGINS=*"

sudo systemctl daemon-reload && sudo systemctl restart ollama
ollama run llama3.2 # Le souffle de vie de l'IA
```

---

## 💎 Chapitre IV : Encyclopédie des Fonctionnalités "Ultimate"

### 1. Formulaire Marchand "Ultimate"
- **Onglet Général** : SKU unique, Tags intelligents, Générateur IA Griot.
- **Gestion Financière** : Calcul automatique des marges, prix barrés, TVA.
- **Logistique** : Gestion des unités de mesure, alertes de seuil critique.

### 2. Système BNPL (Buy Now Pay Later)
- Moteur de calcul d'échéances sur 3, 6 ou 12 mois.
- Automate de scoring basé sur l'historique de l'utilisateur.

### 3. CRM & Gestion des Rôles (RoleGuard)
- **Admin** : Contrôle total, gestion des clés API du monde.
- **Marchand** : Sa boutique est son royaume (gestion produits/commandes).
- **Livreur** : Sa mission est le mouvement (suivi temps réel).

---

## 🔐 Chapitre V : Sécurité & Souveraineté
- **RLS (Row Level Security)** : Chaque utilisateur ne voit que ce qui lui appartient. Loi absolue de Supabase.
- **Encryption** : Les mots de passe sont hachés via Bcrypt (par GoTrue).
- **Failover IA** : Si l'IA locale (8000) s'endort, le système invoque automatiquement les messagers Cloud (Groq/OpenAI) pour maintenir le service.

---

## 🏁 Chapitre Final : La Prophétie de Production
Pour que Yoombal rayonne sur le web :
1.  **Build** : `npm run build` (Génère le corps pur du site).
2.  **Upload** : Envoyer le dossier `dist` vers Wanekoo.
3.  **Config** : Mettre à jour `VITE_SUPABASE_URL` dans les réglages du serveur.

> [!IMPORTANT]
> **Le serment du développeur** : Ne jamais exposer le `service_role_key` au monde. Lui seul a le pouvoir de vie ou de mort sur les données. Utilisez toujours l'`anon_key` pour le frontend.

---
**Yoombal-s : La Technologie au service de la Teranga.** 🌍✨
