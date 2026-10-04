import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { peso, useCart } from "../context/CartContext.jsx";
import { orderService } from "../services/orderService.js";
import "./Commerce.css";

export default function OrderConfirmation() {
  const { isEmpty, loading: cartLoading } = useCart();
  const location = useLocation();
  // Handed over by the payment step; a refresh keeps it (history state).
  const reference = location.state?.reference ?? null;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = reference
      ? orderService.getOrder(reference)
      : orderService.getOrders().then((list) => list[0] ?? null);

    load
      .then((next) => {
        if (!cancelled) setOrder(next);
      })
      .catch(() => {
        if (!cancelled) setOrder(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reference]);

  if (loading || cartLoading) {
    return (
      <section className="section commerce">
        <div className="container">
          <LoadingState title="Fetching your order…" description="One moment while we confirm the details." />
        </div>
      </section>
    );
  }

  // The cart is emptied when an order is placed, so reaching this page with an
  // empty cart *and* no stored order means there is nothing to confirm.
  if (!order && isEmpty) return <Navigate to="/menu" replace />;

  if (!order) {
    return (
      <section className="section commerce">
        <div className="container">
          <div className="confirm">
            <span className="confirm__badge">
              <Icon name="check-circle" size={44} color="var(--success)" strokeWidth={1.7} />
            </span>
            <h1 className="confirm__title">You’re all set</h1>
            <p className="confirm__body">Your order went through. We’ll start brewing it right away.</p>
            <div className="confirm__actions">
              <Button to="/orders" variant="gold">
                View My Orders
              </Button>
              <Button to="/menu" variant="outline">
                Back to Menu
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const placed = new Date(order.placedAt);

  return (
    <section className="section commerce">
      <div className="container">
        <div className="confirm">
          <span className="confirm__badge">
            <Icon name="check" size={44} color="var(--success)" strokeWidth={2.4} />
          </span>

          <h1 className="confirm__title">Order confirmed!</h1>
          <p className="confirm__body">
            Salamat, {order.customer}! We’ve received your order and the baristas are already on it.
            {order.methodLabel === "Pickup"
              ? ` Head to the shop — we’ll have it ready in 15–20 minutes.`
              : ` Expect it at your door in about 30–45 minutes.`}
          </p>

          <p className="confirm__ref">
            Order reference <strong>{order.reference}</strong>
          </p>

          <dl className="confirm__meta">
            <div>
              <dt>Placed</dt>
              <dd>
                {placed.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })} ·{" "}
                {placed.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" })}
              </dd>
            </div>
            <div>
              <dt>Method</dt>
              <dd>
                {order.method} · {order.methodLabel}
              </dd>
            </div>
            <div>
              <dt>Items</dt>
              <dd>{order.itemCount}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{peso(order.total)}</dd>
            </div>
          </dl>

          <div className="confirm__actions">
            <Button to="/orders" variant="gold">
              View My Orders
            </Button>
            <Button to="/menu" variant="outline">
              Order Something Else
            </Button>
            <Button to="/" variant="ghost">
              Back Home
            </Button>
          </div>

          <p className="confirm__footnote">
            Questions about this order? Call us at{" "}
            <a href="tel:09123521096">0912-352-1096</a> or email{" "}
            <a href="mailto:kapresco@gmail.com">kapresco@gmail.com</a>.
          </p>
        </div>

        <section className="confirm-recap" aria-label="Items ordered">
          <h2 className="confirm-recap__title">What you ordered</h2>
          <ul>
            {order.items.map((item) => (
              <li key={item.key}>
                <img src={item.image} alt="" loading="lazy" />
                <span className="confirm-recap__name">
                  {item.name}
                  {item.size ? ` (${item.size})` : ""}
                </span>
                <span className="confirm-recap__qty">× {item.qty}</span>
                <span className="confirm-recap__price">{peso(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="confirm-recap__total">
            <span>Total</span>
            <strong>{peso(order.total)}</strong>
          </p>
        </section>
      </div>
    </section>
  );
}

