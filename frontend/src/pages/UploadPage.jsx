import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiGenerateIdeas } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const onInput = e => setFiles(Array.from(e.target.files || []));
  const onDrop = e => {
    e.preventDefault(); setDrag(false);
    if (e.dataTransfer?.files?.length) setFiles(Array.from(e.dataTransfer.files));
  };

  const onSubmit = async () => {
    if (!isAuthenticated) return alert("Please login first");
    if (files.length < 1) return alert("Select 4–5 PDFs");
    try {
      setLoading(true);
      const token = await getAccessTokenSilently().catch(() => undefined);
      const { session_id, ideas } = await apiGenerateIdeas(files, token);
      sessionStorage.setItem("peer_session_id", session_id);
      sessionStorage.setItem("peer_ideas", JSON.stringify(ideas));
      navigate("/ideas");
    } catch (err) {
      alert(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{marginTop:0}}>Upload 4–5 related papers (PDF)</h2>
        <div
          className={`dropzone ${drag ? "drag":""}`}
          onDragOver={e => {e.preventDefault(); setDrag(true);}}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
        >
          <p className="muted" style={{margin:0}}>
            Drag & drop PDFs here, or
          </p>
          <div className="spacer"></div>
          <input id="filepick" type="file" multiple accept="application/pdf" onChange={onInput} hidden />
          <label htmlFor="filepick" className="btn btn-outline">Choose Files</label>

          {files.length > 0 && (
            <div className="file-list">
              {files.map((f, i) => <span key={i} className="file-pill">{f.name}</span>)}
            </div>
          )}
        </div>

        <div style={{marginTop:16}}>
          <button className="btn btn-primary" disabled={loading} onClick={onSubmit}>
            {loading ? "Generating ideas…" : "Generate Ideas"}
          </button>
        </div>
      </div>
    </div>
  );
}
