import os
import io
import re
import json
import asyncio
from collections import Counter
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import docx

app = FastAPI(title="ATS Resume Checker API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://resumescanatschecker.netlify.app",
    ],
    allow_origin_regex=r"https://.*\.netlify\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── NVIDIA API (optional — works without it via fallback) ───
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "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")
USE_AI = bool(NVIDIA_API_KEY)

# ─── Text Extraction ─────────────────────────────────────────

def extract_pdf_text(file_bytes: bytes) -> str:
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n"
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read PDF: {str(e)}")

def extract_docx_text(file_bytes: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read DOCX: {str(e)}")

# ─── Keyword Analysis ────────────────────────────────────────

STOPWORDS = {
    "the","a","an","and","or","but","in","on","at","to","for",
    "of","with","by","from","as","is","was","are","were","be",
    "been","being","have","has","had","do","does","did","will",
    "would","should","could","may","might","must","shall","can",
    "this","that","these","those","i","you","he","she","it","we",
    "they","them","their","there","here","when","where","why",
    "how","what","which","who","whom","whose","not","no","nor",
    "also","just","more","than","very","too","only","such","its",
    "into","about","over","after","before","between","through",
    "during","each","other","some","any","all","most","your",
    "our","able","well","new","one","two","use","using","used",
    "work","working","include","including","based","etc","per",
    "within","across","both","role","team","strong","looking",
    "experience","years","year","required","preferred","ability",
    "understanding","knowledge","skills","including","relevant",
}

def tokenize(text: str) -> list:
    words = re.findall(r"\b[a-zA-Z][a-zA-Z+#.\-]{1,}\b", text.lower())
    return [w for w in words if len(w) > 2 and w not in STOPWORDS]

def keyword_analysis(resume_text: str, jd_text: str) -> dict:
    resume_tokens = set(tokenize(resume_text))
    jd_tokens_list = tokenize(jd_text)
    freq = Counter(jd_tokens_list)
    important_jd = {w for w, c in freq.most_common(50)}

    matched = sorted(list(important_jd & resume_tokens))[:15]
    missing = sorted(list(important_jd - resume_tokens))[:15]

    common_tech = [
        "agile","jira","ci/cd","docker","kubernetes","aws",
        "azure","gcp","sql","nosql","rest","graphql","git",
        "testing","scrum","linux","redis","kafka","postgresql",
        "python","javascript","react","node","typescript",
    ]
    suggested = [
        kw for kw in common_tech
        if kw in jd_text.lower() and kw not in resume_text.lower()
    ][:10]

    match_pct = int(len(matched) / max(len(important_jd), 1) * 100) if important_jd else 0
    return {
        "matched": [k.capitalize() for k in matched],
        "missing": [k.capitalize() for k in missing],
        "suggested": [k.upper() for k in suggested],
        "match_percent": match_pct,
    }

# ─── Score Computation ───────────────────────────────────────

def compute_score(kw: dict, resume_text: str) -> dict:
    keyword_score = kw["match_percent"]

    sections = {
        "contact": bool(re.search(r"@|\+\d|phone|email", resume_text.lower())),
        "summary": "summary" in resume_text.lower() or "objective" in resume_text.lower(),
        "experience": "experience" in resume_text.lower() or "work" in resume_text.lower(),
        "skills": "skills" in resume_text.lower(),
        "education": "education" in resume_text.lower(),
        "projects": "project" in resume_text.lower(),
    }
    completeness = int(sum(sections.values()) / len(sections) * 100)

    has_bullets = bool(re.search(r"[•●▪◦·]|^\s*[-*]\s", resume_text, re.M))
    word_count = len(resume_text.split())
    formatting_score = 70
    if has_bullets: formatting_score += 15
    if 250 < word_count < 1000: formatting_score += 15
    formatting_score = min(formatting_score, 100)

    action_verbs = [
        "led","built","developed","designed","created","launched",
        "managed","increased","reduced","improved","delivered",
        "implemented","architected","optimized","analyzed","achieved",
    ]
    verb_hits = sum(1 for v in action_verbs if v in resume_text.lower())
    action_score = min(verb_hits * 12, 100)

    overall = int(
        keyword_score * 0.4 +
        completeness * 0.25 +
        formatting_score * 0.20 +
        action_score * 0.15
    )

    if overall >= 85: label = "Excellent Match"
    elif overall >= 70: label = "Strong Match"
    elif overall >= 50: label = "Good Potential"
    else: label = "Needs Work"

    return {
        "overall": overall,
        "label": label,
        "metrics": {
            "Keyword Match": keyword_score,
            "Section Completeness": completeness,
            "Formatting Quality": formatting_score,
            "Action Verbs": action_score,
        },
        "sections": sections,
    }

# ─── AI Suggestions (with timeout + fallback) ────────────────

async def get_ai_suggestions(resume_text: str, jd_text: str, kw: dict) -> list:
    fallback = [
        {
            "title": "Add Missing Keywords",
            "body": f"Your resume is missing important keywords. Add these to your skills section: {', '.join(kw['missing'][:5])}.",
            "icon": "✨"
        },
        {
            "title": "Quantify Your Achievements",
            "body": "Replace vague statements with measurable impact. Use numbers, percentages, and concrete outcomes.",
            "example": "✗ 'Improved website performance'\n✓ 'Improved load speed by 40% via caching'",
            "icon": "💡"
        },
        {
            "title": "Use Strong Action Verbs",
            "body": "Start each bullet point with an action verb: Led, Built, Architected, Delivered, Optimized.",
            "icon": "✨"
        },
        {
            "title": "Strengthen Your Summary",
            "body": "Add a 3-line summary at the top tailored to this role, mentioning your years of experience and 2-3 key skills from the job description.",
            "icon": "💡"
        },
        {
            "title": "ATS-Safe Formatting",
            "body": "Remove tables, columns, headers/footers, and images. Use a single-column layout with standard section headings (Experience, Skills, Education).",
            "icon": "✨"
        },
    ]

    if not USE_AI:
        return fallback

    try:
        import requests

        invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Accept": "application/json",
        }

        prompt = f"""You are an expert ATS resume reviewer.
Analyze the following resume against the given job description.
Provide exactly 5 highly actionable suggestions.

Return the response as a JSON array of objects with:
- "title": short catchy title
- "body": 1-2 sentence summary of the advice
- "example": (optional) before/after example
- "icon": either "✨" or "💡"

Job Description:
{jd_text[:1500]}

Resume Text:
{resume_text[:2000]}

Missing Keywords: {', '.join(kw['missing'][:10])}

OUTPUT FORMAT: Return ONLY valid JSON array. No markdown blocks, no other text."""

        payload = {
            "model": "minimaxai/minimax-m3",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1500,
            "temperature": 0.3,
            "stream": False,
        }

        # CRITICAL: timeout the requests call
        response = await asyncio.wait_for(
            asyncio.to_thread(
                lambda: requests.post(invoke_url, headers=headers, json=payload, timeout=20)
            ),
            timeout=25.0,
        )
        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]

        # Clean up markdown wrapping
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        parsed = json.loads(content)
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict) and "suggestions" in parsed:
            return parsed["suggestions"]
        return fallback

    except asyncio.TimeoutError:
        print("NVIDIA API call timed out — using fallback suggestions")
        return fallback
    except Exception as e:
        print(f"AI suggestion error: {e} — using fallback suggestions")
        return fallback

