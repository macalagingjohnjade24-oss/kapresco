import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import Button from "../../components/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Icon from "../../components/Icon.jsx";
import { authService } from "../../services/authService.js";
import "./auth.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [mismatch, setMismatch] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.confirmPassword && form.confirmPassword !== form.password) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    setError(null);
    setBusy(true);
    try {
      // Requires the recovery session from the emailed reset link.
      await authService.updatePassword(form.password);
      setDone(true);
      window.setTimeout(() => navigate("/login", { replace: true }), 2200);
    } catch (err) {
      setError(err?.message ?? "We couldn’t update your password. Please open the reset link again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <AuthLayout eyebrow="ALL SET" title="Password updated" description="Taking you back to login…">
        <div className="auth-panel">
          <span className="auth-panel__badge">
            <Icon name="check" size={36} color="var(--success)" strokeWidth={2.4} />
          </span>
          <p className="auth-panel__note">
            Your password is saved securely — you can use it the next time you log in.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="PASSWORD HELP"
      title="Set a new password"
      description="Choose something you’ll remember. Tip: three unrelated words beat a squiggly line."
      footer={
        <>
          Changed your mind? <Link to="/login">Back to login</Link>
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
          label="New password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          icon="lock"
          value={form.password}
          onChange={update}
        />

        <Input
          label="Confirm new password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Type it again"
          icon="lock"
          error={mismatch ? "Passwords don’t match yet" : undefined}
          value={form.confirmPassword}
          onChange={update}
        />

        <Button type="submit" variant="brown" size="lg" fullWidth disabled={busy}>
          {busy ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
