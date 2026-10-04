import { getSupabase } from "../lib/supabase.js";

/**
 * Product catalogue service — the `products` table is the source of truth.
 *
 * Row shape (snake_case, straight from PostgREST) is mapped onto the exact
 * camelCase product objects the frontend already renders, so no component or
 * stylesheet has to change when data moves to the database.
 */

const COLUMNS =
  "id,name,description,long_description,price,compare_at,category,tags,image," +
  "detail_image,rating,reviews_count,sizes,size_adjustments,ingredients,nutrition,in_stock,sort_order";

export function rowToProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    longDescription: row.long_description ?? row.description ?? "",
    price: Number(row.price),
    ...(row.compare_at === null || row.compare_at === undefined
      ? {}
      : { compareAt: Number(row.compare_at) }),
    category: row.category,
    tags: row.tags ?? [],
    image: row.image,
    detailImage: row.detail_image ?? null,
    rating: Number(row.rating ?? 0),
    reviews: Number(row.reviews_count ?? 0),
    sizes: row.sizes?.length ? row.sizes : ["Regular"],
    sizeAdjustments: row.size_adjustments ?? { Regular: 0 },
    ingredients: row.ingredients ?? "",
    nutrition: row.nutrition ?? { serving: "—", calories: 0, caffeine: "0 mg" },
    inStock: row.in_stock !== false,
    sortOrder: row.sort_order ?? 0,
  };
}

/** Unit price for a size — the same rule the database applies when ordering. */
export function priceForSize(product, size) {
  const adjustment = Number(product?.sizeAdjustments?.[size ?? "Regular"] ?? 0);
  return Number(product?.price ?? 0) + adjustment;
}

export const productService = {
  /** Full catalogue, ordered as it appears on the menu. */
  async list() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .select(COLUMNS)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToProduct);
  },

  /** Single product by its stable slug (`midnight-brew`, …). */
  async get(id) {
    if (!id) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .select(COLUMNS)
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return rowToProduct(data);
  },
};

export default productService;
