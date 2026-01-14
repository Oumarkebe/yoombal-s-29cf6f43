alter table "public"."profiles" drop constraint "profiles_kyc_status_check";

alter table "public"."products" drop constraint "products_merchant_id_fkey";

alter table "public"."profiles" drop constraint "profiles_role_check";

drop view if exists "public"."admin_orders_view";

alter table "public"."products" add column "brand" text;

alter table "public"."products" add column "category" text;

alter table "public"."products" add column "condition" text default 'new'::text;

alter table "public"."products" add column "dimensions" text;

alter table "public"."products" add column "features" text[];

alter table "public"."products" add column "images" text[];

alter table "public"."products" add column "is_active" boolean default true;

alter table "public"."products" add column "sku" text;

alter table "public"."products" add column "specs" jsonb default '{}'::jsonb;

alter table "public"."products" add column "tags" text[];

alter table "public"."products" add column "weight" numeric;

alter table "public"."profiles" drop column "kyc_contract_signed_at";

alter table "public"."profiles" add column "avatar_url" text;

alter table "public"."products" add constraint "products_merchant_id_fkey" FOREIGN KEY (merchant_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_merchant_id_fkey";

alter table "public"."profiles" add constraint "profiles_role_check" CHECK ((role = ANY (ARRAY['client'::text, 'merchant'::text, 'delivery'::text, 'admin'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_role_check";

create or replace view "public"."admin_orders_view" as  SELECT o.id,
    o.created_at,
    o.updated_at,
    o.total_amount,
    o.status,
    o.payment_method,
    o.payment_status,
    o.delivery_address,
    o.delivery_phone,
    o.delivery_notes,
    o.client_id,
    cp.email AS client_email,
    cp.first_name AS client_first_name,
    cp.last_name AS client_last_name,
    cp.phone AS client_phone,
    o.merchant_id,
    mp.email AS merchant_email,
    mp.first_name AS merchant_first_name,
    mp.last_name AS merchant_last_name,
    mp.business_name AS merchant_business_name,
    ( SELECT count(*) AS count
           FROM public.order_items oi
          WHERE (oi.order_id = o.id)) AS items_count
   FROM ((public.orders o
     LEFT JOIN public.profiles cp ON ((o.client_id = cp.id)))
     LEFT JOIN public.profiles mp ON ((o.merchant_id = mp.id)));



  create policy "Enable all for service role"
  on "public"."products"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Merchants can delete own products"
  on "public"."products"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = merchant_id));



  create policy "Merchants can insert own products"
  on "public"."products"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = merchant_id));



  create policy "Merchants can update own products"
  on "public"."products"
  as permissive
  for update
  to authenticated
using ((auth.uid() = merchant_id))
with check ((auth.uid() = merchant_id));



  create policy "Merchants can view own products"
  on "public"."products"
  as permissive
  for select
  to authenticated
using ((auth.uid() = merchant_id));



  create policy "Merchants manage own products"
  on "public"."products"
  as permissive
  for all
  to public
using ((auth.uid() = merchant_id))
with check ((auth.uid() = merchant_id));



  create policy "Public can view active products"
  on "public"."products"
  as permissive
  for select
  to public
using (((is_active = true) OR (is_active IS NULL)));



  create policy "Public products read"
  on "public"."products"
  as permissive
  for select
  to public
using (true);



  create policy "Enable all for service role"
  on "public"."profiles"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Enable insert for authenticated users only"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = id));



  create policy "Users can update own profile"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



  create policy "Users can view own profile"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((auth.uid() = id));


drop policy "Admins can manage all KYC documents" on "storage"."objects";

drop policy "Admins can view all KYC documents" on "storage"."objects";

drop policy "Users can upload their own KYC documents" on "storage"."objects";

drop policy "Users can view their own KYC documents" on "storage"."objects";


