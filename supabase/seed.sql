SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict g7C4pGH30Z6zjPNP56DsRLjkcgGxOYgLQR0ekShICdNmJVgVFU7u4zmLBha45Xy

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: ai_feature_profile_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ai_module_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "name", "description", "created_at", "updated_at") VALUES
	('1e80015e-906d-49a2-8f20-fa67a9c55847', 'Test Category', 'Description test', '2026-01-08 04:11:50.405935+00', '2026-01-08 04:11:50.405935+00'),
	('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Électronique', 'Smartphones, ordinateurs, accessoires tech', '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Mode & Vêtements', 'Vêtements, chaussures, accessoires mode', '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Maison & Jardin', 'Meubles, décoration, jardinage', '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('d4e5f6a7-b8c9-0123-def1-234567890123', 'Alimentation', 'Produits alimentaires, boissons', '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('e5f6a7b8-c9d0-1234-ef12-345678901234', 'Beauté & Santé', 'Cosmétiques, soins, bien-être', '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: bnpl_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: bnpl_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: deliveries; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: delivery_tracking; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: delivery_zones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."delivery_zones" ("id", "name", "areas", "base_fee", "price_per_km", "max_delivery_time_minutes", "is_active", "created_at", "updated_at") VALUES
	('f6a7b8c9-d0e1-2345-f123-456789012345', 'Dakar Centre', '{Plateau,Médina,Fann,"Point E"}', 500, 100, 30, true, '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('a7b8c9d0-e1f2-3456-0123-567890123456', 'Dakar Ouest', '{Ouakam,Ngor,Yoff,Almadies}', 750, 120, 45, true, '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('b8c9d0e1-f2a3-4567-1234-678901234567', 'Pikine-Guédiawaye', '{Pikine,Guédiawaye,"Parcelles Assainies"}', 1000, 150, 60, true, '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('c9d0e1f2-a3b4-5678-2345-789012345678', 'Rufisque', '{Rufisque,Bargny,Diamniadio}', 1500, 200, 90, true, '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00');


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: platform_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: premium_features; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_ai_feature_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 21, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict g7C4pGH30Z6zjPNP56DsRLjkcgGxOYgLQR0ekShICdNmJVgVFU7u4zmLBha45Xy

RESET ALL;

-- AUTOMATIC TEST USER CREATION
-- Using DO block to avoid function persistence issues during seed

DO $$
DECLARE
    v_user_id uuid;
    v_email text;
    v_password text := 'Touba28';
    v_role text;       -- The intent role (for user_roles)
    v_profile_role text; -- The role to put in profiles table (constrained)
    v_fname text;
    v_lname text;
    user_record record;
BEGIN
    FOR user_record IN 
        SELECT * FROM (VALUES 
            ('admin@yoombal.com', 'admin', 'Super', 'Admin'),
            ('client@yoombal.com', 'client', 'Client', 'Test'),
            ('livreur@yoombal.com', 'driver', 'Livreur', 'Express'),
            ('marchand@yoombal.com', 'marchand', 'Marchand', 'Yoombal')
        ) AS t(email, role, fname, lname)
    LOOP
        v_email := user_record.email;
        v_role := user_record.role;
        v_fname := user_record.fname;
        v_lname := user_record.lname;

        -- Determine valid profile role to satisfy conflicting CHECK constraints
        -- Constraints allow: 'admin', 'client' (intersection of English/French checks)
        IF v_role = 'admin' THEN
            v_profile_role := 'admin';
        ELSE
            v_profile_role := 'client';
        END IF;

        -- Check if user exists
        SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

        IF v_user_id IS NULL THEN
            -- Insert into auth.users
            INSERT INTO auth.users (
                instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
            ) VALUES (
                '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', v_email, crypt(v_password, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', jsonb_build_object('role', v_role, 'first_name', v_fname, 'last_name', v_lname), now(), now(), '', '', '', ''
            ) RETURNING id INTO v_user_id;

            -- Insert into auth.identities
            INSERT INTO auth.identities (
                id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
            ) VALUES (
                v_user_id, v_user_id, jsonb_build_object('sub', v_user_id, 'email', v_email), 'email', v_email, now(), now(), now()
            );
        END IF;

        -- Ensure profile with VALID constrained role
        INSERT INTO public.profiles (id, email, first_name, last_name, role)
        VALUES (v_user_id, v_email, v_fname, v_lname, v_profile_role)
        ON CONFLICT (id) DO UPDATE SET role = v_profile_role;

        -- Ensure user_role with ACTUAL intent role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, v_role)
        ON CONFLICT (user_id, role) DO NOTHING;
        
    END LOOP;

    -- CREATE A TEST DELIVERY
    -- Fetching the IDs we just created
    DECLARE
        v_marchand_id uuid;
        v_livreur_id uuid;
        v_client_id uuid;
        v_delivery_id uuid;
    BEGIN
        SELECT id INTO v_marchand_id FROM auth.users WHERE email = 'marchand@yoombal.com';
        SELECT id INTO v_livreur_id FROM auth.users WHERE email = 'livreur@yoombal.com';
        SELECT id INTO v_client_id FROM auth.users WHERE email = 'client@yoombal.com';

        IF v_marchand_id IS NOT NULL AND v_livreur_id IS NOT NULL THEN
            INSERT INTO public.deliveries (
                order_id,
                customer_id,
                merchant_id,
                driver_id,
                pickup_address,
                delivery_address,
                customer_phone,
                customer_name,
                status,
                delivery_fee,
                estimated_delivery_time
            ) VALUES (
                gen_random_uuid(), -- Changed from 'ORD-TEST-001' to valid UUID
                v_client_id,
                v_marchand_id,
                v_livreur_id,
                'Marché Sandaga, Dakar',
                'Sicap Liberté 6, Dakar',
                '+221 77 123 45 67',
                'Client Test Yoombal',
                'in_transit',
                2500,
                now() + interval '45 minutes'
            ) RETURNING id INTO v_delivery_id;

            -- Add initial tracking position (Dakar Center)
            INSERT INTO public.delivery_tracking (
                delivery_id,
                latitude,
                longitude,
                status_update
            ) VALUES (
                v_delivery_id,
                14.7167,
                -17.4677,
                'initial'
            );
        END IF;
    END;
END $$;
