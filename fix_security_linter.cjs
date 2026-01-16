
const { Client } = require('pg');

// Connexion string (Local)
const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

const client = new Client({
    connectionString,
});

async function fixSecurityIssues() {
    try {
        await client.connect();
        console.log('🔌 Connecté à la base de données.');

        // 1. Fix admin_orders_view (SECURITY DEFINER -> INVOKER)
        // Cela force la vue à respecter les politiques RLS de l'utilisateur qui l'appelle
        console.log('🛠️ Correction de admin_orders_view...');
        await client.query(`
      ALTER VIEW public.admin_orders_view SET (security_invoker = true);
    `);
        console.log('✅ admin_orders_view passé en SECURITY INVOKER.');

        // 2. Fix _migrations_log (Enable RLS)
        console.log('🛠️ Activation RLS sur _migrations_log...');
        await client.query(`
      ALTER TABLE public._migrations_log ENABLE ROW LEVEL SECURITY;
    `);
        // On ajoute une politique simple pour ne pas bloquer les inserts de migration (souvent faits par postgres/service_role qui bypass RLS, 
        // mais soyons propres : lecture seule pour les autres ou bloqué par défaut)
        // Par défaut "ENABLE ROW LEVEL SECURITY" bloque tout le monde sauf le owner/service_role, ce qui est très bien pour une table de logs interne.
        console.log('✅ RLS activé sur _migrations_log.');

    } catch (err) {
        console.error('❌ Erreur lors de la correction :', err);
    } finally {
        await client.end();
        console.log('🔌 Déconnecté.');
    }
}

fixSecurityIssues();
