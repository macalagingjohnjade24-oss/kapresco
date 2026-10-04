import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Icon from "../Icon.jsx";
import Button from "../Button.jsx";
import MobileMenu from "./MobileMenu.jsx";
import { BRAND, NAV_LINKS } from "../../data/site.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import "./Header.css";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const hamburgerRef = useRef(null);
  const menuRef = useRef(null);

  const closeAccount = () => setAccountOpen(false);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // The sheet is a modal dialog: move focus in on open, keep Tab inside it,
  // Escape closes and hands focus back to the button that opened it (§28).
  useEffect(() => {
    if (!menuOpen) return undefined;
    const panel = menuRef.current;
    if (!panel) return undefined;

    const focusables = () =>
      [...panel.querySelectorAll("a[href], button:not([disabled])")].filter(
        (el) => el.getClientRects().length > 0
      );

    // Wait a frame: while the sheet is still `visibility: hidden` its links
    // cannot take focus, and the class that reveals it lands in this commit.
    const raf = requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === hamburgerRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Dismiss the account dropdown on outside click.
  useEffect(() => {
    if (!accountOpen) return undefined;
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [accountOpen]);

  const linkClass = ({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`;

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* The wordmark carries real spaces, so the label has to quote it verbatim
            or the accessible name stops matching the visible text (axe
            label-content-name-mismatch). */}
        <Link to="/" className="brand" aria-label={`${BRAND.wordmark} — home`}>
          <img src={BRAND.logo} alt="" width="50" height="50" className="brand__logo" />
          <span className="brand__wordmark">{BRAND.wordmark}</span>
        </Link>

        <nav className="nav" aria-label="Main">
          <ul className="nav__list">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass} end={link.to === "/"}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          {isAuthenticated && (
            <Link
              to="/cart"
              className="cart-button"
              aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <Icon name="cart" size={22} color="var(--brown-700)" strokeWidth={1.8} />
              {count > 0 && <span className="cart-button__count">{count}</span>}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="account" ref={accountRef}>
              <button
                type="button"
                className="account__trigger"
                aria-expanded={accountOpen}
                aria-haspopup="true"
                onClick={() => setAccountOpen((v) => !v)}
              >
                <span className="account__avatar" aria-hidden="true">
                  <Icon name="user" size={20} color="var(--brown-700)" strokeWidth={1.8} />
                </span>
                <span className="account__identity">
                  <span className="account__name">{user?.name}</span>
                  <span className="account__label">My Account</span>
                </span>
                <Icon
                  name="chevron-down"
                  size={16}
                  color="var(--brown-700)"
                  strokeWidth={2}
                  className={`account__chevron${accountOpen ? " is-open" : ""}`}
                />
              </button>

              {accountOpen && (
                <div className="account__menu" role="menu">
                  <Link to="/account" className="account__menu-link" role="menuitem" onClick={closeAccount}>
                    <Icon name="user" size={17} strokeWidth={1.8} /> My Account
                  </Link>
                  <Link to="/orders" className="account__menu-link" role="menuitem" onClick={closeAccount}>
                    <Icon name="package" size={17} /> Orders
                  </Link>
                  <Link to="/favorites" className="account__menu-link" role="menuitem" onClick={closeAccount}>
                    <Icon name="heart" size={17} /> Favorites
                  </Link>
                  <Link to="/account/addresses" className="account__menu-link" role="menuitem" onClick={closeAccount}>
                    <Icon name="pin" size={17} strokeWidth={1.8} /> Addresses
                  </Link>
                  <Link to="/account/payment-methods" className="account__menu-link" role="menuitem" onClick={closeAccount}>
                    <Icon name="tag" size={17} strokeWidth={1.8} /> Payment Methods
                  </Link>
                  <Link to="/account/settings" className="account__menu-link" role="menuitem" onClick={closeAccount}>
                    <Icon name="settings" size={17} strokeWidth={1.6} /> Settings
                  </Link>
                  <span className="account__menu-divider" aria-hidden="true" />
                  <button
                    type="button"
                    className="account__menu-link account__menu-link--logout"
                    role="menuitem"
                    onClick={() => {
                      closeAccount();
                      logout();
                    }}
                  >
                    <Icon name="log-out" size={17} strokeWidth={1.8} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-actions">
              <Button to="/login" variant="outline" size="sm">
                Login
              </Button>
              <Button to="/signup" variant="brown" size="sm">
                Sign Up
              </Button>
            </div>
          )}

          <button
            ref={hamburgerRef}
            type="button"
            className="hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={24} color="var(--brown-700)" strokeWidth={2} />
          </button>
        </div>
      </div>

      <MobileMenu ref={menuRef} id="mobile-menu" open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
