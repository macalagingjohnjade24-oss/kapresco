import { useEffect, useState } from "react";
import PageIntro from "../components/ui/PageIntro.jsx";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { peso } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { orderService } from "../services/orderService.js";
import "./Orders.css";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "Preparing", label: "Preparing" },
  { id: "Completed", label: "Completed" },
];

const STATUS_TONE = {
  Preparing: "pending",
  Completed: "done",
};

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    orderService
      .getOrders()
      .then((list) => {
        if (!cancelled) setAll(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "We couldn’t load your orders.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, reloadKey]);

  const orders = filter === "all" ? all : all.filter((o) => o.status === filter);

  return (
    <>
      <PageIntro
        eyebrow="KAPRESCO HISTORY"
        title="My Orders"
        description="Every brew you’ve ordered, all in one cozy list."
        image="/images/coffee-image-7499d99f.png"
      />

      <section className="section orders">
        <div className="container">
          {loading ? (
            <LoadingState title="Loading your orders…" description="Pulling your Kapresco history." />
          ) : error ? (
            <EmptyState
              icon="alert-circle"
              title="We couldn’t load your orders"
              description={error}
              actionLabel="Try again"
              onAction={() => setReloadKey((k) => k + 1)}
            />
          ) : all.length === 0 ? (
            <EmptyState
              icon="package"
              title={isAuthenticated ? "No orders yet" : "Sign in to see your orders"}
              description={
                isAuthenticated
                  ? "Once you place an order it’ll show up here with its status."
                  : "Log in and your Kapresco order history will be waiting for you."
              }
              actionLabel={isAuthenticated ? "Explore Our Menu" : "Login"}
              actionTo={isAuthenticated ? "/menu" : "/login"}
            />
          ) : (
            <>
              <div className="orders__filters" role="tablist" aria-label="Filter orders">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={filter === f.id}
                    className={`chip${filter === f.id ? " chip--active" : ""}`}
                    onClick={() => setFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <ul className="order-list">
                {orders.map((order) => {
                  const open = openId === order.reference;
                  return (
                    <li key={order.reference} className="order-card">
                      <button
                        type="button"
                        className="order-card__head"
                        aria-expanded={open}
                        onClick={() => setOpenId(open ? null : order.reference)}
                      >
                        <span className="order-card__ref">
                          <span className="order-card__ref-label">Order</span>
                          <strong>{order.reference}</strong>
                        </span>

                        <span className="order-card__date">
                          <span className="order-card__ref-label">Placed</span>
                          {new Date(order.placedAt).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>

                        <span className={`status-pill status-pill--${STATUS_TONE[order.status] ?? "done"}`}>
                          {order.status}
                        </span>

                        <span className="order-card__total">{peso(order.total)}</span>

                        <Icon
                          name="chevron-down"
                          size={18}
                          color="var(--brown-700)"
                          strokeWidth={2}
                          className={`order-card__chevron${open ? " is-open" : ""}`}
                        />
                      </button>

                      {open && (
                        <div className="order-card__body">
                          <ul className="order-card__items">
                            {order.items.map((item) => (
                              <li key={item.key}>
                                <img src={item.image} alt="" loading="lazy" />
                                <span>
                                  {item.name}
                                  {item.size ? ` (${item.size})` : ""}
                                </span>
                                <span className="order-card__qty">× {item.qty}</span>
                                <span className="order-card__line-price">{peso(item.price * item.qty)}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="order-card__foot">
                            <p>
                              <Icon name="truck" size={16} color="var(--text-muted)" strokeWidth={1.7} />
                              {order.methodLabel}
                              {order.address?.line ? ` — ${order.address.line}, ${order.address.city}` : ""}
                            </p>
                            <p>
                              <Icon name="tag" size={16} color="var(--text-muted)" strokeWidth={1.7} />
                              Paid with {order.method}
                            </p>
                          </div>

                          <div className="order-card__actions">
                            <Button to="/menu" variant="outline" size="sm">
                              Order Again
                            </Button>
                            <Button variant="ghost" size="sm">
                              Contact Support
                            </Button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <p className="orders__note">
                Order history is saved to your Kapresco account, so it follows you across devices.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
