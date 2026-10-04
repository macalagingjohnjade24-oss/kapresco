/**
 * Inline SVG icons recreating the vectors used in the Figma design.
 *
 * The Figma strokes are preserved: `map-pin`, `clock` and `wifi` use
 * #F9C06A @ 1.8, feature icons use #693B23 @ 1.7, `star` uses #ECBD63,
 * `chevron-down` uses #693B23 @ 2, `lock` uses #707070 @ 1.6.
 */

const PATHS = {
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9.2a14 14 0 0 1 19 0" />
      <path d="M6 12.6a9 9 0 0 1 12 0" />
      <path d="M9.4 16a4.2 4.2 0 0 1 5.2 0" />
      <circle cx="12" cy="19.3" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  bean: (
    <>
      <path d="M17.5 3.5c3 3 3.4 8.2.9 11.6-2.6 3.5-7.8 4.6-11.3 1.6S3 8.2 5.6 4.7C8.3 1.1 14.5.5 17.5 3.5Z" />
      <path d="M6.2 18.4C8.8 14.2 12.4 10.6 16.6 8.1" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c0-8 5-14 16-15 .5 9.5-4 15-11 15H4Z" />
      <path d="M9 15c1.8-3.2 4.2-5.6 7.5-7.4" />
    </>
  ),
  tag: (
    <>
      <path d="M20.6 12.6 12.5 20.7a2 2 0 0 1-2.8 0l-6.4-6.4a2 2 0 0 1-.6-1.4V5a2 2 0 0 1 2-2h7.9a2 2 0 0 1 1.4.6l6.6 6.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="8.5" cy="8.5" r="1.6" />
    </>
  ),
  bolt: <path d="M13.5 2 4 13.5h6.5L10 22l9.5-11.5H13L13.5 2Z" />,
  star: <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z" />,
  "arrow-right": (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  "chevron-down": <path d="m5 8.5 7 7 7-7" />,
  "chevron-right": <path d="m9 5 7 7-7 7" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4.5 4.5" />
    </>
  ),
  "log-out": (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 16 5-4-5-4" />
      <path d="M21 12H9" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="m5 5 14 14M19 5 5 19" />,
  cart: (
    <>
      <path d="M2.5 3h2.2l2.4 12.2a1.8 1.8 0 0 0 1.8 1.4h8.7a1.8 1.8 0 0 0 1.8-1.4L21 7H6" />
      <circle cx="9.5" cy="20" r="1.6" />
      <circle cx="17.5" cy="20" r="1.6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  heart: <path d="M12 20.3 4.7 13a4.6 4.6 0 0 1 6.5-6.5l.8.8.8-.8A4.6 4.6 0 1 1 19.3 13Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: (
    <>
      <path d="M3.5 6h17" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M18.5 6 18 20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5.5 6" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "eye-off": (
    <>
      <path d="M10.6 6.1A9.9 9.9 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.9" />
      <path d="M6.3 7.8A16.8 16.8 0 0 0 2 12s3.6 6 10 6a9.7 9.7 0 0 0 4.3-1" />
      <path d="m3 3 18 18" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  check: <path d="m4 12.5 5 5L20 6.5" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="m8 12.2 2.8 2.8L16 9.5" />
    </>
  ),
  "alert-circle": (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 7.5v5.2M12 16.3v.2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 11v5.2M12 7.7v.2" />
    </>
  ),
  "map-pin-alt": (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  phone: <path d="M21 16.9v2.5a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3-8.6A2 2 0 0 1 3.3 2h2.5a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L7 9.9a15.7 15.7 0 0 0 6 6l1.2-1a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />,
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 6.5L21 6" />
    </>
  ),
  facebook: <path d="M14.5 8.5H17V5h-2.5A4.5 4.5 0 0 0 10 9.5V12H7.5v3.5H10V22h3.5v-6.5H16l.5-3.5h-3V9.5a1 1 0 0 1 1-1Z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: <path d="M16.5 3h-2.7v11.4a2.4 2.4 0 1 1-1.9-2.4v-2.7a5.1 5.1 0 1 0 4.6 5.1V8.6a6 6 0 0 0 3.5 1.1V7a3.4 3.4 0 0 1-3.5-4Z" />,
  package: (
    <>
      <path d="m12 2.5 8.5 4.6v9.8L12 21.5 3.5 16.9V7.1Z" />
      <path d="M3.7 7 12 11.6 20.3 7M12 11.6v9.9" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 10h4l3 3v3.5h-7" />
      <circle cx="7" cy="18.5" r="1.8" />
      <circle cx="17" cy="18.5" r="1.8" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
    </>
  ),
};

/** Icons that should read as solid shapes rather than outlines. */
const FILLED = new Set(["star", "bolt", "heart", "facebook", "tiktok", "package"]);

export default function Icon({ name, size = 24, color = "currentColor", strokeWidth, className, ...rest }) {
  const path = PATHS[name];
  if (!path) return null;
  const filled = FILLED.has(name);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill={filled ? color : "none"}
      stroke={filled ? "none" : color}
      strokeWidth={strokeWidth ?? (filled ? 0 : 1.7)}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {path}
    </svg>
  );
}
