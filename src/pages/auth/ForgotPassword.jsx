import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import Button from "../../components/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Icon from "../../components/Icon.jsx";
import { BRAND } from "../../data/site.js";
import { authService } from "../../services/authService.js";
import "./auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err?.message ?? "We couldn’t send the reset link. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        eyebrow="CHECK YOUR INBOX"
        title="Reset link sent"
        description={
          email
            ? `If an account exists for ${email}, we’ve sent a password reset link. It usually arrives within a minute.`
            : "If an account exists for that address, we’ve sent a password reset link."
        }
        footer={
          <>
            Didn’t get it? <a href={`mailto:${BRAND.email}`}>Email us directly</a>
          </>
        }
      >
        <div className="auth-panel">
          <span className="auth-panel__badge">
            <Icon name="mail" size={34} color="var(--success)" strokeWidth={1.7} />
          </span>
          <p className="auth-panel__note">
            The link is single-use and expires after a little while. Nothing arrived? Peek in your spam folder or{" "}
            <a href={`mailto:${BRAND.email}`}>email us</a> and we’ll sort it out.
          </p>
          <div className="auth-panel__actions">
            <Button to="/reset-password" variant="brown" size="lg" fullWidth>
              Set a new password
            </Button>
            <Button to="/login" variant="outline" fullWidth>
              Back to login
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="PASSWORD HELP"
      title="Forgot your password?"
      description="No worries — enter your email and we’ll send you a link to set a new one."
      footer={
        <>
          Remembered it? <Link to="/login">Back to login</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="auth-alert auth-alert--error" role="alert">
            <Icon name="alert-circle" size={17} color="var(--error)" strokeWidth={1.8} />
            {error}
          </p>
        )}

        <Input
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon="mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" variant="brown" size="lg" fullWidth disabled={busy}>
          {busy ? "Sending…" : "Send reset link"}
        </Button>

        <p className="auth-form__demo">
          <Icon name="info" size={16} color="var(--text-muted)" strokeWidth={1.8} />
          We’ll email a secure link to set a new password — nothing else.
        </p>
      </form>
    </AuthLayout>
  );
}
