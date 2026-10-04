import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import Button from "../../components/Button.jsx";
import Input, { Checkbox } from "../../components/ui/Input.jsx";
import Icon from "../../components/Icon.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

export default function Login() {
  const { login, busy } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [status, setStatus] = useState(null);

  const redirectTo = location.state?.from?.pathname ?? "/";

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      await login(form);
      // Send people back where they came from — or to the cart if that was next.
      navigate(count > 0 && redirectTo === "/" ? "/checkout" : redirectTo, { replace: true });
    } catch (err) {
      setStatus({ tone: "error", text: err?.message ?? "We couldn’t log you in. Please try again." });
    }
  };

  return (
    <AuthLayout
      eyebrow="WELCOME BACK"
      title="Login to Kapresco"
      description="Pick up right where you left off — your favorites, orders, and saved details are waiting."
      footer={
        <>
          Don’t have an account yet? <Link to="/signup">Sign up</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {status && (
          <p className={`auth-alert auth-alert--${status.tone}`} role={status.tone === "error" ? "alert" : "status"}>
            <Icon
              name={status.tone === "error" ? "alert-circle" : "check-circle"}
              size={17}
              color={status.tone === "error" ? "var(--error)" : "var(--success)"}
              strokeWidth={1.8}
            />
            {status.text}
          </p>
        )}

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
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          icon="lock"
          value={form.password}
          onChange={update}
        />

        <div className="auth-form__row">
          <Checkbox label="Keep me logged in" name="remember" checked={form.remember} onChange={update} />
          <Link to="/forgot-password" className="auth-form__link">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="brown" size="lg" fullWidth disabled={busy}>
          {busy ? "Logging in…" : "Login"}
        </Button>

        <p className="auth-form__demo">
          <Icon name="info" size={16} color="var(--text-muted)" strokeWidth={1.8} />
          Use the email and password you signed up with — accounts are real and details are never shared.
        </p>
      </form>
    </AuthLayout>
  );
}
