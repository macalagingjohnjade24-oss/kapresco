import Button from "../Button.jsx";
import Icon from "../Icon.jsx";
import "./EmptyState.css";

/** Empty-state block used by cart, orders, favorites and search results. */
export default function EmptyState({ icon = "package", title, description, actionLabel, actionTo, onAction, secondaryLabel, secondaryTo }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        <Icon name={icon} size={34} color="var(--brown-600)" strokeWidth={1.6} />
      </span>
      <h2 className="empty-state__title">{title}</h2>
      {description && <p className="empty-state__description">{description}</p>}
      <div className="empty-state__actions">
        {actionLabel &&
          (actionTo ? (
            <Button to={actionTo} variant="gold">
              {actionLabel}
            </Button>
          ) : (
            <Button variant="gold" onClick={onAction}>
              {actionLabel}
            </Button>
          ))}
        {secondaryLabel && (
          <Button to={secondaryTo} variant="outline">
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
