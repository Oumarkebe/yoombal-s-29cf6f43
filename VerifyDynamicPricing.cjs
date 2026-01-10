
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    console.log("Connected...");

    const pricingPlans = [
        {
            title: "Client",
            price: "Gratuit",
            description: "Pour les acheteurs particuliers",
            features: [
                "Accès à la marketplace",
                "Paiement échelonné BNPL",
                "Livraison standard gratuite",
                "Support client de base",
                "Programme de fidélité",
                "Assurance livraison basique"
            ],
            cta: "Commencer gratuitement",
            highlight: false,
            ctaLink: "/register?role=client"
        },
        {
            title: "Marchand",
            price: "3,0%",
            description: "Pour les vendeurs professionnels",
            features: [
                "Boutique en ligne personnalisée",
                "Gestion des commandes",
                "Intégration BNPL pour vos produits",
                "Tableau de bord analytics",
                "Support prioritaire",
                "Outils marketing avancés",
                "API d'intégration"
            ],
            cta: "Devenir marchand",
            highlight: true,
            ctaLink: "/register?role=merchant"
        },
        {
            title: "Livreur",
            price: "15%",
            description: "Pour les partenaires de livraison",
            features: [
                "Application mobile dédiée",
                "Planification des tournées",
                "Paiements automatiques",
                "Assurance livraison incluse",
                "Formation et support",
                "Bonus de performance",
                "Flexibilité d'horaires"
            ],
            cta: "Devenir livreur",
            highlight: false,
            ctaLink: "/register?role=delivery"
        }
    ];

    try {
        await client.query(
            "INSERT INTO public.platform_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
            ['pricing_plans', JSON.stringify(pricingPlans)]
        );
        console.log("Pricing updated to 3.0% via node script.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
