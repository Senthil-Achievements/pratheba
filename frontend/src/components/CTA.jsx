import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SplitType from 'split-type';
import { gsap } from '../lib/gsap';

const CTA = () => {
  useEffect(() => {
    gsap.fromTo('.cta-panel',
      { opacity: 0, y: 80, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 1, ease: 'power4.out',
        scrollTrigger: {
          trigger: '.cta-panel',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    const split = new SplitType('.cta-headline', { types: 'words' });
    gsap.fromTo(split.words,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power3.out',
        stagger: 0.08, delay: 0.3,
        scrollTrigger: {
          trigger: '.cta-panel',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    gsap.to('.cta-glow', {
      scale: 1.15, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true,
    });

    return () => split.revert();
  }, []);

  const handleMouseMove = (e, btn) => {
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - rect.left) - rect.width / 2;
    const dy = (e.clientY - rect.top) - rect.height / 2;
    gsap.to(btn, { x: dx * 0.35, y: dy * 0.35, duration: 0.4, ease: 'power2.out' });
  };

  const handleMouseLeave = (btn) => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <section className="section-padding" style={{ width: '100%', background: '#090909' }}>
      <div className="container">
        <div
          className="cta-panel"
          style={{
            position: 'relative',
            borderRadius: '32px',
            border: '1px solid rgba(175,80,255,0.2)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(64,24,96,0.8) 0%, rgba(72,35,180,0.6) 50%, rgba(9,9,9,1) 100%)',
          }}
        >
          {/* Decorative blurred iris circle */}
          <div
            className="cta-glow"
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'rgba(175,80,255,0.15)',
              pointerEvents: 'none',
              filter: 'blur(80px)',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '120px 40px',
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.20em', color: '#af50ff', textTransform: 'uppercase', marginBottom: '24px' }}>
              READY TO FLY?
            </div>

            <h2
              className="cta-headline"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                color: '#f7f9fa',
                maxWidth: '680px',
                lineHeight: 1.1,
                margin: '0 auto',
              }}
            >
              Your next role is one optimized resume away.
            </h2>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(15px, 1.2vw, 18px)', fontWeight: 400, color: 'rgba(247,249,250,0.65)', maxWidth: '480px', marginTop: '24px' }}>
              Upload your resume, paste the job description, and get an instant ATS score with AI-powered suggestions.
            </p>

            <div style={{ marginTop: '40px' }}>
              <Link
                to="/upload"
                className="btn-pill btn-iris"
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                style={{ boxShadow: '0 0 24px rgba(175,80,255,0.4)' }}
              >
                CHECK MY RESUME — FREE →
              </Link>
            </div>

            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 400, color: '#6b6b6b', marginTop: '16px' }}>
              No account required. Results in under 3 seconds.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
