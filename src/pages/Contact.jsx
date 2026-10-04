import { useState } from "react";
import PageIntro from "../components/ui/PageIntro.jsx";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import Input, { Checkbox } from "../components/ui/Input.jsx";
import { BRAND } from "../data/site.js";
import { contactService } from "../services/contactService.js";
import "./auth/auth.css";
import "./Static.css";

const EMPTY = { name: "", email: "", subject: "General question", message: "" };

const SUBJECTS = ["General question", "Order issue", "Catering / bulk order", "Feedback", "Careers", "Something else"];

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);
  const [agree, setAgree] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await contactService.send(form);
      setSent(true);
    } catch (err) {
      setError(err?.message ?? "We couldn’t send your message. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageIntro
        eyebrow="SAY HELLO"
        title="Contact Us"
        description="Questions, bulk orders, or just want to say hi? We’d love to hear from you."
        image="/images/coffee-shop-image-34a2f60b.png"
      />

      <section className="section">
        <div className="container contact__layout">
          {/* ---- Form ---- */}
          <div>
            {sent ? (
              <div className="contact__form">
                <span className="empty-state__icon" aria-hidden="true">
                  <Icon name="check" size={34} color="var(--success)" strokeWidth={2.4} />
                </span>
                <h2 className="contact__intro-title">Salamat! Message received.</h2>
                <p className="contact__intro-body" style={{ marginBottom: 0 }}>
                  We’ll get back to you within one business day.
                </p>
                <div className="form-actions" style={{ marginTop: "var(--s-4)" }}>
                  <Button to="/menu" variant="gold">
                    Browse the menu
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setForm(EMPTY);
                      setSent(false);
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                <div>
                  <h2 className="contact__intro-title">Send us a message</h2>
                  <p className="contact__intro-body" style={{ marginBottom: 0 }}>
                    Fill in whatever you’d like — every field works, none of them are mandatory.
                  </p>
                </div>

                {error && (
                  <p className="auth-alert auth-alert--error" role="alert">
                    <Icon name="alert-circle" size={17} color="var(--error)" strokeWidth={1.8} />
                    {error}
                  </p>
                )}

                <div className="form-grid">
                  <Input label="Your name" name="name" placeholder="Andrea M." value={form.name} onChange={update} />
                  <Input
                    label="Email address"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    icon="mail"
                    value={form.email}
                    onChange={update}
                  />
                </div>

                <div className="field">
                  <div className="field__label-row">
                    <label className="field__label" htmlFor="subject">
                      What’s this about?
                    </label>
                  </div>
                  <div className="field__control">
                    <select id="subject" name="subject" className="field__input" value={form.subject} onChange={update}>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <span className="field__chevron" aria-hidden="true">
                      <Icon name="chevron-down" size={18} color="var(--brown-600)" strokeWidth={2} />
                    </span>
                  </div>
                </div>

                <div className="field">
                  <div className="field__label-row">
                    <label className="field__label" htmlFor="message">
                      Message
                    </label>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="field__textarea"
                    placeholder="Tell us what’s on your mind…"
                    value={form.message}
                    onChange={update}
                  />
                </div>

                <Checkbox
                  label="Send me occasional Kapresco updates too"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />

                <Button type="submit" variant="gold" size="lg" fullWidth disabled={busy}>
                  {busy ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          {/* ---- Details ---- */}
          <div className="contact__cards">
            <article className="contact__card">
              <span className="contact__card-icon">
                <Icon name="pin" size={20} color="var(--brown-700)" strokeWidth={1.8} />
              </span>
              <div>
                <p className="contact__card-title">Visit the shop</p>
                <p className="contact__card-body">{BRAND.fullAddress}</p>
              </div>
            </article>

            <article className="contact__card">
              <span className="contact__card-icon">
                <Icon name="phone" size={20} color="var(--brown-700)" strokeWidth={1.8} />
              </span>
              <div>
                <p className="contact__card-title">Call us</p>
                <p className="contact__card-body">
                  <a href={`tel:${BRAND.phone.replace(/-/g, "")}`}>{BRAND.phone}</a>
                </p>
              </div>
            </article>

            <article className="contact__card">
              <span className="contact__card-icon">
                <Icon name="mail" size={20} color="var(--brown-700)" strokeWidth={1.8} />
              </span>
              <div>
                <p className="contact__card-title">Email us</p>
                <p className="contact__card-body">
                  <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
                </p>
              </div>
            </article>

            <article className="contact__card">
              <span className="contact__card-icon">
                <Icon name="clock" size={20} color="var(--brown-700)" strokeWidth={1.8} />
              </span>
              <div>
                <p className="contact__card-title">Opening hours</p>
                <dl className="hours-table">
                  {BRAND.hours.map((h) => (
                    <div key={h.label}>
                      <dt>{h.label}</dt>
                      <dd>{h.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>

            <article className="contact__card">
              <span className="contact__card-icon">
                <Icon name="instagram" size={20} color="var(--brown-700)" strokeWidth={1.8} />
              </span>
              <div>
                <p className="contact__card-title">Follow along</p>
                <p className="contact__card-body">@kapresco on Facebook, Instagram, and TikTok for daily brews.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="visit-band">
        <img src="/images/rectangle-25-139cab64.png" alt="" aria-hidden="true" className="visit-band__image" loading="lazy" />
        <div className="visit-band__inner">
          <div className="visit-band__copy">
            <h2 className="visit-band__title">Come by and stay awhile</h2>
            <p className="visit-band__body">
              We’re right in the middle of {BRAND.address}. Free Wi-Fi, comfy seats, and no rush — the coffee’ll be
              ready when you are.
            </p>
          </div>
          <Button to="/menu" variant="gold" size="lg">
            See What We Brew
          </Button>
        </div>
      </section>
    </>
  );
}
