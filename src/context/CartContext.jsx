import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { cartService } from "../services/cartService.js";

const CartContext = createContext(null);

/**
 * Per-user cart, stored in Supabase (`carts` + `cart_items`).
 *
 * Context stays the single source of truth for the cart domain: components call
 * `add / setQty / remove / applyPromo / clear` and read derived totals — they
 * never touch storage or Supabase directly.
 *
 * Nothing is written until a session exists, so a logged-out visitor's actions
 * can never mutate cart state (the login-required guard also stops them first).
 */
export function CartProvider({ children }) {
  const { user, initialised } = useAuth();
  const [items, setItems] = useState([]);
  const [promo, setPromoState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      setPromoState(null);
      setLoading(false);
      return null;
    }
    const cart = await cartService.getCart();
    setItems(cart.items);
    setPromoState(cart.promo);
    return cart;
  }, [user]);

  // Load (or reset) whenever the signed-in user changes.
  useEffect(() => {
    if (!initialised) return undefined;
    let cancelled = false;
    setLoading(true);
    setError(null);

    refresh()
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "We couldn’t load your cart.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialised, refresh]);

  /**
   * Validates a code against `promo_codes` and persists it on the cart row.
   * Returns the resolved promo (with its label) or `null` when it's unknown.
   */
  const applyCode = useCallback(
    async (rawCode) => {
      const code = String(rawCode ?? "").trim().toUpperCase();
      if (!user || !code) return null;
      setError(null);
      try {
        const promo = await cartService.setPromo(code);
        if (!promo) return null;
        await refresh();
        return promo;
      } catch (err) {
        setError(err?.message ?? "Something went wrong applying your promo code.");
        return null;
      }
    },
    [user, refresh]
  );

  const run = useCallback(
    async (action) => {
      if (!user) return false;
      setError(null);
      try {
        await action();
        await refresh();
        return true;
      } catch (err) {
        setError(err?.message ?? "Something went wrong updating your cart.");
        return false;
      }
    },
    [user, refresh]
  );

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    const discount =
      promo?.type === "percent" ? subtotal * promo.value : promo?.type === "amount" ? promo.value : 0;
    const shipping = promo?.freeShipping || subtotal === 0 ? 0 : 50;
    const total = Math.max(0, subtotal - discount) + shipping;

    return {
      items,
      promo,
      count,
      subtotal,
      discount,
      shipping,
      total,
      isEmpty: items.length === 0,
      loading,
      error,
      refresh,
      add: (product, size, qty) =>
        run(() => cartService.addItem({ productId: product.id, size: size ?? "", qty: qty ?? 1 })),
      setQty: (key, qty) => {
        const line = items.find((i) => i.key === key);
        if (!line) return Promise.resolve(false);
        return run(() => cartService.setQty({ productId: line.id, size: line.size ?? "", qty }));
      },
      remove: (key) => {
        const line = items.find((i) => i.key === key);
        if (!line) return Promise.resolve(false);
        return run(() => cartService.remove({ productId: line.id, size: line.size ?? "" }));
      },
      applyCode,
      applyPromo: (promoOrNull) => {
        // The cart page validates the code first; here we persist whatever it
        // resolved to (null clears it) so the promo follows the user's account.
        if (!promoOrNull) return run(() => cartService.setPromo(null));
        return run(async () => {
          const valid = await cartService.setPromo(promoOrNull.code);
          if (!valid) throw new Error("That promo code doesn’t work.");
        });
      },
      clear: () => run(() => cartService.clear()),
    };
  }, [items, promo, loading, error, refresh, run, applyCode]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export const peso = (n) => `₱${Number(n ?? 0).toFixed(2)}`;
