import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const STOPWORDS = new Set([
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
  "understanding","knowledge","skills","relevant"
]);

function tokenize(text) {
  const words = text.toLowerCase().match(/\b[a-z][a-z+#.\-]{1,}\b/gi) || [];
  return words.filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function keywordAnalysis(resumeText, jdText) {
  const resumeTokens = new Set(tokenize(resumeText));
  const jdTokens = tokenize(jdText);
  
  // count frequencies
  const freq = {};
  for (const w of jdTokens) freq[w] = (freq[w] || 0) + 1;
  
  // top 50 jd words
  const sortedJd = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0,50).map(x => x[0]);
  const importantJd = new Set(sortedJd);
  
  const matched = [...importantJd].filter(w => resumeTokens.has(w)).sort().slice(0, 15);
  const missing = [...importantJd].filter(w => !resumeTokens.has(w)).sort().slice(0, 15);
  
  const commonTech = [
    "agile","jira","ci/cd","docker","kubernetes","aws",
    "azure","gcp","sql","nosql","rest","graphql","git",
    "testing","scrum","linux","redis","kafka","postgresql",
    "python","javascript","react","node","typescript",
  ];
  
  const suggested = commonTech
    .filter(kw => jdText.toLowerCase().includes(kw) && !resumeText.toLowerCase().includes(kw))
    .slice(0, 10);
    
  const matchPct = importantJd.size > 0 ? Math.floor((matched.length / importantJd.size) * 100) : 0;
  
  return {
    matched: matched.map(k => k.charAt(0).toUpperCase() + k.slice(1)),
    missing: missing.map(k => k.charAt(0).toUpperCase() + k.slice(1)),
    suggested: suggested.map(k => k.toUpperCase()),
    match_percent: matchPct
  };
}

function computeScore(kw, resumeText) {
  const keywordScore = kw.match_percent;
  const rtLower = resumeText.toLowerCase();
  
  const sections = {
    contact: /@|\+\d|phone|email/.test(rtLower),
    summary: rtLower.includes("summary") || rtLower.includes("objective"),
    experience: rtLower.includes("experience") || rtLower.includes("work"),
    skills: rtLower.includes("skills"),
    education: rtLower.includes("education"),
    projects: rtLower.includes("project")
  };
  
  const completeness = Math.floor(Object.values(sections).filter(Boolean).length / 6 * 100);
  
  const hasBullets = /[•●▪◦·]|^\s*[-*]\s/m.test(resumeText);
  const wordCount = resumeText.split(/\s+/).length;
  
  let formattingScore = 70;
  if (hasBullets) formattingScore += 15;
  if (wordCount > 250 && wordCount < 1000) formattingScore += 15;
  formattingScore = Math.min(formattingScore, 100);
  
  const actionVerbs = [
    "led","built","developed","designed","created","launched",
    "managed","increased","reduced","improved","delivered",
    "implemented","architected","optimized","analyzed","achieved"
  ];
  const verbHits = actionVerbs.filter(v => rtLower.includes(v)).length;
  const actionScore = Math.min(verbHits * 12, 100);
  
  const overall = Math.floor(
    keywordScore * 0.4 +
    completeness * 0.25 +
    formattingScore * 0.20 +
    actionScore * 0.15
  );
  
  let label = "Needs Work";
  if (overall >= 85) label = "Excellent Match";
  else if (overall >= 70) label = "Strong Match";
  else if (overall >= 50) label = "Good Potential";
  
  return { overall, label, metrics: { "Keyword Match": keywordScore, "Section Completeness": completeness, "Formatting Quality": formattingScore, "Action Verbs": actionScore }, sections };
}

async function getAiSuggestions(resumeText, jdText, kw) {
  const fallback = [
    { title: "Add Missing Keywords", body: `Your resume is missing important keywords. Add these to your skills section: ${kw.missing.slice(0,5).join(', ')}.`, icon: "✨" },
    { title: "Quantify Your Achievements", body: "Replace vague statements with measurable impact. Use numbers, percentages, and concrete outcomes.", example: "✗ 'Improved website performance'\n✓ 'Improved load speed by 40% via caching'", icon: "💡" },
    { title: "Use Strong Action Verbs", body: "Start each bullet point with an action verb: Led, Built, Architected, Delivered, Optimized.", icon: "✨" },
    { title: "Strengthen Your Summary", body: "Add a 3-line summary at the top tailored to this role, mentioning your years of experience and 2-3 key skills from the job description.", icon: "💡" },
    { title: "ATS-Safe Formatting", body: "Remove tables, columns, headers/footers, and images. Use a single-column layout with standard section headings (Experience, Skills, Education).", icon: "✨" }
  ];

  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "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";
  if (!NVIDIA_API_KEY) return fallback;

  try {
    const prompt = `You are an expert ATS resume reviewer.
Analyze the following resume against the given job description.
Provide exactly 5 highly actionable suggestions.

Return the response as a JSON array of objects with:
- "title": short catchy title
- "body": 1-2 sentence summary of the advice
- "example": (optional) before/after example
- "icon": either "✨" or "💡"

Job Description:
${jdText.substring(0, 1500)}

Resume Text:
${resumeText.substring(0, 2000)}

Missing Keywords: ${kw.missing.slice(0, 10).join(', ')}

OUTPUT FORMAT: Return ONLY valid JSON array. No markdown blocks, no other text.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18000); // 18s timeout

    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "minimaxai/minimax-m3",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
        stream: false
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!res.ok) return fallback;
    const data = await res.json();
    let content = data.choices[0].message.content.trim();
    
    if (content.startsWith("```json")) content = content.slice(7);
    if (content.startsWith("```")) content = content.slice(3);
    if (content.endsWith("```")) content = content.slice(0, -3);
    
    const parsed = JSON.parse(content.trim());
    if (Array.isArray(parsed)) return parsed;
    if (parsed && parsed.suggestions) return parsed.suggestions;
    return fallback;
  } catch (e) {
    console.error("AI fetch error:", e);
    return fallback;
  }
}

export default async (req, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const jdText = formData.get('jobDescription');
    const jobTitle = formData.get('jobTitle') || '';

    if (!file || !jdText) {
      return new Response(JSON.stringify({ detail: "Missing file or job description" }), { status: 400, headers });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filename = (file.name || "").toLowerCase();
    
    let resumeText = "";
    if (filename.endsWith('.pdf')) {
      const data = await pdfParse(fileBuffer);
      resumeText = data.text;
    } else if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      resumeText = result.value;
    } else {
      return new Response(JSON.stringify({ detail: "Only PDF, DOCX supported." }), { status: 400, headers });
    }

    if (resumeText.trim().length < 50) {
      return new Response(JSON.stringify({ detail: "Could not extract enough text from resume." }), { status: 400, headers });
    }

    const kw = keywordAnalysis(resumeText, jdText);
    const scoreData = computeScore(kw, resumeText);
    const suggestions = await getAiSuggestions(resumeText, jdText, kw);

    const resultPayload = {
      score: scoreData.overall,
      label: scoreData.label,
      scoreLabel: scoreData.label,
      scoreText: `Your resume matches ${scoreData.overall}% of the keywords and requirements in this job description.`,
      metrics: scoreData.metrics,
      matched: kw.matched,
      missing: kw.missing,
      suggested: kw.suggested,
      sections: scoreData.sections,
      suggestions: suggestions,
      resume_text: resumeText,
      job_title: jobTitle,
      breakdown: Object.entries(scoreData.metrics).map(([k, v]) => ({ label: k, percentage: v })),
      keywords: {
        matched: kw.matched,
        missing: kw.missing,
        suggested: kw.suggested
      }
    };

    return new Response(JSON.stringify(resultPayload), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error("Analysis Error:", e);
    return new Response(JSON.stringify({ detail: e.message || "Internal server error" }), { status: 500, headers });
  }
};
