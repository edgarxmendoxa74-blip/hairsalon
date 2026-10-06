import React, { useState } from "react";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";

const friendlyError = (error) => {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("invalid login")) return "Incorrect email or password.";
  if (msg.includes("email not confirmed")) return "This account's email is not confirmed yet. Confirm it in Supabase.";
  if (msg.includes("failed to fetch") || msg.includes("network")) return "Cannot reach the server. Check your internet connection.";
  return error?.message || "Unable to sign in. Please try again.";
};

const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    setSubmitting(false);
    if (err) setError(friendlyError(err));
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit} noValidate={false}>
        <div className="login-brand">
          <div
            className="login-logo"
            role="img"
            aria-label="Fix Salon logo"
            style={{ backgroundImage: "url('/fix-salon-logo.jpg')" }}
          />
          <h1 className="login-title">Fix Salon</h1>
          <p className="login-tagline">your hair specialist</p>
        </div>

        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            className="form-control"
            placeholder="you@example.com"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <div className="password-field">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="login-error" role="alert">
            Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.
          </div>
        )}
        {error && (
          <div className="login-error" role="alert">{error}</div>
        )}

        <button type="submit" className="btn-primary login-submit" disabled={submitting || !isSupabaseConfigured}>
          {submitting ? <Loader2 size={18} className="spin" /> : <LogIn size={18} />}
          {submitting ? "Signing in…" : "Sign In"}
        </button>

        <p className="login-hint">Access is limited to authorized staff.</p>
      </form>
    </div>
  );
};

export default Login;
