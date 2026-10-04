-- =============================================================================
-- Kapresco — initial schema, Row Level Security and server-side order logic
-- =============================================================================
-- Applied with: supabase/migrations (idempotent — safe to re-run)
--
-- Design notes
--   * Every user-owned table is keyed by `user_id` and protected by RLS so a
--     browser can only ever read/write its own rows.
--   * `products` and `promo_codes` are public read, service-role write: the
--     catalog is the source of truth for pricing.
--   * `place_order()` recomputes every price from `products` at the moment the
--     order is written, so a tampered client cannot change what is charged, and
--     `order_items` stores name + unit price snapshots for history.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Products (catalog)
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id               text primary key,
  name             text not null,
  description      text,
  long_description text,
  price            numeric(10,2) not null check (price >= 0),
  compare_at       numeric(10,2),
  category         text not null,
  tags             text[] not null default '{}',
  image            text,
  detail_image     text,
  rating           numeric(2,1) not null default 0,
  reviews_count    integer not null default 0,
  sizes            text[] not null default array['Regular','Large'],
  -- Authoritative size pricing: {"Regular": 0, "Large": 15}
  size_adjustments jsonb not null default '{"Regular":0,"Large":15}'::jsonb,
  ingredients      text,
  nutrition        jsonb,
  in_stock         boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on column public.products.size_adjustments is
  'Per-size price adjustment in pesos, added to `price` server-side when an order is placed.';

