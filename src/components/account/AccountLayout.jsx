import { NavLink, Outlet } from "react-router-dom";
import Icon from "../Icon.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import "./AccountLayout.css";

const LINKS = [
  { to: "/account", label: "Overview", icon: "user", end: true },
  { to: "/account/settings", label: "Settings", icon: "settings" },
  { to: "/account/addresses", label: "Addresses", icon: "pin" },
  { to: "/account/payment-methods", label: "Payment Methods", icon: "tag" },
  { to: "/orders", label: "Orders", icon: "package" },
  { to: "/favorites", label: "Favorites", icon: "heart" },
];

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const { count } = useFavorites();

  return (
    <section className="account-page">
      <div className="container account-page__layout">
        <aside className="account-sidebar">
          <div className="account-sidebar__user">
            <span className="account-sidebar__avatar" aria-hidden="true">
              <Icon name="user" size={26} color="var(--brown-700)" strokeWidth={1.8} />
            </span>
            <p className="account-sidebar__name">{user?.name ?? "Guest"}</p>
            <p className="account-sidebar__email">{user?.email ?? "Not signed in"}</p>
          </div>

          <nav aria-label="Account">
            <ul className="account-sidebar__list">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) => `account-sidebar__link${isActive ? " is-active" : ""}`}
                  >
                    <Icon name={link.icon} size={18} strokeWidth={1.7} />
                    {link.label}
                    {link.to === "/favorites" && count > 0 && (
                      <span className="account-sidebar__count">{count}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button type="button" className="account-sidebar__logout" onClick={logout}>
            <Icon name="log-out" size={18} strokeWidth={1.8} />
            Logout
          </button>
        </aside>

        <div className="account-page__content">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
