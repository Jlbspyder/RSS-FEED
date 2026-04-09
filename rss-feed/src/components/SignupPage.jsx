import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SignupPage({ onBack, onShowLogin }) {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await register(firstName, lastName, email, password);
    } catch (err) {
      setError(err.message || "Failed to create account");
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
          <h1 className="font-semibold">Create account</h1>
          <p className="muted">Start building your reading dashboard.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              <span>FIRST NAME</span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Debo"
                required
              />
            </label>
            <label>
              <span>LAST NAME</span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
                required
              />
            </label>
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
                placeholder="Create a password"
                required
              />
            </label>

            <label>
              <span>CONFIRM PASSWORD</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
              />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <button
              type="submit"
              className="button button-primary auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <button type="button" className="text-blue-500 hover:underline" onClick={onShowLogin}>
              Log in
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
