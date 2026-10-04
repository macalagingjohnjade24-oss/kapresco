import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { favoritesService } from "../services/favoritesService.js";

const FavoritesContext = createContext(null);

/**
 * Per-user favorites (`favorites` table, RLS-scoped).
 * Components read `ids / isFavorite / count` and call `toggle` — never storage.
 */
export function FavoritesProvider({ children }) {
  const { user, initialised } = useAuth();
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialised) return undefined;
    let cancelled = false;

    if (!user) {
      setIds([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);
    favoritesService
      .list()
      .then((next) => {
        if (!cancelled) setIds(next);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "We couldn’t load your favorites.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialised, user]);

  const toggle = useCallback(
    async (id) => {
      if (!user) return false;
      setError(null);
      // Optimistic: flip locally, roll back if the write fails.
      setIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
      try {
        const isNowFavorite = await favoritesService.toggle(id);
        setIds((current) =>
          isNowFavorite
            ? current.includes(id)
              ? current
              : [...current, id]
            : current.filter((x) => x !== id)
        );
        return isNowFavorite;
      } catch (err) {
        setIds((current) =>
          current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
        );
        setError(err?.message ?? "We couldn’t update your favorites.");
        return false;
      }
    },
    [user]
  );

  const clear = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      await favoritesService.clear();
      setIds([]);
    } catch (err) {
      setError(err?.message ?? "We couldn’t clear your favorites.");
    }
  }, [user]);

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      loading,
      error,
      isFavorite: (id) => ids.includes(id),
      toggle,
      clear,
    }),
    [ids, loading, error, toggle, clear]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
