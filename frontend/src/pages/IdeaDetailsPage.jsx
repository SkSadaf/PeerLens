import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IdeaDetailsPage() {
  const [idea, setIdea] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem("peer_selected_idea");
    if (raw) setIdea(JSON.parse(raw));
  }, []);

  if (!idea) return <div className="container"><div className="card"><p className="muted">No idea selected.</p></div></div>;

  return (
    <div className="container">
      <div className="card">
        <h2 style={{marginTop:0}}>{idea.title}</h2>
        <div className="section">
          <p><b>Problem:</b> <span className="muted">{idea.problem}</span></p>
          <p><b>Methodology:</b> <span className="muted">{idea.methodology}</span></p>
          <p><b>Contribution:</b> <span className="muted">{idea.contribution}</span></p>
        </div>
        <div className="section">
          <button className="btn btn-primary" onClick={() => navigate("/evaluation")}>
            Evaluate this idea
          </button>
        </div>
      </div>
    </div>
  );
}
