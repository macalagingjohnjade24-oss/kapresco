import "./EmptyState.css";
import "./LoadingState.css";

/**
 * Loading placeholder styled exactly like `EmptyState`, so swapping between the
 * loading, empty and error states never shifts the layout.
 */
export default function LoadingState({
  title = "Loading…",
  description,
  label,
}) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <span className="empty-state__icon" aria-hidden="true">
        <span className="loading-spinner" />
      </span>
      <h2 className="empty-state__title">{title}</h2>
      {description && <p className="empty-state__description">{description}</p>}
      {label && <p className="loading-state__label">{label}</p>}
    </div>
  );
}
