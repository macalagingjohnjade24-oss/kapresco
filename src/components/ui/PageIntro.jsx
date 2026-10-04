import "./PageIntro.css";

/**
 * Inner-page hero — the full-bleed image banner used by Menu, About,
 * Contact and the account pages. Figma draws these as a 1366px-wide frame
 * with a dark scrim, a centered gold eyebrow, a large white title and a
 * muted description.
 */
export default function PageIntro({ eyebrow, title, description, image, imageAlt = "", children, tone = "dark" }) {
  return (
    <section className={`page-intro page-intro--${tone}`}>
      {image && (
        <>
          <img src={image} alt={imageAlt} className="page-intro__image" />
          <span className="page-intro__scrim" aria-hidden="true" />
        </>
      )}
      <div className="container page-intro__inner">
        {eyebrow && <p className="page-intro__eyebrow">{eyebrow}</p>}
        <h1 className="page-intro__title">{title}</h1>
        {description && <p className="page-intro__description">{description}</p>}
        {children && <div className="page-intro__actions">{children}</div>}
      </div>
    </section>
  );
}
