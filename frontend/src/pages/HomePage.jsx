import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function HomePage() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="container">
      <div className="card" style={{padding:"32px 28px"}}>
        <h1 style={{margin:0,fontSize:32}}>
          <span className="brand-gradient">PeerLens</span> — your AI research gap copilot
        </h1>
        <p className="muted" style={{marginTop:8}}>
          Upload 4–5 papers → detect research gaps → agents debate novelty/usefulness →
          get a publication probability with clear arguments.
        </p>

        <div style={{display:"flex",gap:12,marginTop:20}}>
          {!isAuthenticated ? (
            <Link to="/auth"><button className="btn btn-primary">Login to get started</button></Link>
          ) : (
            <>
              <Link to="/upload"><button className="btn btn-primary">Go to Upload</button></Link>
              <Link to="/ideas"><button className="btn btn-outline">View Ideas</button></Link>
            </>
          )}
        </div>
      </div>

      <div className="section grid grid-3">
        <div className="card">
          <h3 style={{marginTop:0}}>🧠 Idea Generator</h3>
          <p className="muted">Find specific gaps from methods, datasets, and ablations.</p>
        </div>
        <div className="card">
          <h3 style={{marginTop:0}}>🤝 Agent Debate</h3>
          <p className="muted">Researcher vs. Reviewer discuss novelty and feasibility in parallel.</p>
        </div>
        <div className="card">
          <h3 style={{marginTop:0}}>📈 Publishability</h3>
          <p className="muted">Get a probability score with strengths, concerns, and action items.</p>
        </div>
      </div>
    </div>
  );
}