-- -----------------------------------------------------------------------------
-- Promo codes
-- -----------------------------------------------------------------------------
create table if not exists public.promo_codes (
  code          text primary key,
  type          text not null check (type in ('percent','amount')),
  value         numeric(10,2) not null check (value >= 0),
  free_shipping boolean not null default false,
  label         text,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Profiles (1:1 with auth.users, created by trigger below)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  email              text,
  first_name         text,
  last_name          text,
  display_name       text,
  phone              text,
  notification_prefs jsonb not null default '{"orders":true,"promos":true,"newsletter":false}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Cart (per user, cross-device)
-- -----------------------------------------------------------------------------
create table if not exists public.carts (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  promo_code text references public.promo_codes(code) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  size       text,
  qty        integer not null default 1 check (qty > 0 and qty <= 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One line per product + size per user (NULL size treated as its own line,
-- matching the original frontend's cart keys).
create unique index if not exists cart_items_line_key
  on public.cart_items (user_id, product_id, coalesce(size, ''));

create index if not exists cart_items_user_idx on public.cart_items (user_id);

-- -----------------------------------------------------------------------------
-- Favorites
-- -----------------------------------------------------------------------------
create table if not exists public.favorites (
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- -----------------------------------------------------------------------------
-- Address book
-- -----------------------------------------------------------------------------
create table if not exists public.addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  label      text,
  recipient  text,
  line       text not null,
  city       text,
  region     text,
  phone      text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists addresses_user_idx on public.addresses (user_id);

-- -----------------------------------------------------------------------------
-- Saved payment methods — brand + last4 only, never a PAN or CVV
-- -----------------------------------------------------------------------------
create table if not exists public.payment_methods (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  brand      text not null,
  label      text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists payment_methods_user_idx on public.payment_methods (user_id);

-- -----------------------------------------------------------------------------
-- Orders
-- -----------------------------------------------------------------------------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  reference      text not null unique,
  user_id        uuid not null references auth.users(id) on delete cascade,
  status         text not null default 'Preparing'
                 check (status in ('Preparing','Ready','Out for Delivery','Completed','Cancelled')),
  method         text not null default 'delivery' check (method in ('delivery','pickup')),
  payment_method text,
  subtotal       numeric(10,2) not null default 0,
  discount       numeric(10,2) not null default 0,
  shipping       numeric(10,2) not null default 0,
  total          numeric(10,2) not null default 0,
  promo_code     text,
  address        jsonb,
  contact        jsonb,
  customer_name  text,
  item_count     integer not null default 0,
  placed_at      timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id, placed_at desc);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  -- Snapshots: future product edits must never rewrite order history.
  name       text not null,
  image      text,
  size       text,
  unit_price numeric(10,2) not null,
  qty        integer not null check (qty > 0),
  line_total numeric(10,2) not null
);

create index if not exists order_items_order_idx on public.order_items (order_id);

create table if not exists public.order_status_events (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  status     text not null,
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists order_status_events_order_idx on public.order_status_events (order_id, created_at);

-- -----------------------------------------------------------------------------
-- Contact messages
-- -----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text,
  subject    text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- updated_at maintenance
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['products','profiles','carts','cart_items','orders']
  loop
    execute format(
      'drop trigger if exists set_updated_at_%1$I on public.%1$I;
       create trigger set_updated_at_%1$I before update on public.%1$I
         for each row execute function public.set_updated_at();', t);
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- Auto-create a profile whenever an auth user is created
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, display_name, phone)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data->>'firstName','')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'lastName','')), ''),
    nullif(trim(concat_ws(' ',
      nullif(trim(coalesce(new.raw_user_meta_data->>'firstName','')), ''),
      nullif(trim(coalesce(new.raw_user_meta_data->>'lastName','')), '')
    )), ''),
    coalesce(nullif(trim(coalesce(new.raw_user_meta_data->>'phone','')), ''), new.phone)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
alter table public.products           enable row level security;
alter table public.promo_codes        enable row level security;
alter table public.profiles           enable row level security;
alter table public.carts              enable row level security;
alter table public.cart_items         enable row level security;
alter table public.favorites          enable row level security;
alter table public.addresses          enable row level security;
alter table public.payment_methods    enable row level security;
alter table public.orders             enable row level security;
alter table public.order_items        enable row level security;
alter table public.order_status_events enable row level security;
alter table public.contact_messages   enable row level security;

-- Products + promos: public catalogue, no client writes.
drop policy if exists products_select on public.products;
create policy products_select on public.products
  for select using (true);

drop policy if exists promo_codes_select on public.promo_codes;
create policy promo_codes_select on public.promo_codes
  for select using (active = true);

-- Profiles
drop policy if exists profiles_own on public.profiles;
create policy profiles_own on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Cart
drop policy if exists carts_own on public.carts;
create policy carts_own on public.carts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists cart_items_own on public.cart_items;
create policy cart_items_own on public.cart_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Favorites
drop policy if exists favorites_own on public.favorites;
create policy favorites_own on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Address book
drop policy if exists addresses_own on public.addresses;
create policy addresses_own on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Payment methods
drop policy if exists payment_methods_own on public.payment_methods;
create policy payment_methods_own on public.payment_methods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Orders
drop policy if exists orders_own on public.orders;
create policy orders_own on public.orders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Order items: readable/writable only through your own order.
-- Users cannot UPDATE/DELETE historical lines.
drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items
  for select using (auth.uid() = user_id);

drop policy if exists order_items_insert on public.order_items;
create policy order_items_insert on public.order_items
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- Status timeline
drop policy if exists order_status_events_select on public.order_status_events;
create policy order_status_events_select on public.order_status_events
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

drop policy if exists order_status_events_insert on public.order_status_events;
create policy order_status_events_insert on public.order_status_events
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- Contact form: anyone may submit, nobody reads back from the browser.
drop policy if exists contact_messages_insert on public.contact_messages;
create policy contact_messages_insert on public.contact_messages
  for insert with check (true);

-- =============================================================================
-- PLACE ORDER — authoritative pricing, written in one transaction
-- =============================================================================
create or replace function public.place_order(
  p_method          text default 'delivery',
  p_payment_method  text default null,
  p_address         jsonb default null,
  p_contact         jsonb default null,
  p_promo_code      text default null
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_uid        uuid := auth.uid();
  v_subtotal   numeric(10,2) := 0;
  v_discount   numeric(10,2) := 0;
  v_shipping   numeric(10,2) := 0;
  v_total      numeric(10,2) := 0;
  v_ref        text;
  v_order_id   uuid;
  v_items      integer := 0;
  v_customer   text;
  v_promo      public.promo_codes%rowtype;
  r            record;
begin
  if v_uid is null then
    raise exception 'You must be signed in to place an order.';
  end if;

  if p_method is null or p_method not in ('delivery','pickup') then
    p_method := 'delivery';
  end if;

  -- Validate the promo server-side; ignore anything unknown/inactive.
  if p_promo_code is not null then
    select * into v_promo
      from public.promo_codes
     where upper(code) = upper(p_promo_code)
       and active
     limit 1;
    if not found then
      p_promo_code := null;
      v_promo := null;
    end if;
  end if;

  -- Authoritative pricing: every amount comes from the products table.
  for r in
    select ci.size, ci.qty, p.price, p.size_adjustments, p.name, p.image, p.id as pid
      from public.cart_items ci
      join public.products p on p.id = ci.product_id
     where ci.user_id = v_uid
     order by ci.created_at
  loop
    v_items := v_items + r.qty;
    v_subtotal := v_subtotal
      + (r.price + coalesce((r.size_adjustments ->> coalesce(r.size,'Regular'))::numeric, 0)) * r.qty;
  end loop;

  if v_items = 0 then
    raise exception 'Your cart is empty.';
  end if;

  if v_promo.type = 'percent' then
    v_discount := round(v_subtotal * v_promo.value, 2);
  elsif v_promo.type = 'amount' then
    v_discount := least(v_promo.value, v_subtotal);
  end if;

  if p_method = 'pickup' or coalesce(v_promo.free_shipping, false) then
    v_shipping := 0;
  else
    v_shipping := 50;
  end if;

  v_total := greatest(0, v_subtotal - v_discount) + v_shipping;

  select nullif(trim(concat_ws(' ',
      nullif(trim(coalesce(first_name,'')), ''),
      nullif(trim(coalesce(last_name,'')), '')
    )), '')
    into v_customer
    from public.profiles
   where id = v_uid;

  v_customer := coalesce(v_customer, nullif(trim(coalesce(p_contact->>'name','')), ''), 'Guest');

  -- Unique human-friendly reference.
  loop
    v_ref := 'KAP-' || lpad((floor(random() * 9000) + 1000)::int::text, 4, '0');
    exit when not exists (select 1 from public.orders o where o.reference = v_ref);
  end loop;

  insert into public.orders (
    reference, user_id, status, method, payment_method,
    subtotal, discount, shipping, total, promo_code,
    address, contact, customer_name, item_count
  ) values (
    v_ref, v_uid, 'Preparing', p_method, p_payment_method,
    v_subtotal, v_discount, v_shipping, v_total, p_promo_code,
    p_address, p_contact, v_customer, v_items
  )
  returning id into v_order_id;

  -- Snapshot name + unit price so later catalogue edits never rewrite history.
  insert into public.order_items (order_id, user_id, product_id, name, image, size, unit_price, qty, line_total)
  select
    v_order_id,
    v_uid,
    p.id,
    p.name,
    p.image,
    ci.size,
    p.price + coalesce((p.size_adjustments ->> coalesce(ci.size,'Regular'))::numeric, 0),
    ci.qty,
    (p.price + coalesce((p.size_adjustments ->> coalesce(ci.size,'Regular'))::numeric, 0)) * ci.qty
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.user_id = v_uid;

  insert into public.order_status_events (order_id, user_id, status, note)
  values (v_order_id, v_uid, 'Preparing', 'Order received — the baristas are on it.');

  -- Empty the cart as part of the same transaction.
  delete from public.cart_items where user_id = v_uid;
  update public.carts set promo_code = null where user_id = v_uid;

  return jsonb_build_object(
    'id', v_order_id,
    'reference', v_ref,
    'status', 'Preparing',
    'method', p_method,
    'methodLabel', case when p_method = 'pickup' then 'Pickup' else 'Delivery' end,
    'paymentMethod', p_payment_method,
    'subtotal', v_subtotal,
    'discount', v_discount,
    'shipping', v_shipping,
    'total', v_total,
    'promoCode', p_promo_code,
    'itemCount', v_items,
    'customerName', v_customer,
    'address', p_address,
    'contact', p_contact
  );
end;
$$;

revoke execute on function public.place_order(text, text, jsonb, jsonb, text) from public, anon;
grant  execute on function public.place_order(text, text, jsonb, jsonb, text) to authenticated;

-- =============================================================================
-- GRANTS (RLS decides which rows; these decide which operations are possible)
-- =============================================================================
grant usage on schema public to anon, authenticated;

grant select on public.products, public.promo_codes to anon, authenticated;

grant select, insert, update, delete on public.profiles          to authenticated;
grant select, insert, update, delete on public.carts             to authenticated;
grant select, insert, update, delete on public.cart_items        to authenticated;
grant select, insert, update, delete on public.favorites         to authenticated;
grant select, insert, update, delete on public.addresses         to authenticated;
grant select, insert, update, delete on public.payment_methods   to authenticated;
grant select, insert, update, delete on public.orders            to authenticated;
grant select, insert                    on public.order_items    to authenticated;
grant select, insert                    on public.order_status_events to authenticated;
grant insert                             on public.contact_messages to anon, authenticated;
