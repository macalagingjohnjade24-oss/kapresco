import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { productService } from "../services/productService.js";

const ProductsContext = createContext(null);

/**
 * The product catalogue — sourced from the `products` table, which is the
 * single source of truth for names, copy and prices.
 *
 * Loaded once for the session and shared by Menu, Home, Product detail and
 * Favorites, so the catalog never has to be fetched per page.
 */
export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await productService.list();
      setProducts(list);
      return list;
    } catch (err) {
      setError(err?.message ?? "We couldn’t load the menu.");
      setProducts([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    // `load` always clears its own flags; guard only the state writes.
    productService
      .list()
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? "We couldn’t load the menu.");
          setProducts([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      reload: load,
      byId: (id) => products.find((p) => p.id === id) ?? null,
      bestsellers: (ids) =>
        (ids ?? [])
          .map((id) => products.find((p) => p.id === id))
          .filter(Boolean),
    }),
    [products, loading, error, load]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
}
