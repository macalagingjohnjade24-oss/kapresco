import { useEffect, useState } from "react";
import Button from "../../components/Button.jsx";
import Icon from "../../components/Icon.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import LoadingState from "../../components/ui/LoadingState.jsx";
import Input from "../../components/ui/Input.jsx";
import { BRAND } from "../../data/site.js";
import { addressService } from "../../services/addressService.js";
import "../auth/auth.css";

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ label: "", recipient: "", line: "", city: "City of Mati", region: "Davao Oriental", phone: "" });
  const [status, setStatus] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    addressService
      .list()
      .then((list) => {
        if (!cancelled) setAddresses(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "We couldn’t load your addresses.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const update = (e) => setDraft((d) => ({ ...d, [e.target.name]: e.target.value }));

  const flash = (tone, text) => {
    setStatus({ tone, text });
    window.setTimeout(() => setStatus(null), 3000);
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      const created = await addressService.create(draft);
      setAddresses((list) => [...list, created]);
      setDraft({ label: "", recipient: "", line: "", city: "City of Mati", region: "Davao Oriental", phone: "" });
      setAdding(false);
      flash("success", "Address saved.");
    } catch (err) {
      flash("error", err?.message ?? "We couldn’t save that address.");
    }
  };

  const makeDefault = async (id) => {
    try {
      await addressService.setDefault(id);
      setAddresses((list) => list.map((a) => ({ ...a, isDefault: a.id === id })));
    } catch (err) {
      flash("error", err?.message ?? "We couldn’t update your default address.");
    }
  };

  const remove = async (id) => {
    try {
      setAddresses(await addressService.remove(id));
    } catch (err) {
      flash("error", err?.message ?? "We couldn’t remove that address.");
    }
  };

  return (
    <div className="account-panel">
      <div className="account-panel__header">
        <div>
          <h1 className="account-panel__title">Delivery addresses</h1>
          <p className="account-panel__subtitle">
            Where should we bring your brews? We currently deliver around {BRAND.address}.
          </p>
        </div>
        <Button variant="gold" onClick={() => setAdding((v) => !v)} iconLeft={<Icon name={adding ? "close" : "plus"} size={18} strokeWidth={2.2} />}>
          {adding ? "Cancel" : "Add address"}
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
          <form onSubmit={saveAddress} noValidate>
            <div className="form-grid">
              <Input label="Label" name="label" placeholder="Home, Office, Tambayan…" value={draft.label} onChange={update} />
              <Input label="Recipient" name="recipient" placeholder="Who’s receiving?" value={draft.recipient} onChange={update} />
              <Input className="field--full" label="Street address" name="line" placeholder="Purok, barangay, house number" icon="pin" value={draft.line} onChange={update} />
              <Input label="City" name="city" value={draft.city} onChange={update} />
              <Input label="Region" name="region" value={draft.region} onChange={update} />
              <Input className="field--full" label="Contact number" name="phone" placeholder="0912 345 6789" icon="phone" value={draft.phone} onChange={update} />
            </div>
            <div className="form-actions">
              <span />
              <Button type="submit" variant="gold">
                Save address
              </Button>
            </div>
          </form>
        </>
      )}

      <div className="account-panel__divider" />

      {loading ? (
        <LoadingState title="Loading your addresses…" />
      ) : error ? (
        <EmptyState
          icon="alert-circle"
          title="We couldn’t load your addresses"
          description={error}
          actionLabel="Try again"
          onAction={() => setReloadKey((k) => k + 1)}
        />
      ) : addresses.length === 0 ? (
        <EmptyState
          icon="pin"
          title="No saved addresses"
          description="Add one now and checkout gets a whole lot faster next time."
          actionLabel="Add address"
          onAction={() => setAdding(true)}
        />
      ) : (
        <ul className="row-list">
          {addresses.map((a) => (
            <li key={a.id} className={`row-card${a.isDefault ? " row-card--default" : ""}`}>
              <span className="row-card__icon">
                <Icon name="pin" size={20} color="var(--brown-700)" strokeWidth={1.7} />
              </span>

              <div className="row-card__body">
                <p className="row-card__title">
                  {a.label || "Address"} {a.isDefault && <span className="row-badge">Default</span>}
                </p>
                <p className="row-card__meta">
                  {a.recipient ? `${a.recipient} · ` : ""}
                  {a.line}
                  {a.line ? ", " : ""}
                  {a.city}, {a.region}
                </p>
                {a.phone && <p className="row-card__meta">{a.phone}</p>}
              </div>

              <div className="row-card__actions">
                {!a.isDefault && (
                  <Button variant="ghost" size="sm" onClick={() => makeDefault(a.id)}>
                    Make default
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => remove(a.id)} iconLeft={<Icon name="trash" size={15} color="var(--error)" strokeWidth={1.7} />}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
