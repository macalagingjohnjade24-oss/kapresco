import { createClient } from "@supabase/supabase-js";

/**
 * Supabase browser client.
 *
 * The anon key is a publishable key — it is safe to ship in client code as long
 * as Row Level Security is enabled (it is: see `supabase/migrations/`).
 * The service-role key must never appear in this bundle.
 *
 * Services are the only modules that talk to Supabase; components and pages go
 * through the service layer so the UI never depends on a network library.
 */

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client = null;

/** Returns the shared client, or throws a friendly error when `.env` is missing. */
export function getSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Copy `.env.example` to `.env` and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }
  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

/** Maps Supabase auth error codes/messages onto copy the UI can show verbatim. */
export function authErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;
  const msg = String(error.message ?? error.error_description ?? error.code ?? "").toLowerCase();
  if (msg.includes("invalid login credentials")) return "That email and password combination doesn’t match an account.";
  if (msg.includes("email not confirmed")) return "Please confirm your email address first, then try again.";
  if (msg.includes("already registered") || msg.includes("already been registered")) return "An account with that email already exists.";
  if (msg.includes("password should be at least")) return "Passwords must be at least 8 characters long.";
  if (msg.includes("unable to validate email") || msg.includes("invalid email")) return "Please enter a valid email address.";
  if (msg.includes("signup is disabled")) return "Sign ups are currently disabled on this project.";
  if (msg.includes("failed to fetch") || msg.includes("network")) return "Can’t reach the server. Check your connection and try again.";
  return error.message || fallback;
}

/**
 * Resolves the signed-in user's id, or throws.
 * Used by services that must write an explicit `user_id` — RLS re-checks it
 * against `auth.uid()` server-side, so a forged value is rejected anyway.
 */
export async function requireUserId() {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(authErrorMessage(error));
  if (!data?.user) throw new Error("You must be signed in to do that.");
  return data.user.id;
}
