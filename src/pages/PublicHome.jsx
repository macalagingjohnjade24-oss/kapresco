import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import ProductCard from "../components/cards/ProductCard.jsx";
import { FeatureCard, TestimonialCard, ExperienceCard } from "../components/cards/MarketingCards.jsx";
import { useAuthGuard } from "../hooks/useAuthGuard.jsx";
import LoginRequiredModal from "../components/ui/LoginRequiredModal.jsx";
import {
  BRAND,
  HERO,
  BESTSELLERS_SECTION,
  WHY_SECTION,
  EXPERIENCE_SECTION,
  TESTIMONIALS_SECTION,
  FINAL_CTA,
  BESTSELLER_IDS,
} from "../data/site.js";
import { useProducts } from "../context/ProductsContext.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import "./PublicHome.css";

export default function PublicHome() {
  const { requireAuth, modalProps } = useAuthGuard();
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const bestsellers = BESTSELLER_IDS.map((id) => products.find((p) => p.id === id)).filter(Boolean);

  return (
    <>
      {/* ---- Hero — Figma 1366×670, pad 116/100/80/100 ---- */}
      <section className="hero">
        <img src={HERO.image} alt="" aria-hidden="true" className="hero__image" />
        <span className="hero__scrim" aria-hidden="true" />

        <div className="hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">{HERO.eyebrow}</p>
            <h1 className="hero__title">{HERO.title}</h1>
            <p className="hero__body">{HERO.body}</p>

            <div className="hero__actions">
              <Button
                variant="gold"
                size="lg"
                type="button"
                onClick={() => requireAuth(() => navigate(HERO.primaryCta.to))}
              >
                {HERO.primaryCta.label}
              </Button>
              <Button to={HERO.secondaryCta.to} variant="white" size="lg">
                {HERO.secondaryCta.label}
              </Button>
            </div>
          </div>

          <ul className="hero__details">
            {HERO.details.map((d) => (
              <li key={d.label} className="hero__detail">
                <Icon name={d.icon} size={18} color="var(--gold-400)" strokeWidth={1.8} />
                {d.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Featured best sellers — Figma 1366×893, pad 88/93, gap 42 ---- */}
      <section className="section section--bestsellers">
        <div className="container container--wide-narrow">
          <SectionHeading
            eyebrow={BESTSELLERS_SECTION.eyebrow}
            title={BESTSELLERS_SECTION.title}
            description={BESTSELLERS_SECTION.description}
          />

          <div className="grid grid--4">
            {productsLoading ? (
              <LoadingState title="Brewing the menu…" description="Loading our best sellers." />
            ) : (
              bestsellers.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>

          <Link to={BESTSELLERS_SECTION.linkTo} className="inline-link">
            {BESTSELLERS_SECTION.linkLabel}
            <Icon name="arrow-right" size={18} color="var(--brown-700)" strokeWidth={1.9} />
          </Link>
        </div>
      </section>

      {/* ---- Why choose Kapresco — Figma 1366×608, #F7E9D7 ---- */}
      <section className="section section--why">
        <div className="container container--wide-narrow">
          <SectionHeading
            eyebrow={WHY_SECTION.eyebrow}
            title={WHY_SECTION.title}
            description={WHY_SECTION.description}
          />

          <div className="grid grid--4 grid--features">
            {WHY_SECTION.features.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Kapresco experience — Figma 1366×1012, 3×2 mosaic, gap 18 ---- */}
      <section className="section section--experience">
        <div className="container">
          <SectionHeading
            eyebrow={EXPERIENCE_SECTION.eyebrow}
            title={EXPERIENCE_SECTION.title}
            description={EXPERIENCE_SECTION.description}
          />

          <div className="grid grid--3 grid--experience">
            {EXPERIENCE_SECTION.audiences.map((a) => (
              <ExperienceCard key={a.label} label={a.label} caption={a.caption} image={a.image} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Testimonials — Figma 1366×571, #FFF9F1, 3 columns ---- */}
      <section className="section section--testimonials">
        <div className="container">
          <SectionHeading
            eyebrow={TESTIMONIALS_SECTION.eyebrow}
            title={TESTIMONIALS_SECTION.title}
            description={TESTIMONIALS_SECTION.description}
          />

          <div className="grid grid--3 grid--testimonials">
            {TESTIMONIALS_SECTION.items.map((t) => (
              <TestimonialCard key={t.name} quote={t.quote} name={t.name} rating={t.rating} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Final call to action — Figma 1366×520, scrim #3A1B08 @77% ---- */}
      <section className="final-cta">
        <img src={FINAL_CTA.image} alt="" aria-hidden="true" className="final-cta__image" />
        <span className="final-cta__scrim" aria-hidden="true" />

        <div className="final-cta__inner">
          <div className="final-cta__copy">
            <h2 className="final-cta__title">{FINAL_CTA.title}</h2>
            <p className="final-cta__description">{FINAL_CTA.description}</p>

            <div className="final-cta__actions">
              <Button
                variant="gold"
                size="lg"
                type="button"
                onClick={() => requireAuth(() => navigate(FINAL_CTA.actions[0].to))}
              >
                {FINAL_CTA.actions[0].label}
              </Button>
              <Button
                variant="white"
                size="lg"
                type="button"
                onClick={() => requireAuth(() => navigate(FINAL_CTA.actions[1].to))}
              >
                {FINAL_CTA.actions[1].label}
              </Button>
            </div>
          </div>

          <div className="visit-card">
            <p className="visit-card__heading">{FINAL_CTA.visitCard.heading}</p>
            <p className="visit-card__detail">
              <Icon name="pin" size={20} color="var(--brown-700)" strokeWidth={1.8} />
              {BRAND.fullAddress}
            </p>
            <p className="visit-card__detail">
              <Icon name="clock" size={20} color="var(--brown-700)" strokeWidth={1.8} />
              Mon–Sat 8:00 AM–9:00 PM · Sun 10:00 AM–7:00 PM
            </p>
          </div>
        </div>
      </section>

      <LoginRequiredModal {...modalProps} />
    </>
  );
}
