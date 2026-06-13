import React, { useEffect } from 'react';
import { gsap } from '../lib/gsap';

const sections = [
  { h: 'Acceptance of Terms', b: 'By using ResumeScan you agree to these terms. If you do not agree, please discontinue use of the service.' },
  { h: 'Use of the Service', b: 'ResumeScan provides automated resume analysis for informational purposes. Results are guidance, not a guarantee of interview or employment outcomes.' },
  { h: 'Acceptable Use', b: 'You agree not to upload unlawful content, attempt to disrupt the service, or use it to process data you do not have the right to submit.' },
  { h: 'Intellectual Property', b: 'The ResumeScan interface, branding, and analysis engine remain our property. Your resume content remains yours.' },
  { h: 'Disclaimers', b: 'The service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free operation.' },
  { h: 'Limitation of Liability', b: 'To the maximum extent permitted by law, we are not liable for indirect or consequential damages arising from use of the service.' },
  { h: 'Contact Us', b: 'Questions about these terms can be sent to legal@resumescan.app.' },
];

const Terms = () => {
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
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginTop: '12px' }}>Terms of Service</h1>
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

export default Terms;
