import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageIntro from "../components/ui/PageIntro.jsx";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { peso } from "../context/CartContext.jsx";
import { orderService } from "../services/orderService.js";
import "./Static.css";

const STATUS_TONE = {
  Preparing: "pending",
  Ready: "pending",
  "Out for Delivery": "pending",
  Completed: "done",
  Cancelled: "error",
};

const STATUS_STEPS = [
  { key: "placed", label: "Order placed", icon: "tag" },
  { key: "preparing", label: "Preparing", icon: "coffee" },
  { key: "ready", label: "Ready for pickup", icon: "check-circle" },
  { key: "delivering", label: "Out for delivery", icon: "truck" },
  { key: "completed", label: "Completed", icon: "check-circle-2" },
];

export default function OrderDetail() {
  const { reference } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    orderService
      .getOrder(reference)
      .then((next) => {
        if (!cancelled) setOrder(next);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "We couldn’t load that order.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reference, reloadKey]);

  if (loading) {
    return (
      <section className="section order-detail">
        <div className="container">
          <LoadingState title="Loading your order…" description={`Reference ${reference}`} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section order-detail">
        <div className="container">
          <EmptyState
            icon="alert-circle"
            title="We couldn’t load that order"
            description={error}
            actionLabel="Try again"
            onAction={() => setReloadKey((k) => k + 1)}
          />
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <PageIntro
        eyebrow="ORDER NOT FOUND"
        title="We couldn't find that order"
        description="The reference you entered doesn't match any order in our system."
        image="/images/coffee-image-7499d99f.png"
      />
    );
  }

  const statusTone = STATUS_TONE[order.status] ?? "pending";
  const isDelivery = order.methodLabel === "Delivery";
  const isCancelled = order.status === "Cancelled";

  // Determine current step index for timeline
  let currentStep = 0;
  if (["Preparing", "Ready", "Out for Delivery"].includes(order.status)) currentStep = 1;
  if (order.status === "Out for Delivery") currentStep = 3;
  if (order.status === "Completed") currentStep = 4;
  if (order.status === "Cancelled") currentStep = -1;

  return (
    <>
      <PageIntro
        eyebrow={isDelivery ? "DELIVERY ORDER" : "PICKUP ORDER"}
        title={`Order ${order.reference}`}
        description={
          isCancelled
            ? "This order was cancelled."
            : `Placed ${new Date(order.placedAt).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}`
        }
        image="/images/coffee-image-7499d99f.png"
      />

      <section className="section order-detail">
        <div className="container">
          <div className="order-detail__grid">
            {/* ---- Main content ---- */}
            <div className="order-detail__main">
              {/* Status banner */}
              <div className={`order-detail__status status-pill status-pill--${statusTone}`}>
                <Icon name={isCancelled ? "x-circle" : isDelivery ? "truck" : "bag"} size={18} strokeWidth={1.8} />
                <span>{order.status}</span>
              </div>

              {/* Timeline for delivery orders */}
              {isDelivery && !isCancelled && (
                <div className="order-detail__timeline" aria-label="Delivery progress">
                  {STATUS_STEPS.map((step, idx) => {
                    const isPast = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <div key={step.key} className={`timeline-step${isCurrent ? " is-current" : ""}${isPast ? " is-past" : ""}`}>
                        <div className="timeline-step__dot" aria-hidden="true">
                          {isPast && <Icon name="check" size={14} color="#fff" strokeWidth={2.5} />}
                        </div>
                        <div className="timeline-step__content">
                          <span className="timeline-step__label">{step.label}</span>
                          {isPast && (
                            <span className="timeline-step__time">
                              {idx === 0
                                ? new Date(order.placedAt).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })
                                : "—"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pickup ready state */}
              {isDelivery === false && order.status === "Ready" && !isCancelled && (
                <div className="order-detail__pickup-ready" role="status" aria-live="polite">
                  <Icon name="check-circle" size={28} color="var(--success)" strokeWidth={1.8} />
                  <div>
                    <strong>Your order is ready for pickup!</strong>
                    <p>Head to Kapresco and let the crew know your reference: <strong>{order.reference}</strong></p>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="order-detail__section">
                <h2 className="order-detail__section-title">Items</h2>
                <ul className="order-detail__items">
                  {order.items.map((item) => (
                    <li key={item.key} className="order-detail__item">
                      <img src={item.image} alt="" loading="lazy" className="order-detail__item-image" />
                      <div className="order-detail__item-info">
                        <p className="order-detail__item-name">{item.name}{item.size ? ` (${item.size})` : ""}</p>
                        <p className="order-detail__item-meta">× {item.qty}</p>
                      </div>
                      <p className="order-detail__item-price">{peso(item.price * item.qty)}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery / Pickup details */}
              <div className="order-detail__section">
                <h2 className="order-detail__section-title">{isDelivery ? "Delivery Details" : "Pickup Details"}</h2>
                <div className="order-detail__details">
                  {isDelivery && order.address && (
                    <div className="order-detail__address">
                      <Icon name="map-pin" size={20} color="var(--brown-700)" strokeWidth={1.8} />
                      <div>
                        <p className="order-detail__address-name">{order.address.name}</p>
                        <p className="order-detail__address-line">{order.address.line}, {order.address.city}</p>
                        <p className="order-detail__address-phone">{order.address.phone}</p>
                      </div>
                    </div>
                  )}
                  {!isDelivery && (
                    <div className="order-detail__address">
                      <Icon name="map-pin" size={20} color="var(--brown-700)" strokeWidth={1.8} />
                      <div>
                        <p className="order-detail__address-name">Kapresco Mati</p>
                        <p className="order-detail__address-line">Madang, City of Mati</p>
                        <p className="order-detail__address-phone">0912-352-1096</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="order-detail__section">
                <h2 className="order-detail__section-title">Payment</h2>
                <div className="order-detail__payment">
                  <Icon name={order.method === "GCash" ? "smartphone" : order.method === "Maya" ? "credit-card" : "credit-card"} size={20} color="var(--brown-700)" strokeWidth={1.8} />
                  <div>
                    <p className="order-detail__payment-method">{order.method}</p>
                    <p className="order-detail__payment-status">Paid {new Date(order.placedAt).toLocaleString("en-PH")}</p>
                  </div>
                </div>
              </div>

              {/* Cancelled notice */}
              {isCancelled && (
                <div className="order-detail__cancelled" role="alert">
                  <Icon name="x-circle" size={24} color="var(--error)" strokeWidth={1.8} />
                  <div>
                    <strong>This order was cancelled</strong>
                    <p>If this was a mistake, you can <Link to="/menu">place a new order</Link>.</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="order-detail__actions">
                <Button to="/menu" variant="outline" size="sm">
                  Order Again
                </Button>
                <Button variant="ghost" size="sm">
                  Contact Support
                </Button>
              </div>
            </div>

            {/* ---- Sidebar summary ---- */}
            <aside className="order-detail__sidebar">
              <div className="order-detail__summary">
                <h3>Order Summary</h3>
                <dl className="order-detail__summary-list">
                  {order.items.map((item) => (
                    <div key={item.key} className="order-detail__summary-row">
                      <dt>{item.name}{item.size ? ` (${item.size})` : ""} <span className="order-detail__qty">× {item.qty}</span></dt>
                      <dd>{peso(item.price * item.qty)}</dd>
                    </div>
                  ))}
                  <div className="order-detail__summary-row">
                    <dt>Subtotal</dt>
                    <dd>{peso(order.subtotal)}</dd>
                  </div>
                  {order.shipping > 0 && (
                    <div className="order-detail__summary-row">
                      <dt>Delivery Fee</dt>
                      <dd>{peso(order.shipping)}</dd>
                    </div>
                  )}
                  {order.discount && (
                    <div className="order-detail__summary-row order-detail__discount">
                      <dt>
                        Promo {order.promoCode && `(${order.promoCode})`}
                        <Icon name="tag" size={14} color="var(--success)" strokeWidth={1.8} />
                      </dt>
                      <dd>−{peso(order.discount)}</dd>
                    </div>
                  )}
                  <div className="order-detail__summary-row order-detail__total">
                    <dt>Total</dt>
                    <dd>{peso(order.total)}</dd>
                  </div>
                </dl>
              </div>

              <div className="order-detail__meta">
                <div className="order-detail__meta-row">
                  <span className="order-detail__meta-label">Reference</span>
                  <span className="order-detail__meta-value">{order.reference}</span>
                </div>
                <div className="order-detail__meta-row">
                  <span className="order-detail__meta-label">Placed</span>
                  <span className="order-detail__meta-value">
                    {new Date(order.placedAt).toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="order-detail__meta-row">
                  <span className="order-detail__meta-label">Method</span>
                  <span className="order-detail__meta-value">{order.methodLabel}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}