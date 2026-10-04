import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import { NAV_LINKS } from "../data/site.js";
import "./Static.css";

export default function NotFound() {
  return (
    <section className="section not-found">
      <div className="container">
        <div className="not-found__inner">
          <p className="not-found__code" aria-hidden="true">
            404
          </p>
          <h1 className="not-found__title">This cup doesn’t exist</h1>
          <p className="not-found__body">
            We couldn’t find that page — but there’s plenty to sip. Let’s get you back to something warm.
          </p>

          <div className="not-found__actions">
            <Button to="/" variant="gold" size="lg">
              Back Home
            </Button>
            <Button to="/menu" variant="outline" size="lg">
              Explore Our Menu
            </Button>
          </div>

          <nav className="not-found__links" aria-label="Suggested pages">
            <p>Or try one of these:</p>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>
                    {link.label}
                    <Icon name="chevron-right" size={16} color="currentColor" strokeWidth={1.8} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
