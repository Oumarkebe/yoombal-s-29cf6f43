-- Nettoyage des tables avant import
TRUNCATE TABLE 
  categories,
  delivery_zones,
  products,
  orders,
  order_items,
  deliveries,
  delivery_tracking,
  user_roles,
  profiles,
  premium_features,
  ai_module_settings,
  platform_settings,
  user_premium_subscriptions,
  product_reviews,
  favorites,
  courses,
  services,
  bnpl_applications,
  credit_transactions,
  user_credits,
  referrals,
  feature_usage_quotas
CASCADE;

-- Données à importer
SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 72o2TMNaWD0hRyuf3fJ8wwy7xjEkcuH7YeAyhhdAp2NV8Mf8KLSJvs3ClneIJPO

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
-- SKIPPED: These will be regenerated on next login
--

-- INSERT INTO "auth"."audit_log_entries" ... (removed to avoid duplicates)


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '5ff62f4a-f990-4d10-8075-88274fa18a7b', 'authenticated', 'authenticated', 'client@yoombal.com', '$2a$06$ZSSBxhdX3FTbEphZkOQmo.mrSVgxHxErv8hioscqAJWLlMn03IavS', '2026-01-11 07:42:47.205954+00', NULL, '', NULL, '', '2026-01-11 07:42:47.205954+00', '', '', NULL, '2026-01-11 07:42:47.205954+00', '{"provider": "email", "providers": ["email"]}', '{"role": "client", "last_name": "Test", "first_name": "Client"}', NULL, '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '3c975ab5-5d59-4b2c-8301-33569771f0e4', 'authenticated', 'authenticated', 'marchand@yoombal.com', '$2a$06$aLzca8GU6oS9DkV21HMIOOrvECb4zTDUcGi0R7Y16z6O0bbr1r9/a', '2026-01-11 07:42:47.205954+00', NULL, '', NULL, '', '2026-01-11 07:42:47.205954+00', '', '', NULL, '2026-01-11 07:42:47.205954+00', '{"provider": "email", "providers": ["email"]}', '{"role": "marchand", "last_name": "Yoombal", "first_name": "Marchand"}', NULL, '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a4548683-1535-464f-b579-85183795a131', 'authenticated', 'authenticated', 'livreur@yoombal.com', '$2a$06$t2RXrJkUK8Y6iB8y0IyKB.JfmxfhTaryujEN0YsHGdys9yk0BJ.7q', '2026-01-11 07:42:47.205954+00', NULL, '', NULL, '', '2026-01-11 07:42:47.205954+00', '', '', NULL, '2026-01-11 08:15:31.368395+00', '{"provider": "email", "providers": ["email"]}', '{"role": "driver", "last_name": "Express", "first_name": "Livreur"}', NULL, '2026-01-11 07:42:47.205954+00', '2026-01-11 13:33:25.949267+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '3d591330-34f7-4a31-83ad-25d9770c0435', 'authenticated', 'authenticated', 'admin@yoombal.com', '$2a$06$KrZOmE8168SRZB8gp2xomuv9XYwfsOo57Cuq5rBBhqHQHizTi9qCG', '2026-01-11 07:42:47.205954+00', NULL, '', NULL, '', '2026-01-11 07:42:47.205954+00', '', '', NULL, '2026-01-11 16:37:32.821904+00', '{"provider": "email", "providers": ["email"]}', '{"role": "admin", "last_name": "Admin", "first_name": "Super"}', NULL, '2026-01-11 07:42:47.205954+00', '2026-01-11 16:37:32.83233+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('admin@yoombal.com', '3d591330-34f7-4a31-83ad-25d9770c0435', '{"sub": "3d591330-34f7-4a31-83ad-25d9770c0435", "email": "admin@yoombal.com"}', 'email', '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', '3d591330-34f7-4a31-83ad-25d9770c0435'),
	('client@yoombal.com', '5ff62f4a-f990-4d10-8075-88274fa18a7b', '{"sub": "5ff62f4a-f990-4d10-8075-88274fa18a7b", "email": "client@yoombal.com"}', 'email', '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', '5ff62f4a-f990-4d10-8075-88274fa18a7b'),
	('livreur@yoombal.com', 'a4548683-1535-464f-b579-85183795a131', '{"sub": "a4548683-1535-464f-b579-85183795a131", "email": "livreur@yoombal.com"}', 'email', '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', 'a4548683-1535-464f-b579-85183795a131'),
	('marchand@yoombal.com', '3c975ab5-5d59-4b2c-8301-33569771f0e4', '{"sub": "3c975ab5-5d59-4b2c-8301-33569771f0e4", "email": "marchand@yoombal.com"}', 'email', '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', '3c975ab5-5d59-4b2c-8301-33569771f0e4');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
