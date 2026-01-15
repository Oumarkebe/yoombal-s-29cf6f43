
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyLivreur() {
    const email = 'Livreur@gmail.com'; // Case insensitive usually in auth but specific here
    console.log(`Checking for user: ${email}...`);

    // 1. Get User ID (Trying to search in public profiles using a clever trick or just assuming I can access profiles?)
    // Normal RLS prevents searching profiles by email usually.
    // However, I can try.
    // Or, I can check specific known tables if I have a service role key. 
    // I DO NOT have service role key in context usually.
    // BUT common dev setups put SERVICE_KEY in .env sometimes. Let's check for SUPABASE_SERVICE_ROLE_KEY.

    // Fallback: If I can't find ID, I can't verify easily.
    // BUT maybe I can select * from profiles where email matches? (profile usually doesn't store email directly, auth.users does)
    // Actually, profiles table often has email if copied.
    // Let's see profiles schema... earlier view showed 'id', 'first_name', etc. no 'email'.
    // WAIT. If I can't get ID, I can't check.
    // Assuming the user is testing "Livreur@gmail.com", I really hope I can find their ID.
    // I will try to list all profiles and see if I can spot them by metadata if possible, or just fail gracefully.

    // Actually, 'user_premium_subscriptions' joins on profiles.
    // Let's try to query profiles (if public read allowed).

    // Wait, earlier I saw 'profiles' table definition. It has 'id'. 
    // Auth users are in auth schema.

    // Let's try to find a user with first_name 'Livreur' maybe?

    // BETTER: I will use a special query to `user_premium_subscriptions` and join profiles, filtering by profile fields if possible?

    // Let's just try to list profiles.
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(100);
    if (pError) {
        console.error("Error fetching profiles:", pError);
        return;
    }

    console.log(`Found ${profiles.length} profiles. Scanning for related info...`);

    // I can't see emails. 
    // BUT I can show what modules are active for *any* user, and maybe deduce.

    // Let's just look at *all* active premium subscriptions and list them.
    const { data: subs, error: sError } = await supabase
        .from('user_premium_subscriptions')
        .select(`
            user_id,
            status,
            feature:premium_features(name, feature_key)
        `)
        .eq('status', 'active');

    if (sError) {
        console.error("Error fetching subscriptions:", sError);
    } else {
        console.log("\n--- Active Module Subscriptions ---");
        subs.forEach(s => {
            console.log(`User ${s.user_id} has active module: ${s.feature?.name} (${s.feature?.feature_key})`);
        });
    }

    // Also check overrides
    const { data: settings, error: setError } = await supabase
        .from('user_ai_feature_settings')
        .select('*')
        .eq('is_enabled', true);

    if (setError) {
        console.error("Error fetching settings:", setError);
    } else {
        console.log("\n--- Active Type 2 Overrides (Settings) ---");
        settings.forEach(s => {
            console.log(`User ${s.user_id} has override: ${s.feature_key}`);
        });
    }
}

verifyLivreur();
