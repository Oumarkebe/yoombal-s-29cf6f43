const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manuel parsing of .env file
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length === 2) {
                let key = parts[0].trim();
                let value = parts[1].trim();
                // Remove surrounding quotes if they exist
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }
                process.env[key] = value;
            }
        });
    }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSql() {
    console.log('Activating features in premium_features...');
    const { error: err1 } = await supabase
        .from('premium_features')
        .update({ is_enabled: true })
        .in('feature_key', ['ai_pricing', 'ai_analytics', 'ai_vision']);

    if (err1) console.error('Error premium_features:', err1);

    console.log('Activating features in ai_module_settings...');
    const keys = ['pricing', 'predictions'];
    for (const key of keys) {
        const { error: err2 } = await supabase
            .from('ai_module_settings')
            .upsert({
                key: key,
                is_enabled: true,
                configuration: key === 'pricing' ? { "algorithm": "market_based", "min_margin": 0.1 } : { "prediction_horizon_days": 7 }
            }, { onConflict: 'key' });
        if (err2) console.error(`Error ai_module_settings (${key}):`, err2);
    }

    console.log('Done.');
}

runSql();
