import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../lib/gsap';

const Footer = () => {
  useEffect(() => {
    gsap.fromTo('.footer-col', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.site-footer', start: 'top 90%', toggleActions: 'play none none none' } });
  }, []);

  return (
    <footer className="site-footer" style={{ background: 'var(--bg-void)', borderTop: '1px solid var(--border-default)', paddingTop: '80px', paddingBottom: '80px', width: '100%' }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '64px', alignItems: 'start' }}>
          {/* Brand */}
          <div className="footer-col">
            <Link to="/" style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>RESUMESCAN</Link>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '16px', maxWidth: '280px' }}>Get your resume ATS-ready before the recruiter hits delete.</p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              {[{ icon: 'tag' }, { icon: 'work' }, { icon: 'code' }].map((s, idx) => (
                <a key={idx} href="#" style={{ color: 'var(--text-muted)' }}><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{s.icon}</span></a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="footer-col">
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.20em', color: 'var(--text-muted)', marginBottom: '20px' }}>RESOURCES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/tips" style={footerLink}>Tips &amp; Resources</Link>
              <Link to="/upload" style={footerLink}>Analyze Resume</Link>
              <Link to="/privacy" style={footerLink}>Privacy Policy</Link>
              <Link to="/terms" style={footerLink}>Terms of Service</Link>
            </div>
          </div>

          {/* GET STARTED (Issue #2 fixed) */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', minWidth: 0 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.20em', color: 'var(--text-muted)' }}>GET STARTED</div>
            <Link to="/upload" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: 'auto', maxWidth: '100%', padding: '12px 28px', background: 'var(--accent-iris)', color: '#090909', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600, border: 'none', borderRadius: '9999px', cursor: 'pointer', whiteSpace: 'nowrap', minHeight: '44px', textDecoration: 'none', transition: 'transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease' }}
              onMouseEnter={(e)=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.filter='brightness(1.08)'; e.currentTarget.style.boxShadow='0 8px 24px var(--glow)'; }}
              onMouseLeave={(e)=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.filter='none'; e.currentTarget.style.boxShadow='none'; }}>
              CHECK MY RESUME
            </Link>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)', margin: 0 }}>Free. No account required.</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border-default)', marginTop: '48px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'var(--text-muted)' }}>© 2025 ResumeScan. Built for job seekers.</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
            <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</Link>
            <span>·</span>
            <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </div>

      {/* Coordinate footer */}
      <div style={{ height: '36px' }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '36px', background: 'var(--bg-void)', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', zIndex: 50 }}>
        <Link to="/upload" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none' }}>+ Analyze Direct — ATS Resume Checker</Link>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'var(--text-muted)' }}>28.6139° N, 77.2090° E</span>
      </div>

      <style>{`@media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
    </footer>
  );
};

const footerLink = { fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 2.4, textDecoration: 'none', width: 'fit-content' };

export default Footer;
