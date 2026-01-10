const { Client } = require('pg');

async function fixPlatformSettings() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres'
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        await client.query(`
      CREATE TABLE IF NOT EXISTS public.platform_settings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        key text UNIQUE NOT NULL,
        value jsonb NOT NULL,
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now()
      );

      ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Settings viewable by everyone" ON public.platform_settings;
      CREATE POLICY "Settings viewable by everyone" ON public.platform_settings
      FOR SELECT USING (true);

      DROP POLICY IF EXISTS "Only admins can modify settings" ON public.platform_settings;
      CREATE POLICY "Only admins can modify settings" ON public.platform_settings
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

      -- Default values
      INSERT INTO public.platform_settings (key, value)
      VALUES ('ai_keys', '{"openaiApiKey": ""}')
      ON CONFLICT (key) DO NOTHING;
    `);
        console.log('platform_settings table created successfully.');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

fixPlatformSettings();
