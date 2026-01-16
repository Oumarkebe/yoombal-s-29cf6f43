const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to database");

        // 1. Create Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.application_messages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        application_id UUID REFERENCES public.bnpl_applications(id) ON DELETE CASCADE,
        sender_id UUID REFERENCES auth.users(id),
        content TEXT NOT NULL,
        message_type TEXT DEFAULT 'text', -- 'text', 'image', 'document', 'system'
        is_system_message BOOLEAN DEFAULT false,
        attachment_url TEXT,
        is_read BOOLEAN DEFAULT false,
        read_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);
        console.log("Table application_messages created.");

        // 2. Enable RLS
        await client.query(`ALTER TABLE public.application_messages ENABLE ROW LEVEL SECURITY;`);

        // 3. Create Policies

        // SELECT: Participants can see messages
        await client.query(`
      DROP POLICY IF EXISTS "Participants can view messages" ON public.application_messages;
      CREATE POLICY "Participants can view messages" ON public.application_messages
      FOR SELECT USING (
        auth.uid() IN (
          SELECT user_id FROM public.bnpl_applications WHERE id = application_id
          UNION
          SELECT merchant_id FROM public.bnpl_applications WHERE id = application_id
        )
        OR 
        auth.uid() = sender_id -- Fallback for sender
      );
    `);

        // INSERT: Participants can send messages
        await client.query(`
      DROP POLICY IF EXISTS "Participants can insert messages" ON public.application_messages;
      CREATE POLICY "Participants can insert messages" ON public.application_messages
      FOR INSERT WITH CHECK (
        auth.uid() IN (
          SELECT user_id FROM public.bnpl_applications WHERE id = application_id
          UNION
          SELECT merchant_id FROM public.bnpl_applications WHERE id = application_id
        )
      );
    `);

        // UPDATE: Only participants can update (e.g. mark as read)
        await client.query(`
      DROP POLICY IF EXISTS "Participants can update messages" ON public.application_messages;
      CREATE POLICY "Participants can update messages" ON public.application_messages
      FOR UPDATE USING (
         auth.uid() IN (
          SELECT user_id FROM public.bnpl_applications WHERE id = application_id
          UNION
          SELECT merchant_id FROM public.bnpl_applications WHERE id = application_id
        )
      );
    `);

        console.log("RLS Policies applied.");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

run();
