import React, { useEffect } from 'react';
import SplitType from 'split-type';
import { gsap, ScrollTrigger } from '../lib/gsap';

const HowItWorks = () => {
  useEffect(() => {
    const split = new SplitType('.hiw-heading', { types: 'words' });
    gsap.fromTo(split.words,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.hiw-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    gsap.fromTo('.hiw-card',
      { opacity: 0, y: 80, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8, ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.hiw-cards',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => split.revert();
  }, []);

  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left) - rect.width / 2;
    const dy = (e.clientY - rect.top) - rect.height / 2;
    gsap.to(card, {
      rotateX: -dy * 0.08,
      rotateY: dx * 0.08,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    });
  };

  const handleMouseLeave = (card) => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
  };

  const steps = [
    { num: '01', title: 'Upload Your Resume', desc: 'Securely upload your document in PDF or DOCX format. Our engine strips formatting to analyze the core semantic structure.', icon: 'upload_file' },
    { num: '02', title: 'Paste Job Description', desc: 'We run your content through simulated ATS filters using the same criteria as top Fortune 500 platforms.', icon: 'query_stats' },
    { num: '03', title: 'Get Score + AI Suggestions', desc: 'Receive a granular report with precise directives: which words to add, which sections are unreadable, and how to improve.', icon: 'insights' },
  ];

  return (
    <section id="how-it-works" className="hiw-section section-padding" style={{ width: '100%', background: '#090909' }}>
      <div className="container">
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.20em', color: '#af50ff', textTransform: 'uppercase', marginBottom: '16px' }}>
          THE PROCESS
        </div>

        <h2 className="hiw-heading" style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: '#f7f9fa', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            Three steps to a
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, color: '#f7f9fa', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            stronger resume.
          </span>
        </h2>

        <div
          className="hiw-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginTop: '64px',
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="hiw-card"
              style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid #454545',
                borderRadius: '19.2px',
                padding: '40px 32px',
                overflow: 'hidden',
              }}
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
            >
              {/* Top glow line on hover */}
              <div style={{ position: 'absolute', top: 0, left: '24px', right: '24px', height: '1px', background: 'linear-gradient(90deg, transparent, #af50ff, transparent)', opacity: 0, transition: 'opacity 0.3s' }} className="group-hover-glow" />

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(48px, 6vw, 80px)', letterSpacing: '0.20em', fontWeight: 400, color: 'transparent', lineHeight: 1, WebkitTextStroke: '1px rgba(175,80,255,0.35)' }}>
                {step.num}
              </div>

              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 600, color: '#f7f9fa', marginTop: '20px' }}>
                {step.title}
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 400, color: '#6b6b6b', lineHeight: 1.7, marginTop: '12px' }}>
                {step.desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                <span className="material-symbols-outlined" style={{ color: '#af50ff', fontSize: '24px' }}>{step.icon}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#af50ff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Step {step.num}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hiw-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
