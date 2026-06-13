import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../lib/gsap';
import html2pdf from 'html2pdf.js';

const CIRC = 282.743;

/* ── helpers ────────────────────────────────────────── */
function highlightText(text, matched = [], missing = [], suggested = []) {
  if (!text) return null;
  const all = [
    ...matched.map(k => ({ word: k, kind: 'matched' })),
    ...missing.map(k => ({ word: k, kind: 'missing' })),
    ...suggested.map(k => ({ word: k, kind: 'suggested' })),
  ];
  if (!all.length) return text;

  const escaped = all.map(a => a.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const match = all.find(a => a.word.toLowerCase() === part.toLowerCase());
    if (!match) return part;
    const colors = {
      matched:   { bg: 'rgba(16,185,129,0.18)', border: '#10b981' },
      missing:   { bg: 'rgba(239,68,68,0.15)',  border: '#ef4444' },
      suggested: { bg: 'rgba(245,158,11,0.12)', border: '#f59e0b' },
    };
    const c = colors[match.kind];
    return (
      <span key={i} style={{ background: c.bg, borderBottom: `1.5px solid ${c.border}`, padding: '1px 4px', borderRadius: '3px', color: c.border }}>
        {part}
      </span>
    );
  });
}

function extractNameAndTitle(text) {
  if (!text) return { name: 'Candidate', title: '' };
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const name = lines[0] || 'Candidate';
  const title = lines.length > 1 ? lines[1] : '';
  return { name, title };
}

function extractSection(text, heading) {
  if (!text) return '';
  const re = new RegExp(`(?:^|\\n)\\s*${heading}[:\\s]*\\n([\\s\\S]*?)(?=\\n\\s*(?:EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|SUMMARY|OBJECTIVE|WORK|AWARDS|LANGUAGES|REFERENCES)\\b|$)`, 'i');
  const m = text.match(re);
  return m ? m[1].trim().substring(0, 600) : '';
}

