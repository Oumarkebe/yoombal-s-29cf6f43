SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict CHRx5rphZHMUYLq6MTNXCghB7pLuBgxcFiagAzueCCN3pS46ucDAAKYHLrcw06V

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

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'ffa2067a-6df1-47b5-a52c-e7143b19b9b7', '{"action":"login","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-11 07:43:42.185907+00', ''),
	('00000000-0000-0000-0000-000000000000', '50afeecb-fb2e-4a09-9552-135ad43de2a8', '{"action":"login","actor_id":"a4548683-1535-464f-b579-85183795a131","actor_username":"livreur@yoombal.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-11 07:51:08.43764+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8000d61-5afb-40d9-9968-a38e89332999', '{"action":"logout","actor_id":"a4548683-1535-464f-b579-85183795a131","actor_username":"livreur@yoombal.com","actor_via_sso":false,"log_type":"account"}', '2026-01-11 07:52:28.489966+00', ''),
	('00000000-0000-0000-0000-000000000000', '89b7ae35-1900-46ce-9c89-5bab6f72b935', '{"action":"login","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-11 07:54:16.834255+00', ''),
	('00000000-0000-0000-0000-000000000000', 'acbf20b1-fa5f-4438-8144-db0e775c3f84', '{"action":"login","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-11 08:04:16.961451+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca4fd9b5-dbcc-43e2-baee-74f1b3683292', '{"action":"login","actor_id":"a4548683-1535-464f-b579-85183795a131","actor_username":"livreur@yoombal.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-11 08:15:31.364924+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f34895c-8c72-4220-a470-d5740cef8ef6', '{"action":"token_refreshed","actor_id":"a4548683-1535-464f-b579-85183795a131","actor_username":"livreur@yoombal.com","actor_via_sso":false,"log_type":"token"}', '2026-01-11 13:33:25.933517+00', ''),
	('00000000-0000-0000-0000-000000000000', '23e5946a-89ac-4130-8105-a2f5418371b0', '{"action":"token_revoked","actor_id":"a4548683-1535-464f-b579-85183795a131","actor_username":"livreur@yoombal.com","actor_via_sso":false,"log_type":"token"}', '2026-01-11 13:33:25.937769+00', ''),
	('00000000-0000-0000-0000-000000000000', '74c2fe22-00ca-4906-a900-2c11abd6c327', '{"action":"login","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-11 13:37:12.020251+00', ''),
	('00000000-0000-0000-0000-000000000000', '58dff878-6aae-4d94-bd58-98b81186bd4d', '{"action":"token_refreshed","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"token"}', '2026-01-11 14:35:41.353211+00', ''),
	('00000000-0000-0000-0000-000000000000', '921d0268-c98f-49a6-80b2-0af2c6333118', '{"action":"token_revoked","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"token"}', '2026-01-11 14:35:41.354975+00', ''),
	('00000000-0000-0000-0000-000000000000', '265a09b6-cde0-4da2-937a-d7e6631820d1', '{"action":"token_refreshed","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"token"}', '2026-01-11 15:33:47.316328+00', ''),
	('00000000-0000-0000-0000-000000000000', '58c71194-d4c3-43d9-acc0-ad00ed5ac6fe', '{"action":"token_revoked","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"token"}', '2026-01-11 15:33:47.320968+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f279301b-2579-4788-accd-e7b5e561b5d2', '{"action":"token_refreshed","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"token"}', '2026-01-11 16:31:47.426756+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1d1006d-8567-4ee6-b7eb-66d481784961', '{"action":"token_revoked","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"token"}', '2026-01-11 16:31:47.431622+00', ''),
	('00000000-0000-0000-0000-000000000000', '8cf1e56e-cf5e-460a-957c-07a76dc59ba2', '{"action":"logout","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"account"}', '2026-01-11 16:36:59.531345+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2e47dd3-6608-4395-ac8e-c4ecd29f10b1', '{"action":"login","actor_id":"3d591330-34f7-4a31-83ad-25d9770c0435","actor_username":"admin@yoombal.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-11 16:37:32.820973+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', 'authenticated', 'authenticated', 'yoombal28@gmail.com', '$2a$10$lR2lWHgaetUxFxq.cEhAm.he8pDRinkRXI8lSuFxQpjeZdubC0PW6', '2026-01-11 19:24:02.491873+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-11 19:58:07.902361+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-01-11 19:24:02.44774+00', '2026-01-11 20:56:23.25951+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('bdd6f70f-af16-4732-ab5e-8d7694e6d90f', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', '{"sub": "bdd6f70f-af16-4732-ab5e-8d7694e6d90f", "email": "yoombal28@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-01-11 19:24:02.476129+00', '2026-01-11 19:24:02.477189+00', '2026-01-11 19:24:02.477189+00', '81c28400-d92a-4059-98d2-b99ef975b072');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('8d85f10f-adec-4560-a5b5-c36216d6be52', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', '2026-01-11 19:31:27.874533+00', '2026-01-11 19:31:27.874533+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '41.83.137.32', NULL, NULL, NULL, NULL, NULL),
	('792e37f4-d3a0-4c95-9d96-e05a83c536a1', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', '2026-01-11 19:33:25.223292+00', '2026-01-11 19:33:25.223292+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '41.83.137.32', NULL, NULL, NULL, NULL, NULL),
	('ad6dd7f4-761b-414d-bd6f-136ac540dbfb', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', '2026-01-11 19:34:35.614931+00', '2026-01-11 19:34:35.614931+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '41.83.137.32', NULL, NULL, NULL, NULL, NULL),
	('6aaae8a3-7126-4b60-aaff-69ebe8fdccf7', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', '2026-01-11 19:40:46.894523+00', '2026-01-11 19:40:46.894523+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '41.83.137.32', NULL, NULL, NULL, NULL, NULL),
	('ac397755-5839-446f-81ab-cf0c5f9675a1', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', '2026-01-11 19:56:42.554694+00', '2026-01-11 20:54:54.002349+00', NULL, 'aal1', NULL, '2026-01-11 20:54:54.000426', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '41.83.137.32', NULL, NULL, NULL, NULL, NULL),
	('f770cf85-dac9-4410-9c11-516c7a5cd417', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', '2026-01-11 19:58:07.902452+00', '2026-01-11 20:56:23.262798+00', NULL, 'aal1', NULL, '2026-01-11 20:56:23.262715', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '41.83.137.32', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('8d85f10f-adec-4560-a5b5-c36216d6be52', '2026-01-11 19:31:27.917479+00', '2026-01-11 19:31:27.917479+00', 'password', 'e71e7e0f-ed0c-4011-9767-7cefff7a41f3'),
	('792e37f4-d3a0-4c95-9d96-e05a83c536a1', '2026-01-11 19:33:25.265415+00', '2026-01-11 19:33:25.265415+00', 'password', '0422fda0-aede-4e88-b25d-715fac13aa74'),
	('ad6dd7f4-761b-414d-bd6f-136ac540dbfb', '2026-01-11 19:34:35.620615+00', '2026-01-11 19:34:35.620615+00', 'password', '35bb2ee3-b7e7-43f0-9f6c-cc13acf8c6de'),
	('6aaae8a3-7126-4b60-aaff-69ebe8fdccf7', '2026-01-11 19:40:46.899287+00', '2026-01-11 19:40:46.899287+00', 'password', 'dcec7c55-5389-473f-9104-74242ba1df02'),
	('ac397755-5839-446f-81ab-cf0c5f9675a1', '2026-01-11 19:56:42.581294+00', '2026-01-11 19:56:42.581294+00', 'password', '48b1acdf-5801-4278-8323-c864d5ed94ea'),
	('f770cf85-dac9-4410-9c11-516c7a5cd417', '2026-01-11 19:58:07.907514+00', '2026-01-11 19:58:07.907514+00', 'password', 'd288ad84-9c6a-450d-ae86-6d53af147a69');


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

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 33, 'vb6ou6o5lq3u', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', false, '2026-01-11 19:31:27.895173+00', '2026-01-11 19:31:27.895173+00', NULL, '8d85f10f-adec-4560-a5b5-c36216d6be52'),
	('00000000-0000-0000-0000-000000000000', 34, 'escbqj2kldld', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', false, '2026-01-11 19:33:25.245829+00', '2026-01-11 19:33:25.245829+00', NULL, '792e37f4-d3a0-4c95-9d96-e05a83c536a1'),
	('00000000-0000-0000-0000-000000000000', 35, 'koa4fezyvl37', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', false, '2026-01-11 19:34:35.617195+00', '2026-01-11 19:34:35.617195+00', NULL, 'ad6dd7f4-761b-414d-bd6f-136ac540dbfb'),
	('00000000-0000-0000-0000-000000000000', 36, '4w3xobqfdq7h', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', false, '2026-01-11 19:40:46.897101+00', '2026-01-11 19:40:46.897101+00', NULL, '6aaae8a3-7126-4b60-aaff-69ebe8fdccf7'),
	('00000000-0000-0000-0000-000000000000', 37, 'n24fg3mwns42', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', true, '2026-01-11 19:56:42.571291+00', '2026-01-11 20:54:53.93629+00', NULL, 'ac397755-5839-446f-81ab-cf0c5f9675a1'),
	('00000000-0000-0000-0000-000000000000', 39, 'r7nulzdroam5', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', false, '2026-01-11 20:54:53.961499+00', '2026-01-11 20:54:53.961499+00', 'n24fg3mwns42', 'ac397755-5839-446f-81ab-cf0c5f9675a1'),
	('00000000-0000-0000-0000-000000000000', 38, '5nvtq3xtnzo3', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', true, '2026-01-11 19:58:07.904686+00', '2026-01-11 20:56:23.256474+00', NULL, 'f770cf85-dac9-4410-9c11-516c7a5cd417'),
	('00000000-0000-0000-0000-000000000000', 40, 'vsrsldp2lkk5', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', false, '2026-01-11 20:56:23.257168+00', '2026-01-11 20:56:23.257168+00', '5nvtq3xtnzo3', 'f770cf85-dac9-4410-9c11-516c7a5cd417');


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
-- Data for Name: premium_bundles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: premium_features; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."premium_features" ("id", "feature_key", "name", "description", "category", "is_premium", "price_monthly", "is_enabled", "configuration", "created_at", "updated_at", "activated_at", "expires_at", "trial_days", "status", "is_free") VALUES
	('1cc4a924-2544-48d4-8d98-6e1b2de8e2c7', 'analyses_predictives', 'Analyses Prédictives', 'Prévisions de ventes et tendances du marché', 'analytics', true, 4900, false, '{}', '2026-01-11 19:57:00.025036+00', '2026-01-11 19:57:00.025036+00', NULL, NULL, 14, 'disabled', false),
	('152211e6-a13d-455b-a763-0d3e2aa55663', 'tableau_bord_avance', 'Tableau de Bord Avancé', 'Métriques temps réel et KPI personnalisés', 'analytics', true, 2900, false, '{}', '2026-01-11 19:57:00.163948+00', '2026-01-11 19:57:00.163948+00', NULL, NULL, 7, 'disabled', false),
	('1e8debe4-ad98-4bae-a2f6-5f938ef8037e', 'rapports_personnalises', 'Rapports Personnalisés', 'Génération automatique de rapports sur mesure', 'analytics', true, 1900, false, '{}', '2026-01-11 19:57:00.308341+00', '2026-01-11 19:57:00.308341+00', NULL, NULL, 7, 'disabled', false),
	('b16198d3-fec2-4548-a569-47989e4720c8', 'analyse_comportement', 'Analyse Comportementale', 'Tracking utilisateur et parcours client détaillé', 'analytics', true, 3900, false, '{}', '2026-01-11 19:57:00.443464+00', '2026-01-11 19:57:00.443464+00', NULL, NULL, 14, 'disabled', false),
	('be3bf8dd-7da4-44ff-be5d-1c250bc823f2', 'generation_contenu', 'Génération de Contenu IA', 'Descriptions produits automatiques optimisées', 'content', true, 5900, false, '{}', '2026-01-11 19:57:00.563394+00', '2026-01-11 19:57:00.563394+00', NULL, NULL, 14, 'disabled', false),
	('a675742c-9bd5-43e3-b022-e3b549029ea2', 'optimisation_seo', 'Optimisation SEO', 'Amélioration automatique du référencement Google', 'content', true, 3900, false, '{}', '2026-01-11 19:57:00.680953+00', '2026-01-11 19:57:00.680953+00', NULL, NULL, 7, 'disabled', false),
	('662adcbd-7285-446d-848c-2236044afbcc', 'traduction_auto', 'Traduction Automatique', 'Multilingue avec IA (Français, English, Wolof)', 'content', true, 2900, false, '{}', '2026-01-11 19:57:00.796946+00', '2026-01-11 19:57:00.796946+00', NULL, NULL, 7, 'disabled', false),
	('bf276b7c-8148-4ebd-9ea6-7c9fbb67902d', 'suggestions_images', 'Suggestions d''Images IA', 'Recommandations visuelles intelligentes', 'content', true, 1900, false, '{}', '2026-01-11 19:57:00.910418+00', '2026-01-11 19:57:00.910418+00', NULL, NULL, 7, 'disabled', false),
	('235d8f68-acb7-45da-8ea3-2fb5b329ab3c', 'tarification_dynamique', 'Tarification Dynamique', 'Prix adaptatifs selon demande et concurrence', 'commerce', true, 7900, false, '{}', '2026-01-11 19:57:01.062281+00', '2026-01-11 19:57:01.062281+00', NULL, NULL, 30, 'disabled', false),
	('7dcbb105-9c94-4beb-8098-f8ca8035a12e', 'recommandations_produits', 'Recommandations Produits', 'Suggestions personnalisées par IA', 'commerce', true, 4900, false, '{}', '2026-01-11 19:57:01.294061+00', '2026-01-11 19:57:01.294061+00', NULL, NULL, 14, 'disabled', false),
	('7336aa00-cac8-406a-8a5f-b1fb92d84b90', 'gestion_stock_ia', 'Gestion Stock Intelligente', 'Prévisions et alertes automatiques de rupture', 'commerce', true, 5900, false, '{}', '2026-01-11 19:57:01.485658+00', '2026-01-11 19:57:01.485658+00', NULL, NULL, 14, 'disabled', false),
	('7a13752a-c650-4620-8d8d-096a5cbe2d45', 'detection_fraude', 'Détection de Fraude', 'Protection transactions avec machine learning', 'commerce', true, 6900, false, '{}', '2026-01-11 19:57:01.597842+00', '2026-01-11 19:57:01.597842+00', NULL, NULL, 30, 'disabled', false),
	('823f4c77-62f6-40a5-81b1-decea89a0935', 'panier_abandonne', 'Récupération Panier', 'Relances automatisées intelligentes', 'commerce', true, 3900, false, '{}', '2026-01-11 19:57:02.483855+00', '2026-01-11 19:57:02.483855+00', NULL, NULL, 14, 'disabled', false),
	('10ef4332-d81d-4855-aca7-119d92796971', 'assistant_intelligent', 'Yoombal Bot (Chatbot IA)', 'Support client 24/7 automatisé et intelligent', 'support', true, 8900, false, '{}', '2026-01-11 19:57:02.644336+00', '2026-01-11 19:57:02.644336+00', NULL, NULL, 30, 'disabled', false),
	('2e4f4bd3-31e6-411e-a852-2a7f43ea4d87', 'faq_auto', 'FAQ Automatique', 'Réponses générées et mises à jour par IA', 'support', true, 2900, false, '{}', '2026-01-11 19:57:02.753337+00', '2026-01-11 19:57:02.753337+00', NULL, NULL, 7, 'disabled', false),
	('fc052bde-8c38-411b-8a7f-cfbec2acc9dd', 'tickets_priorite', 'Priorisation Tickets', 'Tri automatique par urgence et type', 'support', true, 3900, false, '{}', '2026-01-11 19:57:02.867846+00', '2026-01-11 19:57:02.867846+00', NULL, NULL, 14, 'disabled', false),
	('26cca5cd-6eec-4369-a425-6b585e1ebd37', 'sentiment_analysis', 'Analyse de Sentiment', 'Détection satisfaction client en temps réel', 'support', true, 4900, false, '{}', '2026-01-11 19:57:02.982817+00', '2026-01-11 19:57:02.982817+00', NULL, NULL, 14, 'disabled', false),
	('0cd0ebae-e5ab-4d4a-a633-0ac92d64af2e', 'campagnes_auto', 'Campagnes Automatisées', 'Email et SMS marketing intelligents', 'marketing', true, 5900, false, '{}', '2026-01-11 19:57:03.12149+00', '2026-01-11 19:57:03.12149+00', NULL, NULL, 14, 'disabled', false),
	('76feaf6e-2185-4471-8727-841d48f5a33e', 'segmentation_client', 'Segmentation Avancée', 'Groupes clients optimisés par IA', 'marketing', true, 4900, false, '{}', '2026-01-11 19:57:03.268349+00', '2026-01-11 19:57:03.268349+00', NULL, NULL, 14, 'disabled', false),
	('73765276-3c09-463f-b240-942c38ff3226', 'ab_testing_auto', 'A/B Testing Automatique', 'Optimisation continue des conversions', 'marketing', true, 3900, false, '{}', '2026-01-11 19:57:03.385224+00', '2026-01-11 19:57:03.385224+00', NULL, NULL, 14, 'disabled', false),
	('e5383532-8f04-469a-9110-c0248804057d', 'prediction_churn', 'Prédiction de Churn', 'Identification clients à risque de départ', 'marketing', true, 6900, false, '{}', '2026-01-11 19:57:03.513538+00', '2026-01-11 19:57:03.513538+00', NULL, NULL, 14, 'disabled', false),
	('65cc6909-a02a-4610-9fde-b782fc550341', 'audit_securite', 'Audit Sécurité IA', 'Scan automatique des vulnérabilités', 'security', true, 7900, false, '{}', '2026-01-11 19:57:03.751531+00', '2026-01-11 19:57:03.751531+00', NULL, NULL, 30, 'disabled', false),
	('9df540bb-e3e5-4f54-b969-614d51ab8904', 'monitoring_temps_reel', 'Monitoring Temps Réel', 'Alertes anomalies système instantanées', 'security', true, 5900, false, '{}', '2026-01-11 19:57:03.967313+00', '2026-01-11 19:57:03.967313+00', NULL, NULL, 14, 'disabled', false),
	('06598bde-2f2e-4e0b-bf13-b0d4d020d60c', 'mobile_money_ia', 'Mobile Money Intelligent', 'OM/Wave avec détection fraude avancée', 'africa', true, 6900, false, '{}', '2026-01-11 19:57:04.085135+00', '2026-01-11 19:57:04.085135+00', NULL, NULL, 30, 'disabled', false),
	('ca4f165b-35f0-4e9f-aaab-5870930d447f', 'wolof_pulaar_nlp', 'NLP Wolof/Pulaar', 'Compréhension langues locales pour chatbot', 'africa', true, 8900, false, '{}', '2026-01-11 19:57:04.199808+00', '2026-01-11 19:57:04.199808+00', NULL, NULL, 30, 'disabled', false),
	('13d60ace-31b9-434a-bc00-b08cea9f7449', 'livraison_zone_rurale', 'Livraison Zone Rurale', 'Optimisation routes zones difficiles', 'africa', true, 4900, false, '{}', '2026-01-11 19:57:04.347714+00', '2026-01-11 19:57:04.347714+00', NULL, NULL, 14, 'disabled', false),
	('5a2129cb-5634-4fae-8e8b-26804a7a7c32', 'paiement_tontine', 'Tontines Digitales', 'Paiement différé communautaire et groupes', 'africa', true, 5900, false, '{}', '2026-01-11 19:57:04.456542+00', '2026-01-11 19:57:04.456542+00', NULL, NULL, 14, 'disabled', false),
	('73e9d92e-6469-4767-90f0-e3569fe67c1d', 'adaptation_ramadan', 'Adaptation Ramadan/Tabaski', 'Prix et stock dynamiques périodes religieuses', 'africa', true, 3900, false, '{}', '2026-01-11 19:57:04.615779+00', '2026-01-11 19:57:04.615779+00', NULL, NULL, 7, 'disabled', false),
	('947543b2-4f21-4270-92b5-56e1837c2998', 'mode_textile_ia', 'IA Mode & Textile', 'Reconnaissance tissus, conseils tailles/morpho', 'vertical', true, 4900, false, '{}', '2026-01-11 19:57:04.723776+00', '2026-01-11 19:57:04.723776+00', NULL, NULL, 14, 'disabled', false),
	('bc755971-b7aa-4ca1-9699-7bb80f9e6e60', 'alimentaire_frais', 'Alimentaire Frais', 'Gestion péremption et rotation FIFO', 'vertical', true, 3900, false, '{}', '2026-01-11 19:57:04.85868+00', '2026-01-11 19:57:04.85868+00', NULL, NULL, 14, 'disabled', false),
	('a9da8a2e-765a-48a5-aead-f491e07a24a3', 'cosmetiques_naturels', 'Cosmétiques Naturels', 'Recommandations type peau/cheveux afro', 'vertical', true, 4900, false, '{}', '2026-01-11 19:57:04.966191+00', '2026-01-11 19:57:04.966191+00', NULL, NULL, 14, 'disabled', false),
	('3602158d-d336-46de-b8e8-ab0b9ed55c56', 'electronique_tech', 'Électronique & Tech', 'Détection compatibilité et comparaisons specs', 'vertical', true, 3900, false, '{}', '2026-01-11 19:57:05.092934+00', '2026-01-11 19:57:05.092934+00', NULL, NULL, 7, 'disabled', false),
	('cf725088-45ce-441e-b729-ad046d9e7168', 'optimisation_tournees', 'Optimisation Tournées Multi-Points', 'Algorithmes avancés pour livreurs', 'logistics', true, 5900, false, '{}', '2026-01-11 19:57:05.205574+00', '2026-01-11 19:57:05.205574+00', NULL, NULL, 14, 'disabled', false),
	('cf9d67d3-a9ca-48d8-a800-41ca8c56d7d2', 'prevision_trafic', 'Prévision Trafic Dakar', 'Estimations temps réel embouteillages', 'logistics', true, 3900, false, '{}', '2026-01-11 19:57:05.317406+00', '2026-01-11 19:57:05.317406+00', NULL, NULL, 14, 'disabled', false),
	('9eb62189-81e8-4186-bdd7-3dfbf36c7b3f', 'gestion_entrepots', 'Gestion Entrepôts Multi-Zones', 'IA placement optimal produits', 'logistics', true, 4900, false, '{}', '2026-01-11 19:57:05.425945+00', '2026-01-11 19:57:05.425945+00', NULL, NULL, 14, 'disabled', false),
	('f9bda591-54c2-4166-a990-acd9c7132b2c', 'credit_scoring', 'Credit Scoring IA', 'Évaluation solvabilité BNPL sans banque', 'finance', true, 7900, false, '{}', '2026-01-11 19:57:05.540804+00', '2026-01-11 19:57:05.540804+00', NULL, NULL, 30, 'disabled', false),
	('f11c11ef-874a-41ba-b5a0-44a3cdeb938c', 'detection_blanchiment', 'Détection Blanchiment', 'Conformité BCEAO et réglementations', 'finance', true, 6900, false, '{}', '2026-01-11 19:57:05.654077+00', '2026-01-11 19:57:05.654077+00', NULL, NULL, 30, 'disabled', false),
	('70bc5a78-d760-40ab-a873-1b0da6e9fcd4', 'facturation_electronique', 'Facturation Électronique', 'Conformité fiscale automatique Sénégal', 'finance', true, 3900, false, '{}', '2026-01-11 19:57:05.778856+00', '2026-01-11 19:57:05.778856+00', NULL, NULL, 14, 'disabled', false),
	('ec6af0b8-9121-45d4-bda3-a4a781cc47f8', 'influence_locale', 'Micro-Influenceurs Locaux', 'Identification ambassadeurs quartiers', 'social', true, 4900, false, '{}', '2026-01-11 19:57:05.888288+00', '2026-01-11 19:57:05.888288+00', NULL, NULL, 14, 'disabled', false),
	('50dfad06-bff9-479c-b17e-334727458f5c', 'groupes_achat', 'Groupes d''Achat Intelligents', 'Organisation achats groupés optimisés', 'social', true, 3900, false, '{}', '2026-01-11 19:57:06.017265+00', '2026-01-11 19:57:06.017265+00', NULL, NULL, 14, 'disabled', false),
	('11562b49-653f-4ce3-87ad-bf24f432c092', 'fidelite_gamifie', 'Programme Fidélité Gamifié', 'Points, badges, défis communautaires', 'social', true, 5900, false, '{}', '2026-01-11 19:57:06.126054+00', '2026-01-11 19:57:06.126054+00', NULL, NULL, 14, 'disabled', false),
	('0f089bed-e21e-4cc9-b6ae-58aa746bb186', 'assistant_vocal_teranga', 'Assistant Vocal Teranga', 'Voix sénégalaises et accents locaux', 'personalization', true, 7900, false, '{}', '2026-01-11 19:57:06.27306+00', '2026-01-11 19:57:06.27306+00', NULL, NULL, 30, 'disabled', false),
	('6fc49dab-4858-473d-9154-cefa2228275d', 'reco_evenements', 'Recommandations Événements', 'Tabaski, mariages, baptêmes, cérémonies', 'personalization', true, 3900, false, '{}', '2026-01-11 19:57:06.399245+00', '2026-01-11 19:57:06.399245+00', NULL, NULL, 7, 'disabled', false);


--
-- Data for Name: bundle_features; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "first_name", "last_name", "phone", "role", "business_name", "business_type", "vehicle_type", "zone", "created_at", "updated_at", "address", "birth_date", "email", "city", "postal_code", "business_address", "business_city", "business_postal_code", "business_tax_id", "permissions") VALUES
	('bdd6f70f-af16-4732-ab5e-8d7694e6d90f', 'Admin', 'Yoombal', NULL, 'admin', NULL, NULL, NULL, NULL, '2026-01-11 19:54:15.733931+00', '2026-01-11 19:54:15.733931+00', NULL, NULL, 'yoombal28@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, '{}');


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: credit_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
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
-- Data for Name: user_premium_subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: feature_usage_quotas; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: platform_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: referrals; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_ai_feature_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_credits; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("id", "user_id", "role", "created_at") VALUES
	('db585381-2370-4da6-a4a6-d16dca0f5f23', 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f', 'admin', '2026-01-11 19:54:15.733931+00');


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 40, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict CHRx5rphZHMUYLq6MTNXCghB7pLuBgxcFiagAzueCCN3pS46ucDAAKYHLrcw06V

RESET ALL;
