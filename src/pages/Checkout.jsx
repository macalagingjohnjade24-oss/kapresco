import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import Input, { Checkbox } from "../components/ui/Input.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { peso, useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthGuard } from "../hooks/useAuthGuard.jsx";
import LoginRequiredModal from "../components/ui/LoginRequiredModal.jsx";
import { orderService } from "../services/orderService.js";
import "./Commerce.css";

const DELIVERY_METHODS = [
  { id: "delivery", label: "Delivery", hint: "We bring it to you in 30–45 minutes", icon: "truck" },
  { id: "pickup", label: "Pickup", hint: "Ready at the shop in 15–20 minutes", icon: "package" },
];

export default function Checkout() {
  const { items, isEmpty, subtotal, discount, shipping, total, loading, error, refresh } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const { requireAuth, modalProps } = useAuthGuard();

  const existing = orderService.getDraft();

  const [contact, setContact] = useState(existing?.contact ?? { email: user?.email ?? "", phone: user?.phone ?? "" });
  const [address, setAddress] = useState(
    existing?.address ?? { line: "", city: "City of Mati", region: "Davao Oriental", notes: "" }
  );
  const [method, setMethod] = useState(existing?.method ?? "delivery");
  const [saveAddress, setSaveAddress] = useState(true);
  const [agreed, setAgreed] = useState(true);

  if (loading && !existing) {
    return (
      <section className="section commerce">
        <div className="container">
          <LoadingState title="Preparing checkout…" description="Loading your cart." />
        </div>
      </section>
    );
  }

  if (error && isEmpty && !existing) {
    return (
      <section className="section commerce">
        <div className="container">
          <EmptyState
            icon="alert-circle"
            title="We couldn’t load your cart"
            description={error}
            actionLabel="Try again"
            onAction={() => refresh()}
          />
        </div>
      </section>
    );
  }

  if (isEmpty && !existing) {
    return (
      <section className="section commerce">
        <div className="container">
          <EmptyState
            icon="cart"
            title="There’s nothing to check out yet"
            description="Add a few drinks to your cart first, then come back here to finish your order."
            actionLabel="Explore Our Menu"
            actionTo="/menu"
          />
        </div>
      </section>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Forms submit as-is — no field is blocked when empty (§6, §21).
    const methodConfig = DELIVERY_METHODS.find((m) => m.id === method);
    orderService.saveDraft({
      contact,
      address,
      method,
      methodLabel: methodConfig?.label ?? "Delivery",
      saveAddress,
      items,
      subtotal,
      discount,
      shipping: method === "pickup" ? 0 : shipping,
      total: method === "pickup" ? Math.max(0, subtotal - discount) : total,
      reference: orderService.createReference(),
      placedAt: new Date().toISOString(),
    });
    navigate("/payment");
  };

  const setContactField = (e) => setContact((c) => ({ ...c, [e.target.name]: e.target.value }));
  const setAddressField = (e) => setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  return (
    <>
      <div className="steps" aria-label="Checkout progress">
        <span className="steps__item is-active">
          <span className="steps__num">1</span> Checkout
        </span>
        <span className="steps__sep" aria-hidden="true" />
        <span className="steps__item">
          <span className="steps__num">2</span> Payment
        </span>
        <span className="steps__sep" aria-hidden="true" />
        <span className="steps__item">
          <span className="steps__num">3</span> Confirmation
        </span>
      </div>

      <section className="section commerce">
        <div className="container">
          <div className="commerce__layout">
            <form className="commerce__main" ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="commerce__heading">
                <h1>Checkout</h1>
                <p>Tell us where to bring your brews. Every field is optional for this demo.</p>
              </div>

              <div className="form-card">
                <h2 className="form-card__title">Contact details</h2>
                <div className="form-grid">
                  <Input
                    label="Email address"
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={setContactField}
                    placeholder="you@example.com"
                    icon="mail"
                  />
                  <Input
                    label="Phone number"
                    type="tel"
                    name="phone"
                    value={contact.phone}
                    onChange={setContactField}
                    placeholder="0912 345 6789"
                    icon="phone"
                  />
                  {!isAuthenticated && (
                    <p className="field--full">
                      Have an account? <Link to="/login">Log in</Link> to use your saved details.
                    </p>
                  )}
                </div>
              </div>

              <div className="form-card">
                <h2 className="form-card__title">How would you like it?</h2>
                <div className="pay-methods">
                  {DELIVERY_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`pay-method${method === m.id ? " is-active" : ""}`}
                      aria-pressed={method === m.id}
                      onClick={() => setMethod(m.id)}
                    >
                      <span className="pay-method__radio" aria-hidden="true" />
                      <Icon name={m.icon} size={22} color="var(--brown-700)" strokeWidth={1.7} />
                      <span>
                        <span className="pay-method__label">{m.label}</span>
                        <br />
                        <span className="pay-method__hint">{m.hint}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {method === "delivery" && (
                <div className="form-card">
                  <h2 className="form-card__title">Delivery address</h2>
                  <div className="form-grid">
                    <Input
                      className="field--full"
                      label="Street address"
                      name="line"
                      value={address.line}
                      onChange={setAddressField}
                      placeholder="Barangay, street, house number"
                      icon="pin"
                    />
                    <Input label="City" name="city" value={address.city} onChange={setAddressField} />
                    <Input label="Region" name="region" value={address.region} onChange={setAddressField} />
                    <Input
                      className="field--full"
                      label="Delivery notes"
                      optional
                      name="notes"
                      value={address.notes}
                      onChange={setAddressField}
                      placeholder="Gate code, landmarks, or what to ring"
                    />
                    <div className="field--full">
                      <Checkbox
                        label="Save this address to my account"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="form-card">
                <div className="form-card__title">Payment preference</div>
                <p className="pay-method__hint">
                  You'll confirm how you're paying on the next step. Nothing is charged in this demo.
                </p>
                <Button
                  variant="gold"
                  size="lg"
                  type="button"
                  onClick={() => {
                    requireAuth(() => {
                      // The form itself carries `.commerce__main`, so a nested
                      // selector never matched and the button did nothing.
                      formRef.current?.requestSubmit();
                    });
                  }}
                >
                  Continue to Payment
                </Button>
              </div>
            </form>

            <aside className="summary" aria-label="Order summary">
              <h2 className="summary__title">Order Summary</h2>

              <ul className="summary__items">
                {items.map((item) => (
                  <li key={item.key}>
                    <span className="summary__item-name">
                      {item.name}
                      {item.size ? ` (${item.size})` : ""} × {item.qty}
                    </span>
                    <span className="summary__item-price">{peso(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>

              <dl className="summary__rows">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{peso(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="summary__row--discount">
                    <dt>Discount</dt>
                    <dd>−{peso(discount)}</dd>
                  </div>
                )}
                <div>
                  <dt>{method === "pickup" ? "Pickup" : "Delivery"}</dt>
                  <dd>{method === "pickup" || shipping === 0 ? "Free" : peso(shipping)}</dd>
                </div>
                <div className="summary__total">
                  <dt>Total</dt>
                  <dd>{peso(method === "pickup" ? Math.max(0, subtotal - discount) : total)}</dd>
                </div>
              </dl>

              <Checkbox
                label="I agree to Kapresco's terms and policies"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <Button to="/cart" variant="ghost">
                Back to cart
              </Button>
            </aside>
          </div>
        </div>
      </section>

      <LoginRequiredModal {...modalProps} />
    </>
  );
}
