import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem("peer_ideas");
    if (raw) setIdeas(JSON.parse(raw));
  }, []);

  const openIdea = (i) => {
    sessionStorage.setItem("peer_selected_index", String(i));
    sessionStorage.setItem("peer_selected_idea", JSON.stringify(ideas[i]));
    navigate("/idea-details");
  };

  return (
    <div className="container">
      <h2 style={{marginTop:0}}>Generated Research Gaps</h2>

      {ideas.length === 0 ? (
        <div className="card">
          <p className="muted">No ideas found. Go to Upload and generate first.</p>
        </div>
      ) : (
        <div className="grid">
          {ideas.map((it, i) => (
            <div className="card" key={i}>
              <h3 style={{marginTop:0}}>{it.title}</h3>
              <p className="muted" style={{marginTop:6}}>
                {it.description}
              </p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
                {it.methodology && <span className="badge">{it.methodology}</span>}
                {it.contribution && <span className="badge">Contribution</span>}
              </div>
              <div style={{marginTop:12}}>
                <button className="btn btn-primary" onClick={() => openIdea(i)}>Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
