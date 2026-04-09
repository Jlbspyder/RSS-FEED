export default function LandingPage({
  onTryGuest,
  onShowLogin,
  onShowSignup,
}) {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="badge">Frontpage</div>
            <h1
              style={{
                fontSize: "clamp(2.3rem, 5vw, 4.5rem)",
                lineHeight: 1.05,
                marginBottom: "1rem",
              }}
            >
              All your favorite feeds, one calm reading dashboard.
            </h1>
            <p
              className="muted"
              style={{ fontSize: "1.1rem", maxWidth: "42rem" }}
            >
              Follow RSS and Atom feeds, organize them by category, catch up on
              what you missed, and read without the noise.
            </p>
            <div className="toolbar gap-2" style={{ marginTop: "1.4rem" }}>
              <button className="button button-primary" onClick={onTryGuest}>
                Try as Guest
              </button>
              <button className="button font-semibold" onClick={onShowLogin}>
                Log in
              </button>
              <button className="button" onClick={onShowSignup}>
                Sign up
              </button>
            </div>
          </div>

          <div className="hero-card">
            <div
              className="article-card unread"
              style={{ marginBottom: ".85rem" }}
            >
              <div className="meta">Frontend · CSS-Tricks</div>
              <h3>Build a calmer way to read the web</h3>
              <p className="muted">
                Clean cards, keyboard-friendly navigation, and quick catch-up
                views.
              </p>
            </div>
            <div
              className="article-card read"
              style={{ marginBottom: ".85rem" }}
            >
              <div className="meta">AI & ML · Simon Willison's Weblog</div>
              <h3>Daily highlights across all your feeds</h3>
              <p className="muted">
                A product-minded digest that helps users process content faster.
              </p>
            </div>
            <div className="article-card unread">
              <div className="meta">Backend & DevOps · Vercel Blog</div>
              <h3>Guest mode that feels like the real product</h3>
              <p className="muted">
                No empty state wall. Real categories. Real sources. Real flow.
              </p>
            </div>
          </div>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Organize</h3>
            <p className="muted">
              Group feeds into categories and scan everything in one place.
            </p>
          </div>
          <div className="feature-card">
            <h3>Catch up</h3>
            <p className="muted">
              Use a digest-style view to quickly see what changed since your
              last visit.
            </p>
          </div>
          <div className="feature-card">
            <h3>Read anywhere</h3>
            <p className="muted">
              Desktop side reader, mobile full-screen reader, and responsive
              layouts.
            </p>
          </div>
          <div className="feature-card">
            <h3>Save what matters</h3>
            <p className="muted">
              Bookmark articles and keep read state under control.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}