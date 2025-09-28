import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiEvaluateIdea } from "../lib/api";

export default function EvaluationPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    try{
      setLoading(true);
      const sessionId = sessionStorage.getItem("peer_session_id");
      const ideaIndex = Number(sessionStorage.getItem("peer_selected_index") || "0");
      const token = await getAccessTokenSilently().catch(()=>undefined);
      const data = await apiEvaluateIdea(sessionId, ideaIndex, token);
      setResult(data);
    }catch(e){ alert(e.message); }
    finally{ setLoading(false); }
  };

  const score = result?.score ?? null;

  return (
    <div className="container">
      <div className="card">
        <h2 style={{marginTop:0}}>Parallel Agent Evaluation</h2>
        <button className="btn btn-primary" disabled={loading} onClick={run}>
          {loading ? "Evaluating…" : "Run Evaluation"}
        </button>

        {result && (
          <div className="section">
            {score != null && (
              <>
                <h3 style={{marginBottom:8}}>Publication Probability: {score}%</h3>
                <div className="progress"><span style={{width:`${Math.min(100,Math.max(0,score))}%`}} /></div>
              </>
            )}
            <div className="section">
              <h4>Detailed Rationale</h4>
              <pre style={{whiteSpace:"pre-wrap",background:"#fafafa",border:"1px solid var(--border)",borderRadius:12,padding:12}}>
{result.result_text}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
