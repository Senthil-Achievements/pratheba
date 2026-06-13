import React, { useEffect } from 'react';
import { gsap } from '../lib/gsap';

const sections = [
  { h: 'Information We Collect', b: 'We collect the resume files you upload and the job descriptions you paste solely to perform ATS analysis. We do not require an account to run a scan.' },
  { h: 'How We Use Your Information', b: 'Your data is used only to generate your match score, keyword analysis, and improvement suggestions. We never sell or share your resume content with third parties.' },
  { h: 'Data Retention', b: 'Uploaded files are processed in memory and discarded after analysis. Saved analyses are only stored when you are signed in and choose to keep them.' },
  { h: 'Resume File Security', b: 'Files are transmitted over encrypted connections and are never written to permanent public storage. Access is restricted to the analysis pipeline.' },
  { h: 'Your Rights', b: 'You may request deletion of any saved analyses at any time. Signed-in users can clear their history from their account settings.' },
  { h: 'Cookies & Analytics', b: 'We use minimal cookies to remember your theme preference and to measure aggregate, anonymized usage. No tracking cookies are used for advertising.' },
  { h: 'Contact Us', b: 'Questions about this policy can be sent to privacy@resumescan.app and we will respond within a reasonable timeframe.' },
];

const Privacy = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.legal-head', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
      gsap.fromTo('.legal-section', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: 0.2 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div className="legal-head">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.20em', color: 'var(--accent-iris)', textTransform: 'uppercase' }}>LEGAL</div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginTop: '12px' }}>Privacy Policy</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>Last updated: January 2025</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '48px' }}>
          {sections.map((s, i) => (
            <section key={i} className="legal-section">
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.h}</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: '12px' }}>{s.b}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Privacy;
