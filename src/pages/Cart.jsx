import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import PageIntro from "../components/ui/PageIntro.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { peso, useCart } from "../context/CartContext.jsx";
import { useAuthGuard } from "../hooks/useAuthGuard.jsx";
import LoginRequiredModal from "../components/ui/LoginRequiredModal.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import "./Commerce.css";

export default function Cart() {
  const {
    items,
    isEmpty,
    subtotal,
    discount,
    shipping,
    total,
    promo,
    setQty,
    remove,
    applyPromo,
    applyCode,
    loading,
    error,
    refresh,
  } = useCart();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);
  const [checking, setChecking] = useState(false);

  const { requireAuth, modalProps } = useAuthGuard();

  const handlePromo = async (e) => {
    e.preventDefault();
    const key = code.trim().toUpperCase();
    if (!key || checking) return;
    setChecking(true);
    setMessage(null);
    try {
      const applied = await applyCode(key);
      if (applied) {
        setMessage({ tone: "success", text: `${key} applied — ${applied.label}.` });
        setCode("");
      } else {
        setMessage({ tone: "error", text: "That promo code doesn't work. Try KAPRESCO10 or TARAKAT." });
      }
    } catch (err) {
      setMessage({ tone: "error", text: err?.message ?? "We couldn’t check that code. Please try again." });
    } finally {
      setChecking(false);
    }
  };

  const clearPromo = () => {
    applyPromo(null);
    setMessage({ tone: "success", text: "Promo code removed." });
  };

  const handleCheckout = () => {
    requireAuth(() => {
      // Navigation handled by Link, but we need to intercept
      window.location.href = "/checkout";
    });
  };

  return (
    <>
      <PageIntro
        eyebrow="YOUR ORDER"
        title="Your Cart"
        description="Review your picks before we brew them up. Everything is made fresh when you order."
        image="/images/untitled-design-1-5efb0725.png"
      />

      <section className="section commerce">
        <div className="container">
          {loading ? (
            <LoadingState title="Loading your cart…" description="Fetching your saved picks." />
          ) : error && isEmpty ? (
            <EmptyState
              icon="alert-circle"
              title="We couldn’t load your cart"
              description={error}
              actionLabel="Try again"
              onAction={() => refresh()}
            />
          ) : isEmpty ? (
            <EmptyState
              icon="cart"
              title="Your cart is empty"
              description="Nothing brewing yet. Take a look at the Kapresco menu and pick your first favorite."
              actionLabel="Explore Our Menu"
              actionTo="/menu"
            />
          ) : (
            <div className="commerce__layout">
              {/* ---- Line items ---- */}
              <div className="commerce__main">
                <ul className="line-items">
                  {items.map((item) => (
                    <li key={item.key} className="line-item">
                      <Link to={`/menu/${item.id}`} className="line-item__media" tabIndex={-1} aria-hidden="true">
                        <img src={item.image} alt="" loading="lazy" />
                      </Link>

                      <div className="line-item__info">
                        <h2 className="line-item__name">
                          <Link to={`/menu/${item.id}`}>{item.name}</Link>
                        </h2>
                        {item.size && <p className="line-item__meta">Size: {item.size}</p>}
                        <p className="line-item__unit">{peso(item.price)} each</p>
                      </div>

                      <div className="line-item__qty">
                        <div className="quantity quantity--sm" role="group" aria-label={`Quantity for ${item.name}`}>
                          <button type="button" onClick={() => setQty(item.key, item.qty - 1)} aria-label="Decrease quantity">
                            <Icon name="minus" size={14} color="var(--brown-700)" strokeWidth={2.2} />
                          </button>
                          <span className="quantity__value">{item.qty}</span>
                          <button type="button" onClick={() => setQty(item.key, item.qty + 1)} aria-label="Increase quantity">
                            <Icon name="plus" size={14} color="var(--brown-700)" strokeWidth={2.2} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="line-item__remove"
                          onClick={() => remove(item.key)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Icon name="trash" size={17} color="var(--error)" strokeWidth={1.7} />
                        </button>
                      </div>

                      <p className="line-item__total">{peso(item.price * item.qty)}</p>
                    </li>
                  ))}
                </ul>

                <Link to="/menu" className="inline-link commerce__continue">
                  <Icon name="arrow-right" size={18} color="var(--brown-700)" strokeWidth={1.9} />
                  Continue shopping
            </Link>
              </div>

              {/* ---- Summary ---- */}
              <aside className="summary" aria-label="Order summary">
                <h2 className="summary__title">Order Summary</h2>

                <form className="promo" onSubmit={handlePromo}>
                  <label className="visually-hidden" htmlFor="promo-code">
                    Promo code
                  </label>
                  <input
                    id="promo-code"
                    className="promo__input"
                    placeholder="Promo code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoComplete="off"
                  />
                  <Button type="submit" variant="brown" size="sm" disabled={checking}>
                    {checking ? "Checking…" : "Apply"}
                  </Button>
                </form>

                {message && (
                  <p className={`promo__message promo__message--${message.tone}`} role="status">
                    <Icon
                      name={message.tone === "success" ? "check-circle" : "alert-circle"}
                      size={16}
                      color={message.tone === "success" ? "var(--success)" : "var(--error)"}
                      strokeWidth={1.8}
                    />
                    {message.text}
                  </p>
                )}

                <dl className="summary__rows">
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{peso(subtotal)}</dd>
                  </div>
                  {promo && (
                    <div className="summary__row--discount">
                      <dt>
                        Promo {promo.code}
                        <button type="button" className="summary__remove-promo" onClick={clearPromo}>
                          Remove
                        </button>
                      </dt>
                      <dd>−{peso(discount)}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Delivery</dt>
                    <dd>{shipping === 0 ? "Free" : peso(shipping)}</dd>
                  </div>
                  <div className="summary__total">
                    <dt>Total</dt>
                    <dd>{peso(total)}</dd>
                  </div>
                </dl>

                <Button variant="gold" size="lg" fullWidth onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
                <p className="summary__note">
                  <Icon name="truck" size={16} color="var(--text-muted)" strokeWidth={1.7} />
                  Free delivery on orders over ₱300.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>

      <LoginRequiredModal {...modalProps} />
    </>
  );
}
