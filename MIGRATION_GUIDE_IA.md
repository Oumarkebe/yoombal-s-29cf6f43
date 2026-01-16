# 🚀 Guide de Migration & Configuration IA (Production)

Ce guide vous explique comment migrer l'écosystème **Yoombal-s** vers un serveur web (Wanekoo ou autre) et comment y configurer un moteur IA local (**Ollama / Llama.cpp**).

---

## 1. Préparation du Serveur Web (Linux)

La plupart des serveurs web (VPS) tournent sous Linux (Ubuntu/Debian). Voici les prérequis :

- **Node.js** (v18+)
- **Docker** & **Docker Compose**
- **Supabase CLI** (pour les Edge Functions)

### Étape 1 : Installer Ollama sur le serveur
Ollama est le moteur le plus simple pour faire tourner Llama en production.

```bash
# Installation automatique sur Linux
curl -fsSL https://ollama.com/install.sh | sh
```

### Étape 2 : Configurer Ollama pour le réseau interne
Par défaut, Ollama n'écoute que sur `127.0.0.1`. Pour que Supabase (Docker) puisse lui parler, modifiez le service :

1. Éditez la configuration : `sudo systemctl edit ollama.service`
2. Ajoutez ces lignes :
   ```ini
   [Service]
   Environment="OLLAMA_HOST=0.0.0.0:8000"
   ```
3. Redémarrez :
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart ollama
   ```

### Étape 3 : Télécharger le modèle IA
```bash
ollama run llama3.2  # Télécharge le modèle Llama 3.2 (3B)
```

---

## 2. Migration du Projet Yoombal

### Étape 1 : Déployer les Edge Functions
Depuis votre machine locale, vers votre instance de production :

```bash
supabase link --project-ref votre_id_projet
supabase functions deploy content-generation
```

### Étape 2 : Configurer les Variables d'Environnement
Sur votre serveur de production (ou via le dashboard Supabase), assurez-vous que l'Edge Function connaît l'adresse d'Ollama :

```bash
# Dans le dashboard Supabase -> Edge Functions -> Settings
# Ajoutez ou vérifiez la variable :
LOCAL_AI_URL = "http://host.docker.internal:8000/v1/chat/completions"
```

---

## 3. Configuration SQL (Finalisation)

Une fois le serveur prêt, assurez-vous que la base de données pointe sur le bon fournisseur :

```sql
-- Dans votre SQL Editor Supabase
UPDATE public.ai_module_settings 
SET configuration = '{"provider": "local"}' 
WHERE key = 'content_generation';
```

---

## 4. Stratégie de Secours (Failover)

> [!IMPORTANT]
> **Ne négligez pas Groq !**
> Sur un serveur web partagé, Ollama peut être lent. Il est fortement recommandé de configurer une clé **Groq** dans les paramètres d'administration de Yoombal.
> 
> **Le système est déjà programmé pour faire ceci :**
> 1. Tenter de joindre Ollama sur le serveur (Port 8000).
> 2. Si Ollama met + de 5 secondes à répondre ou est éteint : Basculer instantanément sur Groq.

---

## 5. Résumé des Ports en Production

| Service | Port | Rôle |
| :--- | :--- | :--- |
| **Vite / Web App** | 8080 | Interface utilisateur |
| **Ollama** | 8000 | Moteur IA Local |
| **Supabase (API)** | 54321 | Backend & Auth |

---

### Vérification après installation
Pour tester si votre serveur IA répond bien sur le serveur web :
`curl http://localhost:8000/v1/models`
