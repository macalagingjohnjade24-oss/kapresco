import { useEffect, useState } from "react";
import Button from "../../components/Button.jsx";
import Icon from "../../components/Icon.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import LoadingState from "../../components/ui/LoadingState.jsx";
import Input from "../../components/ui/Input.jsx";
import { paymentMethodService } from "../../services/paymentMethodService.js";
import "../auth/auth.css";

export default function AccountPaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ brand: "Maya", label: "" });
  const [status, setStatus] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    paymentMethodService
      .list()
      .then((list) => {
        if (!cancelled) setMethods(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "We couldn’t load your payment methods.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const flash = (tone, text) => {
    setStatus({ tone, text });
    window.setTimeout(() => setStatus(null), 3000);
  };

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    const last4 = form.label.replace(/\D/g, "").slice(-4) || "0000";
    try {
      const created = await paymentMethodService.create({ brand: form.brand, label: `•••• ${last4}` });
      setMethods((list) => [...list, created]);
      setForm({ brand: "Maya", label: "" });
      setAdding(false);
      flash("success", "Payment method saved.");
    } catch (err) {
      flash("error", err?.message ?? "We couldn’t save that payment method.");
    }
  };

  const makeDefault = async (id) => {
    try {
      await paymentMethodService.setDefault(id);
      setMethods((list) => list.map((m) => ({ ...m, isDefault: m.id === id })));
    } catch (err) {
      flash("error", err?.message ?? "We couldn’t update your default method.");
    }
  };

  const remove = async (id) => {
    try {
      setMethods(await paymentMethodService.remove(id));
    } catch (err) {
      flash("error", err?.message ?? "We couldn’t remove that payment method.");
    }
  };

  return (
    <div className="account-panel">
      <div className="account-panel__header">
        <div>
          <h1 className="account-panel__title">Payment methods</h1>
          <p className="account-panel__subtitle">Saved methods make checkout a couple of taps faster.</p>
        </div>
        <Button variant="gold" onClick={() => setAdding((v) => !v)} iconLeft={<Icon name={adding ? "close" : "plus"} size={18} strokeWidth={2.2} />}>
          {adding ? "Cancel" : "Add method"}
        </Button>
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

      {adding && (
        <>
          <div className="account-panel__divider" />
          <form onSubmit={save} noValidate>
            <div className="form-grid">
              <Input
                label="Provider"
                name="brand"
                value={form.brand}
                onChange={update}
                icon="phone"
                list="pm-brands"
              />
              <datalist id="pm-brands">
                <option value="GCash" />
                <option value="Maya" />
                <option value="Credit card" />
                <option value="Debit card" />
              </datalist>
              <Input label="Card or wallet number" name="label" inputMode="numeric" placeholder="09XX XXX XXXX" value={form.label} onChange={update} icon="tag" />
            </div>
            <div className="form-actions">
              <span />
              <Button type="submit" variant="gold">
                Save method
              </Button>
            </div>
          </form>
        </>
      )}

      <div className="account-panel__divider" />

      {loading ? (
        <LoadingState title="Loading your payment methods…" />
      ) : error ? (
        <EmptyState
          icon="alert-circle"
          title="We couldn’t load your payment methods"
          description={error}
          actionLabel="Try again"
          onAction={() => setReloadKey((k) => k + 1)}
        />
      ) : methods.length === 0 ? (
        <EmptyState
          icon="tag"
          title="No saved payment methods"
          description="Add a GCash wallet or card so you don’t have to type it in every visit."
          actionLabel="Add method"
          onAction={() => setAdding(true)}
        />
      ) : (
        <ul className="row-list">
          {methods.map((m) => (
            <li key={m.id} className={`row-card${m.isDefault ? " row-card--default" : ""}`}>
              <span className="row-card__icon">
                <Icon name={m.icon} size={20} color="var(--brown-700)" strokeWidth={1.7} />
              </span>

              <div className="row-card__body">
                <p className="row-card__title">
                  {m.brand} <span className="row-card__meta">{m.label}</span>
                  {m.isDefault && <span className="row-badge">Default</span>}
                </p>
                <p className="row-card__meta">Used automatically at checkout.</p>
              </div>

              <div className="row-card__actions">
                {!m.isDefault && (
                  <Button variant="ghost" size="sm" onClick={() => makeDefault(m.id)}>
                    Make default
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => remove(m.id)} iconLeft={<Icon name="trash" size={15} color="var(--error)" strokeWidth={1.7} />}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="form-hint">
        <Icon name="lock" size={14} color="var(--text-muted)" strokeWidth={1.7} /> Only the provider and the masked
        number are saved to your account — full card numbers and CVVs are never stored, and nothing is charged.
      </p>
    </div>
  );
}
