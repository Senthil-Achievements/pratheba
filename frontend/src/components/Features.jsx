import React, { useEffect } from 'react';
import SplitType from 'split-type';
import { gsap } from '../lib/gsap';

const Features = () => {
  useEffect(() => {
    const split = new SplitType('.feat-heading', { types: 'chars' });
    gsap.fromTo(split.chars,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power3.out',
        stagger: 0.04,
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    gsap.fromTo('.feature-row',
      { opacity: 0, x: -60 },
      {
        opacity: 1, x: 0,
        duration: 0.6, ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    gsap.fromTo('.features-line',
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: 1,
        },
      }
    );

    return () => split.revert();
  }, []);

  const featuresList = [
    { name: 'ATS MATCH SCORE', tag: 'SCORING' },
    { name: 'KEYWORD GAP ANALYSIS', tag: 'NLP' },
    { name: 'SECTION COMPLETENESS', tag: 'PARSING' },
    { name: 'FORMATTING CHECKER', tag: 'ATS SAFE' },
    { name: 'AI SMART SUGGESTIONS', tag: 'GPT-4o' },
    { name: 'DOWNLOADABLE REPORT', tag: 'PDF' },
  ];

  return (
    <section id="features" className="features-section section-padding" style={{ width: '100%', background: '#090909' }}>
      <div className="container">
        <h2
          className="feat-heading"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: '#f7f9fa',
            marginBottom: '80px',
            lineHeight: 1.1,
          }}
        >
          Everything ATS. Nothing extra.
        </h2>

        <div style={{ position: 'relative' }}>
          {featuresList.map((feat, idx) => (
            <div
              key={idx}
              className="feature-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 0',
                cursor: 'default',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderBottom: idx === featuresList.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                transition: 'background-color 0.3s',
                width: '100%',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(175,80,255,0.03)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 'clamp(28px, 4vw, 56px)',
                  letterSpacing: '0.18em',
                  fontWeight: 400,
                  color: 'transparent',
                  lineHeight: 1.4,
                  WebkitTextStroke: '1.2px #6b6b6b',
                  transition: 'all 0.3s',
                }}
              >
                {feat.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'center', flexShrink: 0 }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    color: '#af50ff',
                    border: '1px solid rgba(175,80,255,0.3)',
                    borderRadius: '8px',
                    padding: '4px 12px',
                  }}
                >
                  {feat.tag}
                </span>
                <span className="material-symbols-outlined" style={{ color: '#f0f0f0', fontSize: '24px', transition: 'transform 0.3s' }}>
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
          <div className="features-line" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: '#af50ff', transformOrigin: 'left center' }} />
        </div>
      </div>
    </section>
  );
};

export default Features;
