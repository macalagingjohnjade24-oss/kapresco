import { getSupabase, authErrorMessage, isSupabaseConfigured } from "../lib/supabase.js";

/**
 * Authentication service — Supabase Auth.
 *
 * The public interface is the same Promise-based shape the UI already uses
 * (`login` / `register` / `logout` / `getSession`), so `AuthContext`,
 * `ProtectedRoute` and the auth pages keep working unchanged.
 *
 * Unlike the old demo, credentials are real and validated: empty or malformed
 * forms are rejected with a message the pages render inline.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildSession(authUser, extras = {}) {
  const meta = authUser?.user_metadata ?? {};
  const firstName = String(meta.firstName ?? meta.first_name ?? "").trim();
  const lastName = String(meta.lastName ?? meta.last_name ?? "").trim();
  const email = authUser?.email ?? meta.email ?? "";
  const name =
    `${firstName} ${lastName}`.trim() ||
    (email ? email.split("@")[0] : "") ||
    "Kapresco customer";

  return {
    user: {
      id: authUser.id,
      email,
      firstName,
      lastName,
      name,
      phone: String(meta.phone ?? authUser?.phone ?? ""),
    },
    issuedAt: new Date().toISOString(),
    ...extras,
  };
}

function assertConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Copy `.env.example` to `.env` and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }
}

export const authService = {
  /** Restores the session on refresh (called once by `AuthContext`). */
  async getSession() {
    if (!isSupabaseConfigured) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data?.session ? buildSession(data.session.user) : null;
  },

  /** Real sign-in. Rejects empty or unknown credentials. */
  async login({ email = "", password = "" } = {}) {
    assertConfigured();
    const cleanEmail = String(email).trim();

    if (!cleanEmail) throw new Error("Enter your email address.");
    if (!EMAIL_RE.test(cleanEmail)) throw new Error("Enter a valid email address.");
    if (!password) throw new Error("Enter your password.");

    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    if (error) throw new Error(authErrorMessage(error, "We couldn’t log you in. Please try again."));
    return buildSession(data.user);
  },

  /**
   * Real sign-up. Returns a session when email confirmation is disabled, or
   * `{ needsConfirmation: true }` when Supabase requires the user to verify.
   */
  async register({
    firstName = "",
    lastName = "",
    email = "",
    phone = "",
    password = "",
  } = {}) {
    assertConfigured();
    const cleanEmail = String(email).trim();
    const cleanFirst = String(firstName).trim();
    const cleanLast = String(lastName).trim();

    if (!cleanFirst) throw new Error("Enter your first name.");
    if (!cleanLast) throw new Error("Enter your last name.");
    if (!cleanEmail) throw new Error("Enter your email address.");
    if (!EMAIL_RE.test(cleanEmail)) throw new Error("Enter a valid email address.");
    if (!password) throw new Error("Create a password.");
    if (password.length < 8) throw new Error("Password must be at least 8 characters long.");

    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          firstName: cleanFirst,
          lastName: cleanLast,
          phone: String(phone).trim(),
          displayName: `${cleanFirst} ${cleanLast}`.trim(),
        },
      },
    });

    if (error) throw new Error(authErrorMessage(error, "We couldn’t create your account. Please try again."));

    // Supabase returns an "empty identities" user when the email is taken and
    // email confirmation is on (it hides that fact to prevent enumeration).
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw new Error("An account with that email already exists. Try logging in instead.");
    }

    if (data.session) return buildSession(data.user, { justRegistered: true });
    return { needsConfirmation: true, email: cleanEmail };
  },

  async logout() {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(authErrorMessage(error, "We couldn’t log you out. Please try again."));
  },

  /** Profile fields shown in the header/sidebar (from the auth user metadata). */
  async getProfile() {
    assertConfigured();
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(authErrorMessage(error));
    if (!data?.user) return null;
    return buildSession(data.user).user;
  },

  /** Persists profile edits to both `auth.users` metadata and `profiles`. */
  async updateProfile({ firstName, lastName, email, phone, notificationPrefs } = {}) {
    assertConfigured();
    const supabase = getSupabase();

    const { data, error } = await supabase.auth.updateUser({
      email: email?.trim() || undefined,
      data: {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        phone: phone?.trim(),
        displayName: `${firstName ?? ""} ${lastName ?? ""}`.trim(),
      },
    });
    if (error) throw new Error(authErrorMessage(error, "We couldn’t save your changes."));

    // Mirror into `profiles` (notification prefs only live there).
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        ...(firstName !== undefined ? { first_name: firstName.trim() } : {}),
        ...(lastName !== undefined ? { last_name: lastName.trim() } : {}),
        ...(phone !== undefined ? { phone: phone.trim() } : {}),
        ...(email !== undefined ? { email: email.trim() } : {}),
        ...(notificationPrefs ? { notification_prefs: notificationPrefs } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.user.id);
    if (profileError) throw new Error(profileError.message);

    return buildSession(data.user).user;
  },

  /** Loads the `profiles` row (notification preferences, etc.). */
  async getPreferences() {
    assertConfigured();
    const supabase = getSupabase();
    const { data, error } = await supabase.from("profiles").select("notification_prefs").maybeSingle();
    if (error) throw new Error(error.message);
    return data?.notification_prefs ?? { orders: true, promos: true, newsletter: false };
  },

  async updatePassword(password) {
    assertConfigured();
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }
    const supabase = getSupabase();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(authErrorMessage(error, "We couldn’t update your password."));
  },

  /** Sends the real Supabase password-reset email. */
  async requestPasswordReset(email) {
    assertConfigured();
    const cleanEmail = String(email).trim();
    if (!cleanEmail) throw new Error("Enter your email address.");
    if (!EMAIL_RE.test(cleanEmail)) throw new Error("Enter a valid email address.");

    const supabase = getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(authErrorMessage(error, "We couldn’t send the reset link."));
  },

  /** Subscribes to auth changes; returns an unsubscribe function. */
  subscribe(listener) {
    if (!isSupabaseConfigured) return () => {};
    const supabase = getSupabase();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      listener(session ? buildSession(session.user) : null);
    });
    return () => data.subscription.unsubscribe();
  },
};

export default authService;
