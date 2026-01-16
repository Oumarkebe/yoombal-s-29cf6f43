const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Connexion à Supabase avec Service Role...\n');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    db: {
        schema: 'public'
    }
});

async function executeSQL(description, sql) {
    console.log(`📝 ${description}`);
    console.log(`   SQL: ${sql.substring(0, 100)}...`);

    try {
        const { data, error } = await supabase.rpc('exec_sql', { query: sql });

        if (error) {
            console.log(`   ❌ Erreur: ${error.message}`);
            return false;
        }

        console.log(`   ✅ Succès!\n`);
        return true;
    } catch (e) {
        console.log(`   ❌ Exception: ${e.message}\n`);
        return false;
    }
}

async function main() {
    console.log('🚀 Démarrage des corrections de base de données...\n');

    // 1. Renommer la table user_ai_feature_settings -> user_ai_settings
    console.log('=== Étape 1: Renommer la table ===');
    await executeSQL(
        'Renommer user_ai_feature_settings en user_ai_settings',
        `
    DO $$
    BEGIN
        IF EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_ai_feature_settings'
        ) THEN
            ALTER TABLE public.user_ai_feature_settings RENAME TO user_ai_settings;
            RAISE NOTICE 'Table renommée avec succès';
        ELSE
            RAISE NOTICE 'Table user_ai_feature_settings n''existe pas ou déjà renommée';
        END IF;
    END $$;
    `
    );

    // 2. Renommer les contraintes
    console.log('=== Étape 2: Renommer les contraintes ===');
    await executeSQL(
        'Renommer la contrainte primary key',
        `
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'user_ai_feature_settings_pkey'
        ) THEN
            ALTER TABLE public.user_ai_settings 
            RENAME CONSTRAINT user_ai_feature_settings_pkey TO user_ai_settings_pkey;
            RAISE NOTICE 'Contrainte PK renommée';
        ELSE
            RAISE NOTICE 'Contrainte PK déjà renommée ou n''existe pas';
        END IF;
    END $$;
    `
    );

    await executeSQL(
        'Renommer la contrainte unique',
        `
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'user_ai_feature_settings_user_id_feature_key_key'
        ) THEN
            ALTER TABLE public.user_ai_settings 
            RENAME CONSTRAINT user_ai_feature_settings_user_id_feature_key_key 
            TO user_ai_settings_user_id_feature_key_key;
            RAISE NOTICE 'Contrainte unique renommée';
        ELSE
            RAISE NOTICE 'Contrainte unique déjà renommée ou n''existe pas';
        END IF;
    END $$;
    `
    );

    // 3. Créer le profil manquant
    console.log('=== Étape 3: Créer le profil utilisateur ===');
    await executeSQL(
        'Créer/mettre à jour le profil pour yoombal28@gmail.com',
        `
    INSERT INTO public.profiles (id, email, role, first_name, last_name)
    VALUES (
      'bdd6f70f-af16-4732-ab5e-8d7694e6d90f',
      'yoombal28@gmail.com',
      'admin',
      'Yoombal',
      'Admin'
    )
    ON CONFLICT (id) DO UPDATE 
    SET 
      email = EXCLUDED.email,
      role = EXCLUDED.role,
      updated_at = now();
    `
    );

    // 4. Vérifier les résultats
    console.log('=== Vérification finale ===');

    const { data: tables } = await supabase.rpc('exec_sql', {
        query: `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%user_ai%'
      ORDER BY table_name;
    `
    });
    console.log('📊 Tables user_ai trouvées:', tables);

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f')
        .single();

    if (profile) {
        console.log('✅ Profil créé/mis à jour:', profile);
    } else {
        console.log('❌ Profil non trouvé après insertion');
    }

    console.log('\n🎉 Corrections terminées!');
    console.log('\n📝 Prochaines étapes:');
    console.log('   1. Faites un Hard Refresh du navigateur (Ctrl+Shift+R)');
    console.log('   2. Reconnectez-vous à l\'application');
    console.log('   3. Vérifiez que les erreurs ont disparu\n');
}

main().then(() => {
    console.log('✅ Script terminé avec succès');
    process.exit(0);
}).catch(err => {
    console.error('❌ Erreur fatale:', err);
    process.exit(1);
});
