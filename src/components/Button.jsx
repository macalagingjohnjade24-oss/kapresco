import { Link } from "react-router-dom";
import "./Button.css";

/**
 * Button — reproduces the Figma button component.
 *
 * Figma spec: height 50px, radius 999px, 1.5px border, horizontal padding 24px,
 * label Albert Sans 700 16px / 19.2px, gap 10px when an icon is present.
 *
 * Variants map to the fills found in the design:
 *   gold     → #F9C06A bg / #F9C06A border / #693B23 label   (hero + product cards)
 *   brown    → #693B23 bg / #693B23 border / #FFFFFF label   (Login, Sign Up)
 *   white    → #FFFFFF bg / #FFFFFF border / #693B23 label   (Visit Kapresco)
 *   outline  → transparent bg / #693B23 border / #693B23 label (header Login)
 *   ghost    → transparent, brand-brown text
 */
const VARIANTS = {
  gold: "btn--gold",
  brown: "btn--brown",
  white: "btn--white",
  outline: "btn--outline",
  ghost: "btn--ghost",
  danger: "btn--danger",
};

const SIZES = {
  md: "btn--md", // 50px — Figma default
  sm: "btn--sm", // 40px — header auth actions
  lg: "btn--lg",
};

export default function Button({
  children,
  variant = "gold",
  size = "md",
  to,
  href,
  icon,
  iconLeft,
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}) {
  const classes = ["btn", VARIANTS[variant] ?? VARIANTS.gold, SIZES[size], fullWidth ? "btn--block" : "", className]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {iconLeft}
      <span className="btn__label">{children}</span>
      {icon}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {inner}
    </button>
  );
}
