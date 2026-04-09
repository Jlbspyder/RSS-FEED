import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onBack, onShowSignup }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setError(err.message || "Incorrect username or password, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="auth-shell">
        <div className="auth-card">
          <div className="w-full text-blue-500 font-bold text-center">
            Frontpage
          </div>
          <button
            className="button button-primary auth-back"
            onClick={onBack}
            type="button"
          >
            ← Back
          </button>
          <h1 className="font-semibold">Log in</h1>
          <p className="muted">
            Welcome back. Continue reading your feeds without the noise.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              <span>EMAIL</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              <span>PASSWORD</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <button
              type="submit"
              className="button button-primary auth-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account?{" "}
            <button type="button" className="text-blue-500 hover:underline" onClick={onShowSignup}>
              Sign up
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
