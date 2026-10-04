import { getSupabase, requireUserId } from "../lib/supabase.js";

/**
 * Saved payment methods — brand + masked label only.
 * Card numbers and CVVs are never stored anywhere (neither here nor in the DB).
 */

function rowToMethod(row) {
  return {
    id: row.id,
    brand: row.brand,
    label: row.label,
    icon: "tag",
    isDefault: Boolean(row.is_default),
  };
}

const COLUMNS = "id,brand,label,is_default,created_at";

export const paymentMethodService = {
  async list() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("payment_methods")
      .select(COLUMNS)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToMethod);
  },

  async create({ brand, label }) {
    const userId = await requireUserId();
    const supabase = getSupabase();

    const { count, error: countError } = await supabase
      .from("payment_methods")
      .select("id", { count: "exact", head: true });
    if (countError) throw new Error(countError.message);

    const { data, error } = await supabase
      .from("payment_methods")
      .insert({ user_id: userId, brand: brand || "Card", label, is_default: count === 0 })
      .select(COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return rowToMethod(data);
  },

  async setDefault(id) {
    const userId = await requireUserId();
    const supabase = getSupabase();
    const [{ error: clearError }, { error: setError }] = await Promise.all([
      supabase.from("payment_methods").update({ is_default: false }).eq("user_id", userId).neq("id", id),
      supabase.from("payment_methods").update({ is_default: true }).eq("user_id", userId).eq("id", id),
    ]);
    if (clearError) throw new Error(clearError.message);
    if (setError) throw new Error(setError.message);
  },

  async remove(id) {
    const userId = await requireUserId();
    const supabase = getSupabase();
    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);
    if (error) throw new Error(error.message);

    const remaining = await paymentMethodService.list();
    if (remaining.length && !remaining.some((m) => m.isDefault)) {
      await paymentMethodService.setDefault(remaining[0].id);
      return remaining.map((m, i) => ({ ...m, isDefault: i === 0 }));
    }
    return remaining;
  },
};

export default paymentMethodService;
