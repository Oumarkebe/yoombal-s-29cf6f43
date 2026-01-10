
-- Insert Pricing Plans into platform_settings
INSERT INTO public.platform_settings (key, value) VALUES 
('pricing_plans', '[
    {
      "title": "Client",
      "price": "Gratuit",
      "description": "Pour les acheteurs particuliers",
      "features": [
        "Accès à la marketplace",
        "Paiement échelonné BNPL",
        "Livraison standard gratuite",
        "Support client de base",
        "Programme de fidélité",
        "Assurance livraison basique"
      ],
      "cta": "Commencer gratuitement",
      "highlight": false,
      "ctaLink": "/register?role=client"
    },
    {
      "title": "Marchand",
      "price": "3,0%",
      "description": "Pour les vendeurs professionnels",
      "features": [
        "Boutique en ligne personnalisée",
        "Gestion des commandes",
        "Intégration BNPL pour vos produits",
        "Tableau de bord analytics",
        "Support prioritaire",
        "Outils marketing avancés",
        "API d'intégration"
      ],
      "cta": "Devenir marchand",
      "highlight": true,
      "ctaLink": "/register?role=merchant"
    },
    {
      "title": "Livreur",
      "price": "15%",
      "description": "Pour les partenaires de livraison",
      "features": [
        "Application mobile dédiée",
        "Planification des tournées",
        "Paiements automatiques",
        "Assurance livraison incluse",
        "Formation et support",
        "Bonus de performance",
        "Flexibilité d'horaires"
      ],
      "cta": "Devenir livreur",
      "highlight": false,
      "ctaLink": "/register?role=delivery"
    }
]'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
