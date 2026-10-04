import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import { BRAND } from "../../data/site.js";
import "./AuthLayout.css";

/**
 * Auth shell — reproduces the Figma `Authentication content` frame:
 * two-column layout (450×560 welcome visual + form card), 70px gap,
 * 100px side padding, #442808 rounded 20px visual.
 */
export default function AuthLayout({ eyebrow, title, description, children, footer, aside = true }) {
  return (
    <section className="auth">
      <div className="auth__inner">
        {aside && (
          <div className="auth__visual">
            <img
              src="/images/coffee-shop-image-34a2f60b.png"
              alt=""
              aria-hidden="true"
              className="auth__visual-image"
            />
            <span className="auth__visual-scrim" aria-hidden="true" />
            <p className="auth__visual-eyebrow">YOUR KAPRESCO SPACE</p>
            <div className="auth__visual-copy">
              <p className="auth__visual-title">{BRAND.tagline}</p>
              <p className="auth__visual-body">
                Fresh local brews and a cozy place to pause, connect, and feel at home.
              </p>
              <ul className="auth__visual-points">
                <li>
                  <Icon name="pin" size={17} color="var(--gold-400)" strokeWidth={1.8} />
                  {BRAND.address}
                </li>
                <li>
                  <Icon name="clock" size={17} color="var(--gold-400)" strokeWidth={1.8} />
                  Open until 9:00 PM
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="auth__panel">
          <div className="auth__card">
            <Link to="/" className="auth__back">
              <Icon name="arrow-right" size={16} color="var(--brown-600)" strokeWidth={1.9} />
              Back to Kapresco
            </Link>

            {eyebrow && <p className="auth__eyebrow">{eyebrow}</p>}
            <h1 className="auth__title">{title}</h1>
            {description && <p className="auth__description">{description}</p>}

            <div className="auth__body">{children}</div>

            {footer && <div className="auth__footer">{footer}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
