import { NavLink } from "react-router-dom";
import Icon from "../Icon.jsx";
import Button from "../Button.jsx";
import { NAV_LINKS } from "../../data/site.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import "./MobileMenu.css";

const ACCOUNT_LINKS = [
  { to: "/account", label: "My Account", icon: "user" },
  { to: "/orders", label: "Orders", icon: "package" },
  { to: "/favorites", label: "Favorites", icon: "heart" },
  { to: "/account/addresses", label: "Addresses", icon: "pin" },
  { to: "/account/payment-methods", label: "Payment Methods", icon: "tag" },
  { to: "/account/settings", label: "Settings", icon: "settings" },
];

export default function MobileMenu({ id, open, onClose, ref }) {
  const { isAuthenticated, logout } = useAuth();
  const { count } = useCart();

  return (
    <>
      <div
        className={`mobile-menu__scrim${open ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={ref}
        id={id}
        className={`mobile-menu${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <button
          type="button"
          className="mobile-menu__close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <Icon name="close" size={24} color="var(--brown-700)" strokeWidth={2} />
        </button>

        <nav aria-label="Mobile">
          <ul className="mobile-menu__list">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) => `mobile-menu__link${isActive ? " is-active" : ""}`}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                >
                  {link.label}
                  <Icon name="chevron-right" size={18} color="currentColor" strokeWidth={1.8} />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <span className="mobile-menu__divider" aria-hidden="true" />

        {isAuthenticated && (
          <ul className="mobile-menu__list">
            <li>
              <NavLink
                to="/cart"
                className={({ isActive }) => `mobile-menu__link${isActive ? " is-active" : ""}`}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
              >
                <span className="mobile-menu__link-label">
                  <Icon name="cart" size={20} strokeWidth={1.8} /> Cart
                </span>
                {count > 0 && <span className="mobile-menu__badge">{count}</span>}
              </NavLink>
            </li>
          </ul>
        )}

        {isAuthenticated && (
          <>
            <span className="mobile-menu__divider" aria-hidden="true" />
            <p className="mobile-menu__heading">My Kapresco</p>
            <ul className="mobile-menu__list">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `mobile-menu__link mobile-menu__link--sub${isActive ? " is-active" : ""}`}
                    onClick={onClose}
                    tabIndex={open ? 0 : -1}
                  >
                    <span className="mobile-menu__link-label">
                      <Icon name={link.icon} size={19} strokeWidth={1.7} /> {link.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mobile-menu__footer">
          {isAuthenticated ? (
            <Button
              variant="outline"
              fullWidth
              iconLeft={<Icon name="log-out" size={18} strokeWidth={1.8} />}
              onClick={() => {
                onClose();
                logout();
              }}
            >
              Logout
            </Button>
          ) : (
            <div className="mobile-menu__auth">
              <Button to="/login" variant="outline" fullWidth onClick={onClose} tabIndex={open ? 0 : -1}>
                Login
              </Button>
              <Button to="/signup" variant="brown" fullWidth onClick={onClose} tabIndex={open ? 0 : -1}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
