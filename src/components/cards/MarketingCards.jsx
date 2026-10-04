import Icon from "../Icon.jsx";
import Rating from "../ui/Rating.jsx";
import "./MarketingCards.css";

/** Feature card — Figma: #FFFEFC, 1px #E6CDA9, r12, padding 28, gap 18,
 *  64px white circle icon, 22px/800 title, 15px description. */
export function FeatureCard({ icon, title, description }) {
  return (
    <article className="feature-card">
      <span className="feature-card__icon">
        <Icon name={icon} size={32} color="var(--brown-700)" strokeWidth={1.7} />
      </span>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
    </article>
  );
}

/** Testimonial card — Figma: #FFFFFF, 1px #E6CDA9, r12, padding 28,
 *  SPACE_BETWEEN: rating / quote / customer. */
export function TestimonialCard({ quote, name, rating = 5 }) {
  return (
    <figure className="testimonial-card">
      <Rating value={rating} />
      <blockquote className="testimonial-card__quote">{quote}</blockquote>
      <figcaption className="testimonial-card__customer">
        <span className="testimonial-card__avatar" aria-hidden="true">
          {name.charAt(0)}
        </span>
        <span className="testimonial-card__name">{name}</span>
      </figcaption>
    </figure>
  );
}

/** Experience card — Figma: 376×310 image with gradient overlay, r12,
 *  pill audience label top-left, 20px/700 white caption at the bottom. */
export function ExperienceCard({ label, caption, image }) {
  return (
    <article className="experience-card">
      <img src={image} alt="" loading="lazy" className="experience-card__image" />
      <span className="experience-card__overlay" aria-hidden="true" />
      <span className="experience-card__label">{label}</span>
      <p className="experience-card__caption">{caption}</p>
    </article>
  );
}

/** Core Value card — Figma `About Us` (Groups 32/58/59/60):
 *  280×324, fill #FFF9F1, 1px #F9C06A @42% stroke, square corners, centred
 *  column of icon / 26px-700 title / 20px-24 body. The icon is decorative,
 *  so it is hidden from assistive tech. */
export function ValueCard({ icon, iconSize, title, description }) {
  return (
    <article className="value-card">
      <span className="value-card__icon" aria-hidden="true">
        <img src={icon} alt="" width={iconSize} height={iconSize} loading="lazy" />
      </span>
      <h3 className="value-card__title">{title}</h3>
      <p className="value-card__description">{description}</p>
    </article>
  );
}
