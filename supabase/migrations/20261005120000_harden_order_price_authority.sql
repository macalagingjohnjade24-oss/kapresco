-- =============================================================================
-- Harden order price authority (security follow-up)
-- Requirement: the client must never be able to manipulate the authoritative
-- order price — neither by PATCHing their own order rows, nor by inserting
-- forged order / order-item / status rows, nor by editing product prices.
--
-- 1. place_order() becomes SECURITY DEFINER so its writes run with the
--    function owner's rights (the caller's revoked table privileges no longer
--    matter). search_path stays pinned to public, pg_temp; auth.uid() is
--    schema-qualified; the signed-in guard is unchanged; every amount is still
--    re-priced from public.products inside the function.
-- 2. anon/authenticated keep SELECT on order tables (the RLS row filter still
--    limits it to the caller's own rows) but lose INSERT/UPDATE/DELETE — order
--    rows are written only by place_order().
-- 3. products / promo_codes: clients keep read-only access; write grants are
--    revoked so catalogue prices cannot be edited from the client either
--    (RLS already blocks it — no update policy exists — this adds defence in
--    depth at the grant level).
-- =============================================================================

-- 1) All order writes flow through place_order(); make it owner-executed.
alter function public.place_order(text, text, jsonb, jsonb, text)
  security definer;

-- Keep execution restricted: authenticated only (never anon / public).
revoke execute on function public.place_order(text, text, jsonb, jsonb, text)
  from public, anon;
grant  execute on function public.place_order(text, text, jsonb, jsonb, text)
  to authenticated;

-- 2) Order tables become read-only for clients (RLS still scopes the reads).
revoke insert, update, delete on public.orders              from authenticated, anon;
revoke insert, update, delete on public.order_items         from authenticated, anon;
revoke insert, update, delete on public.order_status_events from authenticated, anon;

-- 3) Catalogue is read-only for clients (seed/updates happen via migrations,
--    never from the browser).
revoke insert, update, delete on public.products   from authenticated, anon;
revoke insert, update, delete on public.promo_codes from authenticated, anon;
