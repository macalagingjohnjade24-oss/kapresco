import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../Button.jsx";
import Icon from "../Icon.jsx";
import "./LoginRequiredModal.css";

/**
 * Login Required Modal — matches Kapresco design system.
 * Shown when an unauthenticated user attempts any ordering action.
 */
export default function LoginRequiredModal({ isOpen, onClose, returnTo }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;
    const modal = document.getElementById("login-required-modal");
    if (!modal) return;

    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login", { state: { from: returnTo ?? location.pathname + location.search } });
  };

  const handleSignup = () => {
    onClose();
    navigate("/signup", { state: { from: returnTo ?? location.pathname + location.search } });
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} aria-hidden="true" />
      <div
        id="login-required-modal"
        className="login-required-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-required-title"
        aria-describedby="login-required-desc"
      >
        <div className="login-required-modal__content">
          <Icon name="user" size={36} color="var(--brown-700)" strokeWidth={1.8} className="login-required-modal__icon" aria-hidden="true" />

          <h2 id="login-required-title" className="login-required-modal__title">
            Login Required
          </h2>

          <p id="login-required-desc" className="login-required-modal__message">
            You must log in to your Kapresco account before placing an order.
          </p>

          <div className="login-required-modal__actions">
            <Button variant="gold" size="md" onClick={handleLogin} fullWidth>
              Log In
            </Button>
            <Button variant="outline" size="md" onClick={handleSignup} fullWidth>
              Create Account
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose} className="login-required-modal__cancel">
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}