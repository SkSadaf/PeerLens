import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function HomePage() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="container container-wide">
      {/* Hero */}
      <div className="card hero hero-split colorful">
        <div>
          <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.15 }}>
            <span className="brand-gradient">PeerLens</span> — your AI research gap copilot
          </h1>
          <p className="muted" style={{ marginTop: 10, fontSize: 18 }}>
            Upload 4–5 papers → detect research gaps → get a publishability estimate
            with clear arguments and next actions.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            {!isAuthenticated ? (
              <Link to="/auth">
                <button className="btn btn-primary btn-lg">Go to Upload</button>
              </Link>
            ) : (
              <>
                <Link to="/upload">
                  <button className="btn btn-primary btn-lg">Go to Upload</button>
                </Link>
                <Link to="/ideas">
                  <button className="btn btn-outline btn-lg">View Ideas</button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-art floaty">
          <img src="/logo.jpeg" className="hero-logo" alt="PeerLens logo" />
        </div>
      </div>

      {/* Why PeerLens (no internals shown) */}
      <section className="band">
        <div className="values-grid">
          <div className="value">
            <div className="value-icon">✨</div>
            <div className="value-title">Actionable gaps</div>
            <div className="muted">Specific, experiment-ready directions.</div>
          </div>
          <div className="value">
            <div className="value-icon">🧩</div>
            <div className="value-title">Clear rationale</div>
            <div className="muted">Strengths, concerns, and trade-offs you can cite.</div>
          </div>
          <div className="value">
            <div className="value-icon">📈</div>
            <div className="value-title">Decision-ready score</div>
            <div className="muted">Publishability estimate to guide next steps.</div>
          </div>
        </div>
      </section>

      {/* How it works (compact, 3 steps) */}
      <section className="section">
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Upload PDFs</h3>
            <p className="muted">Drop 4–5 related papers or choose files. We parse and prep.</p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <h3>Generate gaps</h3>
            <p className="muted">Produce concrete, experiment-ready research directions.</p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>Evaluate & plan</h3>
            <p className="muted">See the score with strengths, concerns, and next actions.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="band band-cta colorful">
        <div className="cta-inner">
          <h2 style={{ margin: 0 }}>Ready to find your next paper?</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            Upload a handful of PDFs and let PeerLens surface the strongest research gaps.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <Link to="/upload">
              <button className="btn btn-primary btn-lg">Start Upload</button>
            </Link>
            <Link to="/ideas">
              <button className="btn btn-outline btn-lg">See Generated Ideas</button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        Built at <b>ShellHacks</b> · PeerLens © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
