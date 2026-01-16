
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load .env.local
if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config({ path: '.env' });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing URL or Service Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDb() {
    console.log(`Checking DB at: ${supabaseUrl}`);

    // 1. Check premium_features
    const { data: features, error: featuresError } = await supabase
        .from('premium_features')
        .select('feature_key, is_free, is_enabled');

    if (featuresError) {
        console.error('❌ Error fetching premium_features:', featuresError.message);
    } else {
        console.log('✅ Premium Features:');
        features.forEach(f => {
            if (f.feature_key.includes('ai') || f.feature_key.includes('assistant')) {
                console.log(` - ${f.feature_key}: is_free=${f.is_free}, is_enabled=${f.is_enabled}`);
            }
        });
    }

    // 2. Check platform_settings for ai_keys
    const { data: settings, error: settingsError } = await supabase
        .from('platform_settings')
        .select('key, value')
        .eq('key', 'ai_keys')
        .maybeSingle();

    if (settingsError) {
        console.error('❌ Error fetching platform_settings:', settingsError.message);
    } else {
        console.log('✅ AI Keys Setting:', settings ? 'FOUND' : 'NOT FOUND');
        if (settings) {
            console.log(' - Keys present:', Object.keys(settings.value || {}).filter(k => k.toLowerCase().includes('key')));
        }
    }
}

checkDb();
