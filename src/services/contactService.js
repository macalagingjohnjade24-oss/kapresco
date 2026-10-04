import { getSupabase } from "../lib/supabase.js";

/**
 * Contact form messages — `contact_messages`, insert-only (RLS allows anyone,
 * signed in or not, to send; nobody can read them back from the client).
 */
export const contactService = {
  async send({ name = "", email = "", subject = "", message = "" } = {}) {
    const supabase = getSupabase();
    const { error } = await supabase.from("contact_messages").insert({
      name: String(name).trim() || null,
      email: String(email).trim() || null,
      subject: String(subject).trim() || null,
      message: String(message).trim(),
    });
    if (error) throw new Error(error.message);
    return true;
  },
};

export default contactService;
