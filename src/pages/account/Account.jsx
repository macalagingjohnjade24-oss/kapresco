import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button.jsx";
import Icon from "../../components/Icon.jsx";
import LoadingState from "../../components/ui/LoadingState.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import { peso, useCart } from "../../context/CartContext.jsx";
import { orderService } from "../../services/orderService.js";

export default function Account() {
  const { user } = useAuth();
  const { count } = useFavorites();
  const { items, total } = useCart();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    orderService
      .getOrders()
      .then((list) => {
        if (!cancelled) setOrders(list);
      })
      .catch(() => {
        // The stats degrade gracefully; /orders shows the full error state.
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const spent = orders.reduce((n, o) => n + o.total, 0);
  const lastOrder = orders[0];

  return (
    <div className="account-panel">
      <div className="account-panel__header">
        <div>
          <h1 className="account-panel__title">Welcome back, {user?.firstName ?? "friend"}!</h1>
          <p className="account-panel__subtitle">Here’s what’s happening with your Kapresco account.</p>
        </div>
        <Button to="/menu" variant="gold">
          Order Now
        </Button>
      </div>

      <div className="account-panel__divider" />

      <div className="account-stats">
        <div className="stat-tile">
          <span className="stat-tile__value">{ordersLoading ? "…" : orders.length}</span>
          <span className="stat-tile__label">Orders placed</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value">{ordersLoading ? "…" : peso(spent)}</span>
          <span className="stat-tile__label">Lifetime brews</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value">{count}</span>
          <span className="stat-tile__label">Saved favorites</span>
        </div>
      </div>

      <div className="account-panel__divider" />

      <section aria-label="Recent order">
        <div className="account-panel__header">
          <div>
            <h2 className="account-panel__title" style={{ fontSize: "var(--fs-h4)" }}>
              Recent order
            </h2>
            <p className="account-panel__subtitle">
              {ordersLoading
                ? "Loading your latest order…"
                : lastOrder
                  ? `${lastOrder.reference} · ${lastOrder.itemCount} items · ${lastOrder.status}`
                  : "You haven’t ordered yet — the menu’s waiting."}
            </p>
          </div>
          {lastOrder && (
            <Button to="/orders" variant="outline" size="sm">
              View all orders
            </Button>
          )}
        </div>

        {ordersLoading ? (
          <LoadingState title="Loading your latest order…" />
        ) : lastOrder ? (
          <ul className="row-list">
            {lastOrder.items.slice(0, 3).map((item) => (
              <li key={item.key} className="row-card">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "var(--r-input)" }}
                />
                <div className="row-card__body">
                  <p className="row-card__title">
                    {item.name}
                    {item.size ? ` (${item.size})` : ""}
                  </p>
                  <p className="row-card__meta">
                    × {item.qty} · {peso(item.price * item.qty)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="row-card">
            <span className="row-card__icon">
              <Icon name="cart" size={20} color="var(--brown-700)" strokeWidth={1.7} />
            </span>
            <div className="row-card__body">
              <p className="row-card__title">Nothing brewing yet</p>
              <p className="row-card__meta">
                {items.length > 0
                  ? `You have ${items.length} item${items.length === 1 ? "" : "s"} waiting in your cart — ${peso(total)}.`
                  : "Pick your first favorite from the Kapresco menu."}
              </p>
            </div>
            <div className="row-card__actions">
              <Button to={items.length > 0 ? "/checkout" : "/menu"} variant="brown" size="sm">
                {items.length > 0 ? "Checkout" : "Browse menu"}
              </Button>
            </div>
          </div>
        )}
      </section>

      <div className="account-panel__divider" />

      <section aria-label="Quick links">
        <ul className="row-list">
          <li className="row-card">
            <span className="row-card__icon">
              <Icon name="pin" size={20} color="var(--brown-700)" strokeWidth={1.7} />
            </span>
            <div className="row-card__body">
              <p className="row-card__title">Delivery addresses</p>
              <p className="row-card__meta">Save where we should bring your brews.</p>
            </div>
            <div className="row-card__actions">
              <Button to="/account/addresses" variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </li>

          <li className="row-card">
            <span className="row-card__icon">
              <Icon name="tag" size={20} color="var(--brown-700)" strokeWidth={1.7} />
            </span>
            <div className="row-card__body">
              <p className="row-card__title">Payment methods</p>
              <p className="row-card__meta">GCash, Maya, or a saved card.</p>
            </div>
            <div className="row-card__actions">
              <Button to="/account/payment-methods" variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </li>

          <li className="row-card">
            <span className="row-card__icon">
              <Icon name="settings" size={20} color="var(--brown-700)" strokeWidth={1.6} />
            </span>
            <div className="row-card__body">
              <p className="row-card__title">Account settings</p>
              <p className="row-card__meta">Update your name, email, and notifications.</p>
            </div>
            <div className="row-card__actions">
              <Button to="/account/settings" variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </li>
        </ul>
      </section>

      <p className="form-hint">
        Need a hand? Email us at <Link to="/contact">kapresco@gmail.com</Link>.
      </p>
    </div>
  );
}
