import { getSupabase, requireUserId } from "../lib/supabase.js";

/** Saved delivery addresses — `addresses` table, one owner per row (RLS). */

function rowToAddress(row) {
  return {
    id: row.id,
    label: row.label ?? "",
    recipient: row.recipient ?? "",
    line: row.line ?? "",
    city: row.city ?? "",
    region: row.region ?? "",
    phone: row.phone ?? "",
    isDefault: Boolean(row.is_default),
  };
}

export const addressService = {
  async list() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("addresses")
      .select("id,label,recipient,line,city,region,phone,is_default,created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToAddress);
  },

  async create(address) {
    const userId = await requireUserId();
    const supabase = getSupabase();

    const { count, error: countError } = await supabase
      .from("addresses")
      .select("id", { count: "exact", head: true });
    if (countError) throw new Error(countError.message);

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: userId,
        label: address.label || null,
        recipient: address.recipient || null,
        line: address.line || "",
        city: address.city || null,
        region: address.region || null,
        phone: address.phone || null,
        is_default: count === 0,
      })
      .select("id,label,recipient,line,city,region,phone,is_default,created_at")
      .single();
    if (error) throw new Error(error.message);
    return rowToAddress(data);
  },

  async setDefault(id) {
    const userId = await requireUserId();
    const supabase = getSupabase();
    const [{ error: clearError }, { error: setError }] = await Promise.all([
      supabase.from("addresses").update({ is_default: false }).eq("user_id", userId).neq("id", id),
      supabase.from("addresses").update({ is_default: true }).eq("user_id", userId).eq("id", id),
    ]);
    if (clearError) throw new Error(clearError.message);
    if (setError) throw new Error(setError.message);
  },

  async remove(id) {
    const userId = await requireUserId();
    const supabase = getSupabase();
    const { error } = await supabase.from("addresses").delete().eq("user_id", userId).eq("id", id);
    if (error) throw new Error(error.message);

    // Never leave the book without a default.
    const remaining = await addressService.list();
    if (remaining.length && !remaining.some((a) => a.isDefault)) {
      await addressService.setDefault(remaining[0].id);
      return remaining.map((a, i) => ({ ...a, isDefault: i === 0 }));
    }
    return remaining;
  },
};

export default addressService;
