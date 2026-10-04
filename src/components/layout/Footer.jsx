import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import { BRAND, FOOTER_COLUMNS } from "../../data/site.js";
import "./Footer.css";

const SOCIALS = [
  { name: "facebook", label: "Kapresco on Facebook" },
  { name: "instagram", label: "Kapresco on Instagram" },
  { name: "tiktok", label: "Kapresco on TikTok" },
];

// Resolved once at module load so the footer stays a pure render.
const COPYRIGHT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Figma: "Coffee texture" raster at 20% opacity */}
      <img
        src="/images/fotter-image-b6976bb1.png"
        alt=""
        aria-hidden="true"
        className="site-footer__texture"
        loading="lazy"
      />

      <div className="site-footer__inner">
        <div className="site-footer__content">
          <div className="site-footer__brand">
            <p className="site-footer__wordmark">{BRAND.wordmark}</p>
            <p className="site-footer__tagline">{BRAND.tagline}</p>
            <p className="site-footer__description">{BRAND.description}</p>
            <ul className="site-footer__socials">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a href="#" className="site-footer__social" aria-label={s.label}>
                    <Icon name={s.name} size={18} color="#fff" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__columns">
            {FOOTER_COLUMNS.map((col) => (
              <nav key={col.heading} className="site-footer__column" aria-label={col.heading}>
                <h2 className="site-footer__heading">{col.heading}</h2>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <a href={link.href} className="site-footer__link">
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.to} className="site-footer__link">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="site-footer__base">
          <p>© {COPYRIGHT_YEAR} Kapresco. All rights reserved.</p>
          <p>{BRAND.fullAddress}</p>
        </div>
      </div>
    </footer>
  );
}
