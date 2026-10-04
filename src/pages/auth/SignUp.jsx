import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import Button from "../../components/Button.jsx";
import Input, { Checkbox } from "../../components/ui/Input.jsx";
import Icon from "../../components/Icon.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import "./auth.css";

const EMPTY = { firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", agreed: true };

/** Cheap heuristic so the meter responds as the customer types (§19). */
function scorePassword(value) {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value) && /[^\w\s]/.test(value)) score++;
  return Math.min(score, 4);
}

const STRENGTH = [
  { label: "Add a password to see how strong it is", className: "" },
  { label: "Weak — add a few more characters", className: "is-on-weak" },
  { label: "Getting there — mix in some numbers", className: "is-on-medium" },
  { label: "Good — a few more symbols would help", className: "is-on-medium" },
  { label: "Strong password", className: "is-on-strong" },
];

export default function SignUp() {
  const { register, busy } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [mismatch, setMismatch] = useState(false);
  const [status, setStatus] = useState(null);
  const [confirmationEmail, setConfirmationEmail] = useState(null);

  const update = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const strength = scorePassword(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only confirmation is surfaced — nothing blocks an incomplete form (§7).
    if (form.confirmPassword && form.confirmPassword !== form.password) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    setStatus(null);
    try {
      const result = await register(form);
      if (result?.needsConfirmation) {
        // Email confirmation is on in the project: no session yet, so we
        // can't enter the app — tell the customer to verify first.
        setConfirmationEmail(result.email);
        return;
      }
      navigate("/account-created", { replace: true });
    } catch (err) {
      setStatus({ tone: "error", text: err?.message ?? "We couldn’t create your account. Please try again." });
    }
  };

  return (
    <AuthLayout
      eyebrow="JOIN THE KAPRESCO FAMILY"
      title="Create your account"
      description="Save your favorites, track your orders, and check out faster next time you’re in a chill mood."
      footer={
        <>
          Already have an account? <Link to="/login">Login</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {confirmationEmail ? (
          <p className="auth-alert auth-alert--success" role="status">
            <Icon name="mail" size={17} color="var(--success)" strokeWidth={1.8} />
            One more step — we sent a confirmation link to {confirmationEmail}. Open it, then log in.
          </p>
        ) : (
          status && (
            <p className="auth-alert auth-alert--error" role="alert">
              <Icon name="alert-circle" size={17} color="var(--error)" strokeWidth={1.8} />
              {status.text}
            </p>
          )
        )}

        <div className="form-grid">
          <Input
            label="First name"
            name="firstName"
            autoComplete="given-name"
            placeholder="Andrea"
            value={form.firstName}
            onChange={update}
          />
          <Input
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            placeholder="Mendoza"
            value={form.lastName}
            onChange={update}
          />
        </div>

        <Input
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon="mail"
          value={form.email}
          onChange={update}
        />

        <Input
          label="Phone number"
          type="tel"
          name="phone"
          autoComplete="tel"
          optional
          placeholder="0912 345 6789"
          icon="phone"
          value={form.phone}
          onChange={update}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          icon="lock"
          value={form.password}
          onChange={update}
        />

        <div className="strength" aria-live="polite">
          <div className="strength__bars" aria-hidden="true">
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className={`strength__bar${n <= strength ? ` ${STRENGTH[strength].className}` : ""}`}
              />
            ))}
          </div>
          <p className="strength__label">{STRENGTH[strength].label}</p>
        </div>

        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Type it again"
          icon="lock"
          error={mismatch ? "Passwords don’t match yet" : undefined}
          value={form.confirmPassword}
          onChange={update}
        />

        <Checkbox
          label={
            <>
              I agree to the <Link to="/terms">Terms and Policies</Link> and the <Link to="/terms">Privacy Policy</Link>.
            </>
          }
          name="agreed"
          checked={form.agreed}
          onChange={update}
        />

        <Button type="submit" variant="brown" size="lg" fullWidth disabled={busy}>
          {busy ? "Creating your account…" : "Sign Up"}
        </Button>

        <p className="auth-form__demo">
          <Icon name="info" size={16} color="var(--text-muted)" strokeWidth={1.8} />
          Your details stay in your Kapresco account — we never share them.
        </p>
      </form>
    </AuthLayout>
  );
}