# ─── Main Endpoint ───────────────────────────────────────────

@app.post("/api/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    jobDescription: str = Form(...),
    jobTitle: str = Form(""),
):
    # Validate file size (5 MB)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 5 MB.")

    # Extract text
    filename = (file.filename or "").lower()
    if filename.endswith(".pdf"):
        resume_text = extract_pdf_text(contents)
    elif filename.endswith(".docx") or filename.endswith(".doc"):
        resume_text = extract_docx_text(contents)
    else:
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, DOC files are supported.")

    if len(resume_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Could not extract enough text from resume. Try a different file format.",
        )

    if len(jobDescription.strip()) < 20:
        raise HTTPException(status_code=400, detail="Job description is too short.")

    # Run analysis
    kw = keyword_analysis(resume_text, jobDescription)
    score_data = compute_score(kw, resume_text)
    suggestions = await get_ai_suggestions(resume_text, jobDescription, kw)

    return {
        "score": score_data["overall"],
        "label": score_data["label"],
        "scoreLabel": score_data["label"],
        "scoreText": f"Your resume matches {score_data['overall']}% of the keywords and requirements in this job description.",
        "metrics": score_data["metrics"],
        "matched": kw["matched"],
        "missing": kw["missing"],
        "suggested": kw["suggested"],
        "sections": score_data["sections"],
        "suggestions": suggestions,
        "resume_text": resume_text,
        "job_title": jobTitle,
        # Legacy shape compatibility
        "breakdown": [
            {"label": k, "percentage": v}
            for k, v in score_data["metrics"].items()
        ],
        "keywords": {
            "matched": kw["matched"],
            "missing": kw["missing"],
            "suggested": kw["suggested"],
        },
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "ai_enabled": USE_AI}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
