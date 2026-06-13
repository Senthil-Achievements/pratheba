import React, { useEffect, useRef } from 'react';
import SplitType from 'split-type';
import { gsap } from '../lib/gsap';

const TestimonialCard = ({ name, role, quote }) => (
  <div
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid #454545',
      borderRadius: '19.2px',
      padding: '28px',
      width: '340px',
      flexShrink: 0,
      margin: '0 12px',
    }}
  >
    <div style={{ display: 'flex', gap: '2px' }}>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: '#af50ff', fontSize: '16px' }}>★</span>
      ))}
    </div>
    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 400, color: '#f0f0f0', lineHeight: 1.7, marginTop: '12px' }}>
      "{quote}"
    </p>
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '20px', marginBottom: '16px' }} />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #454545', background: '#333' }} />
      <div style={{ marginLeft: '12px' }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600, color: '#f7f9fa' }}>{name}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 400, color: '#6b6b6b', marginTop: '2px' }}>{role}</div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const tween1Ref = useRef(null);
  const tween2Ref = useRef(null);

  useEffect(() => {
    const split = new SplitType('.test-heading', { types: 'words' });
    gsap.fromTo(split.words,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.test-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Marquee row 1 → left
    tween1Ref.current = gsap.to(row1Ref.current, {
      x: '-50%',
      duration: 35,
      ease: 'none',
      repeat: -1,
    });

    // Marquee row 2 → right
    tween2Ref.current = gsap.fromTo(row2Ref.current,
      { x: '-50%' },
      { x: '0%', duration: 40, ease: 'none', repeat: -1 }
    );

    return () => {
      split.revert();
      tween1Ref.current?.kill();
      tween2Ref.current?.kill();
    };
  }, []);

  const slowRow = (tweenRef) => {
    if (tweenRef.current) tweenRef.current.timeScale(0.2);
  };
  const resumeRow = (tweenRef) => {
    if (tweenRef.current) tweenRef.current.timeScale(1);
  };

  const testimonialsRow1 = [
    { name: 'Sarah L.', role: 'Software Engineer', quote: 'I kept getting auto-rejected before I even spoke to a recruiter. ResumeScan told me exactly what keywords I was missing.' },
    { name: 'James M.', role: 'Product Manager', quote: 'The formatting checker is a lifesaver. Turns out my 3-column fancy layout was completely unreadable by Workday.' },
    { name: 'Emily R.', role: 'Data Scientist', quote: 'Got 3 interviews in a week after implementing the AI suggestions. This tool is basically a cheat code for the job hunt.' },
    { name: 'Michael K.', role: 'UX Designer', quote: "Incredible parsing engine. It pointed out flaws in my resume I didn't even know existed." },
    { name: 'Sarah L.', role: 'Software Engineer', quote: 'I kept getting auto-rejected before I even spoke to a recruiter. ResumeScan told me exactly what keywords I was missing.' },
    { name: 'James M.', role: 'Product Manager', quote: 'The formatting checker is a lifesaver. Turns out my 3-column fancy layout was completely unreadable by Workday.' },
    { name: 'Emily R.', role: 'Data Scientist', quote: 'Got 3 interviews in a week after implementing the AI suggestions. This tool is basically a cheat code for the job hunt.' },
    { name: 'Michael K.', role: 'UX Designer', quote: "Incredible parsing engine. It pointed out flaws in my resume I didn't even know existed." },
  ];

  const testimonialsRow2 = [
    { name: 'David P.', role: 'Marketing Director', quote: 'Finally, a tool that actually explains WHY you failed the ATS screen instead of just giving a meaningless score.' },
    { name: 'Jessica T.', role: 'Financial Analyst', quote: 'The side-by-side gap analysis between my resume and the job description was incredibly eye-opening.' },
    { name: 'Robert W.', role: 'DevOps Engineer', quote: "Clean, fast, and no bullshit. Exactly what you need when you're applying to 100+ jobs." },
    { name: 'Amanda B.', role: 'HR Consultant', quote: 'I recommend this to all my clients. It simulates the exact software I use every day to filter candidates.' },
    { name: 'David P.', role: 'Marketing Director', quote: 'Finally, a tool that actually explains WHY you failed the ATS screen instead of just giving a meaningless score.' },
    { name: 'Jessica T.', role: 'Financial Analyst', quote: 'The side-by-side gap analysis between my resume and the job description was incredibly eye-opening.' },
    { name: 'Robert W.', role: 'DevOps Engineer', quote: "Clean, fast, and no bullshit. Exactly what you need when you're applying to 100+ jobs." },
    { name: 'Amanda B.', role: 'HR Consultant', quote: 'I recommend this to all my clients. It simulates the exact software I use every day to filter candidates.' },
  ];

  return (
    <section className="test-section section-padding" style={{ width: '100%', overflow: 'hidden', background: '#090909' }}>
      {/* Heading inside container */}
      <div className="container" style={{ marginBottom: '64px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.20em', color: '#af50ff', textTransform: 'uppercase', marginBottom: '16px' }}>
          WHAT STUDENTS SAY
        </div>
        <h2 className="test-heading" style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 300, color: '#f7f9fa', lineHeight: 1.1 }}>
            From zero callbacks
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 700, letterSpacing: '-0.04em', color: '#f7f9fa', lineHeight: 1.1 }}>
            to interview-ready.
          </span>
        </h2>
      </div>

      {/* Marquee row 1 — full-width */}
      <div
        style={{ display: 'flex', marginBottom: '24px', paddingLeft: '40px' }}
        onMouseEnter={() => slowRow(tween1Ref)}
        onMouseLeave={() => resumeRow(tween1Ref)}
      >
        <div ref={row1Ref} style={{ display: 'flex', width: 'max-content' }}>
          {testimonialsRow1.map((t, idx) => <TestimonialCard key={idx} {...t} />)}
        </div>
      </div>

      {/* Marquee row 2 */}
      <div
        style={{ display: 'flex', paddingLeft: '40px' }}
        onMouseEnter={() => slowRow(tween2Ref)}
        onMouseLeave={() => resumeRow(tween2Ref)}
      >
        <div ref={row2Ref} style={{ display: 'flex', width: 'max-content' }}>
          {testimonialsRow2.map((t, idx) => <TestimonialCard key={idx} {...t} />)}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
