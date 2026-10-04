import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import Input from "../components/ui/Input.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { peso, useCart } from "../context/CartContext.jsx";
import { useAuthGuard } from "../hooks/useAuthGuard.jsx";
import LoginRequiredModal from "../components/ui/LoginRequiredModal.jsx";
import { orderService } from "../services/orderService.js";
import "./Commerce.css";

const METHODS = [
  { id: "gcash", label: "GCash", hint: "Pay with your GCash balance", icon: "phone" },
  { id: "maya", label: "Maya", hint: "Pay with your Maya wallet", icon: "phone" },
  { id: "card", label: "Credit / Debit card", hint: "Visa, Mastercard, JCB", icon: "tag" },
  { id: "cod", label: "Cash on delivery", hint: "Pay the rider when your order arrives", icon: "truck" },
];

export default function Payment() {
  const { items, promo, refresh, loading: cartLoading, error: cartError } = useCart();
  const navigate = useNavigate();
  const { requireAuth, modalProps } = useAuthGuard();

  const draft = orderService.getDraft();
  const [method, setMethod] = useState("gcash");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  // Set as soon as the database accepts the order so the guard below doesn't
  // bounce the customer back to /cart while the cart is being refreshed.
  const [placed, setPlaced] = useState(false);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  // The cart is restored from the account on mount — wait for it, otherwise a
  // refresh of this page would bounce a full cart back to /cart.
  if (cartLoading && !placed) {
    return (
      <section className="section commerce">
        <div className="container">
          <LoadingState title="Preparing payment…" description="Loading your order." />
        </div>
      </section>
    );
  }

  // No draft and no cart → nothing to pay for.
  if (!draft && items.length === 0 && !placed) {
    if (cartError) {
      return (
        <section className="section commerce">
          <div className="container">
            <EmptyState
              icon="alert-circle"
              title="We couldn’t load your cart"
              description={cartError}
              actionLabel="Try again"
              onAction={() => refresh()}
            />
          </div>
        </section>
      );
    }
    return <Navigate to="/cart" replace />;
  }

  const totals = draft ?? {
    items,
    subtotal: items.reduce((n, i) => n + i.price * i.qty, 0),
    discount: 0,
    shipping: 50,
    total: items.reduce((n, i) => n + i.price * i.qty, 0) + 50,
    reference: orderService.createReference(),
    methodLabel: "Delivery",
  };

  /**
   * Places the order against the database (`place_order` RPC), which
   * re-prices everything from `products`, snapshots the lines, empties the cart
   * and returns the stored order — in one transaction.
   */
  const submitOrder = async () => {
    setBusy(true);
    setError(null);
    try {
      const methodConfig = METHODS.find((m) => m.id === method);
      const order = await orderService.placeOrder({
        method: draft?.method ?? "delivery",
        paymentMethod: methodConfig?.label ?? "GCash",
        address: draft?.address ?? null,
        contact: draft?.contact ?? null,
        promoCode: promo?.code ?? null,
      });

      orderService.clearDraft();
      setPlaced(true);
      // The database already emptied the cart; refresh so the context agrees.
      await refresh().catch(() => null);
      navigate("/order-confirmation", { replace: true, state: { reference: order.reference } });
    } catch (err) {
      setError(err?.message ?? "We couldn’t place your order. Please try again.");
      setBusy(false);
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (busy || placed) return;
    // Ordering entry point: signed-out visitors get the login modal and the
    // order is never attempted.
    requireAuth(() => {
      submitOrder();
    });
  };

  const setCardField = (e) => setCard((c) => ({ ...c, [e.target.name]: e.target.value }));

  return (
    <>
      <div className="steps" aria-label="Checkout progress">
        <span className="steps__item is-done">
          <span className="steps__num">
            <Icon name="check" size={14} color="#fff" strokeWidth={3} />
          </span>
          Checkout
        </span>
        <span className="steps__sep" aria-hidden="true" />
        <span className="steps__item is-active">
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
            <form className="commerce__main" onSubmit={handlePlaceOrder} noValidate>
              <div className="commerce__heading">
                <h1>Payment</h1>
                <p>Pick how you’d like to pay. This is a demo — no real transaction happens.</p>
              </div>

              <div className="form-card">
                <h2 className="form-card__title">Payment method</h2>

                <div className="pay-methods">
                  {METHODS.map((m) => (
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

                {method === "card" && (
                  <div className="card-fields">
                    <Input
                      className="field--full"
                      label="Card number"
                      name="number"
                      inputMode="numeric"
                      value={card.number}
                      onChange={setCardField}
                      placeholder="1234 5678 9012 3456"
                      icon="tag"
                    />
                    <Input
                      className="field--full"
                      label="Name on card"
                      name="name"
                      value={card.name}
                      onChange={setCardField}
                      placeholder="Andrea M."
                    />
                    <Input label="Expiry" name="expiry" value={card.expiry} onChange={setCardField} placeholder="MM / YY" />
                    <Input label="CVV" name="cvv" inputMode="numeric" value={card.cvv} onChange={setCardField} placeholder="123" />
                  </div>
                )}

                {(method === "gcash" || method === "maya") && (
                  <p className="pay-method__hint">
                    You’ll be redirected to {method === "gcash" ? "GCash" : "Maya"} after placing the order. Nothing is
                    charged in this demo.
                  </p>
                )}

                {method === "cod" && (
                  <p className="pay-method__hint">
                    Please have {peso(totals.total)} ready for the rider. Kapresco doesn’t handle change above ₱500.
                  </p>
                )}
              </div>

              <div className="form-card">
                <h2 className="form-card__title">Delivery summary</h2>
                <ul className="confirm-details">
                  <li>
                    <Icon name={totals.methodLabel === "Pickup" ? "package" : "truck"} size={18} color="var(--brown-600)" strokeWidth={1.7} />
                    <span>
                      <strong>{totals.methodLabel ?? "Delivery"}</strong>
                      <br />
                      {totals.address?.line ? `${totals.address.line}, ${totals.address.city}` : "Madang, City of Mati"}
                    </span>
                  </li>
                  {totals.contact?.phone && (
                    <li>
                      <Icon name="phone" size={18} color="var(--brown-600)" strokeWidth={1.7} />
                      <span>{totals.contact.phone}</span>
                    </li>
                  )}
                  {totals.contact?.email && (
                    <li>
                      <Icon name="mail" size={18} color="var(--brown-600)" strokeWidth={1.7} />
                      <span>{totals.contact.email}</span>
                    </li>
                  )}
                </ul>
              </div>

              {error && (
                <p className="promo__message promo__message--error" role="alert">
                  <Icon name="alert-circle" size={16} color="var(--error)" strokeWidth={1.8} />
                  {error}
                </p>
              )}

              <div className="form-actions">
                <Button to="/checkout" variant="ghost">
                  Back to checkout
                </Button>
                <Button type="submit" variant="gold" size="lg" disabled={busy || placed}>
                  {busy ? "Placing order…" : `Place Order · ${peso(totals.total)}`}
                </Button>
              </div>
            </form>

            <aside className="summary" aria-label="Order summary">
              <h2 className="summary__title">Order Summary</h2>

              <ul className="summary__items">
                {totals.items.map((item) => (
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
                  <dd>{peso(totals.subtotal)}</dd>
                </div>
                {totals.discount > 0 && (
                  <div className="summary__row--discount">
                    <dt>Discount</dt>
                    <dd>−{peso(totals.discount)}</dd>
                  </div>
                )}
                <div>
                  <dt>Delivery</dt>
                  <dd>{totals.shipping === 0 ? "Free" : peso(totals.shipping)}</dd>
                </div>
                <div className="summary__total">
                  <dt>Total</dt>
                  <dd>{peso(totals.total)}</dd>
                </div>
              </dl>

              <p className="summary__note">
                <Icon name="lock" size={16} color="var(--text-muted)" strokeWidth={1.7} />
                Demo checkout — no payment is processed.
              </p>
              <Link to="/terms" className="summary__note">
                Read our terms
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <LoginRequiredModal {...modalProps} />
    </>
  );
}
