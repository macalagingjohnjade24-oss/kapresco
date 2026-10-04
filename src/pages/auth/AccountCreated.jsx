import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import Button from "../../components/Button.jsx";
import Icon from "../../components/Icon.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import "./auth.css";

const NEXT_STEPS = [
  {
    icon: "heart",
    title: "Save your favorites",
    body: "Tap the heart on any drink and it’ll be waiting here next time.",
  },
  {
    icon: "package",
    title: "Track your orders",
    body: "Every order you place shows its status in one cozy list.",
  },
  {
    icon: "pin",
    title: "Save a delivery address",
    body: "Checkout once and we’ll remember where to bring your brews.",
  },
];

export default function AccountCreated() {
  const { user } = useAuth();

  return (
    <AuthLayout
      eyebrow="WELCOME TO KAPRESCO"
      title={`Your account is ready, ${user?.firstName ?? "friend"}!`}
      description="Salamat sa pag-join! Here’s what you can do next."
      footer={
        <>
          Already exploring? <Link to="/menu">Browse the menu</Link>
        </>
      }
    >
      <div className="onboard">
        <ul className="onboard__list">
          {NEXT_STEPS.map((step) => (
            <li key={step.title} className="onboard__item">
              <span className="onboard__icon">
                <Icon name={step.icon} size={17} color="var(--brown-700)" strokeWidth={1.8} />
              </span>
              <span>
                <span className="onboard__title">{step.title}</span>
                <br />
                <span className="onboard__body">{step.body}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="auth-panel__actions">
          <Button to="/menu" variant="gold" size="lg" fullWidth>
            Explore Our Menu
          </Button>
          <Button to="/account" variant="outline" fullWidth>
            Go to My Account
          </Button>
        </div>

        <p className="auth-panel__note">
          <Icon name="info" size={16} color="var(--text-muted)" strokeWidth={1.8} /> Your account is live — your cart,
          favorites, and orders stay with it on every device.
        </p>
      </div>
    </AuthLayout>
  );
}
