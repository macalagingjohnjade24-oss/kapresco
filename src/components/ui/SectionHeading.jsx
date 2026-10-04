import "./SectionHeading.css";

/**
 * Section heading — the eyebrow / title / description trio that repeats across
 * every homepage section. Figma: vertical stack, gap 10, centered.
 */
export default function SectionHeading({ eyebrow, title, description, align = "center", as: Tag = "h2", id }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow && <p className="section-heading__eyebrow">{eyebrow}</p>}
      <Tag className="section-heading__title" id={id}>
        {title}
      </Tag>
      {description && <p className="section-heading__description">{description}</p>}
    </div>
  );
}
