import { getSupabase, requireUserId } from "../lib/supabase.js";

/**
 * Per-user cart service.
 *
 * The cart lives in `carts` + `cart_items`, keyed by Supabase `user_id`, so it
 * follows the customer across devices. Prices shown here are read live from
 * `products`; the final, authoritative totals are recomputed inside the
 * `place_order()` database function when the order is written.
 *
 * `size` is stored as a plain string — `''` means "no explicit size" (the
 * original card “Order Now” behaviour) and maps back to `null` for the UI.
 */

async function ensureCart(supabase, userId) {
  const { error } = await supabase
    .from("carts")
    .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

function buildPromo(row) {
  if (!row) return null;
  const value = Number(row.value);
  return {
    code: row.code,
    type: row.type,
    value,
    label:
      row.label ??
      (row.type === "percent" ? `${Math.round(value * 100)}% off` : `₱${value.toFixed(0)} off`),
    freeShipping: Boolean(row.free_shipping),
  };
}

function toCartItem(row) {
  const product = row.products;
  const sizeKey = row.size || "Regular";
  const adjustment = Number(product?.size_adjustments?.[sizeKey] ?? 0);
  return {
    // Same key format the frontend has always used (`id::regular` / `id::Large`).
    key: `${row.product_id}::${row.size || "regular"}`,
    lineId: row.id,
    id: row.product_id,
    name: product?.name ?? "Kapresco item",
    price: Number(product?.price ?? 0) + (Number.isFinite(adjustment) ? adjustment : 0),
    image: product?.image ?? null,
    size: row.size || null,
    qty: row.qty,
  };
}

const ITEM_SELECT =
  "id,product_id,size,qty,created_at,products(id,name,price,image,size_adjustments)";

export const cartService = {
  /** Reads the signed-in user's cart with live product pricing. */
  async getCart() {
    const supabase = getSupabase();
    const [itemsRes, cartRes] = await Promise.all([
      supabase.from("cart_items").select(ITEM_SELECT).order("created_at", { ascending: true }),
      supabase.from("carts").select("promo_code").maybeSingle(),
    ]);
    if (itemsRes.error) throw new Error(itemsRes.error.message);
    if (cartRes.error) throw new Error(cartRes.error.message);

    const promoCode = cartRes.data?.promo_code ?? null;
    const promo = promoCode ? await cartService.getPromo(promoCode) : null;

    return { items: (itemsRes.data ?? []).map(toCartItem), promo };
  },

  /** Looks up and validates a promo code (active codes only). */
  async getPromo(code) {
    const trimmed = String(code ?? "").trim().toUpperCase();
    if (!trimmed) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("promo_codes")
      .select("code,type,value,free_shipping,label")
      .eq("code", trimmed)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return buildPromo(data);
  },

  /** Adds a line (or increments it), capped at 20 like the original cart. */
  async addItem({ productId, size = "", qty = 1 }) {
    const userId = await requireUserId();
    const supabase = getSupabase();
    const normalized = size ?? "";
    const amount = Math.max(1, Math.min(Number(qty) || 1, 20));

    await ensureCart(supabase, userId);

    const { data: existing, error: selError } = await supabase
      .from("cart_items")
      .select("id,qty")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .eq("size", normalized)
      .maybeSingle();
    if (selError) throw new Error(selError.message);

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ qty: Math.min(existing.qty + amount, 20) })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .insert({ user_id: userId, product_id: productId, size: normalized, qty: amount });
    if (error) throw new Error(error.message);
  },

  /** Sets a line's quantity; 0 or less removes it (original reducer rule). */
  async setQty({ productId, size = "", qty }) {
    const userId = await requireUserId();
    const supabase = getSupabase();
    const normalized = size ?? "";
    const next = Math.max(0, Math.min(Number(qty) || 0, 20));

    if (next === 0) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId)
        .eq("size", normalized);
      if (error) throw new Error(error.message);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ qty: next })
      .eq("user_id", userId)
      .eq("product_id", productId)
      .eq("size", normalized);
    if (error) throw new Error(error.message);
  },

  async remove({ productId, size = "" }) {
    const userId = await requireUserId();
    const supabase = getSupabase();
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId)
      .eq("size", size ?? "");
    if (error) throw new Error(error.message);
  },

  async clear() {
    const userId = await requireUserId();
    const supabase = getSupabase();
    const [{ error: itemsError }] = await Promise.all([
      supabase.from("cart_items").delete().eq("user_id", userId),
      supabase.from("carts").update({ promo_code: null }).eq("user_id", userId),
    ]);
    if (itemsError) throw new Error(itemsError.message);
  },

  /** Persists the applied promo on the cart row (`null` clears it). */
  async setPromo(code) {
    const userId = await requireUserId();
    const supabase = getSupabase();

    if (!code) {
      const { error } = await supabase.from("carts").update({ promo_code: null }).eq("user_id", userId);
      if (error) throw new Error(error.message);
      return null;
    }

    const promo = await cartService.getPromo(code);
    if (!promo) return null;

    await ensureCart(supabase, userId);
    const { error } = await supabase
      .from("carts")
      .update({ promo_code: promo.code })
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return promo;
  },
};

export default cartService;
