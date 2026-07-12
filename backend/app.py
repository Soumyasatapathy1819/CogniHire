import os
import re
import json
import tempfile
import threading
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# PDF extraction (try multiple libraries)
PDF_EXTRACTOR = None
try:
    import pdfplumber
    PDF_EXTRACTOR = "pdfplumber"
except Exception:
    try:
        from pypdf import PdfReader
        PDF_EXTRACTOR = "pypdf"
    except Exception:
        PDF_EXTRACTOR = None

# DOCX extraction (try python-docx first, then docx2txt)
DOCX_EXTRACTOR = None
try:
    import docx
    DOCX_EXTRACTOR = "python-docx"
except Exception:
    try:
        import docx2txt
        DOCX_EXTRACTOR = "docx2txt"
    except Exception:
        DOCX_EXTRACTOR = None

app = Flask(__name__)
CORS(app)

def warm_up_ollama():
    """Start the Ollama model in the background so the first screening is much faster."""
    if os.getenv("SKIP_WARMUP", "0") == "1":
        return

    def _run():
        try:
            requests.post(
                OLLAMA_URL,
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": "Reply with OK.",
                    "stream": False,
                    "options": {"temperature": 0, "num_predict": 5},
                },
                timeout=15,
            )
        except Exception:
            pass

    threading.Thread(target=_run, daemon=True).start()

warm_up_ollama()

# ── Ollama config ─────────────────────────────────────────────────────────────
OLLAMA_URL   = "http://localhost:11434/api/generate"
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")
MAX_RESUME_CHARS = int(os.getenv("MAX_RESUME_CHARS", "1200"))
OLLAMA_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT", "180"))
OLLAMA_NUM_PREDICT = int(os.getenv("OLLAMA_NUM_PREDICT", "500"))

# ── Text extraction ───────────────────────────────────────────────────────────
def safe_delete(path):
    """Delete safely — handles Windows file-lock (PermissionError)."""
    try:
        os.unlink(path)
    except Exception:
        pass

def prepare_resume_text(text, max_chars=MAX_RESUME_CHARS, job_description=None):
    """Trim resume text while preserving keywords that matter for the current job."""
    if not text:
        return ""

    normalized = re.sub(r"\s+", " ", text).strip()
    if not normalized:
        return ""
    if len(normalized) <= max_chars:
        return normalized

    keywords = []
    if job_description:
        keyword_candidates = re.findall(r"[A-Za-z0-9+#.]+", job_description)
        keyword_candidates = [k.lower() for k in keyword_candidates if len(k) > 2 and k.lower() not in {"and", "the", "for", "with", "your", "using", "skills", "experience", "years"}]
        keywords = list(dict.fromkeys(keyword_candidates))[:8]

    lowered = normalized.lower()
    preserved_parts = []
    for keyword in keywords:
        idx = lowered.find(keyword)
        if idx != -1:
            start = max(0, idx - 50)
            end = min(len(normalized), idx + len(keyword) + 50)
            snippet = normalized[start:end].strip()
            if snippet and snippet not in preserved_parts:
                preserved_parts.append(snippet)

    if preserved_parts:
        combined = " ... ".join(preserved_parts[:3])
        if len(combined) > max_chars:
            combined = combined[:max_chars].rsplit(" ", 1)[0].strip()
        if combined:
            return combined + "..."

    shortened = normalized[:max_chars].rsplit(" ", 1)[0].strip()
    return shortened + "..."

def extract_text_from_file(file):
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        if not PDF_EXTRACTOR:
            return ""
        tmp_path = None
        try:
            # Save file first to avoid Windows file-lock issues
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp_path = tmp.name
                file.save(tmp_path)

            if PDF_EXTRACTOR == "pdfplumber":
                import pdfplumber
                with pdfplumber.open(tmp_path) as pdf:
                    return "\n".join(page.extract_text() or "" for page in pdf.pages).strip()
            else:
                from pypdf import PdfReader
                reader = PdfReader(tmp_path)
                texts = []
                for p in reader.pages:
                    try:
                        texts.append(p.extract_text() or "")
                    except Exception:
                        texts.append("")
                return "\n".join(texts).strip()
        finally:
            if tmp_path:
                safe_delete(tmp_path)

    elif filename.endswith(".docx"):
        if not DOCX_EXTRACTOR:
            return ""
        tmp_path = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
                tmp_path = tmp.name
                file.save(tmp_path)

            if DOCX_EXTRACTOR == "python-docx":
                import docx
                doc = docx.Document(tmp_path)
                return "\n".join(p.text for p in doc.paragraphs).strip()
            else:
                import docx2txt
                return (docx2txt.process(tmp_path) or "").strip()
        finally:
            if tmp_path:
                safe_delete(tmp_path)

    elif filename.endswith(".txt") or filename.endswith(".md"):
        return file.read().decode("utf-8", errors="ignore").strip()

    return ""