-- SKIPPED: Will be regenerated on next login
--


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
-- SKIPPED: Will be regenerated on next login
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
-- SKIPPED: Will be regenerated on next login
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
-- Data for Name: premium_bundles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: premium_features; Type: TABLE DATA; Schema: public; Owner: postgres
--



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
	('3d591330-34f7-4a31-83ad-25d9770c0435', 'Super', 'Admin', NULL, 'admin', NULL, NULL, NULL, NULL, '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', NULL, NULL, 'admin@yoombal.com', NULL, NULL, NULL, NULL, NULL, NULL, '{}'),
	('5ff62f4a-f990-4d10-8075-88274fa18a7b', 'Client', 'Test', NULL, 'client', NULL, NULL, NULL, NULL, '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', NULL, NULL, 'client@yoombal.com', NULL, NULL, NULL, NULL, NULL, NULL, '{}'),
	('a4548683-1535-464f-b579-85183795a131', 'Livreur', 'Express', NULL, 'client', NULL, NULL, NULL, NULL, '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', NULL, NULL, 'livreur@yoombal.com', NULL, NULL, NULL, NULL, NULL, NULL, '{}'),
	('3c975ab5-5d59-4b2c-8301-33569771f0e4', 'Marchand', 'Yoombal', NULL, 'client', NULL, NULL, NULL, NULL, '2026-01-11 07:42:47.205954+00', '2026-01-11 07:42:47.205954+00', NULL, NULL, 'marchand@yoombal.com', NULL, NULL, NULL, NULL, NULL, NULL, '{}');


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

INSERT INTO "public"."deliveries" ("id", "order_id", "customer_id", "merchant_id", "driver_id", "pickup_address", "delivery_address", "customer_phone", "customer_name", "status", "estimated_delivery_time", "actual_delivery_time", "delivery_fee", "distance_km", "notes", "created_at", "updated_at", "ref", "client", "date") VALUES
	('7972af87-d2b3-415d-a7ce-aad836b12017', '834fa5d9-f1c7-488f-aef3-96c1c53c08cc', '5ff62f4a-f990-4d10-8075-88274fa18a7b', '3c975ab5-5d59-4b2c-8301-33569771f0e4', 'a4548683-1535-464f-b579-85183795a131', 'Marché Sandaga, Dakar', 'Sicap Liberté 6, Dakar', '+221 77 123 45 67', 'Client Test Yoombal', 'delivered', '2026-01-11 08:27:47.205954+00', '2026-01-11 07:46:55.301+00', 2500, NULL, NULL, '2026-01-11 07:42:47.205954+00', '2026-01-11 07:46:55.327395+00', NULL, NULL, NULL);


--
-- Data for Name: delivery_tracking; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."delivery_tracking" ("id", "delivery_id", "latitude", "longitude", "status_update", "notes", "created_at") VALUES
	('1e00df15-d7eb-4a24-96aa-df9d595cf18d', '7972af87-d2b3-415d-a7ce-aad836b12017', 14.7167, -17.4677, 'initial', NULL, '2026-01-11 07:42:47.205954+00');


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
	('b5955af2-ebb4-4d1e-a757-fbc9ffec6a46', '3d591330-34f7-4a31-83ad-25d9770c0435', 'admin', '2026-01-11 07:42:47.205954+00'),
	('b337d314-3983-4f59-80c6-68fd2e97908c', '5ff62f4a-f990-4d10-8075-88274fa18a7b', 'client', '2026-01-11 07:42:47.205954+00'),
	('5b53b37f-a6cb-4c4c-b57e-8cdeb39f9fe1', 'a4548683-1535-464f-b579-85183795a131', 'driver', '2026-01-11 07:42:47.205954+00'),
	('92886965-34ef-4eac-80be-daaa02623468', '3c975ab5-5d59-4b2c-8301-33569771f0e4', 'marchand', '2026-01-11 07:42:47.205954+00');


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
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
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
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- PostgreSQL database dump complete
--

-- Réactiver les contraintes
SET session_replication_role = DEFAULT;
