import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

/**
 * Auth state for the whole app.
 *
 * `initialised` is false until the persisted Supabase session has been read, so
 * route guards can wait instead of bouncing a signed-in user to /login on
 * first paint.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [initialised, setInitialised] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const unsubscribe = authService.subscribe((next) => {
      if (cancelled) return;
      setSession(next);
      setInitialised(true);
    });

    authService
      .getSession()
      .then((restored) => {
        if (cancelled) return;
        setSession((current) => current ?? restored);
        setInitialised(true);
      })
      .catch(() => {
        if (!cancelled) setInitialised(true);
      });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (credentials) => {
    setBusy(true);
    try {
      const next = await authService.login(credentials);
      setSession(next);
      return next;
    } finally {
      setBusy(false);
    }
  }, []);

  const register = useCallback(async (details) => {
    setBusy(true);
    try {
      const next = await authService.register(details);
      // `{ needsConfirmation: true }` has no session yet — nothing to store.
      if (next?.user) setSession(next);
      return next;
    } finally {
      setBusy(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setSession(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.user),
      justRegistered: Boolean(session?.justRegistered),
      busy,
      initialised,
      login,
      register,
      logout,
    }),
    [session, busy, initialised, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
