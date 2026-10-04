import Icon from "../Icon.jsx";
import "./Rating.css";

/** Star rating — Figma draws five #ECBD63 stars at 18×18 with 4px gaps. */
export default function Rating({ value = 5, max = 5, size = 18, showValue = false }) {
  const rounded = Math.round(value);

  return (
    <div className="rating" role="img" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Icon
          key={i}
          name="star"
          size={size}
          color={i < rounded ? "var(--gold-500)" : "var(--border-subtle)"}
          className={i < rounded ? "rating__star is-filled" : "rating__star"}
        />
      ))}
      {showValue && <span className="rating__value">{value.toFixed(1)}</span>}
    </div>
  );
}
