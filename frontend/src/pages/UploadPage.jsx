import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import SplitType from 'split-type';
import { gsap } from '../lib/gsap';

const cardStyle = { background: 'rgba(255,255,255,0.02)', border: '1px solid #454545', borderRadius: '19.2px', padding: '32px' };
const sectionLabel = { fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.20em', color: '#6b6b6b', textTransform: 'uppercase' };
const fieldStyle = { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid #475467', borderRadius: '8px', fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 400, color: '#f7f9fa', outline: 'none', transition: 'all 0.2s ease' };
const onFocus = (e) => { e.target.style.borderColor = '#af50ff'; e.target.style.boxShadow = '0 0 0 3px rgba(175,80,255,0.12)'; };
const onBlur = (e) => { e.target.style.borderColor = '#475467'; e.target.style.boxShadow = 'none'; };


const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxSize: 5242880,
    maxFiles: 1,
  });

  const ready = file && jobDescription.trim().length >= 20;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.upload-label', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 });
      const split = new SplitType('.upload-heading', { types: 'words' });
      gsap.fromTo(split.words, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, delay: 0.2 });
      gsap.fromTo('.upload-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.6 });
      gsap.fromTo('.upload-card', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15, delay: 0.7 });
      gsap.fromTo('.upload-cta-row', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 1.0 });
    });
    return () => ctx.revert();
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume file');
      return;
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      setError('Please paste a job description (min 20 chars)');
      return;
    }

    setError(null);
    setLoading(true);
    setProgress('Uploading resume...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', jobDescription);
      if (jobTitle) formData.append('jobTitle', jobTitle);

      // CRITICAL: timeout controller — abort after 45 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      setProgress('Parsing resume content...');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setProgress('Generating AI suggestions...');

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // Validate response has a score
      if (!data || typeof data.score !== 'number') {
        throw new Error('Invalid response from server');
      }

      // Store result in sessionStorage for the results page
      sessionStorage.setItem('analysisResult', JSON.stringify(data));
      sessionStorage.setItem('resumeFileName', file.name);

      setProgress('Finalizing report...');

      // Small delay so user sees the final progress message
      setTimeout(() => {
        setLoading(false);
        navigate('/results');
      }, 600);

    } catch (err) {
      setLoading(false);
      setProgress('');

      if (err.name === 'AbortError') {
        setError('Analysis took too long. The server may be busy. Please try again.');
      } else if (err.message.includes('Failed to fetch') || err.name === 'TypeError' || err.message.includes('NetworkError')) {
        setError('Cannot connect to the analysis server. Please check your network connection and try again.');
      } else {
        setError(err.message || 'Something went wrong. Try again.');
      }
      console.error('Analyze error:', err);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#090909', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="container">
        {/* Header */}
        <div className="upload-label" style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.20em', color: '#af50ff', textTransform: 'uppercase', marginBottom: '16px' }}>DEPARTURE GATE</div>
        <h1 className="upload-heading" style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 300, lineHeight: 1.05, color: '#f7f9fa' }}>Your resume.</span>
          <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#f7f9fa', marginTop: '8px' }}>Let's see if it flies.</span>
        </h1>
        <p className="upload-sub" style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 400, color: 'rgba(247,249,250,0.65)', maxWidth: '560px', margin: '24px auto 0', textAlign: 'center', lineHeight: 1.6 }}>
          Upload your resume and paste the job description. We will analyze, score, and tell you exactly what to fix.
        </p>

        {/* Error Banner */}
        {error && (
          <div className="error-banner" style={{ maxWidth: '700px', margin: '32px auto 0' }}>
            <span className="error-icon">⚠</span>
            <span>{error}</span>
            <button className="error-close" onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Two-column grid */}
        <div className="upload-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '64px' }}>
          {/* LEFT - Resume upload */}
          <div className="upload-card" style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <span style={sectionLabel}>RESUME FILE</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', color: '#6b6b6b' }}>PDF, DOCX · MAX 5MB</span>
            </div>
            <div {...getRootProps()} style={{ width: '100%', minHeight: '340px', background: isDragActive ? 'rgba(175,80,255,0.04)' : 'rgba(255,255,255,0.02)', border: isDragActive ? '1.5px dashed #af50ff' : '1.5px dashed #475467', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '32px', cursor: 'pointer', transition: 'all 0.3s ease', marginTop: '16px', boxShadow: isDragActive ? '0 0 24px rgba(175,80,255,0.15)' : 'none' }}
              onMouseEnter={(e)=>{ e.currentTarget.style.borderColor='#af50ff'; e.currentTarget.style.background='rgba(175,80,255,0.04)'; e.currentTarget.style.boxShadow='0 0 24px rgba(175,80,255,0.15)'; }}
              onMouseLeave={(e)=>{ if(!isDragActive){ e.currentTarget.style.borderColor='#475467'; e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.boxShadow='none'; } }}>
              <input {...getInputProps()} />
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#af50ff' }}>upload_file</span>
              {file ? (
                <>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 500, color: '#f7f9fa' }}>{file.name}</p>
                  <button onClick={(e)=>{ e.stopPropagation(); setFile(null); }} style={{ background: 'none', border: 'none', color: '#af50ff', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', textDecoration: 'underline' }}>Remove file</button>
                </>
              ) : (
                <>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 500, color: '#f7f9fa' }}>Drag and drop your file here</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, color: '#6b6b6b' }}>or <span style={{ color: '#af50ff', textDecoration: 'underline' }}>click to browse</span> local storage</p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT - Job description */}
          <div className="upload-card" style={cardStyle}>
            <div style={{ ...sectionLabel, marginBottom: '16px' }}>JOB DESCRIPTION</div>
            <input type="text" value={jobTitle} onChange={(e)=>setJobTitle(e.target.value)} onFocus={onFocus} onBlur={onBlur} placeholder="Job Title (optional)" style={{ ...fieldStyle, padding: '12px 16px', marginBottom: '16px' }} />
            <textarea value={jobDescription} onChange={(e)=>setJobDescription(e.target.value)} onFocus={onFocus} onBlur={onBlur} placeholder="Paste the full job description here..." maxLength={5000} style={{ ...fieldStyle, minHeight: '260px', maxHeight: '400px', resize: 'vertical', padding: '16px', lineHeight: 1.6 }} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: jobDescription.length > 4500 ? '#ff8080' : '#6b6b6b', marginTop: '8px', textAlign: 'right' }}>{jobDescription.length} / 5000 CHARS</div>
          </div>
        </div>

        {/* Status + CTA */}
        <div className="upload-cta-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.20em', color: '#af50ff', textTransform: 'uppercase', marginBottom: '20px' }}>
            {ready ? 'READY FOR MATCHING' : 'AWAITING INPUT'}
          </div>
          <button onClick={handleAnalyze} disabled={!ready || loading} style={{ background: '#af50ff', color: '#090909', border: 'none', borderRadius: '9999px', padding: '18px 48px', fontFamily: "'Inter', sans-serif", fontSize: '17px', fontWeight: 600, cursor: (!ready || loading) ? 'not-allowed' : 'pointer', minHeight: '56px', display: 'inline-flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease', opacity: (!ready || loading) ? 0.4 : 1, pointerEvents: (!ready || loading) ? 'none' : 'auto' }}
            onMouseEnter={(e)=>{ if(ready && !loading){ e.currentTarget.style.filter='brightness(1.1)'; e.currentTarget.style.boxShadow='0 0 28px rgba(175,80,255,0.6)'; e.currentTarget.style.transform='translateY(-2px)'; } }}
            onMouseLeave={(e)=>{ e.currentTarget.style.filter='none'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
            ANALYZE MY RESUME →
          </button>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 400, color: '#6b6b6b', marginTop: '16px', textAlign: 'center' }}>
            By proceeding, you agree to our <Link to="/privacy" style={{ color: '#af50ff', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Data Privacy Protocol</Link>.
          </p>
        </div>
      </div>

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner" />
            <h3 className="loading-title">Analyzing your resume</h3>
            <p className="loading-progress">{progress}</p>
            <div className="loading-bar">
              <div className="loading-bar-fill" />
            </div>
            <p className="loading-hint">This usually takes 5–15 seconds</p>
          </div>
        </div>
      )}

      <style>{`@media (max-width: 900px) { .upload-grid { grid-template-columns: 1fr !important; } }`}</style>
    </main>
  );
};

export default UploadPage;
