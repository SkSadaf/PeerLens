# api_server.py
import uuid
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# import your existing modules
from paper_processor import extract_text_from_papers
from idea_generator import generate_research_ideas, parse_ideas
from parallel_agents import parallel_discussion


from pathlib import Path
import tempfile, os

# cross-platform temp dir for uploaded PDFs
UPLOAD_DIR = Path(tempfile.gettempdir()) / "peerlens_uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------
# CORS (adjust for prod later)
# ---------------------------
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://*.vercel.app",      # optional for previews
    "https://app.yourdomain.com" # your GoDaddy/Vercel domain
]

app = FastAPI(title="PeerLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# In-memory store for demo: session_id -> context/ideas
# (Swap to Redis/Postgres later if you want persistence)
# ---------------------------------------------------
SESSIONS = {}

class GenerateResponse(BaseModel):
    session_id: str
    ideas: List[dict]  # [{title, description, problem, methodology, contribution, ...}]

class EvaluateRequest(BaseModel):
    session_id: str
    idea_index: int

class EvaluateResponse(BaseModel):
    session_id: str
    idea_index: int
    result_text: str
    score: Optional[float] = None  # parsed % if we can find it


@app.get("/api/health")
def health():
    return {"ok": True, "service": "PeerLens API"}


@app.post("/api/ideas/generate", response_model=GenerateResponse)
async def ideas_generate(files: List[UploadFile] = File(...)):
    if not files or len(files) < 1:
        raise HTTPException(status_code=400, detail="Upload at least one PDF")

    tmp_paths = []
    try:
        file_paths = []
        for f in files:
            if not f.filename.lower().endswith(".pdf"):
                raise HTTPException(status_code=400, detail=f"Only PDF allowed: {f.filename}")

            # write to a Windows-safe temp path
            filename = Path(f.filename).name
            tmp_path = UPLOAD_DIR / f"{uuid.uuid4().hex}_{filename}"
            with open(tmp_path, "wb") as out:
                # read in chunks (better for big PDFs)
                while True:
                    chunk = await f.read(1024 * 1024)
                    if not chunk:
                        break
                    out.write(chunk)

            tmp_paths.append(tmp_path)         # for cleanup
            file_paths.append(str(tmp_path))   # for your extractor

        # ---- your pipeline ----
        papers_text = extract_text_from_papers(file_paths)
        ideas_raw = generate_research_ideas(papers_text)
        parsed_ideas = parse_ideas(ideas_raw)
        if not parsed_ideas:
            raise HTTPException(status_code=422, detail="No valid research ideas were generated.")

        session_id = uuid.uuid4().hex
        SESSIONS[session_id] = {"papers_text": papers_text, "ideas": parsed_ideas}
        return GenerateResponse(session_id=session_id, ideas=parsed_ideas)

    finally:
        # optional: delete temp files after we’ve extracted text
        for p in tmp_paths:
            try:
                os.remove(p)
            except OSError:
                pass


@app.post("/api/ideas/evaluate", response_model=EvaluateResponse)
def ideas_evaluate(payload: EvaluateRequest):
    """
    Evaluate a selected idea using your parallel agents and return the synthesis.
    """
    session = SESSIONS.get(payload.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Invalid session_id")

    ideas = session["ideas"]
    if payload.idea_index < 0 or payload.idea_index >= len(ideas):
        raise HTTPException(status_code=400, detail="idea_index out of range")

    selected_idea = ideas[payload.idea_index]
    papers_text = session["papers_text"]

    result_text = parallel_discussion(selected_idea, papers_text)

    # Try to parse a numeric score like "Overall Assessment Score (0-100%): 78%"
    score = None
    import re
    m = re.search(r"Score.*?(\d{1,3})\s*%", result_text, flags=re.I | re.S)
    if not m:
        m = re.search(r"(\d{1,3})\s*%", result_text)
    if m:
        try:
            val = float(m.group(1))
            score = max(0.0, min(100.0, val))
        except Exception:
            pass

    return EvaluateResponse(
        session_id=payload.session_id,
        idea_index=payload.idea_index,
        result_text=result_text,
        score=score
    )
