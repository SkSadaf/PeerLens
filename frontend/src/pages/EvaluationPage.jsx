import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiEvaluateIdea } from "../lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


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
        <button
  className="btn btn-primary btn-loading"
  disabled={loading}
  onClick={run}
>
  {loading ? (
    <>
      Evaluating
      <span className="loading">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </span>
    </>
  ) : (
    "Run Evaluation"
  )}
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
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
    <h4 style={{margin:0}}>Detailed Rationale</h4>

    <div style={{display:"flex",gap:8}}>
      <button
        className="btn btn-outline btn-sm"
        onClick={() => navigator.clipboard.writeText(result?.result_text || "")}
        title="Copy to clipboard"
      >
        Copy
      </button>
      <button
        className="btn btn-outline btn-sm"
        onClick={() => {
          const blob = new Blob([result?.result_text || ""], { type: "text/plain;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "peerlens-evaluation.txt"; a.click();
          URL.revokeObjectURL(url);
        }}
        title="Download as .txt"
      >
        Download
      </button>
    </div>
  </div>

  <div className="card scroll prose markdown" style={{padding:16, marginTop:10}}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {result?.result_text || ""}
    </ReactMarkdown>
  </div>
</div>


          </div>
        )}
      </div>
    </div>
  );
}
