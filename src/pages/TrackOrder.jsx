import { useState, useEffect } from "react";
import PageIntro from "../components/ui/PageIntro.jsx";
import Icon from "../components/Icon.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { orderService } from "../services/orderService.js";
import "./Static.css";

/* Track Order page — Figma "Track Order — Delivery" frame:
   timeline on left, order sidebar on right with "Orders" active. */
const TRACKING_STEPS = [
  { key: "placed", label: "Order placed", description: "Your order has been received and confirmed.", icon: "tag" },
  { key: "preparing", label: "Preparing", description: "Our baristas are brewing your drinks fresh.", icon: "coffee" },
  { key: "ready", label: "Ready for pickup", description: "Your order is ready. Waiting for rider assignment.", icon: "check-circle" },
  { key: "delivering", label: "Out for delivery", description: "A rider is on the way to your address.", icon: "truck" },
  { key: "completed", label: "Completed", description: "Your order has been delivered. Enjoy!", icon: "check-circle-2" },
];

export default function TrackOrder() {
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completionTime] = useState(() => new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    orderService
      .getOrders()
      .then((list) => {
        if (!cancelled) {
          setOrders(list.filter((o) => o.methodLabel === "Delivery" && o.status !== "Cancelled"));
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "We couldn’t load your delivery orders.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Simulate progress for demo
  useEffect(() => {
    if (!activeOrderId) return;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return Math.min(100, p + Math.random() * 8);
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [activeOrderId]);

  // Find the active order
  const order = orders.find((o) => o.reference === activeOrderId) || orders[0];

  if (loading) {
    return (
      <section className="section track-order">
        <div className="container">
          <LoadingState title="Tracking your order…" description="Loading your delivery orders." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section track-order">
        <div className="container">
          <EmptyState
            icon="alert-circle"
            title="We couldn’t load your orders"
            description={error}
            actionLabel="Try again"
            onAction={() => window.location.reload()}
          />
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <PageIntro
        eyebrow="TRACK ORDER"
        title="No delivery orders to track"
        description="Place a delivery order to see live tracking here."
        image="/images/coffee-image-7499d99f.png"
      />
    );
  }

  // Determine current step index
  const isCompleted = order.status === "Completed";

  return (
    <>
      <PageIntro
        eyebrow="TRACK ORDER"
        title={`Tracking ${order.reference}`}
        description={
          isCompleted
            ? "Your order has been delivered. Thank you for choosing Kapresco!"
            : "Real-time delivery status — refresh for updates."
        }
        image="/images/coffee-image-7499d99f.png"
      />

      <section className="section track-order">
        <div className="container">
          <div className="track-order__grid">
            {/* ---- Sidebar: Order list ---- */}
            <aside className="track-order__sidebar" aria-label="Your delivery orders">
              <h2 className="track-order__sidebar-title">My Orders</h2>
              <ul className="track-order__list" role="listbox" aria-label="Select an order to track">
                {orders.map((o) => (
                  <li key={o.reference}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={activeOrderId === o.reference || (!activeOrderId && o === orders[0])}
                      className={`track-order__list-item${activeOrderId === o.reference || (!activeOrderId && o === orders[0]) ? " is-active" : ""}`}
                      onClick={() => {
                        setActiveOrderId(o.reference);
                        setProgress(o.status === "Completed" ? 100 : o.status === "Out for Delivery" ? 60 : o.status === "Ready" ? 40 : o.status === "Preparing" ? 20 : 10);
                      }}
                    >
                      <span className="track-order__list-ref">{o.reference}</span>
                      <span className={`track-order__list-status status-pill status-pill--${o.status === "Completed" ? "done" : "pending"}`}>
                        {o.status}
                      </span>
                      <span className="track-order__list-time">
                        {new Date(o.placedAt).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* ---- Main: Timeline + Map placeholder ---- */}
            <main className="track-order__main">
              <div className="track-order__card">
                <div className="track-order__header">
                  <div>
                    <h2>{order.reference}</h2>
                    <p className="track-order__placed">Placed {new Date(order.placedAt).toLocaleString("en-PH", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <span className={`status-pill status-pill--${order.status === "Completed" ? "done" : "pending"}`}>
                    {order.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="track-order__progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Delivery progress">
                  <div className="track-order__progress-bar" style={{ width: `${progress}%` }} />
                  <div className="track-order__progress-steps" role="presentation" aria-hidden="true">
                    {TRACKING_STEPS.map((_, idx) => (
                      <span key={idx} style={{ left: `${(idx / (TRACKING_STEPS.length - 1)) * 100}%` }} className={idx * 25 <= progress ? "is-reached" : ""} />
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="track-order__timeline" aria-label="Delivery timeline">
                  {TRACKING_STEPS.map((step, idx) => {
                    const isPast = idx * 25 < progress;
                    const isCurrent = !isPast && idx * 25 >= progress && idx * 25 < progress + 25;
                    const isLast = idx === TRACKING_STEPS.length - 1;
                    return (
                      <div key={step.key} className={`timeline-step${isCurrent ? " is-current" : ""}${isPast ? " is-past" : ""}`}>
                        <div className="timeline-step__track">
                          <div className="timeline-step__dot" aria-hidden="true">
                            {isPast && <Icon name="check" size={14} color="#fff" strokeWidth={2.5} />}
                          </div>
                          {!isLast && <span className="timeline-step__line" />}
                        </div>
                        <div className="timeline-step__content">
                          <span className="timeline-step__label">{step.label}</span>
                          <p className="timeline-step__desc">{step.description}</p>
                          {isPast && (
                            <span className="timeline-step__time">
                              {idx === 0
                                ? new Date(order.placedAt).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })
                                : "Just now"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Map placeholder for "Out for delivery" */}
                {(order.status === "Out for Delivery" || progress > 50) && !isCompleted && (
                  <div className="track-order__map" role="img" aria-label="Live rider map showing current location">
                    <Icon name="map-pin" size={48} color="var(--gold-400)" strokeWidth={1.5} />
                    <p>Rider is on the way — live map would appear here in production</p>
                  </div>
                )}

                {/* Address */}
                <div className="track-order__delivery-to">
                  <Icon name="map-pin" size={20} color="var(--brown-700)" strokeWidth={1.8} />
                  <div>
                    <strong>Delivering to:</strong>
                    <p>{order.address?.line}, {order.address?.city}</p>
                    <p>{order.address?.name} — {order.address?.phone}</p>
                  </div>
                </div>

                {isCompleted && (
                  <div className="track-order__completed" role="status" aria-live="polite">
                    <Icon name="check-circle-2" size={32} color="var(--success)" strokeWidth={1.8} />
                    <div>
                      <strong>Delivered!</strong>
                      <p>Your order was completed at {completionTime}.</p>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}