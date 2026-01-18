
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config({ path: '.env' });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('Testing RPC check_email_exists...');

    // Testing with a random email
    const { data, error } = await supabase.rpc('check_email_exists', { email_arg: 'nonexistent@yoombal.com' });

    if (error) {
        console.error('❌ RPC Error:', error.message);
        if (error.message.includes('not found')) {
            console.log('💡 The function check_email_exists does not exist in the database.');
        }
    } else {
        console.log('✅ RPC Success! Result for nonexistent email:', data);
    }
}

test();
