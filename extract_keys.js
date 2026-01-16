const fs = require('fs');
const path = require('path');

const kongFile = 'temp_kong.yml';
const envFile = '.env.local';

try {
    console.log('🔍 Analyse de kong.yml...');
    const content = fs.readFileSync(kongFile, 'utf8');

    // Extraction regex simple pour éviter les dépendances YAML
    // Cherche:
    // - username: anon
    //   jwt_secrets:
    //     - key: ...

    const extractKey = (username) => {
        const userRegex = new RegExp(`- username: ${username}[\\s\\S]*?jwt_secrets:[\\s\\S]*?- key: ([a-zA-Z0-9._-]+)`, 'm');
        const match = content.match(userRegex);
        return match ? match[1] : null;
    };

    const anonKey = extractKey('anon');
    const serviceKey = extractKey('service_role');

    if (anonKey && serviceKey) {
        console.log('✅ Clés trouvées !');
        console.log('   Anon:', anonKey.substring(0, 20) + '...');
        console.log('   Service:', serviceKey.substring(0, 20) + '...');

        // Mettre à jour .env.local
        let envContent = '';
        if (fs.existsSync(envFile)) {
            envContent = fs.readFileSync(envFile, 'utf8');
        }

        // Remplacer ou ajouter
        const updateEnv = (key, value) => {
            const regex = new RegExp(`^${key}=.*`, 'm');
            if (regex.test(envContent)) {
                envContent = envContent.replace(regex, `${key}="${value}"`);
            } else {
                envContent += `\n${key}="${value}"`;
            }
        };

        updateEnv('VITE_SUPABASE_ANON_KEY', anonKey);
        updateEnv('SUPABASE_SERVICE_ROLE_KEY', serviceKey); // Parfois appelé SUPABASE_SERVICE_KEY
        updateEnv('VITE_SUPABASE_SERVICE_ROLE_KEY', serviceKey); // Au cas où

        fs.writeFileSync(envFile, envContent);
        console.log(`✅ ${envFile} mis à jour avec succès !`);

    } else {
        console.log('❌ Impossible de trouver les clés dans kong.yml');
        console.log('Contenu partiel pour debug:');
        console.log(content.substring(0, 500));
    }

} catch (e) {
    console.error('❌ Erreur:', e.message);
}