/* ── main component ─────────────────────────────────── */
const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [d, setD] = useState(null);
  const [openSugg, setOpenSugg] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    let raw = null;
    const stored = sessionStorage.getItem('analysisResult');
    if (stored) { try { raw = JSON.parse(stored); } catch { /* */ } }
    if (!raw && location.state?.data) raw = location.state.data;
    if (!raw) { navigate('/upload'); return; }

    setD({
      score: raw.score || 0,
      scoreLabel: raw.scoreLabel || raw.label || 'Match Evaluated',
      scoreText: raw.scoreText || `Your resume matches ${raw.score || 0}% of the keywords and requirements.`,
      keywordMatchScore:  raw.metrics?.['Keyword Match']        ?? raw.breakdown?.find(b => b.label === 'Keyword Match')?.percentage ?? 0,
      formattingScore:    raw.metrics?.['Formatting Quality']   ?? raw.breakdown?.find(b => b.label === 'Formatting Quality')?.percentage ?? 85,
      actionVerbsScore:   raw.metrics?.['Action Verbs']         ?? raw.breakdown?.find(b => b.label === 'Skills Relevance')?.percentage ?? 0,
      completenessScore:  raw.metrics?.['Section Completeness'] ?? 0,
      matched:    raw.matched    ?? raw.keywords?.matched   ?? [],
      missing:    raw.missing    ?? raw.keywords?.missing   ?? [],
      suggested:  raw.suggested  ?? raw.keywords?.suggested ?? [],
      suggestions: raw.suggestions ?? [],
      resumeText: raw.resume_text || '',
    });
  }, [location.state, navigate]);

  /* animations */
  useEffect(() => {
    if (!d) return;
    const ctx = gsap.context(() => {
      const scoreEl = document.querySelector('.score-number');
      if (scoreEl) {
        gsap.to({ val: 0 }, { val: d.score, duration: 2.2, ease: 'power2.out', onUpdate: function () { scoreEl.textContent = Math.round(this.targets()[0].val) + '%'; } });
        gsap.fromTo('.score-ring-progress', { strokeDashoffset: CIRC }, { strokeDashoffset: CIRC - (CIRC * d.score / 100), duration: 2.2, ease: 'power2.out' });
      }
      gsap.fromTo('.results-card', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12 });
      gsap.fromTo('.metric-fill', { width: '0%' }, { width: (_, el) => el.dataset.percent + '%', duration: 1.4, ease: 'power3.out', stagger: 0.1, delay: 0.4 });
      gsap.fromTo('.keyword-chip', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)', stagger: 0.03, delay: 0.6 });
    });
    return () => ctx.revert();
  }, [d]);

  if (!d) return null;

  const resumeFileName = sessionStorage.getItem('resumeFileName') || 'resume.pdf';
  const { name, title } = extractNameAndTitle(d.resumeText);
  const expText = extractSection(d.resumeText, 'EXPERIENCE') || extractSection(d.resumeText, 'WORK');
  const skillsText = extractSection(d.resumeText, 'SKILLS');

  const metrics = [
    { label: 'Keyword Match', value: d.keywordMatchScore },
    { label: 'Formatting Consistency', value: d.formattingScore },
    { label: 'Action Verbs', value: d.actionVerbsScore },
  ];

  const chipStyle = (kind) => {
    const map = {
      matched:   { bg: 'rgba(16,185,129,0.12)', bd: 'rgba(16,185,129,0.4)', c: '#10b981' },
      missing:   { bg: 'rgba(239,68,68,0.12)',  bd: 'rgba(239,68,68,0.4)',  c: '#ef4444' },
      suggested: { bg: 'rgba(245,158,11,0.12)', bd: 'rgba(245,158,11,0.4)', c: '#f59e0b' },
    };
    const m = map[kind];
    return { display: 'inline-flex', alignItems: 'center', padding: '6px 16px', borderRadius: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 400, whiteSpace: 'nowrap', background: m.bg, border: `1px solid ${m.bd}`, color: m.c };
  };

  const monoLabel = { fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.15em', color: '#6b6b6b', textTransform: 'uppercase', marginBottom: '16px' };
  const cardBase = { background: 'rgba(255,255,255,0.02)', border: '1px solid #333', borderRadius: '19.2px', padding: '32px' };

  const scoreBadgeColor = d.score >= 80 ? '#10b981' : d.score >= 60 ? '#af50ff' : '#ef4444';

  return (
    <main style={{ minHeight: '100vh', background: '#090909', paddingTop: '100px', paddingBottom: '160px' }}>
      <div className="container" ref={reportRef} style={{ padding: '20px' }}>
        <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '32px', alignItems: 'start' }}>

          {/* ═══════ LEFT — Resume Preview ═══════ */}
          <aside className="results-left results-card" style={{ position: 'sticky', top: '100px', maxHeight: 'calc(100vh - 140px)', overflowY: 'auto', ...cardBase }}>
            {/* File name */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#af50ff', marginBottom: '20px', letterSpacing: '0.10em' }}>
              {resumeFileName.toUpperCase()}
            </div>

            {/* Name + Title */}
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: '#f7f9fa', lineHeight: 1.2 }}>
              {name}
            </h2>
            {title && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6b6b6b', marginTop: '8px', lineHeight: 1.5 }}>{title}</p>
            )}

            {/* Experience section */}
            {expText && (
              <div style={{ marginTop: '32px' }}>
                <div style={{ ...monoLabel, color: '#6b6b6b', fontSize: '11px' }}>EXPERIENCE</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13.5px', color: '#f0f0f0', lineHeight: 1.85 }}>
                  {highlightText(expText, d.matched, d.missing, d.suggested)}
                </p>
              </div>
            )}

            {/* Skills section */}
            {skillsText && (
              <div style={{ marginTop: '28px' }}>
                <div style={{ ...monoLabel, color: '#6b6b6b', fontSize: '11px' }}>SKILLS</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13.5px', color: '#f0f0f0', lineHeight: 1.85 }}>
                  {highlightText(skillsText, d.matched, d.missing, d.suggested)}
                </p>
              </div>
            )}

            {/* If no sections parsed, show generic text */}
            {!expText && !skillsText && (
              <div style={{ marginTop: '28px' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13.5px', color: '#f0f0f0', lineHeight: 1.85 }}>
                  {highlightText(d.resumeText?.substring(0, 800) || 'Resume text parsed successfully.', d.matched, d.missing, d.suggested)}
                </p>
              </div>
            )}

            {/* Legend */}
            <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[{ c: '#10b981', t: 'MATCHED' }, { c: '#ef4444', t: 'MISSING' }, { c: '#f59e0b', t: 'SUGGESTED' }].map((l, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', color: l.c }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: l.c, display: 'inline-block' }} />{l.t}
                </span>
              ))}
            </div>
          </aside>

          {/* ═══════ RIGHT — Analysis Stack ═══════ */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* ── Score Card ── */}
            <div className="results-card score-card" style={{ ...cardBase, display: 'grid', gridTemplateColumns: '160px 1fr', gap: '32px', alignItems: 'center' }}>
              {/* LEFT — Ring only */}
              <div className="score-ring-wrapper" style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0 }}>
                <svg width="160" height="160" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                  <circle className="score-ring-progress" cx="50" cy="50" r="45" fill="none" stroke="url(#irisGrad)" strokeWidth="7" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC} />
                  <defs><linearGradient id="irisGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#af50ff" /><stop offset="100%" stopColor="#7f56d9" /></linearGradient></defs>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span className="score-number" data-score={d.score} style={{ fontFamily: "'Inter', sans-serif", fontSize: '42px', fontWeight: 700, color: '#f7f9fa' }}>0%</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.20em', color: '#6b6b6b', marginTop: '2px' }}>SCORE</span>
                </div>
              </div>

              {/* RIGHT — Badge + title + description stacked vertically */}
              <div className="score-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', minWidth: 0 }}>
                {/* Badge — sits cleanly above the title */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '9999px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', color: scoreBadgeColor, background: `${scoreBadgeColor}15`, border: `1px solid ${scoreBadgeColor}40`, whiteSpace: 'nowrap', textTransform: 'uppercase', lineHeight: 1 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: scoreBadgeColor, boxShadow: `0 0 8px ${scoreBadgeColor}`, flexShrink: 0 }} />
                  {d.score >= 80 ? 'STRONG MATCH' : d.score >= 60 ? 'GOOD MATCH' : 'NEEDS WORK'}
                </div>

                <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#f7f9fa', margin: 0 }}>{d.scoreLabel}</h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, color: 'rgba(247,249,250,0.6)', lineHeight: 1.65, maxWidth: '420px', margin: 0 }}>{d.scoreText}</p>
              </div>
            </div>

            {/* ── Detailed Metrics ── */}
            <div className="results-card" style={cardBase}>
              <div style={monoLabel}>DETAILED_METRICS</div>
              {metrics.map((m, i) => (
                <div key={i} style={{ marginBottom: i === metrics.length - 1 ? 0 : '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500, color: '#f0f0f0' }}>{m.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 500, color: '#f7f9fa' }}>{m.value}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div className="metric-fill" data-percent={Math.max(0, Math.min(100, m.value))} style={{ height: '100%', width: '0%', background: 'linear-gradient(90deg, #7f56d9, #af50ff)', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Keywords ── */}
            <div className="results-card" style={cardBase}>
              {/* Matched */}
              <div style={{ marginBottom: '28px' }}>
                <div style={monoLabel}>MATCHED_KEYWORDS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {d.matched.length ? d.matched.map((k, i) => <span key={i} className="keyword-chip" style={chipStyle('matched')}>{k}</span>) : <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#6b6b6b' }}>None found.</span>}
                </div>
              </div>
              {/* Missing */}
              <div style={{ marginBottom: '28px' }}>
                <div style={monoLabel}>MISSING_CRITICAL</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {d.missing.length ? d.missing.map((k, i) => <span key={i} className="keyword-chip" style={chipStyle('missing')}>{k}</span>) : <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#6b6b6b' }}>None missing!</span>}
                </div>
              </div>
              {/* Suggested */}
              <div>
                <div style={monoLabel}>SUGGESTED_BOOSTERS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {d.suggested.length ? d.suggested.map((k, i) => <span key={i} className="keyword-chip" style={chipStyle('suggested')}>{k}</span>) : <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#6b6b6b' }}>No extra boosters.</span>}
                </div>
              </div>
            </div>

            {/* ── AI Suggestions (accordion) ── */}
            <div className="results-card" style={cardBase}>
              <div style={{ ...monoLabel, marginBottom: '24px' }}>AI_SMART_SUGGESTIONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {d.suggestions.map((s, i) => {
                  const isOpen = openSugg === i;
                  return (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #333', borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.2s', borderColor: isOpen ? 'rgba(175,80,255,0.3)' : '#333' }}>
                      {/* Header row — clickable */}
                      <button
                        onClick={() => setOpenSugg(isOpen ? -1 : i)}
                        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', gap: '16px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{ fontSize: '18px' }}>{s.icon || (i % 2 === 0 ? '✨' : '💡')}</span>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600, color: '#f7f9fa', textAlign: 'left' }}>{s.title}</span>
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#6b6b6b', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease', flexShrink: 0 }}>▾</span>
                      </button>
                      {/* Body — collapsible */}
                      {isOpen && (
                        <div style={{ padding: '0 24px 24px 56px' }}>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, color: 'rgba(247,249,250,0.7)', lineHeight: 1.7 }}>
                            {s.body || s.excerpt || s.fullText}
                          </p>
                          {(s.example || s.codeExample) && (
                            <div style={{ background: 'rgba(175,80,255,0.06)', border: '1px solid rgba(175,80,255,0.15)', borderRadius: '8px', padding: '14px 16px', marginTop: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#af50ff', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                              <span style={{ color: '#6b6b6b' }}>// ATS Tip: </span>
                              {s.example || (Array.isArray(s.codeExample) ? s.codeExample.join('\n') : '')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Action buttons ── */}
            <div id="report-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => {
                  setIsDownloading(true);
                  const element = reportRef.current;
                  const actionButtons = document.getElementById('report-actions');
                  if (actionButtons) actionButtons.style.display = 'none';
                  
                  const leftSidebar = document.querySelector('.results-left');
                  const oldMaxHeight = leftSidebar.style.maxHeight;
                  leftSidebar.style.maxHeight = 'none';
                  leftSidebar.style.overflow = 'visible';

                  // Force explicit black background and stacked layout for PDF
                  const oldBg = element.style.background;
                  element.style.background = '#090909';
                  
                  const grid = document.querySelector('.results-grid');
                  const oldGrid = grid.style.gridTemplateColumns;
                  grid.style.gridTemplateColumns = '1fr';

                  const opt = {
                    margin:       10,
                    filename:     `${name.replace(/\\s+/g, '_')}_ATS_Report.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#090909', windowWidth: 800 },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                  };

                  html2pdf().set(opt).from(element).save().then(() => {
                    if (actionButtons) actionButtons.style.display = 'flex';
                    leftSidebar.style.maxHeight = oldMaxHeight;
                    leftSidebar.style.overflow = 'auto';
                    element.style.background = oldBg;
                    grid.style.gridTemplateColumns = oldGrid;
                    setIsDownloading(false);
                  });
                }}
                disabled={isDownloading}
                className="btn-pill btn-iris" 
                style={{ minHeight: '52px', padding: '14px 28px', opacity: isDownloading ? 0.7 : 1 }}
              >
                {isDownloading ? 'Generating...' : 'Download PDF Report'}
              </button>
              <button onClick={() => { sessionStorage.removeItem('analysisResult'); navigate('/upload'); }} className="btn-pill btn-ghost" style={{ minHeight: '52px', padding: '14px 28px' }}>Re-analyze</button>
              <button onClick={() => navigate('/tips')} className="btn-pill btn-ghost" style={{ minHeight: '52px', padding: '14px 28px' }}>Improve My Resume</button>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .results-grid { grid-template-columns: 1fr !important; } .results-left { position: static !important; max-height: none !important; } }
        @media (max-width: 640px) {
          .score-card { grid-template-columns: 1fr !important; justify-items: center; text-align: center; }
          .score-info { align-items: center !important; }
        }
        .results-left::-webkit-scrollbar { width: 4px; }
        .results-left::-webkit-scrollbar-thumb { background: rgba(175,80,255,0.4); border-radius: 2px; }
      `}</style>
    </main>
  );
};

export default DashboardPage;
