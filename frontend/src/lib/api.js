const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function apiGenerateIdeas(files, token) {
  const form = new FormData();
  for (const f of files) form.append("files", f);

  const res = await fetch(`${BASE}/api/ideas/generate`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Generate failed: ${msg}`);
    }
  return res.json(); // { session_id, ideas }
}

export async function apiEvaluateIdea(sessionId, ideaIndex, token) {
  const res = await fetch(`${BASE}/api/ideas/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ session_id: sessionId, idea_index: ideaIndex }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Evaluate failed: ${msg}`);
  }
  return res.json(); // { session_id, idea_index, result_text, score? }
}
