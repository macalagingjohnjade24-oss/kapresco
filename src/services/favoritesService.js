import { getSupabase, requireUserId } from "../lib/supabase.js";

/** Per-user favorites — the `favorites` table, scoped by RLS to `auth.uid()`. */

export const favoritesService = {
  /** Product ids the signed-in customer has saved. */
  async list() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("favorites")
      .select("product_id, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => row.product_id);
  },

  /** Adds or removes a product; resolves to the new favourite state. */
  async toggle(productId) {
    const userId = await requireUserId();
    const supabase = getSupabase();

    const { data: existing, error: selError } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();
    if (selError) throw new Error(selError.message);

    if (existing) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);
      if (error) throw new Error(error.message);
      return false;
    }

    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, product_id: productId });
    if (error) throw new Error(error.message);
    return true;
  },

  async clear() {
    const userId = await requireUserId();
    const supabase = getSupabase();
    const { error } = await supabase.from("favorites").delete().eq("user_id", userId);
    if (error) throw new Error(error.message);
  },
};

export default favoritesService;
