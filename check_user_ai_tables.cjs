const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

async function checkTables() {
    console.log('🔍 Vérification des tables user_ai_*...\n');

    // Requête SQL directe pour lister les tables
    const { data: tables, error: tableError } = await supabase.rpc('exec_sql', {
        query: `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%user_ai%'
      ORDER BY table_name
    `
    });

    if (tableError) {
        console.log('❌ Erreur RPC exec_sql:', tableError.message);
        console.log('   Tentative alternative...\n');
    }

    // Test direct des tables
    const tablesToCheck = ['user_ai_settings', 'user_ai_feature_settings'];

    for (const tableName of tablesToCheck) {
        try {
            const { count, error, status } = await supabase
                .from(tableName)
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.log(`❌ ${tableName}: ${error.code} - ${error.message}`);
                console.log(`   Details:`, error.details);
                console.log(`   Hint:`, error.hint);
            } else {
                console.log(`✅ ${tableName}: Existe (${count || 0} lignes) - Status ${status}`);
            }
        } catch (e) {
            console.log(`❌ ${tableName}: Exception -`, e.message);
        }
        console.log('');
    }

    // Vérifier si nous pouvons créer la table manquante
    console.log('🛠️  Tentative de création de user_ai_settings si manquante...\n');

    const { data: createData, error: createError } = await supabase.rpc('exec_sql', {
        query: `
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'user_ai_settings'
          ) THEN
              CREATE TABLE public.user_ai_settings (
                  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                  user_id UUID NOT NULL,
                  feature_key TEXT NOT NULL,
                  is_enabled BOOLEAN NOT NULL DEFAULT false,
                  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
                  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
                  UNIQUE(user_id, feature_key)
              );
              RAISE NOTICE 'Table user_ai_settings créée';
          ELSE
              RAISE NOTICE 'Table user_ai_settings existe déjà';
          END IF;
      END $$;
    `
    });

    if (createError) {
        console.log('❌ Création échouée:', createError.message);
    } else {
        console.log('✅ Création réussie ou table existante');
    }
}

checkTables().then(() => {
    console.log('\n✅ Vérification terminée');
    process.exit(0);
}).catch(err => {
    console.error('\n❌ Erreur fatale:', err);
    process.exit(1);
});