# ── Ollama call ───────────────────────────────────────────────────────────────
def ask_ollama(prompt):
    try:
        res = requests.post(
            OLLAMA_URL,
            json={
                "model":  OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.1,
                    "num_predict": OLLAMA_NUM_PREDICT,
                }
            },
            timeout=OLLAMA_TIMEOUT
        )
        res.raise_for_status()
        return res.json().get("response", "")
    except requests.exceptions.ConnectionError:
        raise Exception("Cannot connect to Ollama. Make sure Ollama is running: run 'ollama serve' in a terminal.")
    except requests.exceptions.Timeout:
        raise Exception("Ollama timed out. Your model may still be loading — try again in a moment.")

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    # Check if Ollama is reachable
    try:
        r = requests.get("http://localhost:11434", timeout=3)
        ollama_running = True
    except Exception:
        ollama_running = False

    # Runtime import checks for better diagnostics
    pdf_ok = False
    pdf_err = None
    try:
        import pdfplumber
        pdf_ok = True
    except Exception as e:
        try:
            from pypdf import PdfReader
            pdf_ok = True
        except Exception as e2:
            pdf_err = f"pdfplumber: {e}; pypdf: {e2}"

    docx_ok = False
    docx_err = None
    try:
        import docx
        docx_ok = True
    except Exception as e:
        try:
            import docx2txt
            docx_ok = True
        except Exception as e2:
            docx_err = f"python-docx: {e}; docx2txt: {e2}"

    return jsonify({
        "status":        "ok",
        "ai":            f"Ollama ({OLLAMA_MODEL})",
        "ollama":        ollama_running,
        "pdf":           pdf_ok,
        "docx":          docx_ok,
        "pdf_error":     pdf_err,
        "docx_error":    docx_err,
    })


@app.route("/api/extract", methods=["POST"])
def extract():
    """Extract text from uploaded resume file."""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "Empty filename"}), 400

    text = extract_text_from_file(file)
    if not text:
        return jsonify({"error": "Could not extract text. Try PDF, DOCX, or TXT."}), 422

    return jsonify({"text": text, "wordCount": len(text.split())})


@app.route("/api/analyze", methods=["POST"])
def analyze():
    """Rank and analyze candidates using local Ollama model."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body"}), 400

    job_description = data.get("jobDescription", "").strip()
    candidates      = data.get("candidates", [])

    if not job_description:
        return jsonify({"error": "Job description is required"}), 400
    if not candidates:
        return jsonify({"error": "At least one candidate required"}), 400

    prepared_candidates = []
    for candidate in candidates:
        prepared_candidates.append({
            "name": candidate.get("name", ""),
            "resume": prepare_resume_text(candidate.get("resume", ""), job_description=job_description),
        })

    prompt = f"""You are a senior talent acquisition specialist and HR analyst.
Evaluate each candidate against the job description below.
Return ONLY a valid JSON object. No explanation, no markdown, no backticks. Just raw JSON.

JOB DESCRIPTION:
{job_description}

CANDIDATES ({len(prepared_candidates)}):
{chr(10).join(f"=== CANDIDATE {i+1}: {c['name']} ==={chr(10)}{c['resume']}" for i, c in enumerate(prepared_candidates))}

Return this exact JSON structure:
{{
  "jobTitle": "extracted job title",
  "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "candidates": [
    {{
      "name": "candidate name",
      "score": 85,
      "verdict": "Strong Match",
      "summary": "Two sentence summary of the candidate fit.",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "matchedSkills": ["matched skill 1", "matched skill 2"],
      "missingSkills": ["missing skill 1"],
      "experience": "X years in relevant field",
      "education": "Degree, Institution",
      "recommendation": "One sentence hiring recommendation.",
      "scores": {{
        "technicalSkills": 80,
        "experience": 75,
        "education": 70,
        "cultureFit": 65
      }}
    }}
  ]
}}

Scoring rules:
- 85 to 100 = Strong Match
- 70 to 84  = Good Match
- 50 to 69  = Average Match
- below 50  = Weak Match

Sort candidates array by score from highest to lowest.
Output raw JSON only. Do not write anything before or after the JSON."""

    try:
        raw = ask_ollama(prompt)
    except Exception as e:
        # Require Ollama in production: return a 503 so frontend knows to retry
        return jsonify({"error": str(e)}), 503

    # Strip any accidental markdown fences
    clean = raw.strip()
    if clean.startswith("```"):
        parts = clean.split("```")
        clean = parts[1] if len(parts) > 1 else clean
        if clean.startswith("json"):
            clean = clean[4:]
    clean = clean.strip()

    # Find JSON boundaries in case model added text around it
    start = clean.find("{")
    end   = clean.rfind("}") + 1
    if start != -1 and end > start:
        clean = clean[start:end]

    try:
        result = json.loads(clean)
    except json.JSONDecodeError:
        # Attempt simple cleanup: remove trailing commas before } or ] and strip non-JSON
        import re
        # remove common markdown fences
        cleaned = re.sub(r"^.*?\{", "{", clean, flags=re.S)
        cleaned = re.sub(r"\}\s*[^\}]*$", "}", cleaned, flags=re.S)
        # remove trailing commas
        cleaned = re.sub(r",\s*}(?![\s\S]*\{)", "}", cleaned)
        cleaned = re.sub(r",\s*]", "]", cleaned)
        # final trim
        cleaned = cleaned.strip()
        try:
            result = json.loads(cleaned)
        except Exception as e2:
            return jsonify({"error": f"AI returned invalid JSON: {str(e2)}", "raw": raw[:2000]}), 500

    return jsonify(result)

if __name__ == "__main__":
    print("\n🚀 CogniHire backend running on http://localhost:5000")
    print(f"🤖 Using Ollama model: {OLLAMA_MODEL}")
    print("📋 Make sure Ollama is running: ollama serve\n")
    try:
        from waitress import serve
        serve(app, host="0.0.0.0", port=5000, threads=8)
    except Exception as exc:
        print(f"Waitress unavailable, falling back to Flask dev server: {exc}")
        app.run(host="0.0.0.0", port=5000)


# Production WSGI entrypoint for deployment platforms such as Render, Railway, or Heroku
application = app
