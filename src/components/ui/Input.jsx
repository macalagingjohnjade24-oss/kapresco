import { useId, useState } from "react";
import Icon from "../Icon.jsx";
import "./Input.css";

/**
 * Form field — Figma `Kapresco input / Single line`:
 * label Albert Sans 600 14px, input 52px tall, radius 8,
 * 1px #E6CDA9 border, 16px horizontal padding.
 */
export default function Input({
  label,
  type = "text",
  hint,
  error,
  optional,
  icon,
  className = "",
  id: providedId,
  ...rest
}) {
  const autoId = useId();
  const id = providedId ?? autoId;
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && reveal ? "text" : type;

  return (
    <div className={`field${error ? " field--error" : ""}${className ? ` ${className}` : ""}`}>
      {label && (
        <div className="field__label-row">
          <label className="field__label" htmlFor={id}>
            {label}
            {optional && <span className="field__optional">Optional</span>}
          </label>
          {hint &&
            (typeof hint === "string" ? <span className="field__hint">{hint}</span> : hint)}
        </div>
      )}

      <div className="field__control">
        {icon && (
          <span className="field__icon" aria-hidden="true">
            <Icon name={icon} size={18} color="var(--text-muted)" strokeWidth={1.7} />
          </span>
        )}
        <input
          id={id}
          type={inputType}
          className="field__input"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? "Hide password" : "Show password"}
            aria-pressed={reveal}
          >
            <Icon name={reveal ? "eye-off" : "eye"} size={19} color="var(--text-muted)" strokeWidth={1.7} />
          </button>
        )}
      </div>

      {error && (
        <p className="field__error" id={`${id}-error`}>
          <Icon name="alert-circle" size={15} color="var(--error)" strokeWidth={1.9} />
          {error}
        </p>
      )}
    </div>
  );
}

/** Checkbox row — Figma uses a 20px control with a 10px gap to its label. */
export function Checkbox({ label, className = "", ...rest }) {
  const id = useId();
  return (
    <div className={`checkbox${className ? ` ${className}` : ""}`}>
      <input type="checkbox" id={id} className="checkbox__input" {...rest} />
      <label htmlFor={id} className="checkbox__label">
        {label}
      </label>
    </div>
  );
}
