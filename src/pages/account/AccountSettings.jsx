import { useEffect, useState } from "react";
import Button from "../../components/Button.jsx";
import Input, { Checkbox } from "../../components/ui/Input.jsx";
import Icon from "../../components/Icon.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { authService } from "../../services/authService.js";
import "../auth/auth.css";

const NOTIFICATIONS = [
  { id: "orders", title: "Order updates", body: "Get a note when your order is preparing and when it’s on the way." },
  { id: "promos", title: "Promos and new brews", body: "Occasional messages about seasonal drinks and specials." },
  { id: "newsletter", title: "Kapresco newsletter", body: "A monthly roundup of what’s happening at the shop." },
];

export default function AccountSettings() {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [prefs, setPrefs] = useState({ orders: true, promos: true, newsletter: false });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Saved notification preferences live on the `profiles` row.
  useEffect(() => {
    let cancelled = false;
    authService
      .getPreferences()
      .then((next) => {
        if (!cancelled) setPrefs((current) => ({ ...current, ...next }));
      })
      .catch(() => {
        /* the defaults above stay in place */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (e) => setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await authService.updateProfile({ ...profile, notificationPrefs: prefs });
      setStatus({ tone: "success", text: "Your details are saved to your Kapresco account." });
    } catch (err) {
      setStatus({ tone: "error", text: err?.message ?? "We couldn’t save your changes." });
    } finally {
      setBusy(false);
      window.setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <div className="account-panel">
      <div className="account-panel__header">
        <div>
          <h1 className="account-panel__title">Account settings</h1>
          <p className="account-panel__subtitle">Keep your details current so checkout stays quick.</p>
        </div>
      </div>

      {status && (
        <p className={`auth-alert auth-alert--${status.tone}`} role={status.tone === "error" ? "alert" : "status"}>
          <Icon
            name={status.tone === "error" ? "alert-circle" : "check-circle"}
            size={17}
            color={status.tone === "error" ? "var(--error)" : "var(--success)"}
            strokeWidth={1.8}
          />
          {status.text}
        </p>
      )}

      <div className="account-panel__divider" />

      <form onSubmit={handleSave} noValidate>
        <h2 className="account-panel__title" style={{ fontSize: "var(--fs-h4)", marginBottom: "var(--s-4)" }}>
          Personal information
        </h2>

        <div className="form-grid">
          <Input label="First name" name="firstName" value={profile.firstName} onChange={update} />
          <Input label="Last name" name="lastName" value={profile.lastName} onChange={update} />
          <Input label="Email address" type="email" name="email" value={profile.email} onChange={update} icon="mail" />
          <Input label="Phone number" type="tel" name="phone" value={profile.phone} onChange={update} icon="phone" />
        </div>

        <p className="form-hint">
          Saved to your Kapresco account — used to speed up checkout and keep your orders recognisable.
        </p>

        <div className="form-actions">
          <span />
          <Button type="submit" variant="gold" disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>

      <div className="account-panel__divider" />

      <section aria-label="Notifications">
        <h2 className="account-panel__title" style={{ fontSize: "var(--fs-h4)", marginBottom: "var(--s-2)" }}>
          Notifications
        </h2>

        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className="toggle-row">
            <div>
              <p className="toggle-row__title">{n.title}</p>
              <p className="toggle-row__body">{n.body}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[n.id]}
              aria-label={n.title}
              className="switch"
              onClick={() => setPrefs((p) => ({ ...p, [n.id]: !p[n.id] }))}
            />
          </div>
        ))}
      </section>

      <div className="account-panel__divider" />

      <section className="danger-zone" aria-label="Session">
        <h2 className="account-panel__title" style={{ fontSize: "var(--fs-h4)" }}>
          Session
        </h2>
        <p className="toggle-row__body" style={{ marginTop: "var(--s-2)", marginBottom: "var(--s-4)" }}>
          Logging out ends your session on this device. Your cart and favorites stay saved to your account.
        </p>

        {confirmLogout ? (
          <div className="auth-panel__actions" style={{ maxWidth: "320px" }}>
            <Button variant="danger" fullWidth onClick={logout}>
              Yes, log me out
            </Button>
            <Button variant="ghost" fullWidth onClick={() => setConfirmLogout(false)}>
              Stay logged in
            </Button>
          </div>
        ) : (
          <Button variant="outline" iconLeft={<Icon name="log-out" size={18} strokeWidth={1.8} />} onClick={() => setConfirmLogout(true)}>
            Logout
          </Button>
        )}
      </section>

      <div className="account-panel__divider" />

      <Checkbox label="I’d like to receive Kapresco news and offers" checked={prefs.newsletter} onChange={() => setPrefs((p) => ({ ...p, newsletter: !p.newsletter }))} />
    </div>
  );
}
