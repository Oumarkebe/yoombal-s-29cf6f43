# 📖 Guide d'Administration : Configurations JSON (IA & Premium)

Ce guide explique comment modifier les paramètres avancés des fonctionnalités premium de Yoombal via les objets JSON dans l'interface d'administration.

---

## 🤖 Intelligence Artificielle (Standardisé 🚀)

### Assistant IA (`ai_assistant`)
*   `language`: Langue principale (ex: `"fr"`)
*   `support_wolof`: Activer/Désactiver le support du Wolof (`true`/`false`)
*### 🎙️ Configuration de la Voix (Griot)
L'assistant Yoombal utilise un système hybride pour garantir une indépendance totale :

1.  **Voix Standard** : Utilise les voix natives du navigateur.
2.  **Voix Griot (Pape Faye)** :
    -   **Emplacement** : Déposez le fichier `pape_faye.onnx` dans `public/models/`.
    -   **Détection Automatique** : Si le fichier est présent, l'assistant l'utilisera pour une qualité supérieure 100% hors-ligne.
    -   **Fallback Intelligent** : Si le fichier est absent, l'assistant bascule sur le mode "Sage" (voix masculine système avec réglages acoustiques optimisés).
*   `response_tone`: Style de réponse (`"professional"`, `"friendly"`, `"concise"`)
*   `engine`: Modèle d'IA utilisé (`"gpt-4o"`, `"gpt-3.5-turbo"`)

### Génération de Contenu (`content_generation`)
*   `max_length`: Nombre maximum de caractères générés.
*   `tone`: Style commercial (`"commercial"`, `"luxury"`, `"minimalist"`)
*   `include_seo`: Optimiser le texte pour le référencement Google.

### Recherche Smart (`ai_smart_search`)
*   `voice_enabled`: Activer le bouton microphone.
*   `semantic_threshold`: Précision de la recherche (0.0 à 1.0).

### Vision IA (`ai_vision`)
*   `qc_enabled`: Activer le bouton de contrôle qualité dans le formulaire produit.
*   `visual_search_enabled`: Activer la recherche par image dans le marketplace.

### Pricing Dynamique (`pricing`)
*   `algorithm`: Type d'algorithme (`"market_based"`, `"cost_plus"`, `"demand_based"`)
*   `min_margin`: Marge minimale à respecter (ex: `0.1` pour 10%).

---

## 📈 Analytics & Marketing

### Analyses Prédictives (`predictions`)
*   `prediction_horizon_days`: Nombre de jours pour les prévisions de ventes.
*   `confidence_interval`: Précision statistique (ex: `0.95`).

### Parrainage (`referral_system`)
*   `reward_amount`: Montant crédité au parrain (en CFA).
*   `max_referrals`: Nombre max de personnes qu'un utilisateur peut parrainer.
*   `require_first_purchase`: La prime n'est versée qu'après le premier achat du filleul.

### Marketing Automatisé (`marketing_automation`)
*   `channels`: Liste des canaux autorisés `["sms", "email", "push"]`.
*   `frequency_limit`: Nombre max de messages par semaine par utilisateur.

---

## ⚙️ Synchronisation Automatique
> [!TIP]
> **Nouveauté** : Les réglages modifiés dans l'administration des fonctionnalités premium sont désormais **automatiquement synchronisés** avec les modules de l'IA via un trigger en base de données. Vous n'avez plus besoin d'opérations manuelles après vos modifications.

## 💡 Conseils pour l'Admin
> [!IMPORTANT]
> - Respectez toujours le format : utilisez des guillemets doubles `" "` pour les textes et les clés.
> - Pour les valeurs logiques, utilisez `true` (vrai) ou `false` (faux) sans guillemets.
> - Si vous faites une erreur de syntaxe, l'IA utilisera ses réglages de secours (fallback).
