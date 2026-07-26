"use client";

import { FormEvent, useState } from "react";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Login services will be connected in the next phase.");
  }

  return (
    <main className="login-shell">
      <section className="brand-panel" aria-label="TigerOne platform overview">
        <div className="brand-overlay" />
        <div className="brand-content">
          <img className="brand-logo" src="/tigerone-logo.png" alt="TigerOne" />
          <div className="brand-message">
            <span className="eyebrow">Business command centre</span>
            <h1>One system. Total control.</h1>
            <p>
              Billing, inventory and business reports—connected in one
              dependable workspace built for your daily operations.
            </p>
          </div>
          <div className="feature-row" aria-label="Platform modules">
            <div><span className="feature-icon">₹</span><strong>Billing</strong><small>Fast, accurate invoices</small></div>
            <div><span className="feature-icon">▦</span><strong>Inventory</strong><small>Live stock visibility</small></div>
            <div><span className="feature-icon">↗</span><strong>Reports</strong><small>Clear business insights</small></div>
          </div>
        </div>
      </section>

      <section className="form-panel">
        <div className="mobile-brand"><img src="/tigerone-logo.png" alt="TigerOne" /></div>
        <div className="login-card">
          <div className="form-heading">
            <span className="status-dot" aria-hidden="true" />
            <span>Secure workspace</span>
          </div>
          <h2>Welcome back</h2>
          <p className="form-intro">Sign in to manage your business operations.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <span aria-hidden="true">@</span>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
            </div>
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <a href="#forgot-password">Forgot password?</a>
            </div>
            <div className="input-wrap">
              <span aria-hidden="true">●</span>
              <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required />
              <button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <label className="remember-option">
              <input type="checkbox" name="remember" />
              <span>Keep me signed in on this device</span>
            </label>
            <button className="login-button" type="submit">
              Sign in to TigerOne <span aria-hidden="true">→</span>
            </button>
            {message && <p className="form-message" role="status">{message}</p>}
          </form>
          <p className="support-copy">
            Need help accessing your account? <a href="mailto:support@tigerone.in">Contact support</a>
          </p>
        </div>
        <footer>
          <span>© {new Date().getFullYear()} TigerOne.in</span>
          <span>Secure business systems</span>
        </footer>
      </section>
    </main>
  );
}
